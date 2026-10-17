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
  const ahorro = hasDiscount && product.precio_anterior && product.precio_anterior > product.precio
    ? product.precio_anterior - product.precio
    : 0;

  return (
    <div className="flex flex-col justify-between rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors p-3 group relative">
      <div>
        {/* Vitrina de Producto con fondo neutro de alta fidelidad */}
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full aspect-square rounded-lg bg-[#f4f4f5] p-3 mb-3 overflow-hidden flex items-center justify-center block cursor-pointer"
        >
          {hasDiscount && (
            <span className="absolute top-2 right-2 z-10 inline-flex items-center px-1.5 py-0.5 rounded bg-zinc-950 text-white text-[11px] font-bold font-mono">
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

        {/* Marca y Nombre */}
        <div className="space-y-1">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            {product.marca || 'Calzado'}
          </span>

          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-semibold text-zinc-200 line-clamp-2 leading-snug hover:text-white transition-colors block min-h-[36px]"
          >
            {product.nombre}
          </a>
        </div>

        {/* Precios */}
        <div className="mt-2.5 space-y-0.5">
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-black text-white tracking-tight">
              {formatCurrency(product.precio)}
            </span>
            {hasDiscount && product.precio_anterior && (
              <span className="text-xs text-zinc-400 line-through font-mono">
                {formatCurrency(product.precio_anterior)}
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-400">
            3 cuotas de {formatCurrency(Math.round(product.precio / 3))}
          </p>
        </div>

        {/* Talles disponibles */}
        {tallesList.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-zinc-400">Talles:</span>
            <div className="flex flex-wrap gap-1">
              {tallesList.slice(0, 5).map((t, idx) => {
                const isMatchingSelected =
                  selectedTalles && selectedTalles.length > 0 && selectedTalles.some((st) => t.includes(st));
                return (
                  <span
                    key={idx}
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors ${
                      isMatchingSelected
                        ? 'bg-white text-zinc-950 font-bold'
                        : 'bg-zinc-950 text-zinc-300 border border-zinc-800'
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

      {/* Acciones al pie */}
      <div className="pt-3 mt-3 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => onOpenHistory(product)}
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs"
        >
          <LineChart className="h-3.5 w-3.5" />
          <span>Historial</span>
        </button>

        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-zinc-200 hover:text-white transition-colors text-xs"
        >
          <span>Sporting</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
};
