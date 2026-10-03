import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Obtener última actualización y conteo total de activos
    const statsResult = await sql`
      SELECT 
        MAX(ultima_actualizacion) as ultima_actualizacion,
        COUNT(*)::int as total_productos
      FROM productos
      WHERE activo = TRUE AND talles IS NOT NULL AND talles != '';
    `;

    // 2. Marcas principales con conteo (solo activos con stock)
    const marcasResult = await sql`
      SELECT 
        marca, 
        COUNT(*)::int as cantidad
      FROM productos 
      WHERE marca IS NOT NULL AND marca != '' AND activo = TRUE AND talles IS NOT NULL AND talles != ''
      GROUP BY marca 
      ORDER BY cantidad DESC 
      LIMIT 50;
    `;

    // 3. Top rebajas destacadas (solo productos activos en catálogo y con stock para comprar)
    const destacadosResult = await sql`
      SELECT 
        p.id, 
        p.nombre, 
        p.marca, 
        p.precio::float, 
        p.url, 
        p.talles, 
        p.categoria,
        p.ultima_actualizacion,
        p.imagen_url,
        h.precio_max::float as precio_anterior,
        ROUND(((h.precio_max - p.precio) / h.precio_max) * 100)::int AS descuento_pct
      FROM productos p
      JOIN (
        SELECT producto_id, MAX(precio) AS precio_max
        FROM historial_precios
        GROUP BY producto_id
      ) h ON p.id = h.producto_id
      WHERE h.precio_max > p.precio AND p.activo = TRUE AND p.talles IS NOT NULL AND p.talles != ''
      ORDER BY descuento_pct DESC, p.precio ASC
      LIMIT 10;
    `;

    const stats = statsResult[0] || {};

    return NextResponse.json({
      ultima_actualizacion: stats.ultima_actualizacion,
      total_productos: stats.total_productos || 0,
      marcas: marcasResult,
      destacados: destacadosResult,
    });
  } catch (error) {
    console.error('Error al consultar estado:', error);
    return NextResponse.json(
      { error: 'Error al conectar con la base de datos' },
      { status: 500 }
    );
  }
}
