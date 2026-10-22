'use client';

import React from 'react';
import { formatCurrency, parseTalles } from '@/lib/utils';
import { ArrowUpRight, LineChart } from 'lucide-react';

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
    <section className="w-full py-10 bg-[#09090b]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado sin botones artificiales */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-5">
          <h2 className="text-base sm:text-xl font-black text-white tracking-tight uppercase">
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
            const valorCuota = Math.round(item.precio / 3);

            return (
              <div
                key={item.id}
                className="rounded-xl bg-zinc-900/60 hover:bg-zinc-900 hover-lift p-3 flex flex-col justify-between transition-[background-color] duration-180 ease-out group relative"
              >
                <div>
                  {/* Vitrina de Producto con fondo neutro */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-full aspect-square rounded-lg bg-[#f4f4f5] p-3 mb-3 overflow-hidden flex items-center justify-center block cursor-pointer active:scale-[0.98] transition-transform duration-150 ease-out"
                  >
                    {item.descuento_pct > 0 && (
                      <span className="absolute top-2 right-2 z-10 inline-flex items-center px-1.5 py-0.5 rounded bg-zinc-950 text-white text-xs font-bold tabular-nums">
                        -{item.descuento_pct}%
                      </span>
                    )}

                    {item.imagen_url ? (
                      <img
                        src={item.imagen_url}
                        alt={item.nombre}
                        loading="lazy"
                        className="h-full w-full object-contain mix-blend-multiply transition-transform duration-200 ease-out md:group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-zinc-400">
                        <span className="text-xs">Sin foto</span>
                      </div>
                    )}
                  </a>

                  {/* Marca y Nombre */}
                  <div className="space-y-1">
                    <span className="block text-xs font-bold text-zinc-400">
                      {item.marca || 'Calzado'}
                    </span>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-semibold text-zinc-200 line-clamp-2 leading-snug hover:text-white transition-colors duration-150 block min-h-[36px]"
                    >
                      {item.nombre}
                    </a>
                  </div>

                  {/* Precios */}
                  <div className="mt-2.5 space-y-0.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg sm:text-xl font-black text-white tracking-tight tabular-nums">
                        {formatCurrency(item.precio)}
                      </span>
                      {item.precio_anterior && (
                        <span className="text-xs text-zinc-500 line-through tabular-nums">
                          {formatCurrency(item.precio_anterior)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 tabular-nums">
                      3 cuotas de {formatCurrency(valorCuota)}
                    </p>
                  </div>

                  {/* Talles */}
                  {tallesList.length > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs text-zinc-400">Talles:</span>
                      <div className="flex flex-wrap gap-1">
                        {tallesList.slice(0, 5).map((t, idx) => (
                          <span
                            key={idx}
                            className="text-xs tabular-nums px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-300"
                          >
                            {t}
                          </span>
                        ))}
                        {tallesList.length > 5 && (
                          <span className="text-xs text-zinc-400 self-center tabular-nums">
                            +{tallesList.length - 5}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="pt-3 mt-3 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => onSelectProduct(item)}
                    className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white active:scale-[0.95] transition-[color,transform] duration-150 ease-out cursor-pointer text-xs select-none"
                  >
                    <LineChart className="h-3.5 w-3.5" />
                    <span>Historial</span>
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-zinc-200 hover:text-white active:scale-[0.95] transition-[color,transform] duration-150 ease-out text-xs select-none"
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
