'use client';

import React from 'react';

interface AboutSectionProps {
  onExploreClick?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = () => {
  return (
    <section className="relative w-full border-b border-zinc-800 bg-[#09090b] py-10 sm:py-14 overflow-hidden">
      {/* Atmósfera sutil de iluminación superior */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,255,255,0.06),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          
          {/* Kicker técnico */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/90 px-3.5 py-1 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Monitor de zapatillas · Sporting Argentina</span>
          </div>

          {/* Titular central de alto impacto */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none">
            Comprá cuando{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500">
              bajan de verdad
            </span>
            .
          </h1>

          {/* Explicación concisa y humana */}
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Llantita rastrea las publicaciones de Sporting cada 30 minutos. Compara cada precio
            contra su histórico para confirmar que el descuento sea genuino y te filtra solo los
            modelos disponibles en tus talles para comprar directo en la tienda oficial.
          </p>

          {/* Tira de especificaciones técnicas centradas */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs font-mono">
            <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-zinc-300">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Historial contra precios inflados</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-zinc-300">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Filtro estricto por talle en depósito</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-zinc-300">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Compra directa sin intermediarios</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
