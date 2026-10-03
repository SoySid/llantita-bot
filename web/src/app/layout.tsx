import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Llantita | Monitor de Ofertas y Precios de Zapatillas',
  description: 'Rastreador en tiempo real de ofertas y bajas de precio de zapatillas en Sporting Argentina. Buscador por talle, marca e historial de precios.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17.5h18c.6 0 1-.4 1-1v-1.5c0-.6-.4-1-1-1h-2.5l-3.2-5.8A2 2 0 0 0 13.5 7h-3.8a2 2 0 0 0-1.8 1.1L5 14H3c-.6 0-1 .4-1 1v1.5c0 .6.4 1 1 1z"/><path d="M2 19h20" stroke-width="2.5"/></svg>',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="bg-[#0b0f17] text-slate-100 antialiased selection:bg-rose-500/30 selection:text-rose-300">
        {children}
      </body>
    </html>
  );
}
