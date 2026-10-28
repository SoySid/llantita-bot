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

const TALLES_COMUNES = ['Todos', '35', '36', '37', '38', '39', '40', '41', '41.5', '42', '42.5', '43', '44', '45', '46'];

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
    <div className="w-full py-2 sm:py-4 mb-4">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 space-y-4">
        
        {/* Selector de Marcas con scroll suave */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="font-barlow font-bold text-sm sm:text-base text-[#d1c8bd] uppercase tracking-wider">
                Marcas
              </span>
              {selectedMarcas.length > 0 ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#ff6a1a] text-black">
                  {selectedMarcas.length} ACTIVA{selectedMarcas.length > 1 ? 'S' : ''}
                </span>
              ) : (
                <span className="text-xs font-mono text-[#8a8074]">
                  ({uniqueMarcas.length} MARCAS · {totalModelos} MODELOS)
                </span>
              )}
            </div>

            {selectedMarcas.length > 0 && (
              <button
                type="button"
                onClick={() => onMarcasChange([])}
                className="flex items-center gap-1 text-xs font-mono text-[#ff8c42] hover:text-[#ffb380] active:scale-[0.96] transition-all cursor-pointer uppercase"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Restablecer</span>
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
                aria-pressed={selectedMarcas.length === 0}
                className={`shrink-0 h-9 px-3 rounded flex items-center gap-2 active:scale-[0.96] focus-visible:ring-1 focus-visible:ring-[#ff6a1a] transition-all duration-150 cursor-pointer text-xs font-barlow font-bold uppercase tracking-wider border ${
                  selectedMarcas.length === 0
                    ? 'bg-gradient-to-r from-[#ff7b29] to-[#ff5100] text-[#1c110a] border-[#ffa366] shadow-[0_0_12px_rgba(255,85,10,0.5)]'
                    : 'bg-[#181512] text-[#a39b91] hover:bg-[#221d18] hover:text-[#f2ede7] border-[#383027]'
                }`}
              >
                <span>Todas</span>
                <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded ${
                  selectedMarcas.length === 0 ? 'bg-black/20 text-black font-bold' : 'bg-[#110f0e] text-[#80766a]'
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
                    aria-pressed={isSelected}
                    className={`shrink-0 h-9 px-3 rounded flex items-center gap-2 active:scale-[0.96] focus-visible:ring-1 focus-visible:ring-[#ff6a1a] transition-all duration-150 cursor-pointer select-none text-xs font-barlow font-bold uppercase tracking-wider border ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#ff7b29] to-[#ff5100] text-[#1c110a] border-[#ffa366] shadow-[0_0_12px_rgba(255,85,10,0.5)]'
                        : 'bg-[#181512] text-[#a39b91] hover:bg-[#221d18] hover:text-[#f2ede7] border-[#383027]'
                    }`}
                  >
                    <div className="h-3.5 w-3.5 flex items-center justify-center">
                      <BrandIcon
                        marca={m.marca}
                        className={`h-3 w-3 ${isSelected ? 'text-black' : 'text-[#80766a]'}`}
                      />
                    </div>
                    <BrandWordmark marca={m.marca} isSelected={isSelected} />
                    <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded ${
                      isSelected ? 'bg-black/20 text-black font-bold' : 'bg-[#110f0e] text-[#80766a]'
                    }`}>
                      {m.cantidad}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Consola Táctica de Controles */}
        <div className="bg-[#14110f] border border-[#332b22] p-3.5 sm:p-4 rounded-lg flex flex-col gap-3.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04),0_6px_20px_rgba(0,0,0,0.7)]">
          
          {/* Fila 1: Buscador + Filtros */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a8074] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Buscar modelo (ej: Air Max, Forum, Runner)..."
                className="w-full h-10 pl-10 pr-9 bg-[#1a1613] border border-[#383027] rounded text-sm text-[#f2ede7] placeholder-[#736a5e] focus:outline-none focus:border-[#ff6a1a] focus:ring-1 focus:ring-[#ff6a1a] font-mono transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange?.('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8074] hover:text-[#f2ede7] active:scale-[0.9] transition-transform cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Controles de orden y rebajas */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onSoloOfertasChange(!soloOfertas)}
                aria-pressed={soloOfertas}
                className={`h-10 px-3.5 rounded text-xs font-barlow font-bold uppercase tracking-wider active:scale-[0.96] transition-all cursor-pointer flex-1 sm:flex-none justify-center border ${
                  soloOfertas
                    ? 'bg-gradient-to-r from-[#ff7b29] to-[#ff5100] text-[#1c110a] border-[#ffa366] shadow-[0_0_12px_rgba(255,85,10,0.5)]'
                    : 'bg-[#1a1613] text-[#a39b91] hover:bg-[#221d18] hover:text-[#f2ede7] border-[#383027]'
                }`}
              >
                Solo rebajas
              </button>

              <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                <select
                  value={selectedOrden}
                  onChange={(e) => onOrdenChange(e.target.value)}
                  className="w-full sm:w-auto h-10 bg-[#1a1613] border border-[#383027] text-[#f2ede7] text-xs font-barlow font-bold uppercase tracking-wider px-3 rounded focus:outline-none focus:border-[#ff6a1a] focus:ring-1 focus:ring-[#ff6a1a] cursor-pointer"
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
                  className="h-10 px-2.5 text-xs font-mono text-[#ff8c42] hover:text-[#ffb380] active:scale-[0.95] transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 uppercase"
                  title="Restablecer todos los filtros"
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Limpiar</span>
                </button>
              )}
            </div>
          </div>

          {/* Fila 2: Selector de Talles */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <span className="font-barlow text-xs sm:text-sm font-bold text-[#8a8074] shrink-0 mr-1 uppercase tracking-wider">
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
                  aria-pressed={isSelected}
                  className={`h-8 sm:h-9 min-w-[36px] sm:min-w-[40px] px-2 rounded active:scale-[0.94] focus-visible:ring-1 focus-visible:ring-[#ff6a1a] transition-all duration-150 shrink-0 flex items-center justify-center select-none cursor-pointer border ${
                    isTodos
                      ? 'px-3 font-barlow text-xs font-bold uppercase tracking-wider'
                      : 'font-mono text-xs font-bold tabular-nums'
                  } ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#ff7b29] to-[#ff5100] text-[#1c110a] border-[#ffa366] shadow-[0_0_10px_rgba(255,85,10,0.45)]'
                      : 'bg-[#1a1613] text-[#a39b91] hover:bg-[#221d18] hover:text-[#f2ede7] border-[#383027]'
                  }`}
                >
                  {talle}
                </button>
              );
            })}
          </div>

        </div>

        {/* Filtros Activos Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-barlow font-bold text-[#8a8074] mr-1 uppercase tracking-wider">
              Filtros:
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange?.('')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1f1b16] border border-[#42362b] text-[#f2ede7] hover:border-[#ff6a1a] active:scale-[0.96] transition-all text-xs font-mono"
              >
                <span>&ldquo;{searchQuery}&rdquo;</span>
                <X className="h-3 w-3 text-[#a39b91]" />
              </button>
            )}
            {selectedMarcas.map((marca) => (
              <button
                key={marca}
                type="button"
                onClick={() => toggleMarca(marca)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1f1b16] border border-[#42362b] text-[#f2ede7] hover:border-[#ff6a1a] active:scale-[0.96] transition-all font-barlow font-bold text-xs uppercase tracking-wider"
              >
                <span>{marca}</span>
                <X className="h-3 w-3 text-[#a39b91]" />
              </button>
            ))}
            {selectedTalles.map((talle) => (
              <button
                key={talle}
                type="button"
                onClick={() => toggleTalle(talle)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1f1b16] border border-[#42362b] text-[#f2ede7] hover:border-[#ff6a1a] active:scale-[0.96] transition-all font-mono text-xs tabular-nums"
              >
                <span>Talle {talle}</span>
                <X className="h-3 w-3 text-[#a39b91]" />
              </button>
            ))}
            {soloOfertas && (
              <button
                type="button"
                onClick={() => onSoloOfertasChange(false)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#ff5100] text-black font-barlow font-bold text-xs uppercase tracking-wider active:scale-[0.96] transition-all"
              >
                <span>Solo rebajas</span>
                <X className="h-3 w-3 text-black" />
              </button>
            )}
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-mono text-[#ff8c42] hover:text-[#ffb380] ml-1 underline underline-offset-4 active:scale-[0.96] transition-all cursor-pointer uppercase"
            >
              Borrar todos
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
