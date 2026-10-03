'use client';

import React from 'react';
import { formatTimeAgo } from '@/lib/utils';
import { Send, Activity, Sparkles } from 'lucide-react';

interface NavbarProps {
  ultimaActualizacion: string | null;
  totalProductos: number;
}

export const Navbar: React.FC<NavbarProps> = ({ ultimaActualizacion, totalProductos }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f17]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 shadow-sm">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m4.93 4.93 4.24 4.24" />
              <path d="m14.83 9.17 4.24-4.24" />
              <path d="m14.83 14.83 4.24 4.24" />
              <path d="m9.17 14.83-4.24 4.24" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">Llantita</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                Live Deals
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Monitor de precios en Sporting Argentina
            </p>
          </div>
        </div>

        {/* Live Update Pulse Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-slate-200">
              {ultimaActualizacion ? `Actualizado ${formatTimeAgo(ultimaActualizacion)}` : 'Sincronizando...'}
            </span>
            {totalProductos > 0 && (
              <span className="hidden md:inline text-slate-500">
                · {totalProductos.toLocaleString('es-AR')} modelos
              </span>
            )}
          </div>

          {/* Telegram Action Button */}
          <a
            href="https://t.me/llantita_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-[#229ED9]/15 border border-[#229ED9]/30 px-3.5 py-1.5 text-xs font-semibold text-[#64BFE8] hover:bg-[#229ED9]/25 hover:text-white transition-all shadow-sm"
          >
            <Send className="h-3.5 w-3.5" />
            <span>@llantita_bot</span>
          </a>
        </div>
      </div>
    </header>
  );
};
