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
  X,
  RotateCcw,
} from 'lucide-react';
import { BrandIcon, BrandWordmark } from './BrandBadge';

interface HeroFiltersProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
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
  searchQuery = '',
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const totalModelos = useMemo(() => {
    return uniqueMarcas.reduce((acc, m) => acc + m.cantidad, 0);
  }, [uniqueMarcas]);

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedTalles.length > 0 ||
    selectedMarcas.length > 0 ||
    soloOfertas;

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

  // Scroll horizontal ultrasuave al usar la rueda del ratón
  const handleWheelScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0 && !e.shiftKey && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
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
    <div className="w-full bg-[#09090b] border-b border-zinc-800/80 py-4 sm:py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* 1. Selector de Marcas con Microinteracciones */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold uppercase tracking-wider text-zinc-300">
                Marcas
              </span>
              {selectedMarcas.length > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white text-zinc-950 animate-filter-pop shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {selectedMarcas.length} seleccionada{selectedMarcas.length > 1 ? 's' : ''}
                </span>
              ) : (
                <span className="text-[11px] font-mono text-zinc-500">
                  {uniqueMarcas.length} marcas · {totalModelos} pares
                </span>
              )}
            </div>

            {selectedMarcas.length > 0 && (
              <button
                type="button"
                onClick={() => onMarcasChange([])}
                className="group flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3 w-3 transition-transform duration-300 group-hover:-rotate-90" />
                <span>Restablecer marcas</span>
              </button>
            )}
          </div>

          {/* Carril de marcas horizontal con máscara de bordes difuminados y animaciones */}
          <div className="relative mask-edges-fade">
            <div
              ref={scrollContainerRef}
              onWheel={handleWheelScroll}
              className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1.5 px-1 select-none"
            >
              {/* Botón Todas las marcas */}
              <button
                type="button"
                onClick={() => onMarcasChange([])}
                className={`group shrink-0 h-11 sm:h-12 px-4 rounded-xl sm:rounded-2xl border flex items-center gap-2.5 transition-all duration-200 ease-out cursor-pointer text-xs font-bold tracking-wide transform active:scale-95 hover:-translate-y-0.5 ${
                  selectedMarcas.length === 0
                    ? 'bg-zinc-100 text-zinc-950 border-white shadow-[0_4px_20px_-2px_rgba(255,255,255,0.25)] ring-2 ring-white/30 scale-[1.02]'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white hover:bg-zinc-850 hover:shadow-lg hover:shadow-black/40'
                }`}
              >
                <div
                  className={`h-6 w-6 rounded-lg flex items-center justify-center transition-colors ${
                    selectedMarcas.length === 0
                      ? 'bg-zinc-200 text-zinc-950'
                      : 'bg-zinc-800/80 text-zinc-400 group-hover:text-white group-hover:bg-zinc-700'
                  }`}
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                </div>
                <span>TODAS</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md transition-colors ${
                    selectedMarcas.length === 0
                      ? 'bg-zinc-300/80 text-zinc-900 font-bold'
                      : 'bg-zinc-800/70 text-zinc-500 group-hover:text-zinc-300'
                  }`}
                >
                  {totalModelos}
                </span>
              </button>

              {/* Botones de Marca individuales */}
              {uniqueMarcas.map((m) => {
                const isSelected = selectedMarcas.some(
                  (sm) => sm.toLowerCase() === m.marca.toLowerCase()
                );
                return (
                  <button
                    key={m.marca}
                    type="button"
                    onClick={() => toggleMarca(m.marca)}
                    className={`group shrink-0 h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl sm:rounded-2xl border flex items-center gap-2.5 transition-all duration-200 ease-out cursor-pointer select-none transform active:scale-95 hover:-translate-y-0.5 ${
                      isSelected
                        ? 'bg-zinc-100 text-zinc-950 border-white shadow-[0_4px_20px_-2px_rgba(255,255,255,0.25)] ring-2 ring-white/30 scale-[1.02] font-semibold'
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white hover:bg-zinc-850 hover:shadow-lg hover:shadow-black/40'
                    }`}
                  >
                    <div
                      className={`h-6 w-6 sm:h-7 sm:w-7 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-200 ${
                        isSelected
                          ? 'bg-zinc-200 text-zinc-950'
                          : 'bg-zinc-800/80 text-zinc-400 group-hover:text-white group-hover:bg-zinc-700/80 group-hover:scale-105'
                      }`}
                    >
                      <BrandIcon
                        marca={m.marca}
                        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                          isSelected
                            ? 'text-zinc-950'
                            : 'text-zinc-400 group-hover:text-zinc-100 transition-colors'
                        }`}
                      />
                    </div>
                    <BrandWordmark marca={m.marca} isSelected={isSelected} />
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md transition-colors ${
                        isSelected
                          ? 'bg-zinc-300/80 text-zinc-900 font-bold'
                          : 'bg-zinc-800/70 text-zinc-500 group-hover:text-zinc-300'
                      }`}
                    >
                      {m.cantidad}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Dock de Talles y Filtros Rápidos */}
        <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800/80 p-2.5 sm:p-3 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xl shadow-black/20">
          
          {/* Selector de Talles interactivo */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1 sm:mx-0 sm:px-0">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 shrink-0 mr-1.5">
              TALLES:
            </span>
            {TALLES_COMUNES.map((talle) => {
              const isTodos = talle === 'Todos';
              const isSelected = isTodos
                ? selectedTalles.length === 0
                : selectedTalles.includes(talle);
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
                  className={`h-8 sm:h-9 rounded-xl font-bold transition-all duration-150 border shrink-0 flex items-center justify-center select-none cursor-pointer transform active:scale-90 hover:-translate-y-0.5 ${
                    isTodos
                      ? 'px-3 text-xs uppercase tracking-wide'
                      : 'w-8 sm:w-9 text-xs sm:text-sm font-mono'
                  } ${
                    isSelected
                      ? 'bg-zinc-100 text-zinc-950 border-white shadow-[0_2px_12px_rgba(255,255,255,0.2)] ring-1 ring-white/30 scale-105'
                      : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {talle}
                </button>
              );
            })}
          </div>

          {/* Acciones de Rebajas, Ordenamiento y Limpieza */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto w-full md:w-auto">
            
            {/* Solo Rebajas con efecto dinámico */}
            <button
              type="button"
              onClick={() => onSoloOfertasChange(!soloOfertas)}
              className={`flex-1 md:flex-initial h-8 sm:h-9 px-3.5 rounded-xl text-xs font-bold transition-all duration-200 border flex items-center justify-center gap-1.5 select-none cursor-pointer transform active:scale-95 ${
                soloOfertas
                  ? 'bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.45)] ring-1 ring-rose-400/40 scale-[1.02]'
                  : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-rose-500/50 hover:text-rose-400 hover:bg-zinc-850 hover:shadow-lg hover:shadow-rose-950/20'
              }`}
            >
              <Flame
                className={`h-3.5 w-3.5 ${
                  soloOfertas ? 'text-white fill-white animate-flame-pulse' : 'text-rose-500'
                }`}
              />
              <span>Solo rebajas</span>
            </button>

            {/* Dropdown Ordenar por animado */}
            <div className="relative flex-1 md:flex-initial">
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="w-full md:w-auto h-8 sm:h-9 px-3 rounded-xl text-xs font-bold bg-zinc-900/90 text-zinc-200 border border-zinc-800 hover:border-zinc-700 focus:outline-none flex items-center justify-between md:justify-start gap-2 transition-all duration-150 select-none cursor-pointer active:scale-95"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <CurrentSortIcon className={`h-3.5 w-3.5 shrink-0 ${currentSort.iconColor}`} />
                  <span className="truncate">{currentSort.label}</span>
                </div>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-zinc-400 shrink-0 transition-transform duration-200 ${
                    isSortOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isSortOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsSortOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-48 rounded-2xl bg-zinc-900/95 border border-zinc-700/80 shadow-2xl backdrop-blur-xl p-1.5 z-50 animate-menu-dropdown">
                    <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
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
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-zinc-800 text-white font-semibold'
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

            {/* Botón Limpiar filtros cuando hay activos */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onReset}
                className="group h-8 sm:h-9 px-2.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                title="Restablecer todos los filtros"
              >
                <X className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-90" />
                <span className="hidden sm:inline">Limpiar</span>
              </button>
            )}

          </div>

        </div>

        {/* 3. Chips de Filtros Activos con Animación Pop-in */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-zinc-800/40 text-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 mr-1">
              ACTIVOS:
            </span>
            {selectedMarcas.map((marca) => (
              <button
                key={marca}
                type="button"
                onClick={() => toggleMarca(marca)}
                className="animate-filter-pop group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800/90 border border-zinc-700/60 text-zinc-200 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-150 text-[11px] font-semibold active:scale-95"
              >
                <span>{marca}</span>
                <X className="h-2.5 w-2.5 text-zinc-400 group-hover:text-rose-300 transition-colors" />
              </button>
            ))}
            {selectedTalles.map((talle) => (
              <button
                key={talle}
                type="button"
                onClick={() => toggleTalle(talle)}
                className="animate-filter-pop group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800/90 border border-zinc-700/60 text-zinc-200 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-150 text-[11px] font-semibold active:scale-95"
              >
                <span>Talle {talle}</span>
                <X className="h-2.5 w-2.5 text-zinc-400 group-hover:text-rose-300 transition-colors" />
              </button>
            ))}
            {soloOfertas && (
              <button
                type="button"
                onClick={() => onSoloOfertasChange(false)}
                className="animate-filter-pop group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all duration-150 text-[11px] font-semibold active:scale-95"
              >
                <span>Solo rebajas</span>
                <X className="h-2.5 w-2.5 text-rose-400 group-hover:text-white transition-colors" />
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
  );
};
