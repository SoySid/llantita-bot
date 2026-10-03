import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

// Inicialización diferida (lazy): evita que Next.js falle durante 'Collecting page data'
// en Vercel si la variable DATABASE_URL aún no se cargó en la fase de análisis estático.
export const sql = ((...args: any[]) => {
  const databaseUrl =
    process.env.DATABASE_URL ||
    'postgresql://dummy:dummy@localhost:5432/dummy';
  const client = neon(databaseUrl);
  return (client as any)(...args);
}) as unknown as NeonQueryFunction<false, false>;
