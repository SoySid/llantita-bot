from psycopg2.extras import execute_values
import os
import time
import psycopg2
import asyncio
import aiohttp

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

DATABASE_URL = os.getenv("DATABASE_URL")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")


def obtener_conexion():
    return psycopg2.connect(DATABASE_URL)


def inicializar_bd(conn):
    with conn:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS productos (
                    id VARCHAR(255) PRIMARY KEY,
                    nombre VARCHAR(255),
                    url TEXT,
                    precio NUMERIC,
                    talles TEXT,
                    marca VARCHAR(255),
                    categoria VARCHAR(255),
                    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            cur.execute("ALTER TABLE productos ADD COLUMN IF NOT EXISTS marca VARCHAR(255);")
            cur.execute("ALTER TABLE productos ADD COLUMN IF NOT EXISTS categoria VARCHAR(255);")

            cur.execute("""
                CREATE TABLE IF NOT EXISTS historial_precios (
                    id SERIAL PRIMARY KEY,
                    producto_id VARCHAR(255),
                    precio NUMERIC,
                    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_historial_producto_id
                ON historial_precios (producto_id);
            """)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS usuarios_telegram (
                    chat_id BIGINT PRIMARY KEY,
                    activo BOOLEAN DEFAULT TRUE,
                    fecha_suscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)


async def procesar_mensajes_telegram(conn, session):
    if not TELEGRAM_BOT_TOKEN:
        return

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates"
    data = None
    
    for intento in range(3):
        try:
            async with session.get(url, timeout=30) as res:
                if res.status == 200:
                    data = await res.json()
                    break
                else:
                    return
        except asyncio.TimeoutError:
            print(f"⚠️ Telegram Timeout en getUpdates (Intento {intento + 1}/3)")
            await asyncio.sleep(2)
        except Exception as e:
            print(f"Error al conectar con Telegram: {e}")
            return

    if not data or not data.get("ok"):
        return

    updates = data.get("result", [])
    if not updates:
        return

    with conn:
        with conn.cursor() as cur:
            for update in updates:
                mensaje = update.get("message", {})
                texto = mensaje.get("text", "").strip().lower()
                chat_id = mensaje.get("chat", {}).get("id")

                if not chat_id:
                    continue

                if texto.startswith("/start"):
                    cur.execute("""
                        INSERT INTO usuarios_telegram (chat_id, activo)
                        VALUES (%s, TRUE)
                        ON CONFLICT (chat_id) DO UPDATE SET activo = TRUE;
                    """, (chat_id,))
                elif texto.startswith("/stop") or texto.startswith("/desuscribir"):
                    cur.execute("""
                        UPDATE usuarios_telegram SET activo = FALSE WHERE chat_id = %s;
                    """, (chat_id,))

    ultimo_update_id = updates[-1]["update_id"]
    try:
        await session.get(f"{url}?offset={ultimo_update_id + 1}", timeout=10)
    except Exception:
        pass


async def enviar_mensaje_telegram(session, chat_id, texto):
    if not TELEGRAM_BOT_TOKEN:
        return
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": chat_id, 
        "text": texto, 
        "parse_mode": "HTML",
        "disable_web_page_preview": False
    }
    
    for intento in range(5):
        try:
            async with session.post(url, json=payload, timeout=20) as res:
                if res.status == 200:
                    return

                error_text = await res.text()

                # 429 (rate limit) y 5xx (errores transitorios del lado de
                # Telegram, ej. 502 Bad Gateway) se reintentan. El resto de
                # errores (400, 403 chat bloqueado, etc.) son permanentes:
                # reintentar no sirve de nada.
                if res.status == 429 or res.status >= 500:
                    print(f"⚠️ Telegram devolvió {res.status} para chat {chat_id} (Intento {intento + 1}/5): {error_text}")
                    espera = 3 * (intento + 1)
                    if res.status == 429:
                        try:
                            import json as _json
                            espera = _json.loads(error_text).get("parameters", {}).get("retry_after", espera)
                        except Exception:
                            pass
                    await asyncio.sleep(espera)
                    continue
                else:
                    print(f"Telegram devolvió {res.status} para chat {chat_id}: {error_text}")
                    return
        except asyncio.TimeoutError:
            print(f"⚠️ Telegram Timeout enviando mensaje a {chat_id} (Intento {intento + 1}/5)")
            await asyncio.sleep(3 * (intento + 1))
        except Exception as e:
            print(f"Error enviando mensaje a {chat_id}: {e}")
            return

    print(f"❌ No se pudo enviar el mensaje a {chat_id} tras 5 intentos.")


def obtener_usuarios_activos(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT chat_id FROM usuarios_telegram WHERE activo = TRUE;")
        return [row[0] for row in cur.fetchall()]


def formatear_bloque_producto(nombre, precio_anterior, precio_nuevo, talles, marca, categoria, tipo_cambio):
    talles_str = talles if talles else "No especificado / Consultar en web"
    marca_str = marca if marca else "No especificada"
    cat_str = categoria if categoria else "Calzado"
    emoji = "🔥" if tipo_cambio == "BAJA" else "💸"

    return (
        f"👟 <b>{nombre}</b>\n"
        f"🏢 Marca: {marca_str} | 📂 {cat_str}\n"
        f"📉 Antes: <s>${precio_anterior:,.2f}</s>\n"
        f"{emoji} AHORA: <b>${precio_nuevo:,.2f}</b> {emoji}\n"
        f"📏 Talles: {talles_str}"
    )


async def notificar_cambios_agrupados(session, usuarios_activos, cambios):
    """
    Junta varios productos con cambio de precio en un mismo mensaje de
    Telegram, en vez de mandar un mensaje por producto. Si son muchos,
    los reparte en varios mensajes (respetando el límite de Telegram y
    un tope de productos por mensaje para que no quede eterno).
    """
    if not TELEGRAM_BOT_TOKEN or not usuarios_activos or not cambios:
        return

    bajas = sum(1 for c in cambios if c[8] == "BAJA")
    alzas = sum(1 for c in cambios if c[8] == "ALZA")

    LIMITE_TELEGRAM = 4096
    MAX_PRODUCTOS_POR_MENSAJE = 12
    URL_TIENDA = "https://www.sporting.com.ar/sporting/calzado"

    def encabezado(indice, total_partes):
        parte_str = f" (parte {indice}/{total_partes})" if total_partes > 1 else ""
        return (
            f"🚨 <b>¡CAMBIOS DE PRECIO DETECTADOS!</b> 🚨{parte_str}\n"
            f"📉 Bajas: {bajas}  📈 Aumentos: {alzas}\n"
            f"━━━━━━━━━━━━━━━━━━\n\n"
        )

    pie = (
        f"\n━━━━━━━━━━━━━━━━━━\n"
        f"👉 <a href='{URL_TIENDA}'>IR A SPORTING CALZADO</a>"
    )

    bloques = [
        formatear_bloque_producto(p_nombre, precio_viejo, p_precio, p_talles, p_marca, p_cat, tipo_cambio)
        for (p_id, p_nombre, precio_viejo, p_precio, p_url, p_talles, p_marca, p_cat, tipo_cambio) in cambios
    ]

    # Primero agrupamos bloques en tandas (por cantidad y por longitud),
    # sin encabezado todavía, porque el encabezado necesita saber el
    # total de partes final.
    tandas = []
    actual = []
    largo_actual = 0
    margen = len(pie) + 300  # margen de sobra para el encabezado más largo

    for bloque in bloques:
        bloque_largo = len(bloque) + 2  # + separador "\n\n"
        if actual and (len(actual) >= MAX_PRODUCTOS_POR_MENSAJE or largo_actual + bloque_largo + margen > LIMITE_TELEGRAM):
            tandas.append(actual)
            actual = []
            largo_actual = 0
        actual.append(bloque)
        largo_actual += bloque_largo

    if actual:
        tandas.append(actual)

    total_partes = len(tandas)
    mensajes = [
        encabezado(i + 1, total_partes) + "\n\n".join(tanda) + pie
        for i, tanda in enumerate(tandas)
    ]

    for mensaje in mensajes:
        tareas = [enviar_mensaje_telegram(session, chat_id, mensaje) for chat_id in usuarios_activos]
        await asyncio.gather(*tareas)


def obtener_precios_anteriores(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT id, precio FROM productos;")
        return {str(row[0]): round(float(row[1]), 2) for row in cur.fetchall()}


async def procesar_y_guardar(conn, session, productos_actuales):
    precios_anteriores = obtener_precios_anteriores(conn)

    cambios = []
    nuevos_registros = []
    historial_registros = []
    movimientos_log = []

    for prod in productos_actuales:
        p_id = str(prod["id"])
        p_nombre = prod["nombre"]
        p_url = prod["url"]
        p_precio = round(float(prod["precio"]), 2)
        p_talles = prod.get("talles", "")
        p_marca = prod.get("marca", "")
        p_categoria = prod.get("categoria", "")

        precio_viejo = precios_anteriores.get(p_id)

        if precio_viejo is None:
            movimientos_log.append(f"✨ [NUEVO] [{p_marca}] {p_nombre} -> ${p_precio:,.2f}")
            nuevos_registros.append((p_id, p_nombre, p_url, p_precio, p_talles, p_marca, p_categoria))
        elif p_precio != precio_viejo:
            if p_precio < precio_viejo:
                movimientos_log.append(f"📉 [BAJA] [{p_marca}] {p_nombre}: ${precio_viejo:,.2f} -> ${p_precio:,.2f}")
                cambios.append((p_id, p_nombre, precio_viejo, p_precio, p_url, p_talles, p_marca, p_categoria, "BAJA"))
            else:
                movimientos_log.append(f"📈 [ALZA] [{p_marca}] {p_nombre}: ${precio_viejo:,.2f} -> ${p_precio:,.2f}")
                cambios.append((p_id, p_nombre, precio_viejo, p_precio, p_url, p_talles, p_marca, p_categoria, "ALZA"))
            
            nuevos_registros.append((p_id, p_nombre, p_url, p_precio, p_talles, p_marca, p_categoria))
            historial_registros.append((p_id, p_precio))

    if movimientos_log:
        total_movimientos = len(movimientos_log)
        print(f"\n📊 Movimientos detectados ({total_movimientos} en total):")
        for log in movimientos_log[:15]:
            print(log)
        if total_movimientos > 15:
            print(f"... y {total_movimientos - 15} movimientos más ocultos para no saturar la consola.")
    else:
        print("\n✅ Ningún precio cambió. No hay movimientos nuevos.")

    usuarios_activos = obtener_usuarios_activos(conn) if cambios else []

    with conn:
        with conn.cursor() as cur:
            if historial_registros:
                query_historial = """
                    INSERT INTO historial_precios (producto_id, precio, fecha)
                    VALUES %s;
                """
                execute_values(
                    cur, 
                    query_historial, 
                    historial_registros, 
                    template="(%s, %s, CURRENT_TIMESTAMP)"
                )

            if cambios:
                await notificar_cambios_agrupados(session, usuarios_activos, cambios)

            if nuevos_registros:
                query_productos = """
                    INSERT INTO productos (id, nombre, url, precio, talles, marca, categoria, ultima_actualizacion)
                    VALUES %s
                    ON CONFLICT (id) DO UPDATE SET
                        nombre = EXCLUDED.nombre,
                        url = EXCLUDED.url,
                        precio = EXCLUDED.precio,
                        talles = EXCLUDED.talles,
                        marca = EXCLUDED.marca,
                        categoria = EXCLUDED.categoria,
                        ultima_actualizacion = CURRENT_TIMESTAMP;
                """
                execute_values(
                    cur,
                    query_productos,
                    nuevos_registros,
                    template="(%s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)"
                )
                print(f"✅ Se actualizaron/insertaron {len(nuevos_registros)} productos en la base de datos.")


async def obtener_pagina(sem, session, categoria_fq, desde, hasta):
    """
    Pide una tanda de productos usando el catálogo CLÁSICO de VTEX
    (fq=C:/{cadena_de_ids}/), no el buscador con IA. Esta API filtra por
    categoría de forma literal: solo trae productos asignados exactamente a
    esa categoría, sin "fuzzy"/"or" que rellene con productos parecidos.
    categoria_fq debe ser la cadena completa de IDs (raíz -> ... -> hoja),
    ej. "1/50/107/110", porque VTEX indexa por el path completo.
    Devuelve máximo 50 productos por pedido (limitación de VTEX).
    """
    async with sem:
        url = (
            f"https://www.sporting.com.ar/api/catalog_system/pub/products/search"
            f"?fq=C:/{categoria_fq}/&_from={desde}&_to={hasta}"
        )
        for intento in range(3):
            try:
                async with session.get(url, timeout=20) as res:
                    if res.status in (200, 206):
                        data = await res.json()
                        total = None
                        rango = res.headers.get("resources")
                        if rango and "/" in rango:
                            try:
                                total = int(rango.split("/")[-1])
                            except ValueError:
                                total = None
                        return data, total, res.status
                    elif res.status == 429:
                        await asyncio.sleep(5 * (intento + 1))
                    else:
                        await asyncio.sleep(2 * (intento + 1))
            except Exception:
                await asyncio.sleep(2 * (intento + 1))
        return None, None, 500


def procesar_productos(productos_lista, productos_dict):
    for item in productos_lista:
        raw_id = item.get("productId")
        p_id = str(raw_id) if raw_id is not None else None
        
        if not p_id:
            continue

        categorias_raw = item.get("categories", [])

        # No hace falta filtrar por palabra clave: el endpoint clásico
        # (fq=C:/{id}/) ya filtra por categoría de forma literal, así que
        # todo lo que llega acá está realmente asignado a "Zapatillas" en
        # el catálogo de VTEX.

        price = None
        talles_disponibles = []
        
        if item.get("items"):
            for sku in item["items"]:
                sellers = sku.get("sellers", [])
                if sellers:
                    oferta = sellers[0].get("commertialOffer", {})
                    cantidad_stock = oferta.get("AvailableQuantity", 0)
                    
                    if cantidad_stock > 0:
                        talle = sku.get("name")
                        if talle:
                            talles_disponibles.append(talle)
                            
            primer_sku_sellers = item["items"][0].get("sellers", [])
            if primer_sku_sellers:
                price = primer_sku_sellers[0].get("commertialOffer", {}).get("Price")

        if p_precio_valido(price):
            talles_str = ", ".join(talles_disponibles)
            marca = item.get("brand", "")
            
            categoria = "Calzado"
            if categorias_raw and isinstance(categorias_raw, list):
                cat_parts = [c.strip() for c in categorias_raw[0].split("/") if c.strip()]
                if cat_parts:
                    categoria = cat_parts[-1]

            productos_dict[p_id] = {
                "id": p_id,
                "nombre": item.get("productName"),
                "url": f"https://www.sporting.com.ar/{item.get('linkText', '').strip('/')}/p",
                "precio": price,
                "talles": talles_str,
                "marca": marca,
                "categoria": categoria
            }


async def obtener_cadena_categoria_zapatillas(session):
    """
    Busca en el árbol de categorías público de VTEX la cadena completa de
    IDs (raíz -> ... -> "Zapatillas", hija de "Calzado"). El filtro fq=C:/
    de VTEX necesita la cadena completa de ancestros, no solo el ID final.
    """
    url = "https://www.sporting.com.ar/api/catalog_system/pub/category/tree/3"
    try:
        async with session.get(url, timeout=20) as res:
            if res.status != 200:
                print(f"⚠️ No se pudo leer el árbol de categorías (status {res.status}).")
                return None
            arbol = await res.json()
    except Exception as e:
        print(f"⚠️ Error leyendo el árbol de categorías: {e}")
        return None

    def buscar(nodos, camino_ids, camino_nombres):
        for nodo in nodos:
            nombre = (nodo.get("name") or "").strip().lower()
            nuevo_ids = camino_ids + [nodo.get("id")]
            if nombre == "zapatillas" and camino_nombres and camino_nombres[-1] == "calzado":
                return nuevo_ids
            resultado = buscar(nodo.get("children", []), nuevo_ids, camino_nombres + [nombre])
            if resultado:
                return resultado
        return None

    cadena = buscar(arbol, [], [])
    if cadena:
        print(f"✅ Categoría 'Zapatillas' encontrada, cadena de IDs: {cadena}")
    else:
        print("⚠️ No se encontró la categoría 'Zapatillas' en el árbol.")
    return cadena


async def extraer_catalogo(session):
    productos_dict = {}
    sem = asyncio.Semaphore(20)

    # Buscamos la cadena completa de IDs de "Zapatillas" en el árbol de
    # categorías (evita depender de slugs/mayúsculas frágiles en la URL).
    cadena_ids = await obtener_cadena_categoria_zapatillas(session)
    if not cadena_ids:
        print("❌ No se pudo determinar la categoría de zapatillas. Cancelando extracción.")
        return []

    categoria_fq = "/".join(str(i) for i in cadena_ids)

    print("🔎 Extrayendo métricas de la página 1 de zapatillas...")

    data_p1, total_records, status = await obtener_pagina(sem, session, categoria_fq, 0, 49)

    if status not in (200, 206) or data_p1 is None:
        print("❌ Error obteniendo el catálogo de calzado.")
        return []

    procesar_productos(data_p1, productos_dict)

    if not total_records:
        total_records = len(productos_dict)

    # El catálogo clásico de VTEX tampoco deja paginar más allá de ~2500
    # resultados por categoría. Avisamos en vez de truncar en silencio
    # (la solución sería partir la consulta por "genero" o por subtipo,
    # ej. Zapatillas Running, Zapatillas Training, etc.)
    if total_records > 2500:
        print(f"⚠️ La categoría tiene {total_records} productos, por encima del límite de paginación de VTEX (2500). "
              f"Se van a perder productos al final del listado. Considerá dividir la consulta por género o subtipo.")
        total_records = 2500

    print(f"✅ Total a escanear: {total_records}.")

    rangos_restantes = [(desde, min(desde + 49, total_records - 1)) for desde in range(50, total_records, 50)]

    if rangos_restantes:
        print(f"⬇️ Descargando {len(rangos_restantes)} tandas restantes...")
        tareas = [obtener_pagina(sem, session, categoria_fq, desde, hasta) for desde, hasta in rangos_restantes]

        for tarea in asyncio.as_completed(tareas):
            data, _, status = await tarea
            if status in (200, 206) and data:
                procesar_productos(data, productos_dict)

    print(f"✅ Catálogo de calzado finalizado: {len(productos_dict)} productos extraídos.")
    return list(productos_dict.values())


def p_precio_valido(val):
    return val is not None and isinstance(val, (int, float)) and val > 0


async def main():
    inicio_total = time.time()
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
        "Accept": "application/json"
    }
    
    cookies = {
        "vtex_segment": "eyJjYW1wYWlnbnMiOm51bGwsImNoYW5uZWwiOiIxIiwicHJpY2VUYWJsZXMiOm51bGwsInJlZ2lvbklkIjpudWxsLCJ1dG1fY2FtcGFpZ24iOm51bGwsInV0bV9zb3VyY2UiOm51bGwsInV0bWlfY2FtcGFpZ24iOm51bGwsImN1cnJlbmN5Q29kZSI6IkFSUyIsImN1cnJlbmN5U3ltYm9sIjoiJCIsImNvdW50cnlDb2RlIjoiQVJHIiwiY3VsdHVyZUluZm8iOiJlcy1BUiIsImNoYW5uZWxQcml2YWN5IjoicHVibGljIn0",
        "vtex_binding_address": "sporting.myvtex.com/"
    }

    async with aiohttp.ClientSession(headers=headers, cookies=cookies) as session:
        conn_inicial = obtener_conexion()
        try:
            print("📦 [BD] Inicializando tablas y procesando usuarios de Telegram...")
            inicializar_bd(conn_inicial)
            await procesar_mensajes_telegram(conn_inicial, session)
        finally:
            conn_inicial.close() 

        print("🚀 Iniciando extracción del catálogo de calzado...")
        datos = await extraer_catalogo(session)

        if datos:
            conn_guardado = obtener_conexion()
            try:
                print(f"💾 [BD] Procesando {len(datos)} productos en la base de datos...")
                await procesar_y_guardar(conn_guardado, session, datos)
            finally:
                conn_guardado.close()

    duracion = time.time() - inicio_total
    print(f"🎉 Proceso asíncrono finalizado con éxito en {duracion:.2f} segundos.")


if __name__ == "__main__":
    asyncio.run(main())