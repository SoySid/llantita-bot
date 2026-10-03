const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

async function main() {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const dbMatch = envContent.match(/DATABASE_URL=(.*)/);
  if (!dbMatch) {
    console.error('DATABASE_URL no encontrada en .env.local');
    process.exit(1);
  }
  const sql = neon(dbMatch[1].trim());

  console.log('🚀 Iniciando extracción de imágenes oficiales desde Sporting VTEX...');
  const categoryFq = '106/107/110';
  const pageSize = 50;
  const maxProducts = 2200;
  const pages = [];

  for (let from = 0; from < maxProducts; from += pageSize) {
    pages.push({ from, to: from + pageSize - 1 });
  }

  const allUpdates = [];
  const concurrency = 6;

  for (let i = 0; i < pages.length; i += concurrency) {
    const batch = pages.slice(i, i + concurrency);
    const results = await Promise.all(
      batch.map(async ({ from, to }) => {
        const url = `https://www.sporting.com.ar/api/catalog_system/pub/products/search?fq=C:/${categoryFq}/&_from=${from}&_to=${to}`;
        for (let intento = 0; intento < 3; intento++) {
          try {
            const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            if (res.ok || res.status === 206) {
              const data = await res.json();
              if (Array.isArray(data)) {
                return data.map((item) => {
                  const id = String(item.productId);
                  let img = null;
                  if (item.items && item.items.length > 0) {
                    for (const sku of item.items) {
                      if (sku.images && sku.images.length > 0 && sku.images[0].imageUrl) {
                        img = sku.images[0].imageUrl;
                        break;
                      }
                    }
                  }
                  return { id, img };
                }).filter((x) => x.id && x.img);
              }
            }
            await new Promise((r) => setTimeout(r, 1000 * (intento + 1)));
          } catch (e) {
            await new Promise((r) => setTimeout(r, 1000 * (intento + 1)));
          }
        }
        return [];
      })
    );

    for (const r of results) {
      allUpdates.push(...r);
    }
    console.log(`📦 Procesadas páginas ${i + 1}-${Math.min(i + concurrency, pages.length)} de ${pages.length} (${allUpdates.length} fotos obtenidas)...`);
  }

  console.log(`\n💾 Guardando ${allUpdates.length} imágenes en la base de datos PostgreSQL...`);

  // Guardar en lotes de 100 con VALUES
  const dbBatchSize = 100;
  let totalSaved = 0;

  for (let i = 0; i < allUpdates.length; i += dbBatchSize) {
    const chunk = allUpdates.slice(i, i + dbBatchSize);
    
    // Armar UPDATE en bloque
    const valuesSql = chunk
      .map((item) => `('${item.id.replace(/'/g, "''")}', '${item.img.replace(/'/g, "''")}')`)
      .join(', ');

    const query = `
      UPDATE productos AS p
      SET imagen_url = v.imagen_url
      FROM (VALUES ${valuesSql}) AS v(id, imagen_url)
      WHERE p.id = v.id;
    `;

    try {
      await sql(query);
      totalSaved += chunk.length;
      process.stdout.write(`✅ Actualizados ${totalSaved}/${allUpdates.length} productos...\r`);
    } catch (err) {
      console.error(`Error guardando lote ${i}:`, err.message);
    }
  }

  console.log(`\n🎉 ¡Listo! Se actualizaron ${totalSaved} imágenes oficiales en la base de datos.`);
}

main().catch(console.error);
