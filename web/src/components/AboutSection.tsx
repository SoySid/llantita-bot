'use client';

import React from 'react';

interface AboutSectionProps {
  onExploreClick?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = () => {
  return (
    <section className="w-full bg-canvas pt-6 pb-4 sm:pt-10 sm:pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl space-y-4">
          <h1 className="font-display text-4xl sm:text-6xl lg:text-[72px] font-bold tracking-[-0.04em] text-ink leading-[0.96]">
            Precios reales y stock en Sporting
          </h1>

          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-[60ch]">
            Comparamos cada zapatilla contra su piso histórico cada 30 minutos para avisarte solo cuando el descuento es genuino y hay talle disponible.
          </p>
        </div>
      </div>
    </section>
  );
};
