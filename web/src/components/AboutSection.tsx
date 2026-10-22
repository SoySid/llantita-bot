'use client';

import React from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

interface AboutSectionProps {
  onExploreClick?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onExploreClick }) => {
  return (
    <section className="w-full bg-[#09090b] pt-10 pb-12 sm:pt-14 sm:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-5">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.04]">
            Zapatillas con rebajas verificadas
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl">
            Monitoreamos Sporting Argentina cada 30 minutos. Comparamos cada precio contra su piso histórico registrado para avisarte únicamente cuando el descuento es real y hay stock físico en tu talle.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 rounded-xl bg-white text-zinc-950 font-bold text-sm px-6 py-3.5 hover:bg-zinc-200 active:scale-[0.96] transition-[background-color,transform] duration-150 ease-out cursor-pointer"
            >
              <span>Explorar catálogo</span>
              <ArrowDown className="h-4 w-4" />
            </button>

            <a
              href="https://t.me/llantita_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 text-zinc-200 font-semibold text-sm px-6 py-3.5 hover:bg-zinc-800 hover:text-white active:scale-[0.96] transition-[background-color,color,transform] duration-150 ease-out cursor-pointer"
            >
              <span>Canal de Telegram</span>
              <ArrowUpRight className="h-4 w-4 text-zinc-400" />
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs sm:text-sm text-zinc-400">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Actualizado cada 30 min
            </span>
            <span>Catálogo Sporting oficial</span>
            <span>Validación contra piso histórico</span>
          </div>
        </div>
      </div>
    </section>
  );
};
