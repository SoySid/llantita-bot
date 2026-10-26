'use client';

import React, { useState, useEffect } from 'react';
import { formatCurrency, parseTalles, safeExternalUrl } from '@/lib/utils';
import { ArrowUpRight, LineChart, Flame, Pause, Play } from 'lucide-react';

export interface DealProduct {
  id: string;
  nombre: string;
  marca: string;
  precio: number;
  precio_anterior?: number | null;
  descuento_pct: number;
  url: string;
  talles: string;
  imagen_url?: string | null;
  categoria?: string;
  ultima_actualizacion?: string;
  activo?: boolean;
}

interface FeaturedDealsProps {
  deals: DealProduct[];
  onSelectProduct: (product: DealProduct) => void;
}

const ROTATION_INTERVAL_MS = 6000;
const TICK_MS = 50;

export const FeaturedDeals: React.FC<FeaturedDealsProps> = ({ deals, onSelectProduct }) => {
  if (!deals || deals.length === 0) return null;

  // Tomamos las 4 mejores oportunidades
  const topDeals = deals.slice(0, 4);
  const total = topDeals.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Control de timer y rotación continua
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (TICK_MS / ROTATION_INTERVAL_MS) * 100;
        if (next >= 100) {
          setActiveIndex((current) => (current + 1) % total);
          return 0;
        }
        return next;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [total, isPaused]);

  const selectDeal = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
  };

  const currentDeal = topDeals[activeIndex] || topDeals[0];
  if (!currentDeal) return null;

  const currentTalles = parseTalles(currentDeal.talles);
  const currentAhorro = currentDeal.precio_anterior && currentDeal.precio_anterior > currentDeal.precio
    ? currentDeal.precio_anterior - currentDeal.precio
    : null;
  const currentUrl = safeExternalUrl(currentDeal.url);
  const currentBrand = currentDeal.marca
    ? currentDeal.marca.charAt(0).toUpperCase() + currentDeal.marca.slice(1).toLowerCase()
    : 'Calzado';

  // Las otras 3 zapatillas en cola de rotación
  const queuedIndices: number[] = [];
  for (let offset = 1; offset < total; offset++) {
    queuedIndices.push((activeIndex + offset) % total);
  }

  return (
    <section
      className="w-full py-4 sm:py-6 bg-canvas"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado compacto */}
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-infrared/20 flex items-center justify-center shrink-0">
              <Flame className="h-3.5 w-3.5 text-infrared" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight leading-none">
              Rebajas récord
            </h2>
          </div>

          {/* Segmentos de rotación interactivos */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Seleccionar oferta">
              {topDeals.map((deal, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={deal.id || idx}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Oferta ${idx + 1}: ${deal.nombre}`}
                    onClick={() => selectDeal(idx)}
                    className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-volt cursor-pointer"
                    style={{ width: isActive ? '2rem' : '0.75rem' }}
                  >
                    <span className="absolute inset-0 bg-surface rounded-full" />
                    {isActive ? (
                      <span
                        className="absolute inset-0 bg-infrared transition-[width] duration-75 ease-linear rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? 'Reanudar rotación' : 'Pausar rotación'}
              className="text-ink-muted hover:text-ink p-1 rounded transition-colors"
              title={isPaused ? 'Reanudar rotación automática' : 'Pausar rotación'}
            >
              {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Grilla balanceada: Altura acotada (320px) para entrar entera en pantalla */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:h-[320px]">
          
          {/* 1. PRODUCTO DESTACADO (7 de 12: Split horizontal compacto y equilibrado) */}
          <div className="lg:col-span-7 rounded-2xl bg-surface-card p-4 sm:p-5 flex flex-col justify-between group relative hover:bg-surface-elevated transition-colors duration-200 h-full">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 h-full">
              
              {/* Vitrina izquierda en Piedra Hueso con proporciones optimizadas para calzado */}
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full sm:w-[46%] h-48 sm:h-full shrink-0 rounded-xl bg-bone p-3 sm:p-4 overflow-hidden flex items-center justify-center block cursor-pointer active:scale-[0.99] transition-transform duration-150"
              >
                <span className="absolute top-2.5 left-2.5 z-10 inline-flex items-center px-2 py-0.5 rounded-md bg-infrared text-white font-display text-xs font-bold tracking-wide shadow-sm">
                  -{currentDeal.descuento_pct}% OFF
                </span>

                {currentDeal.imagen_url ? (
                  <img
                    key={currentDeal.id}
                    src={safeExternalUrl(currentDeal.imagen_url)}
                    alt={currentDeal.nombre}
                    loading="eager"
                    className="h-full w-full object-contain mix-blend-multiply scale-110 sm:scale-115 transition-transform duration-300 ease-out md:group-hover:scale-125 drop-shadow-sm"
                  />
                ) : (
                  <span className="text-xs font-display text-ink-muted">Sin foto</span>
                )}
              </a>

              {/* Información del producto a la derecha sin huecos vacíos */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-infrared uppercase tracking-wider">
                      {currentBrand}
                    </span>
                    <span className="text-[11px] text-ink-muted font-medium">
                      Piso histórico
                    </span>
                  </div>

                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-base sm:text-lg font-bold text-ink hover:text-infrared transition-colors duration-150 block line-clamp-2 leading-snug"
                    title={currentDeal.nombre}
                  >
                    {currentDeal.nombre}
                  </a>

                  {/* Precios */}
                  <div className="pt-2 flex items-baseline gap-2.5 flex-wrap">
                    <span className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight tabular-nums">
                      {formatCurrency(currentDeal.precio)}
                    </span>
                    {currentDeal.precio_anterior && (
                      <span className="text-sm text-ink-muted line-through tabular-nums">
                        {formatCurrency(currentDeal.precio_anterior)}
                      </span>
                    )}
                  </div>

                  {/* Resumen de ahorro destacado */}
                  {currentAhorro && (
                    <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-surface/80 border border-surface flex items-center justify-between text-xs">
                      <span className="text-ink-secondary font-medium">Ahorro récord:</span>
                      <span className="font-display font-bold text-volt tabular-nums">
                        {formatCurrency(currentAhorro)}
                      </span>
                    </div>
                  )}

                  {/* Talles compactos */}
                  {currentTalles.length > 0 && (
                    <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-semibold text-ink-muted">Talles:</span>
                      <div className="flex flex-wrap gap-1">
                        {currentTalles.slice(0, 6).map((t, idx) => (
                          <span
                            key={idx}
                            className="font-display text-xs font-bold tabular-nums px-1.5 py-0.5 rounded bg-canvas text-ink-secondary border border-surface/50"
                          >
                            {t}
                          </span>
                        ))}
                        {currentTalles.length > 6 && (
                          <span className="text-xs text-ink-muted self-center">
                            +{currentTalles.length - 6}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="pt-3 mt-2 flex items-center justify-between gap-3 border-t border-surface/60">
                  <button
                    type="button"
                    onClick={() => onSelectProduct(currentDeal)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-secondary hover:text-volt active:scale-[0.96] transition-colors duration-150 cursor-pointer"
                  >
                    <LineChart className="h-3.5 w-3.5" />
                    <span>Ver historial</span>
                  </button>

                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-infrared hover:bg-infrared-hover active:scale-[0.96] text-white font-display text-xs sm:text-sm font-bold px-3.5 py-2 transition-[background-color,transform] duration-150 ease-out shadow-sm shadow-infrared/20"
                  >
                    <span>Ir a la tienda</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* 2. COLA DE SIGUIENTES 3 ZAPATILLAS (5 de 12: Altura total exacta de 320px) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-2 lg:h-[320px]">
            {queuedIndices.map((dealIdx) => {
              const item = topDeals[dealIdx];
              if (!item) return null;

              const ahorro = item.precio_anterior && item.precio_anterior > item.precio
                ? item.precio_anterior - item.precio
                : null;
              const productUrl = safeExternalUrl(item.url);
              const brandLabel = item.marca
                ? item.marca.charAt(0).toUpperCase() + item.marca.slice(1).toLowerCase()
                : 'Calzado';

              return (
                <div
                  key={item.id}
                  onClick={() => selectDeal(dealIdx)}
                  className="flex-1 rounded-xl bg-surface-card p-2.5 sm:p-3 flex gap-3 items-center hover:bg-surface-elevated transition-all duration-150 group relative cursor-pointer border border-transparent hover:border-surface min-h-0"
                  title="Hacer clic para destacar en grande"
                >
                  {/* Mini vitrina cuadrada en Piedra Hueso */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-bone p-1.5 shrink-0 overflow-hidden flex items-center justify-center">
                    <span className="absolute top-1 right-1 z-10 inline-flex items-center px-1.5 py-0.2 rounded bg-infrared text-white font-display text-[10px] font-bold tabular-nums leading-tight">
                      -{item.descuento_pct}%
                    </span>

                    {item.imagen_url ? (
                      <img
                        src={safeExternalUrl(item.imagen_url)}
                        alt={item.nombre}
                        loading="lazy"
                        className="h-full w-full object-contain mix-blend-multiply transition-transform duration-150 ease-out group-hover:scale-[1.05]"
                      />
                    ) : (
                      <span className="text-[10px] text-ink-muted">Sin foto</span>
                    )}
                  </div>

                  {/* Datos del producto */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-display text-[11px] font-bold text-ink-muted uppercase tracking-wider truncate">
                          {brandLabel}
                        </span>
                        {ahorro && (
                          <span className="text-[11px] text-volt font-medium tabular-nums shrink-0">
                            -{formatCurrency(ahorro)}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-xs sm:text-[13px] font-bold text-ink truncate group-hover:text-infrared transition-colors duration-150 mt-0.5">
                        {item.nombre}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-sm font-bold text-ink tabular-nums">
                          {formatCurrency(item.precio)}
                        </span>
                        {item.precio_anterior && (
                          <span className="text-[11px] text-ink-muted line-through tabular-nums">
                            {formatCurrency(item.precio_anterior)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProduct(item);
                          }}
                          className="text-[11px] text-ink-secondary hover:text-volt active:scale-[0.96] transition-colors duration-150 flex items-center gap-0.5"
                        >
                          <LineChart className="h-3 w-3" />
                          <span>Historial</span>
                        </button>

                        <a
                          href={productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="font-display text-[11px] font-bold text-ink hover:text-infrared active:scale-[0.96] transition-colors duration-150 flex items-center gap-0.5"
                        >
                          <span>Ir</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
