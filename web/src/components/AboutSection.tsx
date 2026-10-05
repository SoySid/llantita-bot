'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface AboutSectionProps {
  onExploreClick?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = () => {
  return (
    <section className="w-full border-b border-zinc-800 bg-gradient-to-b from-zinc-950 via-[#0b0b0e] to-[#09090b] py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-3.5">
          
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase leading-tight">
            Comprá zapatillas cuando bajan de verdad.
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            Llantita monitorea las publicaciones de Sporting de forma automática. Compara cada precio
            contra su historial para comprobar si una rebaja es genuina o si inflaron el valor antes
            de la promoción, y te muestra únicamente lo que tiene stock en tu número.
          </p>

          <div className="pt-1.5 space-y-2 text-xs sm:text-sm text-zinc-300">
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span>Historial de precios para verificar que no inflaron el valor previo</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span>Filtro estricto por talle en depósito para no entrar a pares agotados</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span>Sin comisiones: hacés clic y comprás directo en la tienda oficial</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
