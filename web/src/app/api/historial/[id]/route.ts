import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { checkRateLimit, productoIdSchema } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Rate Limiting por IP
  const rateLimitResponse = checkRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const rawParams = await params;
    const validation = productoIdSchema.safeParse(rawParams?.id);

    if (!validation.success) {
      return NextResponse.json({ error: 'ID de producto no válido' }, { status: 400 });
    }

    const id = validation.data;

    // Consulta única parametrizada que obtiene el producto y su historial
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
