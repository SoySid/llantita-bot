'use client';

import React from 'react';
import { ProductCard } from './ProductCard';
import { DealProduct } from './FeaturedDeals';
import { ChevronLeft, ChevronRight, SearchX, Loader2 } from 'lucide-react';

interface ProductGridProps {
  productos: DealProduct[];
  loading: boolean;
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onOpenHistory: (product: DealProduct) => void;
  selectedTalles?: string[];
  onResetFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  productos,
  loading,
  total,
  currentPage,
  totalPages,
  onPageChange,
  onOpenHistory,
  selectedTalles,
  onResetFilters,
}) => {
  return (
    <section className="w-full py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado del catálogo */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-[-0.03em]">
              Catálogo completo
            </h2>
            {total > 0 && (
              <span className="text-[13px] text-ink-muted tabular-nums">
                ({total.toLocaleString('es-AR')} modelos)
              </span>
            )}
          </div>
        </div>

        {/* Estado de carga */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-ink-secondary">
            <Loader2 className="h-6 w-6 fast-spin text-infrared mb-3" />
            <p className="text-sm font-medium">Cargando catálogo...</p>
          </div>
        ) : productos.length === 0 ? (
          /* Estado vacío */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-surface">
            <div className="h-11 w-11 rounded-xl bg-surface-card flex items-center justify-center text-ink-muted mb-3">
              <SearchX className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-bold text-ink">No se encontraron zapatillas</h3>
            <p className="text-sm text-ink-secondary max-w-sm mt-1 mb-4">
              Probá cambiando los filtros de talle, marca o término de búsqueda.
            </p>
            <button
              onClick={onResetFilters}
              className="rounded-xl bg-bone text-canvas text-[13px] font-display font-bold px-4 py-2.5 hover:opacity-90 active:scale-[0.96] transition-[opacity,transform] duration-150 ease-out cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          /* Grilla de productos */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {productos.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onOpenHistory={onOpenHistory}
                selectedTalles={selectedTalles}
              />
            ))}
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && !loading && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="inline-flex items-center gap-1.5 rounded-xl bg-surface-card px-4 py-2.5 text-[13px] font-display font-bold text-ink hover:bg-surface-elevated active:enabled:scale-[0.96] disabled:opacity-30 transition-[background-color,transform] duration-150 ease-out cursor-pointer select-none"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Anterior</span>
            </button>

            <span className="text-[13px] text-ink-secondary tabular-nums">
              Página <strong className="text-ink font-bold">{currentPage}</strong> de {totalPages}
            </span>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center gap-1.5 rounded-xl bg-surface-card px-4 py-2.5 text-[13px] font-display font-bold text-ink hover:bg-surface-elevated active:enabled:scale-[0.96] disabled:opacity-30 transition-[background-color,transform] duration-150 ease-out cursor-pointer select-none"
            >
              <span>Siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
