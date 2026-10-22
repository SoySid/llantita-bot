'use client';

import React from 'react';
import { ArrowDown, ArrowUpRight, LineChart, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { DealProduct } from './FeaturedDeals';

interface AboutSectionProps {
  topDeal?: DealProduct | null;
  onExploreClick?: () => void;
  onOpenHistory?: (product: DealProduct) => void;
}

const DEFAULT_HERO_DEAL: DealProduct = {
  id: 'hero-showcase',
  nombre: 'Zapatillas Adidas Forum Low Classic',
  marca: 'ADIDAS',
  precio: 119999,
  precio_anterior: 199999,
  descuento_pct: 40,
  url: 'https://www.sporting.com.ar',
  talles: '39, 40, 41, 42, 43',
  imagen_url: 'https://sporting.vtexassets.com/arquivos/ids/1418779-800-800?v=638663806655100000&width=800&height=800&aspect=true',
};

export const AboutSection: React.FC<AboutSectionProps> = ({
  topDeal,
  onExploreClick,
  onOpenHistory,
}) => {
  const displayDeal = topDeal || DEFAULT_HERO_DEAL;

  return (
    <section className="w-full bg-[#09090b] pt-10 pb-16 sm:pt-14 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Columna Editorial Principal */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.04]">
              Zapatillas con rebajas verificadas
            </h1>

            <p className="text-base sm:text-xl text-zinc-300 leading-relaxed max-w-xl">
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

          {/* Columna Protagonista / Punto Focal */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-zinc-900/60 p-5 sm:p-6 flex flex-col justify-between hover-lift transition-[background-color] duration-180 ease-out">
              {/* Badge editorial */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs sm:text-sm font-semibold">
                  <Sparkles className="h-3.5 w-3.5" />
                  Mayor baja de precio hoy
                </span>
                {displayDeal.descuento_pct > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-zinc-950 text-white text-xs sm:text-sm font-bold tabular-nums">
                    -{displayDeal.descuento_pct}%
                  </span>
                )}
              </div>

              {/* Vitrina de Producto en pedestal claro */}
              <a
                href={displayDeal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full aspect-4/3 rounded-2xl bg-[#f4f4f5] p-5 flex items-center justify-center overflow-hidden active:scale-[0.98] transition-transform duration-150 ease-out cursor-pointer"
              >
                {displayDeal.imagen_url ? (
                  <img
                    src={displayDeal.imagen_url}
                    alt={displayDeal.nombre}
                    className="h-full w-full object-contain mix-blend-multiply transition-transform duration-200 ease-out hover:scale-105"
                  />
                ) : (
                  <span className="text-sm text-zinc-500">Foto de muestra</span>
                )}
              </a>

              {/* Info del calzado */}
              <div className="mt-4 space-y-1">
                <span className="text-xs font-bold text-zinc-400">
                  {displayDeal.marca || 'Calzado'}
                </span>
                <a
                  href={displayDeal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base sm:text-lg font-bold text-white hover:text-zinc-200 transition-colors line-clamp-1 block"
                >
                  {displayDeal.nombre}
                </a>
              </div>

              {/* Precio y acciones */}
              <div className="mt-3 pt-3 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl sm:text-3xl font-black text-white tabular-nums tracking-tight">
                      {formatCurrency(displayDeal.precio)}
                    </span>
                    {displayDeal.precio_anterior && (
                      <span className="text-xs sm:text-sm text-zinc-500 line-through tabular-nums">
                        {formatCurrency(displayDeal.precio_anterior)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onOpenHistory && (
                    <button
                      type="button"
                      onClick={() => onOpenHistory(displayDeal)}
                      className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white active:scale-[0.95] transition-[color,transform] duration-150 p-2 cursor-pointer"
                      title="Ver historial de precios"
                    >
                      <LineChart className="h-4 w-4" />
                    </button>
                  )}
                  <a
                    href={displayDeal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-xl bg-white text-zinc-950 text-xs sm:text-sm font-bold px-4 py-2.5 hover:bg-zinc-200 active:scale-[0.96] transition-[background-color,transform] duration-150 ease-out cursor-pointer"
                  >
                    <span>Ver oferta</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
