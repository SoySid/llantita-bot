import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { checkRateLimit, escapeRegExp, productosQuerySchema } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // 1. Rate Limiting por IP
  const rateLimitResponse = checkRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);

    // 2. Extraer parámetros crudos
    const marcasRaw = [
      ...searchParams.getAll('marca'),
      ...searchParams.getAll('marcas'),
    ];
    const marcasParsed = marcasRaw
      .flatMap((m) => m.split(','))
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    const tallesRaw = [
      ...searchParams.getAll('talle'),
      ...searchParams.getAll('talles'),
    ];
    const tallesParsed = tallesRaw
      .flatMap((t) => t.split(','))
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // 3. Validación y sanitización estricta con Zod
    const validationResult = productosQuerySchema.safeParse({
      q: searchParams.get('q')?.trim() || '',
      marcas: marcasParsed,
      talles: tallesParsed,
      solo_ofertas: searchParams.get('solo_ofertas') === 'true',
      orden: searchParams.get('orden') || 'descuento',
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '24', 10),
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Parámetros de consulta no válidos',
          detalles: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { q, marcas, talles, solo_ofertas: soloOfertas, orden, page, limit } =
      validationResult.data;
    const offset = (page - 1) * limit;

    // 4. Construcción de condiciones WHERE con consultas parametrizadas
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

    // Prevención de ReDoS: escapar metacaracteres antes de construir el patrón de talles
    if (talles.length > 0) {
      const orClauses = talles.map((t) => {
        const escaped = escapeRegExp(t);
        values.push(`(?<![0-9.])${escaped}(?![0-9.])`);
        return `p.talles ~* $${idx++}`;
      });
      conditions.push(`(${orClauses.join(' OR ')})`);
    }

    if (soloOfertas) {
      conditions.push('h.precio_max > p.precio');
    }

    // Ordenamiento seguro (garantizado por enum de Zod)
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
    const countQuery = soloOfertas
      ? `
        SELECT COUNT(*)::int as total
        FROM productos p
        INNER JOIN (
          SELECT producto_id, MAX(precio) AS precio_max
          FROM historial_precios
          GROUP BY producto_id
        ) h ON p.id = h.producto_id
        WHERE ${whereString};
      `
      : `
        SELECT COUNT(*)::int as total
        FROM productos p
        WHERE ${whereString};
      `;

    // Consulta principal
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

    const [countResult, productosResult] = await Promise.all([
      sql(countQuery, values),
      sql(selectQuery, [...values, limit, offset]),
    ]);

    const total = countResult[0]?.total || 0;

    return NextResponse.json(
      {
        productos: productosResult,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    console.error('Error al buscar productos:', error);
    return NextResponse.json(
      { error: 'Error al realizar la consulta' },
      { status: 500 }
    );
  }
}
