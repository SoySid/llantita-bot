import base64
import json
import os
import psycopg2
from datetime import datetime
import requests

# Se lee la URL de conexión desde la variable de entorno de GitHub o tu .env local
DATABASE_URL = os.getenv("DATABASE_URL")

cookies = {
    'VtexWorkspace': 'master%3A-',
    '_fbp': 'fb.2.1786415635596.675698177669314501.AQYCAQIB',
    'vtex_segment': 'eyJjYW1wYWlnbnMiOm51bGwsImNoYW5uZWwiOiIxIiwicHJpY2VUYWJsZXMiOm51bGwsInJlZ2lvbklkIjpudWxsLCJ1dG1fY2FtcGFpZ24iOm51bGwsInV0bV9zb3VyY2UiOm51bGwsInV0bWlfY2FtcGFpZ24iOm51bGwsImN1cnJlbmN5Q29kZSI6IkFSUyIsImN1cnJlbmN5U3ltYm9sIjoiJCIsImNvdW50cnlDb2RlIjoiQVJHIiwiY3VsdHVyZUluZm8iOiJlcy1BUiIsImNoYW5uZWxQcml2YWN5IjoicHVibGljIn0',
}

headers = {
    'accept': '*/*',
    'accept-language': 'es-ES,es;q=0.9',
    'content-type': 'application/json',
    'referer': 'https://www.sporting.com.ar/sporting/calzado?initialMap=c,c&initialQuery=sporting/calzado&map=category-1,category-2,genero&query=/sporting/calzado/hombre&searchState',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
}

def obtener_conexion():
    if not DATABASE_URL:
        raise ValueError("La variable DATABASE_URL no está configurada.")
    return psycopg2.connect(DATABASE_URL)

def inicializar_db():
    conn = obtener_conexion()
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS productos (
        id VARCHAR PRIMARY KEY,
        nombre VARCHAR NOT NULL,
        precio NUMERIC NOT NULL,
        url VARCHAR NOT NULL,
        ultima_actualizacion TIMESTAMP NOT NULL
    );
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS historial_precios (
        id SERIAL PRIMARY KEY,
        producto_id VARCHAR NOT NULL,
        precio NUMERIC NOT NULL,
        fecha TIMESTAMP NOT NULL,
        FOREIGN KEY (producto_id) REFERENCES productos (id)
    );
    """)
    
    conn.commit()
    cursor.close()
    conn.close()

def generar_variables_base64(desde, hasta):
    variables_dict = {
        "skusFilter": "ALL_AVAILABLE",
        "simulationBehavior": "default",
        "installmentCriteria": "ALL",
        "productOriginVtex": False,
        "map": "category-1,category-2,genero",
        "query": "sporting/calzado/hombre",
        "orderBy": "OrderByScoreDESC",
        "from": desde,
        "to": hasta,
        "selectedFacets": [
            {"key": "category-1", "value": "sporting"},
            {"key": "category-2", "value": "calzado"},
            {"key": "genero", "value": "hombre"}
        ],
        "searchState": None,
        "facetsBehavior": "Static",
        "categoryTreeBehavior": "default",
        "withFacets": False
    }
    json_bytes = json.dumps(variables_dict).encode('utf-8')
    return base64.b64encode(json_bytes).decode('utf-8')

def construir_url_producto(prod):
    link = prod.get("link") or prod.get("linkText", "")
    if not link:
        return "https://www.sporting.com.ar"
    if link.startswith("http"):
        return link
    if link.startswith("/"):
        return f"https://www.sporting.com.ar{link}"
    return f"https://www.sporting.com.ar/{link}/p"

def extraer_precio_valido(items):
    for item in items:
        for seller in item.get("sellers", []):
            offer = seller.get("commertialOffer", {})
            precio = offer.get("Price", 0)
            if precio and precio > 0:
                return precio
    return 0

def obtener_precios_actuales():
    precios = {}
    tamanio_pagina = 50
    desde = 0

    print("Iniciando extracción completa del catálogo...")

    while True:
        hasta = desde + tamanio_pagina - 1
        variables_b64 = generar_variables_base64(desde, hasta)

        params = {
            'workspace': 'master',
            'maxAge': 'short',
            'appsEtag': 'remove',
            'domain': 'store',
            'locale': 'es-AR',
            '__bindingId': '22af0609-1aa9-4623-a580-93c1df938f14',
            'operationName': 'productSearchV3',
            'variables': '{}',
            'extensions': json.dumps({
                "persistedQuery": {
                    "version": 1,
                    "sha256Hash": "b398fc0a2fd04ea5d4f7a94c732c10fb1bf64f8f9a2b31c92aee6a5e796457c9",
                    "sender": "vtex.store-resources@0.x",
                    "provider": "vtex.search-graphql@0.x"
                },
                "variables": variables_b64
            })
        }

        res = requests.get(
            'https://www.sporting.com.ar/_v/segment/graphql/v1',
            params=params,
            cookies=cookies,
            headers=headers
        )
        
        data = res.json()
        productos = data.get("data", {}).get("productSearch", {}).get("products", [])

        if not productos:
            break

        for prod in productos:
            prod_id = prod.get("productId")
            nombre = prod.get("productName")
            items = prod.get("items", [])
            url_producto = construir_url_producto(prod)
            precio = extraer_precio_valido(items)
            
            if prod_id and nombre and precio > 0:
                precios[prod_id] = {
                    "nombre": nombre,
                    "precio": precio,
                    "url": url_producto
                }

        if len(productos) < tamanio_pagina:
            break

        desde += tamanio_pagina

    return precios

def procesar_y_guardar(precios_actuales):
    conn = obtener_conexion()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, precio FROM productos")
    historial = {row[0]: float(row[1]) for row in cursor.fetchall()}
    
    fecha_actual = datetime.now()
    hubo_bajadas = False
    es_primera_ejecucion = len(historial) == 0

    for prod_id, info in precios_actuales.items():
        precio_actual = info['precio']
        nombre = info['nombre']
        url = info['url']

        if prod_id in historial:
            precio_anterior = historial[prod_id]

            # Tu lógica exacta: detecta cualquier bajada de precio
            if precio_actual < precio_anterior:
                diferencia = precio_anterior - precio_actual
                print(f"🔥 ¡BAJÓ DE PRECIO! {nombre}")
                print(f"   Antes: ${precio_anterior:,.2f} | Ahora: ${precio_actual:,.2f} (Ahorro: ${diferencia:,.2f})")
                print(f"   Link: {url}\n")
                hubo_bajadas = True

                cursor.execute(
                    "INSERT INTO historial_precios (producto_id, precio, fecha) VALUES (%s, %s, %s)",
                    (prod_id, precio_actual, fecha_actual)
                )

        cursor.execute("""
        INSERT INTO productos (id, nombre, precio, url, ultima_actualizacion)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT(id) DO UPDATE SET
            precio = EXCLUDED.precio,
            ultima_actualizacion = EXCLUDED.ultima_actualizacion
        """, (prod_id, nombre, precio_actual, url, fecha_actual))

    conn.commit()
    cursor.close()
    conn.close()

    if es_primera_ejecucion:
        print(f"Primera corrida exitosa en Neon: {len(precios_actuales)} productos procesados.")
    elif not hubo_bajadas:
        print(f"Revisión completada sobre {len(precios_actuales)} productos: no bajó ningún precio respecto al historial.")

def analizar_precios():
    inicializar_db()
    precios_actuales = obtener_precios_actuales()
    
    if not precios_actuales:
        print("Atención: No se obtuvieron productos.")
        return

    procesar_y_guardar(precios_actuales)

if __name__ == "__main__":
    analizar_precios()