'use client';

import React from 'react';
import { History, CheckCircle2, ExternalLink, Send, ArrowDown } from 'lucide-react';

interface AboutSectionProps {
  onExploreClick?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onExploreClick }) => {
  return (
    <section className="w-full border-b border-zinc-800/80 bg-gradient-to-b from-zinc-950 via-[#0c0c0e] to-[#09090b] pt-8 pb-10 sm:pt-12 sm:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera Principal */}
        <div className="max-w-3xl space-y-3.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-900/80 px-3 py-1 text-xs font-mono text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Monitoreo automático cada 30 min</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
            Rastreador de precios y stock de zapatillas
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
            Llantita analiza de forma continua el catálogo de Sporting Argentina. Detecta rebajas
            reales, registra la evolución histórica de precios y filtra por tu número exacto para
            que no pierdas tiempo en publicaciones sin stock.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {onExploreClick && (
              <button
                type="button"
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm"
              >
                <span>Explorar ofertas</span>
                <ArrowDown className="h-4 w-4 text-zinc-700" />
              </button>
            )}

            <a
              href="https://t.me/llantita_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 hover:border-zinc-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-zinc-100 transition-colors"
            >
              <Send className="h-4 w-4 text-[#229ED9]" />
              <span>Recibir alertas en Telegram</span>
            </a>
          </div>
        </div>

        {/* 3 Pilares de Funcionamiento */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          
          {/* Pilar 1 */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5 backdrop-blur-sm space-y-2.5 hover:border-zinc-700 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-200">
              <History className="h-5 w-5 text-sky-400" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Historial de precios transparente
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-normal">
              Guardamos cada cambio de valor en el tiempo. Podés comprobar en un gráfico si un descuento
              es genuino o si inflaron el precio días antes de una promoción.
            </p>
          </div>

          {/* Pilar 2 */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5 backdrop-blur-sm space-y-2.5 hover:border-zinc-700 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-200">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Stock por talle verificado
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-normal">
              El buscador consulta directamente los números disponibles en depósito. Si elegís tu talle,
              solo verás modelos que podés comprar en ese instante.
            </p>
          </div>

          {/* Pilar 3 */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5 backdrop-blur-sm space-y-2.5 hover:border-zinc-700 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-200">
              <ExternalLink className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Compra directa en tienda oficial
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-normal">
              Llantita no cobra comisiones ni gestiona cobros. Cada tarjeta te deriva de manera directa
              a la publicación original de Sporting Argentina para concretar la compra.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
