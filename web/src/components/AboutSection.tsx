'use client';

import React from 'react';

interface AboutSectionProps {
  onExploreClick?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = () => {
  return (
    <section className="w-full bg-[#09090b] pt-6 pb-2 sm:pt-8 sm:pb-3">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-3">
          
          {/* Identidad con el Michi y frecuencia */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800/80 text-xs text-zinc-300">
            <img
              src="/logo.jpg"
              alt="Michi Llantita"
              className="h-4 w-4 rounded-full object-cover"
            />
            <span className="font-medium text-zinc-200">Llantita</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400">Monitoreo cada 30 min</span>
          </div>

          {/* Título directo y humano */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Historial de precios y stock en Sporting
          </h1>

          {/* Explicación funcional y honesta */}
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Comparamos cada precio contra su piso histórico para avisarte solo cuando el descuento existe y hay número disponible.
          </p>

        </div>
      </div>
    </section>
  );
};
