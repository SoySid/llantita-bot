import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

// 1. Rate Limiting en memoria por IP (Ventana fija de 60s)
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 60;
const ipHits = new Map<string, { count: number; resetTime: number }>();

// Limpieza periódica para evitar fugas de memoria
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipHits.entries()) {
    if (now > entry.resetTime) {
      ipHits.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export function checkRateLimit(request: NextRequest): NextResponse | null {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
  const now = Date.now();

  const entry = ipHits.get(ip);
  if (!entry || now > entry.resetTime) {
    ipHits.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return null;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Por favor, reintente en unos instantes.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
        },
      }
    );
  }

  entry.count++;
  return null;
}

// 2. Escape seguro para expresiones regulares en PostgreSQL (~*)
export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 3. Esquema de validación para parámetros de /api/productos
export const productosQuerySchema = z.object({
  q: z.string().max(80).default(''),
  marcas: z.array(z.string().trim().max(40)).max(15).default([]),
  talles: z
    .array(
      z
        .string()
        .trim()
        .regex(/^[0-9]+(\.[0-9]+)?$/, 'Talle inválido')
        .max(10)
    )
    .max(15)
    .default([]),
  solo_ofertas: z.boolean().default(false),
  orden: z.enum(['descuento', 'precio_asc', 'precio_desc', 'recientes']).default('descuento'),
  page: z.number().int().min(1).max(500).default(1),
  limit: z.number().int().min(12).max(60).default(24),
});

// 4. Esquema de validación para ID en /api/historial/[id]
export const productoIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[a-zA-Z0-9_-]+$/, 'ID con caracteres no permitidos');
