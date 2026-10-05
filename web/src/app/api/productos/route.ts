import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';
    const marcasRaw = [
      ...searchParams.getAll('marca'),
      ...searchParams.getAll('marcas'),
    ];
    const marcas = marcasRaw
      .flatMap((m) => m.split(','))
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    const tallesRaw = [
      ...searchParams.getAll('talle'),
      ...searchParams.getAll('talles'),
    ];
    const talles = tallesRaw
      .flatMap((t) => t.split(','))
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const soloOfertas = searchParams.get('solo_ofertas') === 'true';
    const orden = searchParams.get('orden') || 'descuento';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(60, Math.max(12, parseInt(searchParams.get('limit') || '24', 10)));
    const offset = (page - 1) * limit;

    // Construcción de condiciones WHERE seguras (solo productos activos y con stock)
    const conditions: string[] = ['p.activo = TRUE', "p.talles IS NOT NULL AND p.talles != ''"];
    const values: (string | number)[] = [];
    let idx = 1;

    if (q) {
      conditions.push(`(p.nombre ILIKE $${idx} OR p.marca ILIKE $${idx})`);
      values.push(`%${q}%`);
      idx++;
    }

    if (marcas.length > 0) {
      const orClauses = marcas.map((m) => {
        values.push(m);
        return `p.marca ILIKE $${idx++}`;
      });
      conditions.push(`(${orClauses.join(' OR ')})`);
    }

    if (talles.length > 0) {
      const orClauses = talles.map((t) => {
        values.push(`(?<![0-9.])${t}(?![0-9.])`);
        return `p.talles ~* $${idx++}`;
      });
      conditions.push(`(${orClauses.join(' OR ')})`);
    }

    if (soloOfertas) {
      conditions.push('h.precio_max > p.precio');
    }

    // Ordenamiento
    let orderByClause = 'p.ultima_actualizacion DESC';
    if (orden === 'descuento') {
      orderByClause = 'descuento_pct DESC NULLS LAST, p.precio ASC';
    } else if (orden === 'precio_asc') {
      orderByClause = 'p.precio ASC';
    } else if (orden === 'precio_desc') {
      orderByClause = 'p.precio DESC';
    } else if (orden === 'recientes') {
      orderByClause = 'p.ultima_actualizacion DESC';
    }

    const whereString = conditions.join(' AND ');

    // Conteo total para paginación
    const countQuery = `
      SELECT COUNT(*)::int as total
      FROM productos p
      LEFT JOIN (
        SELECT producto_id, MAX(precio) AS precio_max
        FROM historial_precios
        GROUP BY producto_id
      ) h ON p.id = h.producto_id
      WHERE ${whereString};
    `;

    // Query principal de productos
    const selectQuery = `
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
        CASE 
          WHEN h.precio_max > p.precio THEN ROUND(((h.precio_max - p.precio) / h.precio_max) * 100)::int
          ELSE 0
        END AS descuento_pct
      FROM productos p
      LEFT JOIN (
        SELECT producto_id, MAX(precio) AS precio_max
        FROM historial_precios
        GROUP BY producto_id
      ) h ON p.id = h.producto_id
      WHERE ${whereString}
      ORDER BY ${orderByClause}
      LIMIT $${idx} OFFSET $${idx + 1};
    `;

    const countResult = await sql(countQuery, values);
    const total = countResult[0]?.total || 0;

    const productosResult = await sql(selectQuery, [...values, limit, offset]);

    return NextResponse.json({
      productos: productosResult,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error al buscar productos:', error);
    return NextResponse.json(
      { error: 'Error al realizar la consulta' },
      { status: 500 }
    );
  }
}
