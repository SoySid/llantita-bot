'use client';

import React, { useRef, useMemo } from 'react';
import {
  Percent,
  TrendingDown,
  TrendingUp,
  Clock,
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

  const SORT_OPTIONS = [
    { id: 'descuento', label: '% Rebaja', icon: Percent },
    { id: 'precio_asc', label: '$ Menor', icon: TrendingDown },
    { id: 'precio_desc', label: '$ Mayor', icon: TrendingUp },
    { id: 'recientes', label: 'Novedades', icon: Clock },
  ];

  return (
    <div className="w-full bg-[#09090b] border-b border-zinc-800 py-4 sm:py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Selector de Marcas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold uppercase tracking-wider text-zinc-300">
                Marcas
              </span>
              {selectedMarcas.length > 0 ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-white text-zinc-950">
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
                className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
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
                className={`shrink-0 h-10 px-3.5 rounded-lg border flex items-center gap-2 transition-colors cursor-pointer text-xs font-semibold ${
                  selectedMarcas.length === 0
                    ? 'bg-white text-zinc-950 border-white font-bold'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <span>TODAS</span>
                <span className={`text-[10px] font-mono px-1 rounded ${
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
                    className={`shrink-0 h-10 px-3 rounded-lg border flex items-center gap-2 transition-colors cursor-pointer select-none text-xs ${
                      isSelected
                        ? 'bg-white text-zinc-950 border-white font-bold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    <div className="h-4 w-4 flex items-center justify-center">
                      <BrandIcon
                        marca={m.marca}
                        className={`h-3.5 w-3.5 ${isSelected ? 'text-zinc-950' : 'text-zinc-400'}`}
                      />
                    </div>
                    <BrandWordmark marca={m.marca} isSelected={isSelected} />
                    <span className={`text-[10px] font-mono px-1 rounded ${
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

        {/* Barra unificada de controles: Buscador, Talles, Ofertas y Orden */}
        <div className="border border-zinc-800 bg-zinc-900/40 p-3 rounded-xl flex flex-col gap-3">
          
          {/* Fila superior: Buscador + Toggle Ofertas */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Buscador de modelos */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Buscar modelo (ej: Air Max, Forum, Runner, Grand Court)..."
                className="w-full h-9 pl-9 pr-8 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange?.('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Toggle de solo ofertas */}
            <button
              type="button"
              onClick={() => onSoloOfertasChange(!soloOfertas)}
              className={`shrink-0 h-9 px-3.5 rounded-lg border flex items-center gap-2 transition-colors cursor-pointer text-xs font-semibold ${
                soloOfertas
                  ? 'bg-rose-600 text-white border-rose-500 font-bold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <span className="font-mono text-[11px] uppercase tracking-wide">Solo rebajas</span>
              <span className={`inline-block h-2 w-2 rounded-full ${soloOfertas ? 'bg-white' : 'bg-zinc-600'}`} />
            </button>
          </div>

          {/* Fila inferior: Talles + Orden */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-zinc-800/60">
            
            {/* Selector de Talles */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 shrink-0 mr-1">
                Talle:
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
                    className={`h-8 rounded-md font-semibold transition-colors border shrink-0 flex items-center justify-center select-none cursor-pointer ${
                      isTodos
                        ? 'px-2.5 text-xs uppercase'
                        : 'w-8 text-xs font-mono'
                    } ${
                      isSelected
                        ? 'bg-white text-zinc-950 border-white font-bold'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    {talle}
                  </button>
                );
              })}
            </div>

            {/* Ordenamiento y Reset */}
            <div className="flex items-center gap-2 shrink-0 self-start lg:self-auto overflow-x-auto no-scrollbar">
              <div className="flex items-center p-0.5 rounded-lg bg-zinc-950 border border-zinc-800 gap-0.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 px-2 hidden sm:inline">
                  Orden:
                </span>
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = selectedOrden === opt.id;
                  const OptIcon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onOrdenChange(opt.id)}
                      className={`h-7 px-2.5 rounded-md text-[11px] font-mono font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-100 text-zinc-950 font-bold'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <OptIcon className="h-3 w-3" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onReset}
                  className="h-8 px-2.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  title="Restablecer todos los filtros"
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Limpiar</span>
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Filtros Activos */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mr-1">
              Filtros:
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange?.('')}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 hover:bg-zinc-700 transition-colors text-[11px]"
              >
                <span>&ldquo;{searchQuery}&rdquo;</span>
                <X className="h-2.5 w-2.5 text-zinc-400" />
              </button>
            )}
            {selectedMarcas.map((marca) => (
              <button
                key={marca}
                type="button"
                onClick={() => toggleMarca(marca)}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 hover:bg-zinc-700 transition-colors text-[11px]"
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
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 hover:bg-zinc-700 transition-colors text-[11px]"
              >
                <span>Talle {talle}</span>
                <X className="h-2.5 w-2.5 text-zinc-400" />
              </button>
            ))}
            {soloOfertas && (
              <button
                type="button"
                onClick={() => onSoloOfertasChange(false)}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-200 hover:bg-rose-900 transition-colors text-[11px]"
              >
                <span>Solo rebajas</span>
                <X className="h-2.5 w-2.5 text-rose-300" />
              </button>
            )}
            <button
              type="button"
              onClick={onReset}
              className="text-[11px] text-zinc-400 hover:text-white ml-1 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Borrar todos
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

