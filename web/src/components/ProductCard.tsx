'use client';

import React from 'react';
import { formatCurrency, parseTalles, safeExternalUrl } from '@/lib/utils';
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
  const productUrl = safeExternalUrl(product.url);
  const ahorro = hasDiscount && product.precio_anterior && product.precio_anterior > product.precio
    ? product.precio_anterior - product.precio
    : null;

  const brandLabel = product.marca
    ? product.marca.toUpperCase()
    : 'CALZADO';

  return (
    <div className="tactical-card p-3.5 sm:p-4 flex flex-col justify-between group relative">
      <div>
        {/* Vitrina de Producto */}
        <a
          href={productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full aspect-square rounded bg-[#131110] border border-[#2d2621] p-3 mb-3 overflow-hidden flex items-center justify-center block cursor-pointer active:scale-[0.98] transition-transform duration-150"
        >
          {hasDiscount && (
            <span className="absolute top-2 right-2 z-10 inline-flex items-center px-2 py-0.5 rounded bg-[#ff5500] text-black font-barlow text-xs font-bold uppercase">
              -{product.descuento_pct}% OFF
            </span>
          )}

          {product.imagen_url ? (
            <img
              src={safeExternalUrl(product.imagen_url)}
              alt={product.nombre}
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-200 ease-out md:group-hover:scale-[1.06]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-stone-500">
              <span className="text-xs">Sin foto</span>
            </div>
          )}
        </a>

        {/* Marca y Nombre */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="block font-barlow text-xs font-bold text-orange-400 uppercase">
              {brandLabel}
            </span>
            {hasDiscount && product.descuento_pct >= 30 && (
              <span className="text-xs text-emerald-400 font-semibold">Piso histórico</span>
            )}
          </div>

          <a
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="section-title text-xl sm:text-2xl text-stone-100 line-clamp-2 leading-snug hover:text-orange-400 transition-colors duration-150 block min-h-[44px]"
          >
            {product.nombre}
          </a>
        </div>

        {/* Precios y Ahorro */}
        <div className="mt-2.5 space-y-0.5">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl sm:text-3xl font-bold text-orange-400 tabular-nums" style={{ fontFamily: 'var(--font-barlow), sans-serif' }}>
              {formatCurrency(product.precio)}
            </span>
            {hasDiscount && product.precio_anterior && (
              <span className="text-xs text-stone-500 line-through tabular-nums">
                {formatCurrency(product.precio_anterior)}
              </span>
            )}
          </div>
          {ahorro ? (
            <p className="text-xs text-amber-300 font-semibold tabular-nums">
              Ahorrás {formatCurrency(ahorro)}
            </p>
          ) : (
            <p className="text-xs text-stone-500">
              Precio verificado
            </p>
          )}
        </div>

        {/* Talles disponibles */}
        {tallesList.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-barlow font-bold text-stone-400 uppercase">Talles:</span>
            <div className="flex flex-wrap gap-1">
              {tallesList.slice(0, 5).map((t, idx) => {
                const isMatchingSelected =
                  selectedTalles && selectedTalles.length > 0 && selectedTalles.some((st) => t.includes(st));
                return (
                  <span
                    key={idx}
                    className={`text-xs tabular-nums px-1.5 py-0.5 rounded border transition-colors select-none ${
                      isMatchingSelected
                        ? 'bg-orange-500 text-black font-bold border-orange-400'
                        : 'bg-[#100e0d] text-stone-300 border-stone-800'
                    }`}
                  >
                    {t}
                  </span>
                );
              })}
              {tallesList.length > 5 && (
                <span className="text-xs text-stone-500 self-center tabular-nums">
                  +{tallesList.length - 5}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Acciones al pie */}
      <div className="pt-3 mt-3 flex items-center justify-between text-xs gap-1">
        <button
          type="button"
          onClick={() => onOpenHistory(product)}
          className="inline-flex items-center gap-1.5 font-barlow font-bold text-xs uppercase text-stone-400 hover:text-orange-400 active:scale-[0.95] transition-colors cursor-pointer select-none"
        >
          <LineChart className="h-3.5 w-3.5 shrink-0" />
          <span>Historial</span>
        </button>

        <a
          href={productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-barlow font-bold text-xs uppercase text-stone-200 hover:text-orange-400 active:scale-[0.95] transition-colors select-none"
        >
          <span>Sporting</span>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
        </a>
      </div>
    </div>
  );
};
