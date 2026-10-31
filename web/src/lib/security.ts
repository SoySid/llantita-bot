import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

// 1. Rate Limiting en memoria por IP (Ventana fija de 60s con poda pasiva apta para serverless)
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 60;
const ipHits = new Map<string, { count: number; resetTime: number }>();

function pruneExpired(now: number) {
  if (ipHits.size > 150) {
    for (const [key, entry] of ipHits.entries()) {
      if (now > entry.resetTime) {
        ipHits.delete(key);
      }
    }
  }
}

export function checkRateLimit(request: NextRequest): NextResponse | null {
  // Prioriza cabeceras seguras de proxy en Vercel/Cloudflare antes de x-forwarded-for
  const ip =
    request.headers.get('x-real-ip') ||
    request.headers.get('x-vercel-forwarded-for') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    '127.0.0.1';

  const now = Date.now();
  pruneExpired(now);

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
