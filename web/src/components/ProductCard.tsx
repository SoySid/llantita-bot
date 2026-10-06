'use client';

import React from 'react';
import { formatCurrency, parseTalles } from '@/lib/utils';
import { ArrowUpRight, LineChart } from 'lucide-react';
import { DealProduct } from './FeaturedDeals';
import { BrandBadge } from './BrandBadge';

interface ProductCardProps {
  product: DealProduct;
  onOpenHistory: (product: DealProduct) => void;
  selectedTalles?: string[];
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenHistory,
  selectedTalles,
}) => {
  const tallesList = parseTalles(product.talles);
  const hasDiscount = product.descuento_pct > 0 && product.precio_anterior;
  const ahorro = hasDiscount && product.precio_anterior && product.precio_anterior > product.precio
    ? product.precio_anterior - product.precio
    : 0;

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col justify-between rounded-xl sm:rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-300 p-3 sm:p-4 shadow-sm hover:shadow-xl group block relative"
    >
      <div>
        {/* Showcase de Producto Proporcional 1:1 */}
        <div className="relative w-full aspect-square rounded-xl bg-white p-2 sm:p-3 mb-3 overflow-hidden flex items-center justify-center border border-zinc-200/70 group-hover:border-zinc-300 transition-colors">
          {/* Badges Flotantes sobre la vitrina */}
          <div className="absolute top-2 left-2 z-10">
            <BrandBadge marca={product.marca} />
          </div>
          {hasDiscount && (
            <span className="absolute top-2 right-2 z-10 inline-flex items-center rounded-md sm:rounded-lg bg-rose-500 text-white px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-black font-mono shadow-xs">
              -{product.descuento_pct}%
            </span>
          )}

          {/* Foto del Calzado sin sombras artificiales de contorno */}
          {product.imagen_url ? (
            <img
              src={product.imagen_url}
              alt={product.nombre}
              loading="lazy"
              className="h-full w-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-300 ease-out"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-400">
              <span className="text-[10px] sm:text-[11px] font-mono">Sin foto</span>
            </div>
          )}
        </div>

        {/* Cuerpo de la Tarjeta */}
        <div>
          {/* Nombre del modelo */}
          <h3 className="text-xs sm:text-sm font-bold text-zinc-100 line-clamp-2 leading-tight sm:leading-snug group-hover:text-white transition-colors min-h-[32px] sm:min-h-[40px]">
            {product.nombre}
          </h3>

          {/* Precios con cálculo de ahorro real */}
          <div className="mt-2.5 sm:mt-3.5 pt-2 sm:pt-3 border-t border-zinc-800/60">
            <div className="flex flex-wrap sm:flex-nowrap items-baseline gap-1.5 sm:gap-2">
              <span className="text-base sm:text-2xl font-black text-white tracking-tight">
                {formatCurrency(product.precio)}
              </span>
              {hasDiscount && product.precio_anterior && (
                <span className="text-[10px] sm:text-xs text-zinc-500 line-through font-mono">
                  {formatCurrency(product.precio_anterior)}
                </span>
              )}
            </div>
            {ahorro > 0 && (
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-400 font-mono mt-0.5 block truncate">
                Ahorrás {formatCurrency(ahorro)}
              </span>
            )}
            <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 mt-0.5 block font-medium">
              3 cuotas sin interés de {formatCurrency(Math.round(product.precio / 3))}
            </span>
          </div>

          {/* Talles en stock */}
          {tallesList.length > 0 && (
            <div className="mt-2 sm:mt-3">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-zinc-500 block mb-1 font-mono">
                Talles:
              </span>
              <div className="flex flex-wrap gap-1">
                {tallesList.slice(0, 4).map((t, idx) => {
                  const isMatchingSelected =
                    selectedTalles && selectedTalles.length > 0 && selectedTalles.some((st) => t.includes(st));
                  return (
                    <span
                      key={idx}
                      className={`rounded-md px-1 sm:px-1.5 py-0.5 text-[9px] sm:text-[10px] font-mono border transition-colors ${
                        isMatchingSelected
                          ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-black shadow-xs'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                      }`}
                    >
                      {t}
                    </span>
                  );
                })}
                {tallesList.length > 4 && (
                  <span className="text-[9px] sm:text-[10px] text-zinc-500 self-center font-mono">
                    +{tallesList.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer limpio: Historial y link a Sporting */}
      <div className="px-2.5 pb-2.5 sm:px-4 sm:pb-3.5 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] sm:text-[11px]">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenHistory(product);
          }}
          className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors py-1 group/btn cursor-pointer"
        >
          <LineChart className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-zinc-500 group-hover/btn:text-rose-400 transition-colors" />
          <span className="font-mono">Historial</span>
        </button>

        <span className="inline-flex items-center gap-0.5 sm:gap-1 font-bold text-zinc-400 group-hover:text-white transition-colors">
          <span>Sporting</span>
          <ArrowUpRight className="h-3 sm:h-3.5 w-3 sm:w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  );
};
