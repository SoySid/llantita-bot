'use client';

import React, { useRef } from 'react';
import { formatCurrency, parseTalles } from '@/lib/utils';
import { ArrowUpRight, LineChart, ChevronLeft, ChevronRight } from 'lucide-react';
import { BrandBadge } from './BrandBadge';

export interface DealProduct {
  id: string;
  nombre: string;
  marca: string;
  precio: number;
  precio_anterior?: number | null;
  descuento_pct: number;
  url: string;
  talles: string;
  imagen_url?: string | null;
  categoria?: string;
  ultima_actualizacion?: string;
  activo?: boolean;
}

interface FeaturedDealsProps {
  deals: DealProduct[];
  onSelectProduct: (product: DealProduct) => void;
}

export const FeaturedDeals: React.FC<FeaturedDealsProps> = ({ deals, onSelectProduct }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!deals || deals.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleWheelScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0 && !e.shiftKey && scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <section className="w-full py-8 border-b border-zinc-800 bg-[#09090b]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight uppercase font-mono">
              Bajas de precio destacadas
            </h2>
            <span className="text-xs font-mono text-zinc-400">
              ({deals.length} modelos)
            </span>
          </div>

          {/* Controles de paginación horizontal */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="h-8 w-8 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Ver productos anteriores"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="h-8 w-8 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Ver siguientes productos"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Carrusel horizontal */}
        <div className="relative">
          <div
            ref={scrollRef}
            onWheel={handleWheelScroll}
            className="flex gap-4 overflow-x-auto pb-2 pt-1 snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
          >
            {deals.map((item) => {
              const tallesList = parseTalles(item.talles);
              const ahorro = item.precio_anterior && item.precio_anterior > item.precio
                ? item.precio_anterior - item.precio
                : 0;
              const valorCuota = Math.round(item.precio / 3);

              return (
                <div
                  key={item.id}
                  className="snap-start shrink-0 w-[260px] sm:w-[300px] rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 p-3 sm:p-4 flex flex-col justify-between transition-colors group relative"
                >
                  <div>
                    {/* Vitrina de Producto */}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-full aspect-square rounded-lg bg-white p-3 mb-3 overflow-hidden flex items-center justify-center border border-zinc-200/60 block cursor-pointer"
                    >
                      <div className="absolute top-2 left-2 z-10">
                        <BrandBadge marca={item.marca} />
                      </div>
                      {item.descuento_pct > 0 && (
                        <span className="absolute top-2 right-2 z-10 inline-flex items-center rounded bg-zinc-950 text-white px-1.5 py-0.5 text-[11px] font-black font-mono">
                          -{item.descuento_pct}%
                        </span>
                      )}

                      {item.imagen_url ? (
                        <img
                          src={item.imagen_url}
                          alt={item.nombre}
                          loading="lazy"
                          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-200 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-zinc-400">
                          <span className="text-xs font-mono">Sin foto</span>
                        </div>
                      )}
                    </a>

                    {/* Contenido */}
                    <div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm font-semibold text-zinc-200 line-clamp-2 leading-snug hover:text-white transition-colors block min-h-[36px]"
                      >
                        {item.nombre}
                      </a>

                      <div className="mt-3 pt-2.5 border-t border-zinc-800/60">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg sm:text-2xl font-black text-white tracking-tight">
                            {formatCurrency(item.precio)}
                          </span>
                          {item.precio_anterior && (
                            <span className="text-xs text-zinc-400 line-through font-mono">
                              {formatCurrency(item.precio_anterior)}
                            </span>
                          )}
                        </div>
                        {ahorro > 0 && (
                          <span className="text-[11px] font-semibold text-emerald-400 font-mono mt-0.5 block">
                            Ahorrás {formatCurrency(ahorro)}
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-zinc-400 mt-0.5 block">
                          3 cuotas sin interés de {formatCurrency(valorCuota)}
                        </span>
                      </div>

                      {/* Talles */}
                      {tallesList.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {tallesList.slice(0, 5).map((t, idx) => (
                              <span
                                key={idx}
                                className="rounded px-1.5 py-0.5 text-[10px] font-mono border bg-zinc-950 border-zinc-800 text-zinc-300"
                              >
                                {t}
                              </span>
                            ))}
                            {tallesList.length > 5 && (
                              <span className="text-[10px] text-zinc-400 self-center font-mono">
                                +{tallesList.length - 5}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="pt-3 mt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(item)}
                      className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors py-1 cursor-pointer font-mono text-[11px]"
                    >
                      <LineChart className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Historial</span>
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-white hover:text-zinc-300 transition-colors text-xs"
                    >
                      <span>Sporting</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
