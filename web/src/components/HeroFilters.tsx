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

// Ampliamos talles para incluir talles reales de calzado (35 al 46 con medios puntos comunes)
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
    <div className="w-full bg-canvas py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Selector de Marcas con scroll suave */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-ink-secondary">
                Marcas
              </span>
              {selectedMarcas.length > 0 ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[13px] font-bold tabular-nums bg-bone text-canvas">
                  {selectedMarcas.length} seleccionada{selectedMarcas.length > 1 ? 's' : ''}
                </span>
              ) : (
                <span className="text-[13px] text-ink-muted tabular-nums">
                  ({uniqueMarcas.length} marcas · {totalModelos} pares)
                </span>
              )}
            </div>

            {selectedMarcas.length > 0 && (
              <button
                type="button"
                onClick={() => onMarcasChange([])}
                className="flex items-center gap-1 text-[13px] font-medium text-ink-secondary hover:text-ink focus-visible:ring-2 focus-visible:ring-infrared active:scale-[0.96] transition-[color,transform] duration-150 ease-out cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
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
                aria-pressed={selectedMarcas.length === 0}
                className={`shrink-0 h-10 px-3.5 rounded-xl flex items-center gap-2 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-infrared transition-[background-color,color,transform] duration-150 ease-out cursor-pointer text-[13px] font-display font-bold ${
                  selectedMarcas.length === 0
                    ? 'bg-bone text-canvas'
                    : 'bg-surface-card text-ink-secondary hover:bg-surface-elevated hover:text-ink'
                }`}
              >
                <span>Todas</span>
                <span className={`text-[13px] tabular-nums px-1.5 py-0.5 rounded-md ${
                  selectedMarcas.length === 0 ? 'bg-canvas/15 text-canvas font-bold' : 'bg-canvas text-ink-muted'
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
                    className={`shrink-0 h-10 px-3 rounded-xl flex items-center gap-2 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-infrared transition-[background-color,color,transform] duration-150 ease-out cursor-pointer select-none text-[13px] ${
                      isSelected
                        ? 'bg-bone text-canvas font-bold'
                        : 'bg-surface-card text-ink-secondary hover:bg-surface-elevated hover:text-ink'
                    }`}
                  >
                    <div className="h-4 w-4 flex items-center justify-center">
                      <BrandIcon
                        marca={m.marca}
                        className={`h-3.5 w-3.5 ${isSelected ? 'text-canvas' : 'text-ink-muted'}`}
                      />
                    </div>
                    <BrandWordmark marca={m.marca} isSelected={isSelected} />
                    <span className={`text-[13px] tabular-nums px-1.5 py-0.5 rounded-md ${
                      isSelected ? 'bg-canvas/15 text-canvas font-bold' : 'bg-canvas text-ink-muted'
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
        <div className="bg-surface p-4 rounded-2xl flex flex-col gap-3.5">
          
          {/* Fila 1: Buscador de modelos + Controles de Orden y Rebajas */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Buscador: fuente 16px en móvil para evitar zoom forzado en iOS */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Buscar por modelo (ej: Air Max, Forum, Runner)..."
                className="w-full h-11 pl-10 pr-9 bg-surface-card rounded-xl text-base sm:text-sm text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-infrared transition-[box-shadow] duration-150"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange?.('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink focus-visible:ring-2 focus-visible:ring-infrared active:scale-[0.9] transition-transform duration-150 ease-out cursor-pointer"
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
                className={`h-11 px-3 sm:px-4 rounded-xl text-[13px] font-display font-bold active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-infrared transition-[background-color,color,transform] duration-150 ease-out cursor-pointer flex-1 sm:flex-none justify-center ${
                  soloOfertas
                    ? 'bg-infrared text-white'
                    : 'bg-surface-card text-ink-secondary hover:bg-surface-elevated hover:text-ink'
                }`}
              >
                Solo rebajas
              </button>

              <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                <select
                  value={selectedOrden}
                  onChange={(e) => onOrdenChange(e.target.value)}
                  className="w-full sm:w-auto h-11 bg-surface-card text-ink text-base sm:text-[13px] font-medium px-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-infrared cursor-pointer"
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
                  className="h-11 px-2.5 text-[13px] font-semibold text-ink-secondary hover:text-ink focus-visible:ring-2 focus-visible:ring-infrared active:scale-[0.95] transition-[color,transform] duration-150 ease-out flex items-center justify-center gap-1 cursor-pointer shrink-0"
                  title="Restablecer todos los filtros"
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">Limpiar</span>
                </button>
              )}
            </div>
          </div>

          {/* Fila 2: Selector de Talles táctiles (mínimo 40px para dedo en móvil) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <span className="font-display text-sm font-bold text-ink-secondary shrink-0 mr-1.5">
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
                  className={`h-10 min-w-[40px] px-2.5 rounded-lg active:scale-[0.94] focus-visible:ring-2 focus-visible:ring-infrared transition-[background-color,color,transform] duration-150 ease-out shrink-0 flex items-center justify-center select-none cursor-pointer ${
                    isTodos
                      ? 'px-3.5 font-display text-[13px] font-bold'
                      : 'font-display text-[13px] font-bold tabular-nums'
                  } ${
                    isSelected
                      ? 'bg-bone text-canvas font-bold'
                      : 'bg-surface-card text-ink-secondary hover:bg-surface-elevated hover:text-ink'
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
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[13px]">
            <span className="text-sm font-display font-bold text-ink-muted mr-1">
              Filtros:
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange?.('')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-card text-ink hover:bg-surface-elevated focus-visible:ring-2 focus-visible:ring-infrared active:scale-[0.96] transition-[background-color,transform] duration-150 ease-out text-[13px]"
              >
                <span>&ldquo;{searchQuery}&rdquo;</span>
                <X className="h-3.5 w-3.5 text-ink-muted" />
              </button>
            )}
            {selectedMarcas.map((marca) => (
              <button
                key={marca}
                type="button"
                onClick={() => toggleMarca(marca)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-card text-ink hover:bg-surface-elevated focus-visible:ring-2 focus-visible:ring-infrared active:scale-[0.96] transition-[background-color,transform] duration-150 ease-out font-display text-[13px]"
              >
                <span>{marca}</span>
                <X className="h-3.5 w-3.5 text-ink-muted" />
              </button>
            ))}
            {selectedTalles.map((talle) => (
              <button
                key={talle}
                type="button"
                onClick={() => toggleTalle(talle)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-card text-ink hover:bg-surface-elevated focus-visible:ring-2 focus-visible:ring-infrared active:scale-[0.96] transition-[background-color,transform] duration-150 ease-out font-display text-[13px] tabular-nums"
              >
                <span>Talle {talle}</span>
                <X className="h-3.5 w-3.5 text-ink-muted" />
              </button>
            ))}
            {soloOfertas && (
              <button
                type="button"
                onClick={() => onSoloOfertasChange(false)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-infrared text-white hover:bg-infrared-hover focus-visible:ring-2 focus-visible:ring-volt active:scale-[0.96] transition-[background-color,transform] duration-150 ease-out font-display font-bold text-[13px]"
              >
                <span>Solo rebajas</span>
                <X className="h-3.5 w-3.5 text-white" />
              </button>
            )}
            <button
              type="button"
              onClick={onReset}
              className="text-[13px] font-medium text-ink-secondary hover:text-ink focus-visible:ring-2 focus-visible:ring-infrared ml-1 underline underline-offset-4 active:scale-[0.96] transition-[color,transform] duration-150 ease-out cursor-pointer"
            >
              Borrar todos
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
