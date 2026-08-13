from psycopg2.extras import execute_values
import os
import time
import psycopg2
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

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


def procesar_mensajes_telegram(conn):
    if not TELEGRAM_BOT_TOKEN:
        return

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates"
    try:
        res = requests.get(url, timeout=15).json()
    except Exception as e:
        print(f"Error al conectar con Telegram: {e}")
        return

    if not res.get("ok"):
        return

    updates = res.get("result", [])
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
    requests.get(f"{url}?offset={ultimo_update_id + 1}")


def enviar_mensaje_telegram(chat_id, texto):
    if not TELEGRAM_BOT_TOKEN:
        return
    try:
        res = requests.post(
            f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
            json={
                "chat_id": chat_id, 
                "text": texto, 
                "parse_mode": "HTML",
                "disable_web_page_preview": False
            },
            timeout=10,
        )
        if res.status_code != 200:
            print(f"Telegram devolvió {res.status_code} para chat {chat_id}: {res.text}")
    except Exception as e:
        print(f"Error enviando mensaje a {chat_id}: {e}")


def obtener_usuarios_activos(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT chat_id FROM usuarios_telegram WHERE activo = TRUE;")
        return [row[0] for row in cur.fetchall()]


def notificar_oferta_masiva(usuarios_activos, nombre, precio_anterior, precio_nuevo, url_producto):
    if not TELEGRAM_BOT_TOKEN or not usuarios_activos:
        return

    mensaje = (
        f"🚨 <b>¡ALERTA DE BAJA DE PRECIO!</b> 🚨\n"
        f"━━━━━━━━━━━━━━━━━━\n\n"
        f"👟 <b>{nombre}</b>\n\n"
        f"💸 <i>Antes:</i> <s>${precio_anterior:,.2f}</s>\n"
        f"🔥 <b>AHORA: ${precio_nuevo:,.2f}</b> 🔥\n\n"
        f"━━━━━━━━━━━━━━━━━━\n"
        f"👉 <a href='{url_producto}'>TOCÁ ACÁ PARA IR A LA TIENDA</a>"
    )

    with ThreadPoolExecutor(max_workers=5) as executor:
        for chat_id in usuarios_activos:
            executor.submit(enviar_mensaje_telegram, chat_id, mensaje)


def obtener_precios_anteriores(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT id, precio FROM productos;")
        return {str(row[0]): round(float(row[1]), 2) for row in cur.fetchall()}


def procesar_y_guardar(conn, productos_actuales):
    precios_anteriores = obtener_precios_anteriores(conn)

    ofertas = []
    nuevos_registros = []
    historial_registros = []

    for prod in productos_actuales:
        p_id = str(prod["id"])
        p_nombre = prod["nombre"]
        p_url = prod["url"]
        p_precio = round(float(prod["precio"]), 2)

        precio_viejo = precios_anteriores.get(p_id)

        if precio_viejo is not None and p_precio < precio_viejo:
            ofertas.append((p_id, p_nombre, precio_viejo, p_precio, p_url))
            historial_registros.append((p_id, p_precio))

        if precio_viejo is None or p_precio != precio_viejo:
            nuevos_registros.append((p_id, p_nombre, p_url, p_precio))

    usuarios_activos = obtener_usuarios_activos(conn) if ofertas else []

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

            for p_id, p_nombre, precio_viejo, p_precio, p_url in ofertas:
                print(f"🔥 ¡OFERTA! {p_nombre}: de ${precio_viejo} a ${p_precio}")
                notificar_oferta_masiva(usuarios_activos, p_nombre, precio_viejo, p_precio, p_url)

            if nuevos_registros:
                query_productos = """
                    INSERT INTO productos (id, nombre, url, precio, ultima_actualizacion)
                    VALUES %s
                    ON CONFLICT (id) DO UPDATE SET
                        nombre = EXCLUDED.nombre,
                        url = EXCLUDED.url,
                        precio = EXCLUDED.precio,
                        ultima_actualizacion = CURRENT_TIMESTAMP;
                """
                execute_values(
                    cur,
                    query_productos,
                    nuevos_registros,
                    template="(%s, %s, %s, %s, CURRENT_TIMESTAMP)"
                )
                print(f"✅ Se actualizaron/insertaron {len(nuevos_registros)} productos en Neon.")
            else:
                print("✅ Ningún precio cambió. No se hicieron escrituras en Neon.")


def extraer_catalogo():
    session = requests.Session()
    session.headers.update({
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            " (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        )
    })

    productos_dict = {}
    page = 1
    page_size = 50
    max_workers = 10

    print("🔎 Escaneando catálogo completo de forma concurrente...")

    def obtener_pagina(p):
        url = f"https://www.sporting.com.ar/api/io/_v/api/intelligent-search/product_search/calzado?page={p}&count={page_size}&query=calzado"
        for intento in range(3):
            try:
                res = session.get(url, timeout=20)
                if res.status_code == 200:
                    return p, res.json(), 200
                elif res.status_code == 400:
                    return p, None, 400
                elif res.status_code == 429:
                    time.sleep(5 * (intento + 1))
                else:
                    time.sleep(2 * (intento + 1))
            except Exception:
                time.sleep(2 * (intento + 1))
        return p, None, 500

    terminar = False

    while not terminar:
        futures = []
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            for i in range(max_workers):
                futures.append(executor.submit(obtener_pagina, page + i))

            for future in as_completed(futures):
                p_num, data, status = future.result()

                if status == 400 or not data or not data.get("products"):
                    terminar = True
                    continue

                if status == 200 and data:
                    for item in data.get("products", []):
                        raw_id = item.get("productId")
                        p_id = str(raw_id) if raw_id is not None else None
                        
                        if not p_id:
                            continue

                        price = None
                        if item.get("items"):
                            sellers = item["items"][0].get("sellers", [])
                            if sellers:
                                price = sellers[0].get("commertialOffer", {}).get("Price")

                        if p_precio_valido(price):
                            productos_dict[p_id] = {
                                "id": p_id,
                                "nombre": item.get("productName"),
                                "url": f"https://www.sporting.com.ar/{item.get('linkText', '').strip('/')}/p",
                                "precio": price,
                            }
        
        page += max_workers

    print(f"✅ Catálogo finalizado: {len(productos_dict)} productos extraídos.")
    return list(productos_dict.values())


def p_precio_valido(val):
    return val is not None and isinstance(val, (int, float)) and val > 0


if __name__ == "__main__":
    inicio_total = time.time()

    conn_inicial = obtener_conexion()
    try:
        print("📦 [BD] Inicializando tablas y procesando usuarios de Telegram...")
        inicializar_bd(conn_inicial)
        procesar_mensajes_telegram(conn_inicial)
    finally:
        conn_inicial.close() 

    print("🚀 Iniciando extracción del catálogo...")
    datos = extraer_catalogo()

    if datos:
        conn_guardado = obtener_conexion()
        try:
            print(f"💾 [BD] Procesando {len(datos)} productos en Neon...")
            procesar_y_guardar(conn_guardado, datos)
        finally:
            conn_guardado.close()

    duracion = time.time() - inicio_total
    print(f"🎉 Proceso finalizado con éxito en {duracion:.2f} segundos.")