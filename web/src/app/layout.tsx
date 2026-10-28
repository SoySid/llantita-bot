import type { Metadata, Viewport } from 'next';
import { Teko, Barlow_Condensed, Inter } from 'next/font/google';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0e0c0b',
};

const teko = Teko({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-teko',
  display: 'swap',
});

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-barlow',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LLANTITA - Descuentos reales en zapatillas',
  description: 'Monitoreamos bajas de precio y stock en Sporting cada 30 minutos para que compres en su piso histórico.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23ff5500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17.5h18c.6 0 1-.4 1-1v-1.5c0-.6-.4-1-1-1h-2.5l-3.2-5.8A2 2 0 0 0 13.5 7h-3.8a2 2 0 0 0-1.8 1.1L5 14H3c-.6 0-1 .4-1 1v1.5c0 .6.4 1 1 1z"/><path d="M2 19h20" stroke-width="2.5"/></svg>',
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
      className={`dark scroll-smooth ${teko.variable} ${barlow.variable} ${inter.variable}`}
    >
      <body className="bg-[#0e0c0b] text-white font-sans antialiased selection:bg-[#ff5500] selection:text-black">
        {children}
      </body>
    </html>
  );
}
