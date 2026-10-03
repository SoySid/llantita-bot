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

    // 1. Obtener producto
    const productoResult = await sql`
      SELECT 
        id, 
        nombre, 
        marca, 
        precio::float, 
        url, 
        talles, 
        categoria, 
        ultima_actualizacion,
        COALESCE(activo, TRUE) as activo
      FROM productos 
      WHERE id = ${id}
      LIMIT 1;
    `;

    if (!productoResult.length) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    // 2. Obtener historial cronológico de precios
    const historialResult = await sql`
      SELECT 
        id, 
        precio::float, 
        fecha 
      FROM historial_precios 
      WHERE producto_id = ${id}
      ORDER BY fecha ASC;
    `;

    return NextResponse.json({
      producto: productoResult[0],
      historial: historialResult,
    });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
