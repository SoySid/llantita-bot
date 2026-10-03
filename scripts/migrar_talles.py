import os
import re
import asyncio
import aiohttp
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def extraer_talle_sku(sku):
    for campo in ("Talle", "talle", "Talles", "talles", "Tamaño", "tamano"):
        val = sku.get(campo)
        if val and isinstance(val, list) and len(val) > 0:
            t = str(val[0]).strip()
            if t:
                return t
        elif val and isinstance(val, str) and val.strip():
            return val.strip()

    name = str(sku.get("name", "")).strip()
    if not name:
        return ""

    match_talle = re.search(r"talle[:\s]+([0-9]+(?:\.[0-9]+)?)", name, re.IGNORECASE)
    if match_talle:
        return match_talle.group(1)

    match_uk = re.match(r"^([0-9]+(?:\.[0-9]+)?)\s*\(", name)
    if match_uk:
        return match_uk.group(1)

    return name

def clave_orden_talle(val):
    try:
        return (0, float(val))
    except ValueError:
        return (1, val)

def limpiar_talles_texto(texto):
    if not texto:
        return ""
    partes = texto.split(",")
    res = []
    for p in partes:
        p = p.strip()
        m_talle = re.search(r"talle[:\s]+([0-9]+(?:\.[0-9]+)?)", p, re.IGNORECASE)
        if m_talle:
            res.append(m_talle.group(1))
            continue
        m_uk = re.match(r"^([0-9]+(?:\.[0-9]+)?)\s*\(", p)
        if m_uk:
            res.append(m_uk.group(1))
            continue
        m_num = re.search(r"\b[0-9]+(?:\.[0-9]+)?\b", p)
        if m_num:
            res.append(m_num.group(0))
        elif p:
            res.append(p)

    unicos = sorted(list(dict.fromkeys(res)), key=clave_orden_talle)
    return ", ".join(unicos)

async def actualizar_desde_vtex(conn, productos_a_consultar):
    if not productos_a_consultar:
        return

    print(f"Consultando VTEX para {len(productos_a_consultar)} productos con talles UK...")
    sem = asyncio.Semaphore(15)
    headers = {"User-Agent": "Mozilla/5.0"}
    actualizaciones = []

    async with aiohttp.ClientSession(headers=headers) as session:
        async def consultar(pid):
            async with sem:
                url = f"https://www.sporting.com.ar/api/catalog_system/pub/products/search?fq=productId:{pid}"
                for _ in range(2):
                    try:
                        async with session.get(url, timeout=12) as res:
                            if res.status == 200:
                                data = await res.json()
                                if data and data[0].get("items"):
                                    talles_disp = []
                                    for sku in data[0]["items"]:
                                        sellers = sku.get("sellers", [])
                                        if sellers:
                                            oferta = sellers[0].get("commertialOffer", {})
                                            if oferta.get("AvailableQuantity", 0) > 0:
                                                t = extraer_talle_sku(sku)
                                                if t and t not in talles_disp:
                                                    talles_disp.append(t)
                                    if talles_disp:
                                        talles_disp.sort(key=clave_orden_talle)
                                        return (pid, ", ".join(talles_disp))
                            await asyncio.sleep(0.5)
                    except Exception:
                        await asyncio.sleep(0.5)
            return None

        tareas = [consultar(pid) for pid in productos_a_consultar]
        resultados = await asyncio.gather(*tareas)
        actualizaciones = [r for r in resultados if r is not None]

    if actualizaciones:
        print(f"Actualizando {len(actualizaciones)} productos en la base de datos con talles reales de VTEX...")
        with conn.cursor() as cur:
            execute_values(
                cur,
                """
                UPDATE productos AS p SET
                    talles = u.talles
                FROM (VALUES %s) AS u(id, talles)
                WHERE p.id = u.id;
                """,
                actualizaciones
            )
        conn.commit()

def main():
    conn = psycopg2.connect(DATABASE_URL)
    print("Conectado a la base de datos.")

    with conn.cursor() as cur:
        cur.execute("SELECT id, talles FROM productos WHERE talles IS NOT NULL AND talles != '';")
        todos = cur.fetchall()

    print(f"Total productos con talles: {len(todos)}")

    limpiezas_locales = []
    necesitan_vtex = []

    # Regex para identificar si los talles solo contienen números de UK (ej: 3.5, 4, 4.5, ..., 13)
    patron_uk = re.compile(r"^(?:[1-9]|1[0-3])(?:\.[0-9])?(?:,\s*(?:[1-9]|1[0-3])(?:\.[0-9])?)*$")

    for pid, talles in todos:
        talles_limpio = talles.strip()
        if "Color:" in talles_limpio or "(UK" in talles_limpio:
            nuevo = limpiar_talles_texto(talles_limpio)
            if nuevo and not patron_uk.match(nuevo):
                limpiezas_locales.append((pid, nuevo))
            else:
                necesitan_vtex.append(pid)
        elif patron_uk.match(talles_limpio):
            necesitan_vtex.append(pid)

    if limpiezas_locales:
        print(f"Aplicando limpieza rápida a {len(limpiezas_locales)} productos (Color / UK labels)...")
        with conn.cursor() as cur:
            execute_values(
                cur,
                """
                UPDATE productos AS p SET
                    talles = u.talles
                FROM (VALUES %s) AS u(id, talles)
                WHERE p.id = u.id;
                """,
                limpiezas_locales
            )
        conn.commit()
        print("Limpieza rápida aplicada.")

    if necesitan_vtex:
        print(f"Productos con talles ambiguos/UK a consultar en VTEX: {len(necesitan_vtex)}")
        asyncio.run(actualizar_desde_vtex(conn, necesitan_vtex))

    print("Migración finalizada con éxito.")
    conn.close()

if __name__ == "__main__":
    main()
