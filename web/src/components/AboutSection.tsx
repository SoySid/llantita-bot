'use client';

import React from 'react';

interface AboutSectionProps {
  onExploreClick?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = () => {
  return (
    <section className="relative w-full border-b border-zinc-800 bg-[#09090b] py-8 sm:py-12 overflow-hidden">
      {/* Iluminación cenital sutil */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,255,255,0.06),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5">
          
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

          {/* Barra unificada de 3 especificaciones (dock segmentado) */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/80 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm shadow-sm">
              
              <div className="p-3 sm:py-3 sm:px-4 flex flex-col items-center justify-center text-center gap-0.5">
                <span className="text-xs font-bold text-zinc-200 uppercase tracking-tight">
                  Historial de precios
                </span>
                <span className="text-[11px] text-zinc-400">
                  Descartá rebajas infladas
                </span>
              </div>

              <div className="p-3 sm:py-3 sm:px-4 flex flex-col items-center justify-center text-center gap-0.5">
                <span className="text-xs font-bold text-zinc-200 uppercase tracking-tight">
                  Stock por talle
                </span>
                <span className="text-[11px] text-zinc-400">
                  Solo modelos en tu número
                </span>
              </div>

              <div className="p-3 sm:py-3 sm:px-4 flex flex-col items-center justify-center text-center gap-0.5">
                <span className="text-xs font-bold text-zinc-200 uppercase tracking-tight">
                  Tienda oficial
                </span>
                <span className="text-[11px] text-zinc-400">
                  Comprás directo en Sporting
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
