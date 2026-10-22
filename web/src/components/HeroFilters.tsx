'use client';

import React, { useRef, useMemo } from 'react';
import {
  X,
  RotateCcw,
  Search,
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const handleWheelScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0 && !e.shiftKey && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="w-full bg-[#09090b] py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Selector de Marcas */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-300">
                Marcas
              </span>
              {selectedMarcas.length > 0 ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold tabular-nums bg-white text-zinc-950">
                  {selectedMarcas.length} seleccionada{selectedMarcas.length > 1 ? 's' : ''}
                </span>
              ) : (
                <span className="text-xs text-zinc-400 tabular-nums">
                  ({uniqueMarcas.length} marcas · {totalModelos} pares)
                </span>
              )}
            </div>

            {selectedMarcas.length > 0 && (
              <button
                type="button"
                onClick={() => onMarcasChange([])}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white active:scale-[0.96] transition-[color,transform] duration-150 ease-out cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Restablecer marcas</span>
              </button>
            )}
          </div>

          <div className="relative">
            <div
              ref={scrollContainerRef}
              onWheel={handleWheelScroll}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 select-none"
            >
              <button
                type="button"
                onClick={() => onMarcasChange([])}
                className={`shrink-0 h-10 px-3.5 rounded-xl flex items-center gap-2 active:scale-[0.96] transition-[background-color,color,transform] duration-150 ease-out cursor-pointer text-xs font-semibold ${
                  selectedMarcas.length === 0
                    ? 'bg-white text-zinc-950 font-bold'
                    : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <span>TODAS</span>
                <span className={`text-xs tabular-nums px-1.5 py-0.5 rounded-md ${
                  selectedMarcas.length === 0 ? 'bg-zinc-200 text-zinc-900' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {totalModelos}
                </span>
              </button>

              {uniqueMarcas.map((m) => {
                const isSelected = selectedMarcas.some(
                  (sm) => sm.toLowerCase() === m.marca.toLowerCase()
                );
                return (
                  <button
                    key={m.marca}
                    type="button"
                    onClick={() => toggleMarca(m.marca)}
                    className={`shrink-0 h-10 px-3 rounded-xl flex items-center gap-2 active:scale-[0.96] transition-[background-color,color,transform] duration-150 ease-out cursor-pointer select-none text-xs ${
                      isSelected
                        ? 'bg-white text-zinc-950 font-bold'
                        : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <div className="h-4 w-4 flex items-center justify-center">
                      <BrandIcon
                        marca={m.marca}
                        className={`h-3.5 w-3.5 ${isSelected ? 'text-zinc-950' : 'text-zinc-400'}`}
                      />
                    </div>
                    <BrandWordmark marca={m.marca} isSelected={isSelected} />
                    <span className={`text-xs tabular-nums px-1.5 py-0.5 rounded-md ${
                      isSelected ? 'bg-zinc-200 text-zinc-900 font-bold' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {m.cantidad}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Barra de controles: Buscador, Talles, Rebajas y Ordenamiento */}
        <div className="bg-zinc-900/50 p-3.5 rounded-2xl flex flex-col gap-3">
          
          {/* Fila 1: Buscador de modelos + Controles de Orden y Rebajas */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Buscador */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Buscar por modelo o estilo (ej: Air Max, Forum, Runner)..."
                className="w-full h-10 pl-10 pr-9 bg-zinc-900 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-[box-shadow] duration-150"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange?.('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white active:scale-[0.9] transition-transform duration-150 ease-out cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Controles de orden y rebajas */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onSoloOfertasChange(!soloOfertas)}
                className={`h-10 px-4 rounded-xl text-xs font-semibold active:scale-[0.96] transition-[background-color,color,transform] duration-150 ease-out cursor-pointer shrink-0 ${
                  soloOfertas
                    ? 'bg-white text-zinc-950 font-bold'
                    : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                Solo rebajas
              </button>

              <div className="flex items-center gap-1.5 shrink-0">
                <select
                  value={selectedOrden}
                  onChange={(e) => onOrdenChange(e.target.value)}
                  className="h-10 bg-zinc-900 text-zinc-200 text-xs px-3 rounded-xl focus:outline-none cursor-pointer"
                  aria-label="Ordenar productos"
                >
                  <option value="descuento">Mayor descuento</option>
                  <option value="precio_asc">Menor precio</option>
                  <option value="precio_desc">Mayor precio</option>
                  <option value="recientes">Novedades</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onReset}
                  className="h-10 px-2.5 text-xs font-semibold text-zinc-400 hover:text-white active:scale-[0.95] transition-[color,transform] duration-150 ease-out flex items-center gap-1 cursor-pointer shrink-0"
                  title="Restablecer todos los filtros"
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">Limpiar</span>
                </button>
              )}
            </div>
          </div>

          {/* Fila 2: Selector de Talles */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2">
            <span className="text-xs text-zinc-400 shrink-0 mr-1.5">
              Talles:
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
                  className={`h-8 rounded-lg font-semibold active:scale-[0.94] transition-[background-color,color,transform] duration-150 ease-out shrink-0 flex items-center justify-center select-none cursor-pointer ${
                    isTodos
                      ? 'px-3 text-xs'
                      : 'w-8 text-xs tabular-nums'
                  } ${
                    isSelected
                      ? 'bg-white text-zinc-950 font-bold'
                      : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  {talle}
                </button>
              );
            })}
          </div>

        </div>

        {/* Filtros Activos */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-xs font-bold text-zinc-400 mr-1">
              Filtros:
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange?.('')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 active:scale-[0.96] transition-[background-color,transform] duration-150 ease-out text-xs"
              >
                <span>&ldquo;{searchQuery}&rdquo;</span>
                <X className="h-3 w-3 text-zinc-400" />
              </button>
            )}
            {selectedMarcas.map((marca) => (
              <button
                key={marca}
                type="button"
                onClick={() => toggleMarca(marca)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 active:scale-[0.96] transition-[background-color,transform] duration-150 ease-out text-xs"
              >
                <span>{marca}</span>
                <X className="h-3 w-3 text-zinc-400" />
              </button>
            ))}
            {selectedTalles.map((talle) => (
              <button
                key={talle}
                type="button"
                onClick={() => toggleTalle(talle)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 active:scale-[0.96] transition-[background-color,transform] duration-150 ease-out text-xs tabular-nums"
              >
                <span>Talle {talle}</span>
                <X className="h-3 w-3 text-zinc-400" />
              </button>
            ))}
            {soloOfertas && (
              <button
                type="button"
                onClick={() => onSoloOfertasChange(false)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950 text-rose-200 hover:bg-rose-900 active:scale-[0.96] transition-[background-color,transform] duration-150 ease-out text-xs"
              >
                <span>Solo rebajas</span>
                <X className="h-3 w-3 text-rose-300" />
              </button>
            )}
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-zinc-400 hover:text-white ml-1 underline underline-offset-2 active:scale-[0.96] transition-[color,transform] duration-150 ease-out cursor-pointer"
            >
              Borrar todos
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
