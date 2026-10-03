'use client';

import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Tag, X } from 'lucide-react';

interface HeroFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTalle: string;
  onTalleChange: (talle: string) => void;
  selectedMarca: string;
  onMarcaChange: (marca: string) => void;
  marcasDisponibles: Array<{ marca: string; cantidad: number }>;
  selectedOrden: string;
  onOrdenChange: (orden: string) => void;
  soloOfertas: boolean;
  onSoloOfertasChange: (val: boolean) => void;
  onReset: () => void;
}

const TALLES_COMUNES = ['Todos', '38', '39', '40', '41', '42', '43', '44', '45', '46'];

export const HeroFilters: React.FC<HeroFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedTalle,
  onTalleChange,
  selectedMarca,
  onMarcaChange,
  marcasDisponibles,
  selectedOrden,
  onOrdenChange,
  soloOfertas,
  onSoloOfertasChange,
  onReset,
}) => {
  const hasActiveFilters = searchQuery || selectedTalle || selectedMarca || soloOfertas;

  return (
    <div className="w-full bg-[#111827]/70 border-b border-slate-800/80 backdrop-blur-sm py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* Search Bar + Controls */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Input Buscador */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar zapatilla (ej. Duramo, Forum, Pegasus, Skate...)"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl bg-slate-900/90 border border-slate-700/80 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Selector de Marcas */}
          <div className="flex items-center gap-2">
            <select
              value={selectedMarca}
              onChange={(e) => onMarcaChange(e.target.value)}
              className="w-full md:w-44 rounded-xl bg-slate-900/90 border border-slate-700/80 px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
            >
              <option value="">Todas las marcas</option>
              {marcasDisponibles.map((m) => (
                <option key={m.marca} value={m.marca}>
                  {m.marca} ({m.cantidad})
                </option>
              ))}
            </select>

            {/* Selector de Orden */}
            <select
              value={selectedOrden}
              onChange={(e) => onOrdenChange(e.target.value)}
              className="w-full md:w-48 rounded-xl bg-slate-900/90 border border-slate-700/80 px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
            >
              <option value="descuento">Mayor descuento %</option>
              <option value="precio_asc">Menor precio</option>
              <option value="precio_desc">Mayor precio</option>
              <option value="recientes">Últimos actualizados</option>
            </select>
          </div>
        </div>

        {/* Selector de Talles (Chips horizontales con snap táctil en móvil) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
              Talles:
            </span>
            {TALLES_COMUNES.map((talle) => {
              const isSelected = talle === 'Todos' ? !selectedTalle : selectedTalle === talle;
              return (
                <button
                  key={talle}
                  onClick={() => onTalleChange(talle === 'Todos' ? '' : talle)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm shadow-emerald-500/20'
                      : 'bg-slate-900/80 text-slate-300 border-slate-700/60 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  {talle === 'Todos' ? 'Todos los talles' : `Talle ${talle}`}
                </button>
              );
            })}
          </div>

          {/* Toggle Solo Ofertas y Reset */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={soloOfertas}
                onChange={(e) => onSoloOfertasChange(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
              />
              <span className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-emerald-400" />
                Solo con rebaja
              </span>
            </label>

            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="text-xs text-slate-400 hover:text-rose-400 underline underline-offset-2 transition-colors ml-2"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
