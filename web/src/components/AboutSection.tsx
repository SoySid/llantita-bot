'use client';

import React from 'react';

interface AboutSectionProps {
  onExploreClick?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = () => {
  return (
    <section className="w-full border-b border-zinc-800 bg-[#09090b] py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-800/60">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="inline-block h-2 w-2 bg-emerald-400 rounded-xs" />
              <span>CATÁLOGO SPORTING ARGENTINA · MONITOREO ACTIVO</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
              Radar de zapatillas y ofertas reales
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl">
              Monitoreo continuo cada 30 minutos sobre Sporting. Verificamos el piso de precio histórico para confirmar rebajas auténticas y filtramos por talle físico disponible.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono text-zinc-300 shrink-0">
            <div className="border border-zinc-800 bg-zinc-900/60 p-3 rounded-lg">
              <span className="block text-[10px] text-zinc-400 uppercase">Frecuencia</span>
              <strong className="text-white text-xs sm:text-sm font-semibold">Cada 30 min</strong>
            </div>
            <div className="border border-zinc-800 bg-zinc-900/60 p-3 rounded-lg">
              <span className="block text-[10px] text-zinc-400 uppercase">Origen</span>
              <strong className="text-white text-xs sm:text-sm font-semibold">Sporting Oficial</strong>
            </div>
            <div className="border border-zinc-800 bg-zinc-900/60 p-3 rounded-lg col-span-2 sm:col-span-1">
              <span className="block text-[10px] text-zinc-400 uppercase">Validación</span>
              <strong className="text-emerald-400 text-xs sm:text-sm font-semibold">Piso Histórico</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

