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
    <section className="w-full py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado del catálogo */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-baseline gap-2.5">
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Todas las zapatillas
            </h2>
            {total > 0 && (
              <span className="text-xs text-zinc-500 font-mono">
                ({total.toLocaleString('es-AR')} modelos)
              </span>
            )}
          </div>
        </div>

        {/* Estado de carga */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-200 mb-3" />
            <p className="text-sm font-medium">Consultando ofertas en tiempo real...</p>
          </div>
        ) : productos.length === 0 ? (
          /* Estado vacío si no hay resultados */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800">
            <div className="h-12 w-12 rounded-xl bg-zinc-800/80 flex items-center justify-center text-zinc-400 mb-3">
              <SearchX className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-zinc-200">No se encontraron zapatillas</h3>
            <p className="text-xs text-zinc-400 max-w-sm mt-1 mb-4">
              Probá cambiando los filtros de talle o marca para ver más modelos disponibles.
            </p>
            <button
              onClick={onResetFilters}
              className="rounded-xl bg-zinc-100 text-zinc-950 text-xs font-black px-4 py-2 hover:bg-white transition-colors shadow-sm"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          /* Grilla de productos (2 columnas en móvil estilo app nativa, 4 en PC) */
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
              className="inline-flex items-center gap-1 rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2 text-xs font-bold text-zinc-200 hover:border-zinc-700 disabled:opacity-30 disabled:hover:border-zinc-800 transition-all select-none"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Anterior</span>
            </button>

            <span className="text-xs font-semibold text-zinc-400 font-mono">
              Página <span className="text-white font-bold">{currentPage}</span> de {totalPages}
            </span>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center gap-1 rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2 text-xs font-bold text-zinc-200 hover:border-zinc-700 disabled:opacity-30 disabled:hover:border-zinc-800 transition-all select-none"
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
