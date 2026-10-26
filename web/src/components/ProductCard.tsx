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
    ? product.marca.charAt(0).toUpperCase() + product.marca.slice(1).toLowerCase()
    : 'Calzado';

  return (
    <div className="flex flex-col justify-between rounded-xl bg-surface-card hover:bg-surface-elevated hover-lift transition-[background-color,transform] duration-180 ease-out p-3.5 group relative">
      <div>
        {/* Vitrina de Producto en Piedra Hueso */}
        <a
          href={productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full aspect-square rounded-lg bg-bone p-3 mb-3.5 overflow-hidden flex items-center justify-center block cursor-pointer active:scale-[0.98] transition-transform duration-150 ease-out"
        >
          {hasDiscount && (
            <span className="absolute top-2.5 right-2.5 z-10 inline-flex items-center px-2 py-0.5 rounded bg-infrared text-white font-display text-[13px] font-bold tabular-nums">
              -{product.descuento_pct}%
            </span>
          )}

          {product.imagen_url ? (
            <img
              src={safeExternalUrl(product.imagen_url)}
              alt={product.nombre}
              loading="lazy"
              className="h-full w-full object-contain mix-blend-multiply transition-transform duration-200 ease-out md:group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-ink-muted">
              <span className="text-[13px] font-display">Sin foto</span>
            </div>
          )}
        </a>

        {/* Marca y Nombre */}
        <div className="space-y-1">
          <span className="block font-display text-sm font-bold text-ink-muted">
            {brandLabel}
          </span>

          <a
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-sm sm:text-base font-bold text-ink line-clamp-2 leading-snug hover:text-infrared transition-colors duration-150 block min-h-[42px]"
          >
            {product.nombre}
          </a>
        </div>

        {/* Precios y Ahorro Verificable */}
        <div className="mt-3 space-y-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-display text-lg sm:text-xl font-bold text-ink tracking-tight tabular-nums">
              {formatCurrency(product.precio)}
            </span>
            {hasDiscount && product.precio_anterior && (
              <span className="text-[13px] text-ink-muted line-through tabular-nums">
                {formatCurrency(product.precio_anterior)}
              </span>
            )}
          </div>
          {ahorro ? (
            <p className="text-[13px] text-volt font-medium tabular-nums">
              Ahorrás {formatCurrency(ahorro)}
            </p>
          ) : (
            <p className="text-[13px] text-ink-muted">
              Precio regular verificado
            </p>
          )}
        </div>

        {/* Talles disponibles */}
        {tallesList.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <span className="text-[13px] text-ink-muted">Talles:</span>
            <div className="flex flex-wrap gap-1">
              {tallesList.slice(0, 5).map((t, idx) => {
                const isMatchingSelected =
                  selectedTalles && selectedTalles.length > 0 && selectedTalles.some((st) => t.includes(st));
                return (
                  <span
                    key={idx}
                    className={`font-display text-[13px] tabular-nums px-1.5 py-0.5 rounded transition-[background-color,color] duration-150 select-none ${
                      isMatchingSelected
                        ? 'bg-bone text-canvas font-bold'
                        : 'bg-canvas text-ink-secondary'
                    }`}
                  >
                    {t}
                  </span>
                );
              })}
              {tallesList.length > 5 && (
                <span className="text-[13px] text-ink-muted self-center tabular-nums">
                  +{tallesList.length - 5}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Acciones al pie */}
      <div className="pt-3 mt-3 flex items-center justify-between text-[13px]">
        <button
          type="button"
          onClick={() => onOpenHistory(product)}
          className="inline-flex items-center gap-1.5 font-medium text-ink-secondary hover:text-volt focus-visible:ring-2 focus-visible:ring-volt active:scale-[0.95] transition-[color,transform] duration-150 ease-out cursor-pointer text-[13px] select-none"
        >
          <LineChart className="h-4 w-4" />
          <span>Historial</span>
        </button>

        <a
          href={productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-display font-bold text-ink hover:text-infrared focus-visible:ring-2 focus-visible:ring-infrared active:scale-[0.95] transition-[color,transform] duration-150 ease-out text-[13px] select-none"
        >
          <span>Sporting</span>
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};
