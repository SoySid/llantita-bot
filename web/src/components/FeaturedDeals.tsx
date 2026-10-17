'use client';

import React from 'react';
import { formatCurrency, parseTalles } from '@/lib/utils';
import { ArrowUpRight, LineChart } from 'lucide-react';
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
  if (!deals || deals.length === 0) return null;

  const topDeals = deals.slice(0, 8);

  return (
    <section className="w-full py-8 border-b border-zinc-800 bg-[#09090b]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado sin botones artificiales */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-4">
          <h2 className="text-base sm:text-lg font-black text-white tracking-tight uppercase font-mono">
            Bajas de precio destacadas
          </h2>
          <span className="text-xs text-zinc-400">
            Las mayores rebajas con stock comprobado contra piso histórico
          </span>
        </div>

        {/* Grilla editorial de oportunidades */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {topDeals.map((item) => {
            const tallesList = parseTalles(item.talles);
            const ahorro = item.precio_anterior && item.precio_anterior > item.precio
              ? item.precio_anterior - item.precio
              : 0;
            const valorCuota = Math.round(item.precio / 3);

            return (
              <div
                key={item.id}
                className="rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 p-3 sm:p-4 flex flex-col justify-between transition-colors group relative"
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

                  {/* Datos del modelo */}
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
                        3 cuotas de {formatCurrency(valorCuota)}
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
    </section>
  );
};

