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
                    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
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
    
    for intento in range(3):
        try:
            async with session.post(url, json=payload, timeout=20) as res:
                if res.status != 200:
                    error_text = await res.text()
                    print(f"Telegram devolvió {res.status} para chat {chat_id}: {error_text}")
                break
        except asyncio.TimeoutError:
            print(f"⚠️ Telegram Timeout enviando mensaje a {chat_id} (Intento {intento + 1}/3)")
            await asyncio.sleep(2)
        except Exception as e:
            print(f"Error enviando mensaje a {chat_id}: {e}")
            break


def obtener_usuarios_activos(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT chat_id FROM usuarios_telegram WHERE activo = TRUE;")
        return [row[0] for row in cur.fetchall()]


async def notificar_cambio_precio(session, usuarios_activos, nombre, precio_anterior, precio_nuevo, url_producto, talles, tipo_cambio):
    if not TELEGRAM_BOT_TOKEN or not usuarios_activos:
        return

    talles_str = talles if talles else "No especificado / Consultar en web"

    if tipo_cambio == "BAJA":
        encabezado = "🚨 <b>¡ALERTA DE BAJA DE PRECIO!</b> 🚨"
        emoji = "🔥"
    else:
        encabezado = "📈 <b>¡ALERTA DE AUMENTO DE PRECIO!</b> 📈"
        emoji = "💸"

    mensaje = (
        f"{encabezado}\n"
        f"━━━━━━━━━━━━━━━━━━\n\n"
        f"👟 <b>{nombre}</b>\n\n"
        f"📉 <i>Antes:</i> <s>${precio_anterior:,.2f}</s>\n"
        f"{emoji} <b>AHORA: ${precio_nuevo:,.2f}</b> {emoji}\n\n"
        f"📏 <b>Talles Disp:</b> {talles_str}\n\n"
        f"━━━━━━━━━━━━━━━━━━\n"
        f"👉 <a href='{url_producto}'>TOCÁ ACÁ PARA IR A LA TIENDA</a>"
    )

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

        precio_viejo = precios_anteriores.get(p_id)

        if precio_viejo is None:
            movimientos_log.append(f"✨ [NUEVO] {p_nombre} -> ${p_precio:,.2f}")
            nuevos_registros.append((p_id, p_nombre, p_url, p_precio, p_talles))
        elif p_precio != precio_viejo:
            if p_precio < precio_viejo:
                movimientos_log.append(f"📉 [BAJA] {p_nombre}: ${precio_viejo:,.2f} -> ${p_precio:,.2f}")
                cambios.append((p_id, p_nombre, precio_viejo, p_precio, p_url, p_talles, "BAJA"))
            else:
                movimientos_log.append(f"📈 [ALZA] {p_nombre}: ${precio_viejo:,.2f} -> ${p_precio:,.2f}")
                cambios.append((p_id, p_nombre, precio_viejo, p_precio, p_url, p_talles, "ALZA"))
            
            nuevos_registros.append((p_id, p_nombre, p_url, p_precio, p_talles))
            historial_registros.append((p_id, p_precio))

    # --- PROTECCIÓN PARA LA CONSOLA ---
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

            # --- PROTECCIÓN PARA TELEGRAM ---
            if cambios:
                if len(cambios) <= 5:
                    for p_id, p_nombre, precio_viejo, p_precio, p_url, p_talles, tipo_cambio in cambios:
                        await notificar_cambio_precio(session, usuarios_activos, p_nombre, precio_viejo, p_precio, p_url, p_talles, tipo_cambio)
                else:
                    bajas = sum(1 for c in cambios if c[6] == "BAJA")
                    alzas = sum(1 for c in cambios if c[6] == "ALZA")
                    mensaje_global = (
                        f"🚨 <b>¡ALERTA DE CAMBIOS MASIVOS!</b> 🚨\n"
                        f"━━━━━━━━━━━━━━━━━━\n\n"
                        f"Detectamos cambios de precio en <b>{len(cambios)}</b> productos.\n"
                        f"📉 Bajas: {bajas}\n"
                        f"📈 Aumentos: {alzas}\n\n"
                        f"¡Entrá a la tienda para revisar los movimientos!\n\n"
                        f"👉 <a href='https://www.sporting.com.ar/calzado'>IR A SPORTING</a>"
                    )
                    tareas_masivas = [enviar_mensaje_telegram(session, chat_id, mensaje_global) for chat_id in usuarios_activos]
                    await asyncio.gather(*tareas_masivas)

            if nuevos_registros:
                query_productos = """
                    INSERT INTO productos (id, nombre, url, precio, talles, ultima_actualizacion)
                    VALUES %s
                    ON CONFLICT (id) DO UPDATE SET
                        nombre = EXCLUDED.nombre,
                        url = EXCLUDED.url,
                        precio = EXCLUDED.precio,
                        talles = EXCLUDED.talles,
                        ultima_actualizacion = CURRENT_TIMESTAMP;
                """
                execute_values(
                    cur,
                    query_productos,
                    nuevos_registros,
                    template="(%s, %s, %s, %s, %s, CURRENT_TIMESTAMP)"
                )
                print(f"✅ Se actualizaron/insertaron {len(nuevos_registros)} productos en la base de datos.")


async def obtener_pagina(sem, session, url_base, p):
    async with sem:
        url = f"{url_base}&page={p}"
        for intento in range(3):
            try:
                async with session.get(url, timeout=20) as res:
                    if res.status == 200:
                        data = await res.json()
                        return p, data, 200
                    elif res.status == 429:
                        await asyncio.sleep(5 * (intento + 1))
                    else:
                        await asyncio.sleep(2 * (intento + 1))
            except Exception:
                await asyncio.sleep(2 * (intento + 1))
        return p, None, 500


def procesar_productos(data, productos_dict):
    for item in data.get("products", []):
        raw_id = item.get("productId")
        p_id = str(raw_id) if raw_id is not None else None
        
        if not p_id:
            continue

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
            productos_dict[p_id] = {
                "id": p_id,
                "nombre": item.get("productName"),
                "url": f"https://www.sporting.com.ar/{item.get('linkText', '').strip('/')}/p",
                "precio": price,
                "talles": talles_str
            }


async def extraer_catalogo(session):
    productos_dict = {}
    sem = asyncio.Semaphore(20)
    
    url_base = "https://www.sporting.com.ar/api/io/_v/api/intelligent-search/product_search/calzado?count=50&query=calzado"
    
    print("🔎 Extrayendo métricas de la página 1...")
    
    data_p1 = None
    for intento in range(3):
        try:
            async with session.get(f"{url_base}&page=1", timeout=20) as res:
                if res.status == 200:
                    data_p1 = await res.json()
                    break
        except Exception:
            pass
            
    if not data_p1:
        print("❌ Error obteniendo el catálogo principal.")
        return []

    procesar_productos(data_p1, productos_dict)
    
    total_records = data_p1.get("recordsFiltered", 2500)
    total_pages = min((total_records // 50) + (1 if total_records % 50 > 0 else 0), 50)
    
    print(f"✅ Total reportado en catálogo: {total_records}. Descargando las {total_pages - 1} páginas restantes...")

    if total_pages > 1:
        tareas = [obtener_pagina(sem, session, url_base, p) for p in range(2, total_pages + 1)]
        
        for tarea in asyncio.as_completed(tareas):
            p_num, data, status = await tarea
            if status == 200 and data:
                procesar_productos(data, productos_dict)

    print(f"✅ Catálogo finalizado: {len(productos_dict)} productos extraídos.")
    return list(productos_dict.values())


def p_precio_valido(val):
    return val is not None and isinstance(val, (int, float)) and val > 0


async def main():
    inicio_total = time.time()
    
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            " (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        )
    }

    async with aiohttp.ClientSession(headers=headers) as session:
        conn_inicial = obtener_conexion()
        try:
            print("📦 [BD] Inicializando tablas y procesando usuarios de Telegram...")
            inicializar_bd(conn_inicial)
            await procesar_mensajes_telegram(conn_inicial, session)
        finally:
            conn_inicial.close() 

        print("🚀 Iniciando extracción del catálogo...")
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