from concurrent.futures import ThreadPoolExecutor
from psycopg2.extras import execute_values
import os
import time
import psycopg2
import requests

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

  with obtener_conexion() as conn:
    with conn.cursor() as cur:
      for update in updates:
        mensaje = update.get("message", {})
        texto = mensaje.get("text", "").strip().lower()
        chat_id = mensaje.get("chat", {}).get("id")

        if not chat_id:
          continue

        if texto.startswith("/start"):
          cur.execute(
              """
                        INSERT INTO usuarios_telegram (chat_id, activo)
                        VALUES (%s, TRUE)
                        ON CONFLICT (chat_id) DO UPDATE SET activo = TRUE;
                    """,
              (chat_id,),
          )

        elif texto.startswith("/stop") or texto.startswith("/desuscribir"):
          cur.execute(
              """
                        UPDATE usuarios_telegram SET activo = FALSE WHERE chat_id = %s;
                    """,
              (chat_id,),
          )

      conn.commit()

  ultimo_update_id = updates[-1]["update_id"]
  requests.get(f"{url}?offset={ultimo_update_id + 1}")


def enviar_mensaje_telegram(chat_id, texto):
  if not TELEGRAM_BOT_TOKEN:
    return
  try:
    requests.post(
        f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
        json={"chat_id": chat_id, "text": texto, "parse_mode": "Markdown"},
        timeout=10,
    )
  except Exception as e:
    print(f"Error enviando mensaje a {chat_id}: {e}")


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
      f"🔗 {url_producto}"
  )

  for (chat_id,) in usuarios:
    enviar_mensaje_telegram(chat_id, mensaje)


def obtener_precios_anteriores():
  with obtener_conexion() as conn:
    with conn.cursor() as cur:
      cur.execute("SELECT id, precio FROM productos;")
      return {str(row[0]): float(row[1]) for row in cur.fetchall()}


def procesar_y_guardar(productos_actuales):
  precios_anteriores = obtener_precios_anteriores()
  
  ofertas = []
  nuevos_registros = []

  for prod in productos_actuales:
    p_id = str(prod["id"])
    p_nombre = prod["nombre"]
    p_url = prod["url"]
    p_precio = float(prod["precio"])

    precio_viejo = precios_anteriores.get(p_id)

    if precio_viejo is not None and p_precio < precio_viejo:
      ofertas.append((p_id, p_nombre, precio_viejo, p_precio, p_url))

    # Preparamos la tupla exacta de 4 elementos
    nuevos_registros.append((p_id, p_nombre, p_url, p_precio))

  with obtener_conexion() as conn:
    with conn.cursor() as cur:
      for p_id, p_nombre, precio_viejo, p_precio, p_url in ofertas:
        print(f"🔥 ¡OFERTA! {p_nombre}: de ${precio_viejo} a ${p_precio}")
        cur.execute(
            """
                    INSERT INTO historial_precios (producto_id, precio, fecha)
                    VALUES (%s, %s, CURRENT_TIMESTAMP);
                """,
            (p_id, p_precio),
        )
        notificar_oferta_masiva(p_nombre, precio_viejo, p_precio, p_url)

      # Aca esta el fix: quitamos ultima_actualizacion de la primera linea de columnas
      if nuevos_registros:
        query = """
            INSERT INTO productos (id, nombre, url, precio)
            VALUES %s
            ON CONFLICT (id) DO UPDATE SET
                nombre = EXCLUDED.nombre,
                url = EXCLUDED.url,
                precio = EXCLUDED.precio,
                ultima_actualizacion = CURRENT_TIMESTAMP;
        """
        execute_values(cur, query, nuevos_registros)

    conn.commit()


def obtener_productos_por_rango(rango, session):
  min_p, max_p = rango
  productos_rango = []
  page = 1
  page_size = 50

  while True:
    url = f"https://www.sporting.com.ar/api/io/_v/api/intelligent-search/product_search/calzado?page={page}&count={page_size}&query=calzado&fq=P:[{min_p} TO {max_p}]"
    
    exito = False
    data = {}
    
    for intento in range(3):
      try:
        res = session.get(url, timeout=20)
        if res.status_code == 200:
          data = res.json()
          exito = True
          break
      except Exception as e:
        print(f"Fallo de conexion en rango {min_p}-{max_p} (pag {page}), intento {intento + 1}: {e}")
        time.sleep(2)

    if not exito:
      print(f"Saltando pagina {page} del rango {min_p}-{max_p} tras 3 intentos.")
      break

    items = data.get("products", [])
    if not items:
      break

    for item in items:
      raw_id = item.get("productId")
      p_id = str(raw_id) if raw_id is not None else None
      p_nombre = item.get("productName")

      raw_link = item.get("linkText", "").strip("/")
      p_link = f"https://www.sporting.com.ar/{raw_link}/p"

      price = None
      if item.get("items"):
        sellers = item["items"][0].get("sellers", [])
        if sellers:
          price = sellers[0].get("commertialOffer", {}).get("Price")

      if p_id and p_precio_valido(price):
        productos_rango.append({
            "id": p_id,
            "nombre": p_nombre,
            "url": p_link,
            "precio": price,
        })

    page += 1
    time.sleep(0.3)

  return productos_rango


def extraer_catalogo():
  rangos = [
      (0, 30000),
      (30001, 60000),
      (60001, 90000),
      (90001, 130000),
      (130001, 200000),
      (200001, 9999999),
  ]

  session = requests.Session()
  session.headers.update({
      "User-Agent": (
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          " (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      )
  })

  productos_dict = {}

  with ThreadPoolExecutor(max_workers=4) as executor:
    resultados = executor.map(
        lambda r: obtener_productos_por_rango(r, session), rangos
    )

  for lista_productos in resultados:
    for prod in lista_productos:
      productos_dict[prod["id"]] = prod

  return list(productos_dict.values())


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