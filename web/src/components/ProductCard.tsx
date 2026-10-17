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
    <div className="flex flex-col justify-between rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors p-3 sm:p-4 group relative">
      <div>
        {/* Vitrina de Producto */}
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full aspect-square rounded-lg bg-white p-3 mb-3 overflow-hidden flex items-center justify-center border border-zinc-200/60 block cursor-pointer"
        >
          <div className="absolute top-2 left-2 z-10">
            <BrandBadge marca={product.marca} />
          </div>
          {hasDiscount && (
            <span className="absolute top-2 right-2 z-10 inline-flex items-center rounded bg-zinc-950 text-white px-1.5 py-0.5 text-[11px] font-black font-mono">
              -{product.descuento_pct}%
            </span>
          )}

          {product.imagen_url ? (
            <img
              src={product.imagen_url}
              alt={product.nombre}
              loading="lazy"
              className="h-full w-full object-contain mix-blend-multiply transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-400">
              <span className="text-xs font-mono">Sin foto</span>
            </div>
          )}
        </a>

        {/* Detalles del Producto */}
        <div>
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-semibold text-zinc-200 line-clamp-2 leading-snug hover:text-white transition-colors block min-h-[36px]"
          >
            {product.nombre}
          </a>

          {/* Precios */}
          <div className="mt-3 pt-2.5 border-t border-zinc-800/60">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-2xl font-black text-white tracking-tight">
                {formatCurrency(product.precio)}
              </span>
              {hasDiscount && product.precio_anterior && (
                <span className="text-xs text-zinc-400 line-through font-mono">
                  {formatCurrency(product.precio_anterior)}
                </span>
              )}
            </div>
            {ahorro > 0 && (
              <span className="text-[11px] font-semibold text-emerald-400 font-mono mt-0.5 block">
                Ahorrás {formatCurrency(ahorro)}
              </span>
            )}
            <span className="text-[11px] font-mono text-zinc-400 mt-0.5 block">
              3 cuotas sin interés de {formatCurrency(Math.round(product.precio / 3))}
            </span>
          </div>

          {/* Talles */}
          {tallesList.length > 0 && (
            <div className="mt-3">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1 font-mono">
                Talles disponibles:
              </span>
              <div className="flex flex-wrap gap-1">
                {tallesList.slice(0, 5).map((t, idx) => {
                  const isMatchingSelected =
                    selectedTalles && selectedTalles.length > 0 && selectedTalles.some((st) => t.includes(st));
                  return (
                    <span
                      key={idx}
                      className={`rounded px-1.5 py-0.5 text-[10px] font-mono border transition-colors ${
                        isMatchingSelected
                          ? 'bg-white text-zinc-950 border-white font-bold'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                      }`}
                    >
                      {t}
                    </span>
                  );
                })}
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

      {/* Footer de Acciones */}
      <div className="pt-3 mt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => onOpenHistory(product)}
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors py-1 cursor-pointer font-mono text-[11px]"
        >
          <LineChart className="h-3.5 w-3.5 text-zinc-400" />
          <span>Historial</span>
        </button>

        <a
          href={product.url}
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
};
