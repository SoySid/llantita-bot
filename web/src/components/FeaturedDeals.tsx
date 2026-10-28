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

  const topDeals = deals.slice(0, 4);
  const total = topDeals.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

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
    ? currentDeal.marca.toUpperCase()
    : 'CALZADO';

  const queuedIndices: number[] = [];
  for (let offset = 1; offset < total; offset++) {
    queuedIndices.push((activeIndex + offset) % total);
  }

  return (
    <section
      className="w-full py-5 sm:py-7 bg-[#0d0b0a]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        
        {/* Encabezado Táctico Mech */}
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-[#2a1c12] border border-[#593924] flex items-center justify-center shrink-0">
              <Flame className="h-3.5 w-3.5 text-[#ff6a1a]" />
            </div>
            <h2 className="font-anton text-xl sm:text-2xl text-[#f2ede7] tracking-wider uppercase leading-none">
              Rebajas Récord
            </h2>
          </div>

          {/* Segmentos de rotación HUD */}
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
                    className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300 focus:outline-none cursor-pointer"
                    style={{ width: isActive ? '2rem' : '0.75rem' }}
                  >
                    <span className="absolute inset-0 bg-[#29221b] rounded-full" />
                    {isActive ? (
                      <span
                        className="absolute inset-0 bg-gradient-to-r from-[#ff7b29] to-[#ff5100] transition-[width] duration-75 ease-linear rounded-full"
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
              className="text-[#8c8275] hover:text-[#f2ede7] p-1 rounded transition-colors"
              title={isPaused ? 'Reanudar rotación automática' : 'Pausar rotación'}
            >
              {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Grilla balanceada Mech */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:h-[320px]">
          
          {/* 1. PRODUCTO DESTACADO (7 de 12) */}
          <div className="lg:col-span-7 rounded-lg bg-[#151210] border border-[#382f25] p-4 sm:p-5 flex flex-col justify-between group relative hover:border-[#ff6a1a] transition-all duration-200 h-full shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 h-full">
              
              {/* Vitrina izquierda */}
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full sm:w-[46%] h-48 sm:h-full shrink-0 rounded bg-[#1a1714] border border-[#30281f] p-3 sm:p-4 overflow-hidden flex items-center justify-center block cursor-pointer active:scale-[0.99] transition-transform duration-150"
              >
                <span className="absolute top-2 left-2 z-10 inline-flex items-center px-2 py-0.5 rounded bg-gradient-to-r from-[#ff7b29] to-[#ff5100] text-[#1c110a] font-barlow text-xs font-bold tracking-wider uppercase border border-[#ffa366] shadow-[0_0_10px_rgba(255,85,10,0.5)]">
                  -{currentDeal.descuento_pct}% OFF
                </span>

                {currentDeal.imagen_url ? (
                  <img
                    key={currentDeal.id}
                    src={safeExternalUrl(currentDeal.imagen_url)}
                    alt={currentDeal.nombre}
                    loading="eager"
                    className="h-full w-full object-contain scale-110 sm:scale-115 transition-transform duration-300 ease-out md:group-hover:scale-125 drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]"
                  />
                ) : (
                  <span className="text-xs font-mono text-[#8a8074]">Sin foto</span>
                )}
              </a>

              {/* Información del producto a la derecha */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-barlow text-xs font-bold text-[#ff6a1a] uppercase tracking-wider">
                      {currentBrand}
                    </span>
                    <span className="text-[10px] font-mono text-[#8c8275]">
                      PISO HISTÓRICO
                    </span>
                  </div>

                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-anton text-lg sm:text-xl text-[#f2ede7] hover:text-[#ff6a1a] transition-colors duration-150 block line-clamp-2 leading-snug tracking-wide"
                    title={currentDeal.nombre}
                  >
                    {currentDeal.nombre}
                  </a>

                  {/* Precios */}
                  <div className="pt-2 flex items-baseline gap-2.5 flex-wrap">
                    <span className="font-anton text-2xl sm:text-3xl text-[#f2ede7] tracking-wider tabular-nums">
                      {formatCurrency(currentDeal.precio)}
                    </span>
                    {currentDeal.precio_anterior && (
                      <span className="text-sm font-mono text-[#8c8275] line-through tabular-nums">
                        {formatCurrency(currentDeal.precio_anterior)}
                      </span>
                    )}
                  </div>

                  {/* Resumen de ahorro destacado */}
                  {currentAhorro && (
                    <div className="mt-2 px-2.5 py-1.5 rounded bg-[#1e1813] border border-[#453123] flex items-center justify-between text-xs">
                      <span className="text-[#a39b91] font-barlow font-bold uppercase tracking-wider">Ahorro récord:</span>
                      <span className="font-mono font-bold text-[#ff944d] tabular-nums">
                        {formatCurrency(currentAhorro)}
                      </span>
                    </div>
                  )}

                  {/* Talles compactos */}
                  {currentTalles.length > 0 && (
                    <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-barlow font-bold text-[#8c8275] uppercase tracking-wider">Talles:</span>
                      <div className="flex flex-wrap gap-1">
                        {currentTalles.slice(0, 6).map((t, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-[11px] font-bold tabular-nums px-1.5 py-0.2 rounded bg-[#0d0b0a] text-[#c7beaf] border border-[#332b22]"
                          >
                            {t}
                          </span>
                        ))}
                        {currentTalles.length > 6 && (
                          <span className="text-xs font-mono text-[#8a8074] self-center">
                            +{currentTalles.length - 6}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="pt-3 mt-2 flex items-center justify-between gap-3 border-t border-[#29221b]">
                  <button
                    type="button"
                    onClick={() => onSelectProduct(currentDeal)}
                    className="inline-flex items-center gap-1.5 text-xs font-barlow font-bold uppercase tracking-wider text-[#a39b91] hover:text-[#ff944d] active:scale-[0.96] transition-colors duration-150 cursor-pointer"
                  >
                    <LineChart className="h-3.5 w-3.5" />
                    <span>Ver historial</span>
                  </button>

                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded bg-gradient-to-r from-[#ff7b29] to-[#ff5100] border border-[#ffa366] text-[#1c110a] font-barlow text-xs sm:text-sm font-bold uppercase tracking-wider px-3.5 py-1.5 transition-all duration-150 active:scale-[0.96] shadow-[0_0_12px_rgba(255,85,10,0.5)]"
                  >
                    <span>Ir a la tienda</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* 2. COLA DE SIGUIENTES 3 ZAPATILLAS (5 de 12) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-2 lg:h-[320px]">
            {queuedIndices.map((dealIdx) => {
              const item = topDeals[dealIdx];
              if (!item) return null;

              const ahorro = item.precio_anterior && item.precio_anterior > item.precio
                ? item.precio_anterior - item.precio
                : null;
              const productUrl = safeExternalUrl(item.url);
              const brandLabel = item.marca
                ? item.marca.toUpperCase()
                : 'CALZADO';

              return (
                <div
                  key={item.id}
                  onClick={() => selectDeal(dealIdx)}
                  className="flex-1 rounded bg-[#151210] border border-[#2e271f] p-2 sm:p-2.5 flex gap-3 items-center hover:bg-[#1c1814] hover:border-[#ff6a1a] transition-all duration-150 group relative cursor-pointer min-h-0"
                  title="Hacer clic para destacar en grande"
                >
                  {/* Mini vitrina */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded bg-[#1a1714] border border-[#30281f] p-1.5 shrink-0 overflow-hidden flex items-center justify-center">
                    <span className="absolute top-1 right-1 z-10 inline-flex items-center px-1 rounded bg-[#ff5100] text-[#1c110a] font-barlow text-[10px] font-bold tabular-nums leading-tight">
                      -{item.descuento_pct}%
                    </span>

                    {item.imagen_url ? (
                      <img
                        src={safeExternalUrl(item.imagen_url)}
                        alt={item.nombre}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-150 ease-out group-hover:scale-[1.05]"
                      />
                    ) : (
                      <span className="text-[10px] font-mono text-[#8a8074]">Sin foto</span>
                    )}
                  </div>

                  {/* Datos del producto */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-barlow text-[11px] font-bold text-[#ff6a1a] uppercase tracking-wider truncate">
                          {brandLabel}
                        </span>
                        {ahorro && (
                          <span className="text-[11px] font-mono text-[#ff944d] font-bold tabular-nums shrink-0">
                            -{formatCurrency(ahorro)}
                          </span>
                        )}
                      </div>

                      <h3 className="font-anton text-xs sm:text-sm text-[#f2ede7] tracking-wide truncate group-hover:text-[#ff6a1a] transition-colors duration-150 mt-0.5">
                        {item.nombre}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-anton text-sm sm:text-base text-[#f2ede7] tabular-nums tracking-wide">
                          {formatCurrency(item.precio)}
                        </span>
                        {item.precio_anterior && (
                          <span className="text-[11px] font-mono text-[#8c8275] line-through tabular-nums">
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
                          className="text-[11px] font-barlow font-bold uppercase tracking-wider text-[#a39b91] hover:text-[#ff944d] active:scale-[0.96] transition-colors flex items-center gap-0.5"
                        >
                          <LineChart className="h-3 w-3" />
                          <span>Historial</span>
                        </button>

                        <a
                          href={productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="font-barlow text-[11px] font-bold uppercase tracking-wider text-[#f2ede7] hover:text-[#ff6a1a] active:scale-[0.96] transition-colors flex items-center gap-0.5"
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
