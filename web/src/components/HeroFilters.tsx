'use client';

import React, { useState, useRef, useMemo } from 'react';
import {
  Flame,
  Percent,
  TrendingDown,
  TrendingUp,
  Clock,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from 'lucide-react';
import { BrandIcon, BrandWordmark } from './BrandBadge';

interface HeroFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTalles: string[];
  onTallesChange: (talles: string[]) => void;
  selectedMarcas: string[];
  onMarcasChange: (marcas: string[]) => void;
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
  selectedTalles,
  onTallesChange,
  selectedMarcas,
  onMarcasChange,
  marcasDisponibles,
  selectedOrden,
  onOrdenChange,
  soloOfertas,
  onSoloOfertasChange,
  onReset,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const brandsScrollRef = useRef<HTMLDivElement>(null);

  // Normalizar marcas únicas para asegurar que no haya duplicados
  const uniqueMarcas = useMemo(() => {
    const map = new Map<string, { marca: string; cantidad: number }>();
    for (const m of marcasDisponibles) {
      const key = m.marca.toUpperCase().trim();
      if (map.has(key)) {
        const existing = map.get(key)!;
        existing.cantidad += m.cantidad;
      } else {
        map.set(key, { ...m });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.cantidad - a.cantidad);
  }, [marcasDisponibles]);

  const hasActiveFilters = searchQuery || selectedTalles.length > 0 || selectedMarcas.length > 0 || soloOfertas;

  const toggleMarca = (marca: string) => {
    const exists = selectedMarcas.some((m) => m.toLowerCase() === marca.toLowerCase());
    if (exists) {
      onMarcasChange(selectedMarcas.filter((m) => m.toLowerCase() !== marca.toLowerCase()));
    } else {
      onMarcasChange([...selectedMarcas, marca]);
    }
  };

  const toggleTalle = (talle: string) => {
    if (selectedTalles.includes(talle)) {
      onTallesChange(selectedTalles.filter((t) => t !== talle));
    } else {
      onTallesChange([...selectedTalles, talle]);
    }
  };

  const scrollBrands = (direction: 'left' | 'right') => {
    if (!brandsScrollRef.current) return;
    const scrollAmount = direction === 'left' ? -350 : 350;
    brandsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const SORT_OPTIONS = [
    { id: 'descuento', label: 'Mayor rebaja', icon: Percent, iconColor: 'text-rose-400' },
    { id: 'precio_asc', label: 'Menor precio', icon: TrendingDown, iconColor: 'text-emerald-400' },
    { id: 'precio_desc', label: 'Mayor precio', icon: TrendingUp, iconColor: 'text-zinc-400' },
    { id: 'recientes', label: 'Más recientes', icon: Clock, iconColor: 'text-sky-400' },
  ];

  const currentSort = SORT_OPTIONS.find((s) => s.id === selectedOrden) || SORT_OPTIONS[0];
  const CurrentSortIcon = currentSort.icon;

  return (
    <div className="w-full bg-[#09090b] border-b border-zinc-800/80 py-5 sm:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">
        
        {/* 1. Carrusel Horizontal de Marcas con Logos Oficiales y Tipografía Auténtica */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
                Marcas
              </span>
              <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full">
                {uniqueMarcas.length} disponibles
              </span>
            </div>

            <div className="flex items-center gap-2">
              {selectedMarcas.length > 0 && (
                <button
                  type="button"
                  onClick={() => onMarcasChange([])}
                  className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer mr-1"
                >
                  ✕ Limpiar marcas ({selectedMarcas.length})
                </button>
              )}

              {/* Controles de navegación en PC */}
              <div className="hidden sm:flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollBrands('left')}
                  className="h-7 w-7 rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:border-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
                  title="Desplazar a la izquierda"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollBrands('right')}
                  className="h-7 w-7 rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:border-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
                  title="Desplazar a la derecha"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Riel horizontal fluido con snap */}
          <div
            ref={brandsScrollRef}
            className="flex gap-2 sm:gap-2.5 overflow-x-auto scroll-smooth no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory"
          >
            {/* Opción Todas las marcas */}
            <button
              type="button"
              onClick={() => onMarcasChange([])}
              className={`shrink-0 snap-start w-[84px] sm:w-[92px] h-[72px] sm:h-[78px] p-2 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center group cursor-pointer ${
                selectedMarcas.length === 0
                  ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-md ring-2 ring-white/20'
                  : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <div className="h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </div>
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-tight">Todas</span>
            </button>

            {/* Marcas únicas ordenadas */}
            {uniqueMarcas.map((m) => {
              const isSelected = selectedMarcas.some((sm) => sm.toLowerCase() === m.marca.toLowerCase());
              return (
                <button
                  key={m.marca}
                  type="button"
                  onClick={() => toggleMarca(m.marca)}
                  className={`shrink-0 snap-start w-[84px] sm:w-[92px] h-[72px] sm:h-[78px] p-2 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center group cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-md ring-2 ring-white/20'
                      : 'bg-zinc-900/70 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <div className="h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center">
                    <BrandIcon
                      marca={m.marca}
                      className={`h-5 w-5 sm:h-6 sm:w-6 ${isSelected ? 'text-zinc-950' : 'text-zinc-300 group-hover:text-white'}`}
                    />
                  </div>
                  <BrandWordmark marca={m.marca} isSelected={isSelected} />
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Barra de Herramientas: Buscador + Selector de Talles + Filtros */}
        <div className="pt-3 border-t border-zinc-800/80 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-3 sm:p-3.5 backdrop-blur-sm">
            
            {/* Buscador de calzado por modelo */}
            <div className="relative w-full lg:w-64 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar modelo..."
                className="w-full h-10 pl-9 pr-8 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-0.5"
                  title="Borrar búsqueda"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Selector de Talles con scroll horizontal limpio */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1 sm:mx-0 sm:px-0">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 shrink-0 mr-1">
                TALLES:
              </span>
              {TALLES_COMUNES.map((talle) => {
                const isTodos = talle === 'Todos';
                const isSelected = isTodos ? selectedTalles.length === 0 : selectedTalles.includes(talle);
                return (
                  <button
                    key={talle}
                    type="button"
                    onClick={() => {
                      if (isTodos) {
                        onTallesChange([]);
                      } else {
                        toggleTalle(talle);
                      }
                    }}
                    className={`h-9 sm:h-10 rounded-xl font-black transition-all border shrink-0 flex items-center justify-center select-none cursor-pointer ${
                      isTodos ? 'px-3 text-xs uppercase tracking-wider' : 'w-10 sm:w-11 text-xs sm:text-sm'
                    } ${
                      isSelected
                        ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-sm ring-1 ring-white/20'
                        : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    {talle}
                  </button>
                );
              })}
            </div>

            {/* Acciones de Ordenamiento y Ofertas */}
            <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto">
              
              {/* Botón Solo Rebajas */}
              <button
                type="button"
                onClick={() => onSoloOfertasChange(!soloOfertas)}
                className={`flex-1 lg:flex-initial justify-center h-9 sm:h-10 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all border flex items-center gap-1.5 select-none cursor-pointer ${
                  soloOfertas
                    ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-950/60 ring-1 ring-rose-400/30'
                    : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-rose-500/40 hover:text-rose-400'
                }`}
              >
                <Flame className={`h-4 w-4 ${soloOfertas ? 'text-white fill-white' : 'text-rose-500'}`} />
                <span>Solo rebajas</span>
              </button>

              {/* Dropdown de Orden */}
              <div className="relative flex-1 lg:flex-initial">
                <button
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="w-full lg:w-auto justify-between lg:justify-start h-9 sm:h-10 px-3 rounded-xl text-xs sm:text-sm font-bold bg-zinc-900/90 text-zinc-200 border border-zinc-800 hover:border-zinc-700 focus:outline-none flex items-center gap-2 transition-all select-none cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <CurrentSortIcon className={`h-3.5 w-3.5 shrink-0 ${currentSort.iconColor}`} />
                    <span className="truncate">{currentSort.label}</span>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 text-zinc-400 shrink-0 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSortOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsSortOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 sm:w-52 rounded-2xl bg-zinc-900/95 border border-zinc-800 shadow-2xl backdrop-blur-md p-1.5 z-50">
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
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
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

              {/* Limpiar todos los filtros */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onReset}
                  className="h-9 sm:h-10 px-2.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer shrink-0"
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
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors text-[11px] font-semibold"
                >
                  <span>"{searchQuery}"</span>
                  <X className="h-2.5 w-2.5 text-zinc-400" />
                </button>
              )}
              {selectedMarcas.map((marca) => (
                <button
                  key={marca}
                  type="button"
                  onClick={() => toggleMarca(marca)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors text-[11px] font-semibold"
                >
                  <span>{marca}</span>
                  <X className="h-2.5 w-2.5 text-zinc-400" />
                </button>
              ))}
              {selectedTalles.map((talle) => (
                <button
                  key={talle}
                  type="button"
                  onClick={() => toggleTalle(talle)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors text-[11px] font-semibold"
                >
                  <span>Talle {talle}</span>
                  <X className="h-2.5 w-2.5 text-zinc-400" />
                </button>
              ))}
              {soloOfertas && (
                <button
                  type="button"
                  onClick={() => onSoloOfertasChange(false)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-colors text-[11px] font-semibold"
                >
                  <span>Solo rebajas</span>
                  <X className="h-2.5 w-2.5 text-rose-400" />
                </button>
              )}
              <button
                type="button"
                onClick={onReset}
                className="text-[11px] text-zinc-500 hover:text-zinc-200 ml-1.5 underline underline-offset-2 transition-colors cursor-pointer"
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
