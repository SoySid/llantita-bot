'use client';

import React from 'react';
import { formatTimeAgo } from '@/lib/utils';
import { Send } from 'lucide-react';

interface NavbarProps {
  ultimaActualizacion: string | null;
  totalProductos: number;
}

export const Navbar: React.FC<NavbarProps> = ({ ultimaActualizacion, totalProductos }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-[#09090b]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Brand / Logo sobrio con la foto del gatito */}
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden border-2 border-zinc-700 bg-zinc-800 shrink-0 hover:border-zinc-400 transition-colors">
            <img
              src="/logo.jpg"
              alt="Llantita"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <span className="text-xl sm:text-2xl font-black uppercase tracking-tight text-zinc-100">
              Llantita
            </span>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Precios y ofertas en Sporting Argentina
            </p>
          </div>
        </div>

        {/* Datos de sincronización y Botón */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Indicador tipográfico sobrio estilo agregador */}
          <div className="hidden md:flex items-center gap-2.5 text-xs text-zinc-400 border border-zinc-800 bg-zinc-900/60 px-3.5 py-1.5 rounded-lg font-mono">
            {totalProductos > 0 && (
              <>
                <span className="text-zinc-200 font-semibold">{totalProductos.toLocaleString('es-AR')} modelos</span>
                <span className="text-zinc-600">/</span>
              </>
            )}
            <span>{ultimaActualizacion ? `Actualizado ${formatTimeAgo(ultimaActualizacion)}` : 'Sincronizando'}</span>
          </div>

          {/* Botón de GitHub */}
          <a
            href="https://github.com/SoySid/llantita-bot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-8 w-8 rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
            title="Ver código en GitHub"
            aria-label="GitHub"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* Botón de Telegram de alto contraste */}
          <a
            href="https://t.me/llantita_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs px-3.5 sm:px-4 py-2 transition-colors shadow-sm"
          >
            <Send className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Bot de Telegram</span>
            <span className="sm:hidden">Telegram</span>
          </a>
        </div>
      </div>
    </header>
  );
};
