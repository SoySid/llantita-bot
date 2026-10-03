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
  selectedTalle?: string;
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
  selectedTalle,
  onResetFilters,
}) => {
  return (
    <section className="w-full py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado del catálogo con conteo de resultados */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Catálogo Monitoreado
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {total > 0
                ? `Mostrando ${productos.length} de ${total.toLocaleString('es-AR')} calzados encontrados`
                : 'Buscando en la base de datos...'}
            </p>
          </div>
        </div>

        {/* Estado de carga */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mb-3" />
            <p className="text-sm font-medium">Consultando ofertas en tiempo real...</p>
          </div>
        ) : productos.length === 0 ? (
          /* Estado vacío si no hay resultados */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800">
            <div className="h-12 w-12 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 mb-3">
              <SearchX className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-200">No se encontraron zapatillas</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
              Probá ajustando los términos de búsqueda o quitando el filtro de talle y marca.
            </p>
            <button
              onClick={onResetFilters}
              className="rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold px-4 py-2 hover:bg-emerald-600/30 transition-colors"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          /* Grilla de productos */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productos.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onOpenHistory={onOpenHistory}
                selectedTalle={selectedTalle}
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
              className="inline-flex items-center gap-1 rounded-xl bg-slate-900 border border-slate-700/80 px-3.5 py-2 text-xs font-medium text-slate-200 hover:border-slate-500 disabled:opacity-40 disabled:hover:border-slate-700 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Anterior</span>
            </button>

            <span className="text-xs font-semibold text-slate-400">
              Página <span className="text-white">{currentPage}</span> de {totalPages}
            </span>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center gap-1 rounded-xl bg-slate-900 border border-slate-700/80 px-3.5 py-2 text-xs font-medium text-slate-200 hover:border-slate-500 disabled:opacity-40 disabled:hover:border-slate-700 transition-all"
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
