import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'ID de producto requerido' }, { status: 400 });
    }

    // Consulta única que obtiene el producto y su historial en un solo roundtrip
    const rows = await sql`
      SELECT 
        p.id, 
        p.nombre, 
        p.marca, 
        p.precio::float, 
        p.url, 
        p.talles, 
        p.categoria, 
        p.ultima_actualizacion,
        COALESCE(p.activo, TRUE) as activo,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', h.id, 
                'precio', h.precio::float, 
                'fecha', h.fecha
              )
              ORDER BY h.fecha ASC
            )
            FROM historial_precios h 
            WHERE h.producto_id = p.id
          ),
          '[]'::json
        ) as historial
      FROM productos p 
      WHERE p.id = ${id}
      LIMIT 1;
    `;

    if (!rows.length) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    const { historial, ...producto } = rows[0];

    return NextResponse.json(
      {
        producto,
        historial: historial || [],
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
