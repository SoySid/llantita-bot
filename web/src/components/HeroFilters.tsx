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

  // Scroll horizontal suave al usar la rueda del ratón sobre el carril
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3.5">
        
        {/* 1. Selector de Marcas Horizontal */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold uppercase tracking-wider text-zinc-400">
                Marcas
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                {uniqueMarcas.length} marcas · {totalModelos} pares
              </span>
            </div>

            {selectedMarcas.length > 0 && (
              <button
                type="button"
                onClick={() => onMarcasChange([])}
                className="font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Limpiar marcas ({selectedMarcas.length})
              </button>
            )}
          </div>

          {/* Carril de marcas con scroll táctil y wheel nativo */}
          <div className="relative">
            <div
              ref={scrollContainerRef}
              onWheel={handleWheelScroll}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-4 px-4 sm:mx-0 sm:px-0 select-none"
            >
              {/* Opción Todas */}
              <button
                type="button"
                onClick={() => onMarcasChange([])}
                className={`shrink-0 h-10 px-4 rounded-xl border flex items-center gap-2 transition-all cursor-pointer text-xs font-bold tracking-wide ${
                  selectedMarcas.length === 0
                    ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-sm'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <span>TODAS</span>
                <span className={`text-[10px] font-mono ${selectedMarcas.length === 0 ? 'text-zinc-600' : 'text-zinc-500'}`}>
                  {totalModelos}
                </span>
              </button>

              {/* Botones de Marca individuales con proporción horizontal adecuada */}
              {uniqueMarcas.map((m) => {
                const isSelected = selectedMarcas.some(
                  (sm) => sm.toLowerCase() === m.marca.toLowerCase()
                );
                return (
                  <button
                    key={m.marca}
                    type="button"
                    onClick={() => toggleMarca(m.marca)}
                    className={`shrink-0 h-10 px-3.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-sm font-semibold'
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <div className="h-4 w-4 shrink-0 flex items-center justify-center">
                      <BrandIcon
                        marca={m.marca}
                        className={`h-4 w-4 ${
                          isSelected
                            ? 'text-zinc-950'
                            : 'text-zinc-400 group-hover:text-zinc-100 transition-colors'
                        }`}
                      />
                    </div>
                    <BrandWordmark marca={m.marca} isSelected={isSelected} />
                    <span
                      className={`text-[10px] font-mono shrink-0 ${
                        isSelected ? 'text-zinc-600' : 'text-zinc-500'
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

        {/* 2. Barra de Talles y Filtros Rápidos */}
        <div className="pt-3 border-t border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Selector de Talles */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4 sm:mx-0 sm:px-0">
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
                  className={`h-8 sm:h-9 rounded-lg font-bold transition-all border shrink-0 flex items-center justify-center select-none cursor-pointer ${
                    isTodos
                      ? 'px-2.5 text-xs uppercase tracking-wide'
                      : 'w-8 sm:w-9 text-xs sm:text-sm font-mono'
                  } ${
                    isSelected
                      ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-sm'
                      : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  {talle}
                </button>
              );
            })}
          </div>

          {/* Controles de Rebajas, Ordenamiento y Limpieza */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto w-full md:w-auto">
            
            {/* Solo Rebajas */}
            <button
              type="button"
              onClick={() => onSoloOfertasChange(!soloOfertas)}
              className={`flex-1 md:flex-initial h-8 sm:h-9 px-3 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1.5 select-none cursor-pointer ${
                soloOfertas
                  ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                  : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:border-rose-500/40 hover:text-rose-400'
              }`}
            >
              <Flame className={`h-3.5 w-3.5 ${soloOfertas ? 'text-white fill-white' : 'text-rose-500'}`} />
              <span>Solo rebajas</span>
            </button>

            {/* Dropdown Ordenar por */}
            <div className="relative flex-1 md:flex-initial">
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="w-full md:w-auto h-8 sm:h-9 px-3 rounded-lg text-xs font-bold bg-zinc-900/80 text-zinc-200 border border-zinc-800 hover:border-zinc-700 focus:outline-none flex items-center justify-between md:justify-start gap-2 transition-all select-none cursor-pointer"
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
                  <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-zinc-900/95 border border-zinc-800 shadow-2xl backdrop-blur-md p-1.5 z-50">
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
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
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
                className="h-8 sm:h-9 px-2.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                title="Restablecer todos los filtros"
              >
                <X className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Limpiar</span>
              </button>
            )}

          </div>

        </div>

        {/* 3. Chips de Filtros Activos */}
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
  );
};
