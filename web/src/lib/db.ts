import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

let cachedClient: NeonQueryFunction<false, false> | null = null;
let cachedUrl: string | null = null;

// Inicialización diferida y cacheada para optimizar reutilización en serverless
export const sql = ((...args: any[]) => {
  const databaseUrl =
    process.env.DATABASE_URL ||
    'postgresql://dummy:dummy@localhost:5432/dummy';
  if (!cachedClient || cachedUrl !== databaseUrl) {
    cachedClient = neon(databaseUrl);
    cachedUrl = databaseUrl;
  }
  return (cachedClient as any)(...args);
}) as unknown as NeonQueryFunction<false, false>;
