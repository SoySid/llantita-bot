'use client';

import React from 'react';
import { formatCurrency, parseTalles } from '@/lib/utils';
import { ExternalLink, LineChart, Tag } from 'lucide-react';
import { DealProduct } from './FeaturedDeals';

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

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-[#141b29] border border-slate-800 hover:border-slate-700 transition-all p-4 shadow-sm hover:shadow-md group">
      <div>
        {/* Encabezado: Marca y Descuento */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {product.marca || 'Calzado'}
          </span>
          {hasDiscount && (
            <span className="inline-flex items-center gap-1 rounded bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-xs font-bold text-rose-400">
              <Tag className="h-3 w-3" />
              -{product.descuento_pct}%
            </span>
          )}
        </div>

        {/* Nombre del modelo */}
        <h3 className="text-sm font-semibold text-slate-100 line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
          {product.nombre}
        </h3>

        {/* Precios */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-white">
            {formatCurrency(product.precio)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-slate-500 line-through">
              {formatCurrency(product.precio_anterior)}
            </span>
          )}
        </div>

        {/* Talles en stock */}
        {tallesList.length > 0 && (
          <div className="mt-3">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
              Talles disponibles:
            </span>
            <div className="flex flex-wrap gap-1">
              {tallesList.slice(0, 6).map((t, idx) => {
                const isMatchingSelected = selectedTalle && t.includes(selectedTalle);
                return (
                  <span
                    key={idx}
                    className={`rounded px-1.5 py-0.5 text-[10px] font-mono border ${
                      isMatchingSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-slate-900 border-slate-700/60 text-slate-300'
                    }`}
                  >
                    {t}
                  </span>
                );
              })}
              {tallesList.length > 6 && (
                <span className="text-[10px] text-slate-500 self-center">
                  +{tallesList.length - 6}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={() => onOpenHistory(product)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-medium py-2 px-2.5 transition-colors"
        >
          <LineChart className="h-3.5 w-3.5 text-emerald-400" />
          <span>Historial</span>
        </button>
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold py-2 px-3 transition-colors"
        >
          <span>Tienda</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};
