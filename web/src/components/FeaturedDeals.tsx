'use client';

import React from 'react';
import { formatCurrency, parseTalles } from '@/lib/utils';
import { Flame, TrendingDown, ExternalLink, LineChart } from 'lucide-react';

export interface DealProduct {
  id: string;
  nombre: string;
  marca: string;
  precio: number;
  precio_anterior?: number | null;
  descuento_pct: number;
  url: string;
  talles: string;
  categoria?: string;
  ultima_actualizacion?: string;
}

interface FeaturedDealsProps {
  deals: DealProduct[];
  onSelectProduct: (product: DealProduct) => void;
}

export const FeaturedDeals: React.FC<FeaturedDealsProps> = ({ deals, onSelectProduct }) => {
  if (!deals || deals.length === 0) return null;

  return (
    <section className="w-full py-8 border-b border-slate-800/60 bg-[#0e1420]/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header de la sección */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <TrendingDown className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Mayores Bajas Detectadas
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Comparado contra su máximo histórico
          </span>
        </div>

        {/* Carrusel con Snap en móvil */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {deals.map((item) => {
            const tallesList = parseTalles(item.talles);

            return (
              <div
                key={item.id}
                className="snap-start shrink-0 w-72 sm:w-80 rounded-2xl bg-gradient-to-b from-[#161f30] to-[#121927] border border-slate-800/90 p-4 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all group"
              >
                <div>
                  {/* Top Bar Card */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
                      {item.marca || 'Calzado'}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-xs font-bold text-rose-400">
                      -{item.descuento_pct}%
                    </span>
                  </div>

                  {/* Nombre */}
                  <h3 className="text-sm font-semibold text-slate-100 line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
                    {item.nombre}
                  </h3>

                  {/* Precios */}
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-emerald-400">
                      {formatCurrency(item.precio)}
                    </span>
                    {item.precio_anterior && (
                      <span className="text-xs text-slate-500 line-through">
                        {formatCurrency(item.precio_anterior)}
                      </span>
                    )}
                  </div>

                  {/* Talles disponibles */}
                  {tallesList.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[10px] uppercase font-semibold text-slate-400 mb-1">
                        Talles con stock:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {tallesList.slice(0, 5).map((t, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-slate-800/90 border border-slate-700/60 px-1.5 py-0.5 text-[10px] font-mono text-slate-300"
                          >
                            {t}
                          </span>
                        ))}
                        {tallesList.length > 5 && (
                          <span className="text-[10px] text-slate-400 self-center">
                            +{tallesList.length - 5}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectProduct(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-2 px-3 transition-colors"
                  >
                    <LineChart className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Historial</span>
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold py-2 px-3 transition-colors"
                  >
                    <span>Ir a tienda</span>
                    <ExternalLink className="h-3 w-3" />
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
