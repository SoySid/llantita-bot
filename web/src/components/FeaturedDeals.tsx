'use client';

import React, { useState, useEffect, useRef } from 'react';
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
      className="w-full py-8 sm:py-10 bg-canvas"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado sin la palabra "podio" y con controles sutiles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-md bg-infrared/20 flex items-center justify-center shrink-0">
              <Flame className="h-4 w-4 text-infrared" />
            </div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-[-0.03em] leading-tight">
                Rebajas récord
              </h2>
            </div>
          </div>

          {/* Segmentos de rotación interactivos */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
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
                    className="relative h-2 rounded-full overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-volt cursor-pointer"
                    style={{ width: isActive ? '2.5rem' : '1rem' }}
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
              className="text-ink-muted hover:text-ink text-xs p-1 rounded-md transition-colors"
              title={isPaused ? 'Reanudar rotación automática' : 'Pausar rotación'}
            >
              {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Grilla balanceada: Hero a la izquierda y Cola de 3 a la derecha con alturas 100% niveladas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:items-stretch">
          
          {/* 1. PRODUCTO DESTACADO ACTUAL (7 de 12, h-full nivelado) */}
          <div className="lg:col-span-7 rounded-2xl bg-surface-card p-5 sm:p-6 flex flex-col justify-between group relative hover:bg-surface-elevated transition-colors duration-200 h-full">
            <div>
              {/* Badge superior con porcentaje de descuento y ahorro */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-infrared text-white font-display text-[13px] font-bold tracking-wide">
                    -{currentDeal.descuento_pct}% OFF
                  </span>
                  {currentAhorro && (
                    <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-md bg-surface text-volt text-[13px] font-semibold tabular-nums">
                      Ahorrás {formatCurrency(currentAhorro)}
                    </span>
                  )}
                </div>
                <span className="text-[13px] text-ink-muted">Piso histórico comprobado</span>
              </div>

              {/* Vitrina Hero en Piedra Hueso */}
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-xl bg-bone p-6 mb-5 overflow-hidden flex items-center justify-center block cursor-pointer active:scale-[0.99] transition-transform duration-150"
              >
                {currentDeal.imagen_url ? (
                  <img
                    key={currentDeal.id}
                    src={safeExternalUrl(currentDeal.imagen_url)}
                    alt={currentDeal.nombre}
                    loading="eager"
                    className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 ease-out md:group-hover:scale-[1.05]"
                  />
                ) : (
                  <span className="text-sm font-display text-ink-muted">Sin foto</span>
                )}
              </a>

              {/* Marca y Nombre Hero */}
              <div className="space-y-1.5">
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-xl sm:text-2xl font-bold text-ink hover:text-infrared transition-colors duration-150 block leading-snug"
                >
                  <span className="text-infrared font-bold mr-2">{currentBrand}</span>
                  {currentDeal.nombre}
                </a>

                {/* Precios Hero */}
                <div className="pt-2 flex items-baseline gap-3 flex-wrap">
                  <span className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight tabular-nums">
                    {formatCurrency(currentDeal.precio)}
                  </span>
                  {currentDeal.precio_anterior && (
                    <span className="text-base text-ink-muted line-through tabular-nums">
                      {formatCurrency(currentDeal.precio_anterior)}
                    </span>
                  )}
                  {currentAhorro && (
                    <span className="sm:hidden inline-flex px-2 py-0.5 rounded bg-surface text-volt text-[13px] font-semibold tabular-nums">
                      Ahorrás {formatCurrency(currentAhorro)}
                    </span>
                  )}
                </div>
                {currentAhorro && (
                  <p className="text-[13px] text-volt font-medium tabular-nums">
                    Ahorro de {formatCurrency(currentAhorro)} respecto al precio de lista
                  </p>
                )}
              </div>

              {/* Talles Hero */}
              {currentTalles.length > 0 && (
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <span className="text-[13px] font-semibold text-ink-muted">Talles disponibles:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentTalles.map((t, idx) => (
                      <span
                        key={idx}
                        className="font-display text-[13px] font-bold tabular-nums px-2 py-0.5 rounded bg-canvas text-ink-secondary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Acciones Hero */}
            <div className="pt-6 mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onSelectProduct(currentDeal)}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-secondary hover:text-volt active:scale-[0.96] transition-colors duration-150 cursor-pointer"
              >
                <LineChart className="h-4 w-4" />
                <span>Ver historial de precios</span>
              </button>

              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-infrared hover:bg-infrared-hover active:scale-[0.96] text-white font-display text-sm font-bold px-4 py-2.5 transition-[background-color,transform] duration-150 ease-out"
              >
                <span>Aprovechar en Sporting</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* 2. COLA DE SIGUIENTES 3 ZAPATILLAS (5 de 12, h-full nivelado matemáticamente) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3 sm:gap-3.5 h-full">
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
                  className="flex-1 rounded-2xl bg-surface-card p-3.5 sm:p-4 flex gap-3.5 hover:bg-surface-elevated transition-all duration-200 group relative cursor-pointer border border-transparent hover:border-surface"
                  title="Hacer clic para destacar en grande"
                >
                  {/* Mini vitrina cuadrada en Piedra Hueso */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-bone p-2.5 shrink-0 overflow-hidden flex items-center justify-center">
                    <span className="absolute top-1.5 right-1.5 z-10 inline-flex items-center px-1.5 py-0.5 rounded bg-infrared text-white font-display text-[12px] font-bold tabular-nums">
                      -{item.descuento_pct}%
                    </span>

                    {item.imagen_url ? (
                      <img
                        src={safeExternalUrl(item.imagen_url)}
                        alt={item.nombre}
                        loading="lazy"
                        className="h-full w-full object-contain mix-blend-multiply transition-transform duration-200 ease-out group-hover:scale-[1.06]"
                      />
                    ) : (
                      <span className="text-[13px] text-ink-muted">Sin foto</span>
                    )}
                  </div>

                  {/* Datos del producto */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-display text-[12px] font-bold text-ink-muted uppercase tracking-wider">
                          {brandLabel}
                        </span>
                        {ahorro && (
                          <span className="text-[12px] text-volt font-medium tabular-nums">
                            -{formatCurrency(ahorro)}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-sm font-bold text-ink line-clamp-2 leading-tight group-hover:text-infrared transition-colors duration-150 mt-0.5">
                        {item.nombre}
                      </h3>
                    </div>

                    <div>
                      {/* Precios */}
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-display text-base font-bold text-ink tabular-nums">
                          {formatCurrency(item.precio)}
                        </span>
                        {item.precio_anterior && (
                          <span className="text-[13px] text-ink-muted line-through tabular-nums">
                            {formatCurrency(item.precio_anterior)}
                          </span>
                        )}
                      </div>

                      {/* Botones de acción compactos */}
                      <div className="pt-2 flex items-center justify-between text-[13px]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProduct(item);
                          }}
                          className="text-[12px] text-ink-secondary hover:text-volt active:scale-[0.96] transition-colors duration-150 cursor-pointer flex items-center gap-1"
                        >
                          <LineChart className="h-3.5 w-3.5" />
                          <span>Historial</span>
                        </button>

                        <a
                          href={productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="font-display text-[12px] font-bold text-ink hover:text-infrared active:scale-[0.96] transition-colors duration-150 flex items-center gap-1"
                        >
                          <span>Sporting</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
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
