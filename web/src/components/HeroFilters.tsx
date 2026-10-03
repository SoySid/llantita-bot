'use client';

import React, { useState } from 'react';
import { Flame, Percent, TrendingDown, TrendingUp, Clock, Check, ChevronDown, X } from 'lucide-react';

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

import { BrandIcon, BrandWordmark } from './BrandBadge';


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
  const [isSortOpen, setIsSortOpen] = useState(false);
  const hasActiveFilters = searchQuery || selectedTalle || selectedMarca || soloOfertas;

  const SORT_OPTIONS = [
    { id: 'descuento', label: 'Mayor rebaja', icon: Percent, iconColor: 'text-rose-400' },
    { id: 'precio_asc', label: 'Menor precio', icon: TrendingDown, iconColor: 'text-emerald-400' },
    { id: 'precio_desc', label: 'Mayor precio', icon: TrendingUp, iconColor: 'text-zinc-400' },
    { id: 'recientes', label: 'Más recientes', icon: Clock, iconColor: 'text-sky-400' },
  ];

  const currentSort = SORT_OPTIONS.find((s) => s.id === selectedOrden) || SORT_OPTIONS[0];
  const CurrentSortIcon = currentSort.icon;

  return (
    <div className="w-full bg-[#09090b] border-b border-zinc-800 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* 1. Grilla de TODAS las Marcas con Logos Oficiales y Tipografía Propia */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Seleccionar Marca ({marcasDisponibles.length} disponibles)
            </span>
            {selectedMarca && (
              <button
                onClick={() => onMarcaChange('')}
                className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
              >
                ✕ Limpiar marca ({selectedMarca})
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
            {/* Opción Todas las marcas */}
            <button
              onClick={() => onMarcaChange('')}
              className={`p-3 sm:p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center group cursor-pointer min-h-[88px] ${
                !selectedMarca
                  ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-md ring-2 ring-white/20'
                  : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <div className="h-7 w-7 flex items-center justify-center">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </div>
              <span className="text-xs font-black uppercase tracking-tight">Todas</span>
              <span className={`text-[10px] font-mono ${!selectedMarca ? 'text-zinc-600 font-bold' : 'text-zinc-500'}`}>
                Catálogo
              </span>
            </button>

            {/* Tarjetas de Marcas con tipografía auténtica */}
            {marcasDisponibles.map((m) => {
              const isSelected = selectedMarca.toLowerCase() === m.marca.toLowerCase();
              return (
                <button
                  key={m.marca}
                  onClick={() => onMarcaChange(isSelected ? '' : m.marca)}
                  className={`p-3 sm:p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center group cursor-pointer min-h-[88px] ${
                    isSelected
                      ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-md ring-2 ring-white/20'
                      : 'bg-zinc-900/70 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <div className="h-7 w-7 flex items-center justify-center">
                    <BrandIcon
                      marca={m.marca}
                      className={isSelected ? 'text-zinc-950' : 'text-zinc-300 group-hover:text-white'}
                    />
                  </div>
                  <BrandWordmark marca={m.marca} isSelected={isSelected} />
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-zinc-600 font-bold' : 'text-zinc-500'}`}>
                    {m.cantidad} pares
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Barra de Utilidad de Talles y Filtros (Estilo Streetwear Boutique) */}
        <div className="pt-4 border-t border-zinc-800/80 space-y-3">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-3 sm:p-3.5 backdrop-blur-sm">
            
            {/* Izquierda: Selector de Talles con Números Grandes y Claros */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-2 px-2 sm:mx-0 sm:px-0">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-400 shrink-0 mr-1 font-mono">
                TALLES:
              </span>
              {TALLES_COMUNES.map((talle) => {
                const isSelected = talle === 'Todos' ? !selectedTalle : selectedTalle === talle;
                const isTodos = talle === 'Todos';
                return (
                  <button
                    key={talle}
                    onClick={() => onTalleChange(isTodos ? '' : talle)}
                    className={`h-10 sm:h-11 rounded-xl font-black transition-all border shrink-0 flex items-center justify-center select-none ${
                      isTodos ? 'px-4 text-xs sm:text-sm uppercase tracking-wider' : 'w-11 sm:w-12 text-sm sm:text-base'
                    } ${
                      isSelected
                        ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-md ring-2 ring-white/20'
                        : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white hover:bg-zinc-800/80'
                    }`}
                  >
                    {talle}
                  </button>
                );
              })}
            </div>

            {/* Derecha: Botón de Oferta Potente y Dropdown Oscuro con Iconos */}
            <div className="flex items-center gap-2.5 shrink-0 self-end xl:self-center">
              {/* Botón Destacado: Solo Rebajas con llama SVG */}
              <button
                type="button"
                onClick={() => onSoloOfertasChange(!soloOfertas)}
                className={`h-10 sm:h-11 px-4 rounded-xl text-xs sm:text-sm font-black transition-all border flex items-center gap-2 select-none group shrink-0 ${
                  soloOfertas
                    ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-950/60 ring-2 ring-rose-500/25'
                    : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-rose-500/50 hover:text-rose-400'
                }`}
              >
                <Flame className={`h-4 w-4 transition-transform group-hover:scale-110 ${soloOfertas ? 'text-white fill-white' : 'text-rose-500'}`} />
                <span>Solo rebajas</span>
              </button>

              {/* Dropdown Oscuro Personalizado con Iconos (Sin menú nativo de Windows) */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="h-10 sm:h-11 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold bg-zinc-900/90 text-zinc-200 border border-zinc-800 hover:border-zinc-700 focus:outline-none flex items-center gap-2 transition-all select-none"
                >
                  <CurrentSortIcon className={`h-4 w-4 ${currentSort.iconColor}`} />
                  <span>{currentSort.label}</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSortOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsSortOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 sm:w-52 rounded-2xl bg-zinc-900/95 border border-zinc-800 shadow-2xl backdrop-blur-md p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                        Ordenar por
                      </div>
                      {SORT_OPTIONS.map((opt) => {
                        const isSelected = selectedOrden === opt.id;
                        const OptIcon = opt.icon;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              onOrdenChange(opt.id);
                              setIsSortOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                              isSelected
                                ? 'bg-zinc-800 text-white'
                                : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <OptIcon className={`h-3.5 w-3.5 ${opt.iconColor}`} />
                              <span>{opt.label}</span>
                            </div>
                            {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Limpiar filtros si hay alguno activo */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onReset}
                  className="h-10 sm:h-11 px-2.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                  title="Restablecer todos los filtros"
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Limpiar</span>
                </button>
              )}
            </div>

          </div>

          {/* Chips de Filtros Activos */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-zinc-800/40 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mr-1 font-mono">
                ACTIVOS:
              </span>
              {selectedMarca && (
                <button
                  onClick={() => onMarcaChange('')}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors text-[11px] font-semibold"
                >
                  <span>{selectedMarca}</span>
                  <X className="h-2.5 w-2.5 text-zinc-400" />
                </button>
              )}
              {selectedTalle && (
                <button
                  onClick={() => onTalleChange('')}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors text-[11px] font-semibold"
                >
                  <span>Talle {selectedTalle}</span>
                  <X className="h-2.5 w-2.5 text-zinc-400" />
                </button>
              )}
              {soloOfertas && (
                <button
                  onClick={() => onSoloOfertasChange(false)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-colors text-[11px] font-semibold"
                >
                  <span>Solo rebajas</span>
                  <X className="h-2.5 w-2.5 text-rose-400" />
                </button>
              )}
              <button
                onClick={onReset}
                className="text-[11px] text-zinc-500 hover:text-zinc-200 ml-1.5 underline underline-offset-2 transition-colors"
              >
                Borrar todos
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
