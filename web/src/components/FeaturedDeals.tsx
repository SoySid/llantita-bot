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
      const offset = direction === 'left' ? -330 : 330;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full py-8 border-b border-zinc-800/80 bg-[#09090b]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header directo y auténtico */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.jpg"
              alt="Michi"
              className="h-8 w-8 rounded-full object-cover border border-zinc-700 shadow-xs"
            />
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Ofertas increíbles
            </h2>
          </div>

          {/* Flechas de navegación del carrusel */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="h-8 w-8 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 flex items-center justify-center transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="h-8 w-8 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 flex items-center justify-center transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Carrusel horizontal con Snap */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {deals.map((item) => {
            const tallesList = parseTalles(item.talles);
            const ahorro = item.precio_anterior && item.precio_anterior > item.precio
              ? item.precio_anterior - item.precio
              : 0;

            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="snap-start shrink-0 w-[260px] sm:w-[310px] rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 shadow-lg flex flex-col justify-between transition-all duration-300 group block relative overflow-hidden"
              >
                <div>
                  {/* Vitrina Superior Integrada (Edge-to-Edge Showcase) */}
                  <div className="relative w-full aspect-[4/3] bg-white overflow-hidden flex items-center justify-center border-b border-zinc-800/80">
                    {/* Badges Flotantes sobre la vitrina */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <BrandBadge marca={item.marca} />
                    </div>
                    {item.descuento_pct > 0 && (
                      <span className="absolute top-2.5 right-2.5 z-10 inline-flex items-center rounded-lg bg-rose-500 text-white px-2 py-0.5 text-[11px] font-black font-mono shadow-md">
                        -{item.descuento_pct}%
                      </span>
                    )}

                    {/* Foto del Calzado con escala heroica para llenar el marco */}
                    {item.imagen_url ? (
                      <img
                        src={item.imagen_url}
                        alt={item.nombre}
                        loading="lazy"
                        className="h-full w-full object-contain scale-115 group-hover:scale-125 transition-transform duration-300 ease-out filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)]"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-zinc-400">
                        <span className="text-[11px] font-mono">Sin foto</span>
                      </div>
                    )}
                  </div>

                  {/* Cuerpo de la Tarjeta */}
                  <div className="p-3.5 sm:p-4">
                    {/* Nombre del calzado */}
                    <h3 className="text-sm font-bold text-zinc-100 line-clamp-2 leading-snug group-hover:text-white transition-colors min-h-[40px]">
                      {item.nombre}
                    </h3>

                    {/* Precios con cálculo de ahorro real */}
                    <div className="mt-3 pt-3 border-t border-zinc-800/60">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                          {formatCurrency(item.precio)}
                        </span>
                        {item.precio_anterior && (
                          <span className="text-xs text-zinc-500 line-through font-mono">
                            {formatCurrency(item.precio_anterior)}
                          </span>
                        )}
                      </div>
                      {ahorro > 0 && (
                        <span className="text-[11px] font-bold text-emerald-400 font-mono mt-0.5 block">
                          Ahorrás {formatCurrency(ahorro)}
                        </span>
                      )}
                    </div>

                    {/* Talles en stock */}
                    {tallesList.length > 0 && (
                      <div className="mt-2.5">
                        <div className="flex flex-wrap gap-1">
                          {tallesList.slice(0, 5).map((t, idx) => (
                            <span
                              key={idx}
                              className="rounded-md bg-zinc-950 border border-zinc-800/80 px-1.5 py-0.5 text-[10px] font-bold font-mono text-zinc-300"
                            >
                              {t}
                            </span>
                          ))}
                          {tallesList.length > 5 && (
                            <span className="text-[10px] text-zinc-500 self-center font-mono">
                              +{tallesList.length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Footer: Historial y link a Sporting */}
                    <div className="mt-3.5 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onSelectProduct(item);
                        }}
                        className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors py-1 group/btn cursor-pointer"
                      >
                        <LineChart className="h-3.5 w-3.5 text-zinc-500 group-hover/btn:text-rose-400 transition-colors" />
                        <span className="text-[11px] font-mono">Historial</span>
                      </button>

                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-400 group-hover:text-white transition-colors">
                        <span>Sporting</span>
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>

                  </div>
                </div>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
};
