'use client';

import React from 'react';
import { formatCurrency, parseTalles } from '@/lib/utils';
import { ArrowUpRight, LineChart } from 'lucide-react';
import { DealProduct } from './FeaturedDeals';

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

  return (
    <div className="flex flex-col justify-between rounded-xl bg-zinc-900/60 hover:bg-zinc-900 hover-lift transition-[background-color] duration-180 ease-out p-3.5 group relative">
      <div>
        {/* Vitrina de Producto con fondo neutro de alta fidelidad */}
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full aspect-square rounded-lg bg-[#f4f4f5] p-3 mb-3 overflow-hidden flex items-center justify-center block cursor-pointer active:scale-[0.98] transition-transform duration-150 ease-out"
        >
          {hasDiscount && (
            <span className="absolute top-2 right-2 z-10 inline-flex items-center px-2 py-0.5 rounded bg-zinc-950 text-white text-xs font-bold tabular-nums">
              -{product.descuento_pct}%
            </span>
          )}

          {product.imagen_url ? (
            <img
              src={product.imagen_url}
              alt={product.nombre}
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
            {product.marca || 'Calzado'}
          </span>

          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-semibold text-zinc-200 line-clamp-2 leading-snug hover:text-white transition-colors duration-150 block min-h-[36px]"
          >
            {product.nombre}
          </a>
        </div>

        {/* Precios */}
        <div className="mt-2.5 space-y-0.5">
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-black text-white tracking-tight tabular-nums">
              {formatCurrency(product.precio)}
            </span>
            {hasDiscount && product.precio_anterior && (
              <span className="text-xs text-zinc-500 line-through tabular-nums">
                {formatCurrency(product.precio_anterior)}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 tabular-nums">
            3 cuotas de {formatCurrency(Math.round(product.precio / 3))}
          </p>
        </div>

        {/* Talles disponibles */}
        {tallesList.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-zinc-400">Talles:</span>
            <div className="flex flex-wrap gap-1">
              {tallesList.slice(0, 5).map((t, idx) => {
                const isMatchingSelected =
                  selectedTalles && selectedTalles.length > 0 && selectedTalles.some((st) => t.includes(st));
                return (
                  <span
                    key={idx}
                    className={`text-xs tabular-nums px-1.5 py-0.5 rounded transition-[background-color,color] duration-150 select-none ${
                      isMatchingSelected
                        ? 'bg-white text-zinc-950 font-bold'
                        : 'bg-zinc-950 text-zinc-300'
                    }`}
                  >
                    {t}
                  </span>
                );
              })}
              {tallesList.length > 5 && (
                <span className="text-xs text-zinc-400 self-center tabular-nums">
                  +{tallesList.length - 5}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Acciones al pie */}
      <div className="pt-3 mt-3 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => onOpenHistory(product)}
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white active:scale-[0.95] transition-[color,transform] duration-150 ease-out cursor-pointer text-xs select-none"
        >
          <LineChart className="h-3.5 w-3.5" />
          <span>Historial</span>
        </button>

        <a
          href={product.url}
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
};
