import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import asyncio
import aiohttp
import psycopg2
from dotenv import load_dotenv
from llantita_bot import obtener_cadena_categoria_zapatillas, obtener_pagina

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

async def sync():
    conn = psycopg2.connect(DATABASE_URL)
    print("Conectado a la base de datos.")

    sem = asyncio.Semaphore(15)
    headers = {"User-Agent": "Mozilla/5.0"}

    async with aiohttp.ClientSession(headers=headers) as session:
        cadena = await obtener_cadena_categoria_zapatillas(session)
        if not cadena:
            print("No se pudo obtener la cadena de categorías.")
            return

        fq = "/".join(str(i) for i in cadena)
        _, total_records, status = await obtener_pagina(sem, session, fq, 0, 49)
        print(f"Total en Sporting hoy: {total_records}")

        if not total_records:
            return

        total_a_escanear = min(total_records, 2500)
        rangos = [(d, min(d + 49, total_a_escanear - 1)) for d in range(0, total_a_escanear, 50)]

        print(f"Descargando {len(rangos)} páginas para extraer IDs en vivo...")
        tareas = [obtener_pagina(sem, session, fq, d, h) for d, h in rangos]
        paginas = await asyncio.gather(*tareas)

        ids_vivos = set()
        for data, _, _ in paginas:
            if data:
                for item in data:
                    pid = item.get("productId")
                    if pid:
                        ids_vivos.add(str(pid))

    print(f"Total IDs activos encontrados en Sporting: {len(ids_vivos)}")

    with conn:
        with conn.cursor() as cur:
            # 1. Asegurar columna activo
            cur.execute("ALTER TABLE productos ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT TRUE;")
            
            # 2. Desactivar todos los productos que NO vinieron en el catálogo
            cur.execute(
                """
                UPDATE productos 
                SET activo = FALSE 
                WHERE id NOT IN %s AND activo = TRUE;
                """,
                (tuple(ids_vivos),)
            )
            desactivados_por_catalogo = cur.rowcount
            print(f"Productos desactivados (ya no existen en catálogo de Sporting): {desactivados_por_catalogo}")

            # 3. Desactivar los que tengan talles vacíos (sin stock en ningún talle)
            cur.execute(
                """
                UPDATE productos 
                SET activo = FALSE 
                WHERE (talles IS NULL OR TRIM(talles) = '') AND activo = TRUE;
                """
            )
            desactivados_sin_talle = cur.rowcount
            print(f"Productos desactivados (sin stock en ningún talle): {desactivados_sin_talle}")

            # 4. Activar los que sí están en el catálogo y tienen talles
            cur.execute(
                """
                UPDATE productos 
                SET activo = TRUE 
                WHERE id IN %s AND talles IS NOT NULL AND TRIM(talles) != '';
                """,
                (tuple(ids_vivos),)
            )
            activados = cur.rowcount
            print(f"Productos confirmados como ACTIVOS con stock: {activados}")

    conn.close()
    print("Sincronización de productos activos completada con éxito.")

if __name__ == "__main__":
    asyncio.run(sync())
