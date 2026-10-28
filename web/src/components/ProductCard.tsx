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
    <div className="mech-card p-3 sm:p-3.5 flex flex-col justify-between group relative">
      <div>
        {/* Vitrina de Producto */}
        <a
          href={productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full aspect-square rounded bg-[#161311] border border-[#2b241d] p-3 mb-3 overflow-hidden flex items-center justify-center block cursor-pointer active:scale-[0.98] transition-transform duration-150"
        >
          {hasDiscount && (
            <span className="absolute top-2 right-2 z-10 inline-flex items-center px-1.5 py-0.5 rounded bg-gradient-to-r from-[#ff7b29] to-[#ff5100] text-[#1c110a] font-barlow text-xs font-bold uppercase tracking-wider shadow-[0_0_8px_rgba(255,85,10,0.5)] border border-[#ffa366]">
              -{product.descuento_pct}%
            </span>
          )}

          {product.imagen_url ? (
            <img
              src={safeExternalUrl(product.imagen_url)}
              alt={product.nombre}
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-200 ease-out md:group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-[#8a8074]">
              <span className="text-xs font-mono">Sin foto</span>
            </div>
          )}
        </a>

        {/* Marca y Nombre */}
        <div className="space-y-1">
          <span className="block font-barlow text-xs font-bold text-[#ff6a1a] uppercase tracking-wider">
            {brandLabel}
          </span>

          <a
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-anton text-base sm:text-lg text-[#f2ede7] line-clamp-2 leading-snug hover:text-[#ff6a1a] transition-colors duration-150 block min-h-[44px] tracking-wide"
          >
            {product.nombre}
          </a>
        </div>

        {/* Precios y Ahorro */}
        <div className="mt-2.5 space-y-0.5">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-anton text-xl sm:text-2xl text-[#f2ede7] tracking-wider tabular-nums">
              {formatCurrency(product.precio)}
            </span>
            {hasDiscount && product.precio_anterior && (
              <span className="text-xs font-mono text-[#8c8275] line-through tabular-nums">
                {formatCurrency(product.precio_anterior)}
              </span>
            )}
          </div>
          {ahorro ? (
            <p className="text-xs font-mono text-[#ff944d] font-bold tabular-nums">
              Ahorrás {formatCurrency(ahorro)}
            </p>
          ) : (
            <p className="text-[11px] font-mono text-[#736c64]">
              Precio regular verificado
            </p>
          )}
        </div>

        {/* Talles disponibles */}
        {tallesList.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-barlow font-bold text-[#8a8074] uppercase tracking-wider">Talles:</span>
            <div className="flex flex-wrap gap-1">
              {tallesList.slice(0, 5).map((t, idx) => {
                const isMatchingSelected =
                  selectedTalles && selectedTalles.length > 0 && selectedTalles.some((st) => t.includes(st));
                return (
                  <span
                    key={idx}
                    className={`font-mono text-xs tabular-nums px-1.5 py-0.2 rounded border transition-colors select-none ${
                      isMatchingSelected
                        ? 'bg-[#ff5100] text-black font-bold border-[#ffa366]'
                        : 'bg-[#100e0d] text-[#c7beaf] border-[#2e261f]'
                    }`}
                  >
                    {t}
                  </span>
                );
              })}
              {tallesList.length > 5 && (
                <span className="text-[11px] font-mono text-[#8a8074] self-center tabular-nums">
                  +{tallesList.length - 5}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Acciones al pie */}
      <div className="pt-3 mt-3 flex items-center justify-between text-xs gap-1 border-t border-[#29221b]">
        <button
          type="button"
          onClick={() => onOpenHistory(product)}
          className="inline-flex items-center gap-1 font-barlow font-bold text-xs uppercase tracking-wider text-[#a39b91] hover:text-[#ff944d] active:scale-[0.95] transition-all cursor-pointer select-none"
        >
          <LineChart className="h-3.5 w-3.5 shrink-0" />
          <span>Historial</span>
        </button>

        <a
          href={productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 font-barlow font-bold text-xs uppercase tracking-wider text-[#f2ede7] hover:text-[#ff6a1a] active:scale-[0.95] transition-all select-none"
        >
          <span>Sporting</span>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
        </a>
      </div>
    </div>
  );
};
