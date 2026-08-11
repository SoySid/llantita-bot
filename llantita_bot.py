import os
import requests
import psycopg2

DATABASE_URL = os.getenv("DATABASE_URL")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

def obtener_conexion():
    return psycopg2.connect(DATABASE_URL)

def inicializar_bd():
    with obtener_conexion() as conn:
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
                CREATE TABLE IF NOT EXISTS usuarios_telegram (
                    chat_id BIGINT PRIMARY KEY,
                    activo BOOLEAN DEFAULT TRUE,
                    fecha_suscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            conn.commit()

def procesar_mensajes_telegram():
    if not TELEGRAM_BOT_TOKEN:
        return

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates"
    res = requests.get(url).json()

    if not res.get("ok"):
        return

    updates = res.get("result", [])
    if not updates:
        return

    with obtener_conexion() as conn:
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

            conn.commit()

    ultimo_update_id = updates[-1]["update_id"]
    requests.get(f"{url}?offset={ultimo_update_id + 1}")

def enviar_mensaje_telegram(chat_id, texto):
    if not TELEGRAM_BOT_TOKEN:
        return
    requests.post(
        f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
        json={"chat_id": chat_id, "text": texto, "parse_mode": "Markdown"}
    )

def notificar_oferta_masiva(nombre, precio_anterior, precio_nuevo, url_producto):
    if not TELEGRAM_BOT_TOKEN:
        return

    with obtener_conexion() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT chat_id FROM usuarios_telegram WHERE activo = TRUE;")
            usuarios = cur.fetchall()

    if not usuarios:
        return

    mensaje = (
        f"🚨 *OFERTA* 🚨\n\n"
        f"👟 *{nombre}*\n"
        f"❌ Precio anterior: ~${precio_anterior:,.2f}~\n"
        f"🔥 *Precio nuevo: ${precio_nuevo:,.2f}*\n\n"
        f"🔗 [Ver producto en la tienda]({url_producto})"
    )

    for (chat_id,) in usuarios:
        enviar_mensaje_telegram(chat_id, mensaje)

def obtener_precios_anteriores():
    with obtener_conexion() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, precio FROM productos;")
            return {row[0]: float(row[1]) for row in cur.fetchall()}

def procesar_y_guardar(productos_actuales):
    precios_anteriores = obtener_precios_anteriores()

    with obtener_conexion() as conn:
        with conn.cursor() as cur:
            for prod in productos_actuales:
                p_id = prod["id"]
                p_nombre = prod["nombre"]
                p_url = prod["url"]
                p_precio = prod["precio"]

                precio_viejo = precios_anteriores.get(p_id)

                if precio_viejo is not None and p_precio < precio_viejo:
                    print(f"🔥 ¡OFERTA! {p_nombre}: de ${precio_viejo} a ${p_precio}")
                    cur.execute("""
                        INSERT INTO historial_precios (producto_id, precio, fecha)
                        VALUES (%s, %s, CURRENT_TIMESTAMP);
                    """, (p_id, p_precio))
                    
                    notificar_oferta_masiva(p_nombre, precio_viejo, p_precio, p_url)

                cur.execute("""
                    INSERT INTO productos (id, nombre, url, precio, ultima_actualizacion)
                    VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)
                    ON CONFLICT (id) DO UPDATE SET
                        nombre = EXCLUDED.nombre,
                        url = EXCLUDED.url,
                        precio = EXCLUDED.precio,
                        ultima_actualizacion = CURRENT_TIMESTAMP;
                """, (p_id, p_nombre, p_url, p_precio))

            conn.commit()

def extraer_catalogo():
    productos = []
    page = 1
    page_size = 50

    while True:
        url = f"https://www.sporting.com.ar/api/io/_v/api/intelligent-search/product_search/calzado?page={page}&count={page_size}&query=calzado"
        res = requests.get(url)
        
        if res.status_code != 200:
            break
            
        data = res.json()
        items = data.get("products", [])
        
        if not items:
            break

        for item in items:
            p_id = item.get("productId")
            p_nombre = item.get("productName")
            p_link = f"https://www.sporting.com.ar{item.get('linkText')}/p"
            
            price = None
            if item.get("items"):
                sellers = item["items"][0].get("sellers", [])
                if sellers:
                    price = sellers[0].get("commertialOffer", {}).get("Price")

            if p_id and p_precio_valido(price):
                productos.append({
                    "id": p_id,
                    "nombre": p_nombre,
                    "url": p_link,
                    "precio": price
                })

        page += 1

    return productos

def p_precio_valido(val):
    return val is not None and isinstance(val, (int, float)) and val > 0

if __name__ == "__main__":
    print("Inicializando base de datos...")
    inicializar_bd()

    print("Procesando altas y bajas en Telegram...")
    procesar_mensajes_telegram()

    print("Iniciando extracción del catálogo...")
    datos = extraer_catalogo()
    
    print(f"Productos obtenidos: {len(datos)}. Guardando en base de datos...")
    procesar_y_guardar(datos)

    print("Proceso finalizado con éxito.")