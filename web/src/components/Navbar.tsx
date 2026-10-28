'use client';

import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

interface NavbarProps {
  ultimaActualizacion?: string | null;
  totalProductos: number;
}

export const Navbar: React.FC<NavbarProps> = ({ ultimaActualizacion, totalProductos }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-colors duration-200 ${
        scrolled
          ? 'bg-[#12100e]/95 py-2 sm:py-2.5'
          : 'bg-[#0e0c0b]/80 py-3 sm:py-4'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6">
        {/* Marca y avatar */}
        <a
          href="#"
          onClick={handleScrollTop}
          className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer"
          title="Ir al inicio"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-md overflow-hidden bg-[#181512] border border-[#3d332a]">
            <img
              src="/cat-shield.jpg"
              alt="Llantita"
              className="h-full w-full object-cover select-none pointer-events-none"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="logo-text text-2xl sm:text-3xl font-bold tracking-wider block leading-none">
                LLANTITA
              </span>
              {ultimaActualizacion && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#1c1815] border border-[#382e25] text-xs text-stone-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Act. {formatTimeAgo(ultimaActualizacion)}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400 hidden md:block">
              Monitor de precios en Sporting
            </p>
          </div>
        </a>

        {/* Acciones */}
        <div className="flex items-center gap-2 sm:gap-3">
          {totalProductos > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-orange-400 bg-[#1c1713] border border-orange-500/30 px-2.5 sm:px-3 py-1.5 rounded tabular-nums">
              <span className="font-bold">
                {totalProductos.toLocaleString('es-AR')}
                <span className="hidden xs:inline sm:inline text-stone-400 font-normal"> pares</span>
              </span>
            </div>
          )}

          <a
            href="https://github.com/SoySid/llantita-bot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-8 w-8 rounded bg-[#1c1814] border border-stone-800 text-stone-400 hover:text-stone-100 hover:border-orange-500 active:scale-[0.96] transition-colors cursor-pointer"
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
            className="btn-telegram px-3.5 py-1.5 rounded text-xs uppercase flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="h-3 w-3" />
            <span className="hidden xs:inline">Telegram</span>
          </a>
        </div>
      </div>
    </header>
  );
};
