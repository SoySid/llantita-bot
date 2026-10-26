import type { Metadata } from 'next';
import { Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Llantita | Monitor de Ofertas y Precios de Zapatillas',
  description: 'Rastreador en tiempo real de ofertas y bajas de precio de zapatillas en Sporting Argentina. Buscador por talle, marca e historial de precios.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23c82309" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17.5h18c.6 0 1-.4 1-1v-1.5c0-.6-.4-1-1-1h-2.5l-3.2-5.8A2 2 0 0 0 13.5 7h-3.8a2 2 0 0 0-1.8 1.1L5 14H3c-.6 0-1 .4-1 1v1.5c0 .6.4 1 1 1z"/><path d="M2 19h20" stroke-width="2.5"/></svg>',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`dark ${spaceGrotesk.variable} ${plusJakarta.variable}`}
    >
      <body className="bg-canvas text-ink font-sans text-base antialiased selection:bg-infrared selection:text-white">
        {children}
      </body>
    </html>
  );
}
