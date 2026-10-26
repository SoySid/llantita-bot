'use client';

import React from 'react';
import { Send } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

interface NavbarProps {
  ultimaActualizacion?: string | null;
  totalProductos: number;
}

export const Navbar: React.FC<NavbarProps> = ({ ultimaActualizacion, totalProductos }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-canvas">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        
        {/* Marca y avatar */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full overflow-hidden bg-surface-card shrink-0">
            <img
              src="/logo.jpg"
              alt="Llantita"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl sm:text-2xl font-bold tracking-[-0.03em] text-ink block leading-none">
                Llantita
              </span>
              {ultimaActualizacion && (
                <span className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-card text-[11px] font-medium text-ink-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-volt animate-pulse" />
                  <span>Actualizado {formatTimeAgo(ultimaActualizacion)}</span>
                </span>
              )}
            </div>
            <p className="text-[13px] text-ink-secondary hidden sm:block mt-1">
              Radar de precios y stock en Sporting Argentina
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {totalProductos > 0 && (
            <div className="hidden md:flex items-center gap-2 text-[13px] text-ink-secondary bg-surface-card px-3.5 py-2 rounded-lg tabular-nums">
              <span className="h-2 w-2 rounded-full bg-volt" />
              <span className="font-semibold text-ink">{totalProductos.toLocaleString('es-AR')} pares</span>
            </div>
          )}

          <a
            href="https://github.com/SoySid/llantita-bot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-9 w-9 rounded-lg bg-surface-card text-ink-secondary hover:text-ink focus-visible:ring-2 focus-visible:ring-infrared active:scale-[0.94] transition-[color,transform] duration-150 ease-out cursor-pointer"
            title="Ver código en GitHub"
            aria-label="GitHub"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          <a
            href="https://t.me/llantita_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-infrared hover:bg-infrared-hover focus-visible:ring-2 focus-visible:ring-volt active:scale-[0.96] text-white font-display font-bold text-[13px] px-3.5 py-2 transition-[background-color,transform] duration-150 ease-out cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Alertas Telegram</span>
            <span className="sm:hidden">Telegram</span>
          </a>
        </div>
      </div>
    </header>
  );
};
