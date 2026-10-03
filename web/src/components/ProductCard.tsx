'use client';

import React from 'react';
import { formatCurrency, parseTalles } from '@/lib/utils';
import { ArrowUpRight, LineChart } from 'lucide-react';
import { DealProduct } from './FeaturedDeals';
import { BrandBadge } from './BrandBadge';

interface ProductCardProps {
  product: DealProduct;
  onOpenHistory: (product: DealProduct) => void;
  selectedTalle?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenHistory,
  selectedTalle,
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
      className="flex flex-col justify-between rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-200 p-4 sm:p-5 shadow-sm hover:shadow-xl group block relative"
    >
      <div>
        {/* Encabezado: Brand Badge (Logo + Wordmark oficial) y Descuento */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <BrandBadge marca={product.marca} />
          {hasDiscount && (
            <span className="inline-flex items-center rounded-md bg-rose-500 text-white px-2 py-0.5 text-[11px] font-black font-mono shadow-xs shrink-0">
              -{product.descuento_pct}%
            </span>
          )}
        </div>

        {/* Foto del Calzado - Studio White Container */}
        <div className="relative w-full aspect-[4/3] rounded-xl bg-white p-3 mb-3.5 overflow-hidden flex items-center justify-center border border-zinc-800/40 group-hover:border-zinc-600 transition-colors shadow-inner">
          {product.imagen_url ? (
            <img
              src={product.imagen_url}
              alt={product.nombre}
              loading="lazy"
              className="h-full w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] group-hover:scale-108 transition-transform duration-300 ease-out"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-400">
              <span className="text-[11px] font-mono">Sin foto</span>
            </div>
          )}
        </div>

        {/* Nombre del modelo */}
        <h3 className="text-sm font-bold text-zinc-100 line-clamp-2 leading-snug group-hover:text-white transition-colors min-h-[40px]">
          {product.nombre}
        </h3>

        {/* Precios con cálculo de ahorro real */}
        <div className="mt-3.5 pt-3 border-t border-zinc-800/60">
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {formatCurrency(product.precio)}
            </span>
            {hasDiscount && product.precio_anterior && (
              <span className="text-xs text-zinc-500 line-through font-mono">
                {formatCurrency(product.precio_anterior)}
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
          <div className="mt-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1 font-mono">
              Talles disponibles:
            </span>
            <div className="flex flex-wrap gap-1">
              {tallesList.slice(0, 6).map((t, idx) => {
                const isMatchingSelected = selectedTalle && t.includes(selectedTalle);
                return (
                  <span
                    key={idx}
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-mono border transition-colors ${
                      isMatchingSelected
                        ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-black shadow-xs'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    {t}
                  </span>
                );
              })}
              {tallesList.length > 6 && (
                <span className="text-[10px] text-zinc-500 self-center font-mono">
                  +{tallesList.length - 6}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer limpio: Historial y link a Sporting sin botones toscos */}
      <div className="mt-4 pt-3.5 border-t border-zinc-800/60 flex items-center justify-between">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenHistory(product);
          }}
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors py-1 group/btn"
        >
          <LineChart className="h-3.5 w-3.5 text-zinc-500 group-hover/btn:text-rose-400 transition-colors" />
          <span className="text-[11px] font-mono">Historial</span>
        </button>

        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-400 group-hover:text-white transition-colors">
          <span>Sporting</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  );
};
