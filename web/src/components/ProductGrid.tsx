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
    <section className="w-full py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-2 sm:px-4">
        
        {/* Encabezado del catálogo */}
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <div className="flex items-baseline gap-3">
            <h2 className="section-title text-2xl sm:text-3xl text-stone-100">
              Catálogo completo
            </h2>
            {total > 0 && (
              <span className="text-xs text-stone-400 tabular-nums">
                ({total.toLocaleString('es-AR')} modelos)
              </span>
            )}
          </div>
        </div>

        {/* Estado de carga */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#a39b91]">
            <Loader2 className="h-7 w-7 animate-spin text-orange-500 mb-3" />
            <p className="text-sm font-medium tracking-wide">Cargando catálogo...</p>
          </div>
        ) : productos.length === 0 ? (
          /* Estado vacío */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-lg bg-[#14110f] border border-[#2b241c]">
            <div className="h-11 w-11 rounded bg-[#1e1813] border border-[#423425] flex items-center justify-center text-[#8a8074] mb-3">
              <SearchX className="h-5 w-5" />
            </div>
            <h3 className="section-title text-xl text-stone-100 uppercase">Sin resultados para esta búsqueda</h3>
            <p className="text-sm text-stone-400 max-w-sm mt-1 mb-4">
              Probá cambiando los filtros de talle, marca o término de búsqueda.
            </p>
            <button
              onClick={onResetFilters}
              className="rounded bg-[#ff5500] text-black text-xs font-barlow font-bold uppercase px-4 py-2 hover:bg-[#ff6a1a] active:scale-[0.96] transition-colors cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          /* Grilla de productos */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
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
              className="inline-flex items-center gap-1.5 rounded bg-[#161310] border border-[#382f25] hover:border-[#ff5500] px-3.5 py-2 text-xs font-barlow font-bold uppercase text-[#f2ede7] active:enabled:scale-[0.96] disabled:opacity-30 transition-colors cursor-pointer select-none"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Anterior</span>
            </button>

            <span className="text-xs text-stone-400 tabular-nums">
              Página <strong className="text-stone-100 font-bold">{currentPage}</strong> de {totalPages}
            </span>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center gap-1.5 rounded bg-[#161310] border border-[#382f25] hover:border-[#ff5500] px-3.5 py-2 text-xs font-barlow font-bold uppercase text-[#f2ede7] active:enabled:scale-[0.96] disabled:opacity-30 transition-colors cursor-pointer select-none"
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
