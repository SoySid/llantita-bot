'use client';

import React, { useState, useMemo } from 'react';
import { formatCurrency } from '@/lib/utils';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

export interface PricePoint {
  id?: number;
  precio: number;
  fecha: string;
}

interface PriceChartProps {
  history: PricePoint[];
  currentPrice: number;
  lastUpdated?: string | null;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  history,
  currentPrice,
  lastUpdated,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Normalizar y ordenar la serie temporal completa
  const dataSeries = useMemo(() => {
    // Si no hay historial previo, crear punto con precio actual
    if (!history || history.length === 0) {
      return [
        {
          precio: currentPrice,
          fecha: lastUpdated || new Date().toISOString(),
        },
      ];
    }

    // Clonar y ordenar por fecha ascendente
    const sorted = [...history].sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );

    // Asegurar que el punto final represente el estado actual si la fecha difiere
    const ultimo = sorted[sorted.length - 1];
    const fechaUltimo = new Date(ultimo.fecha).getTime();
    const ahora = lastUpdated ? new Date(lastUpdated).getTime() : Date.now();

    // Si pasaron más de 12 horas desde el último cambio, agregamos punto al presente para ver la meseta
    if (ahora - fechaUltimo > 12 * 3600 * 1000) {
      sorted.push({
        precio: currentPrice,
        fecha: new Date(ahora).toISOString(),
      });
    }

    return sorted;
  }, [history, currentPrice, lastUpdated]);

  // Dimensiones del SVG
  const width = 520;
  const height = 180;
  const padLeft = 68;
  const padRight = 24;
  const padTop = 28;
  const padBottom = 32;

  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;

  const prices = dataSeries.map((d) => d.precio);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Escala Y con margen para no pegar al borde
  const priceMargin = maxPrice === minPrice ? maxPrice * 0.1 || 1000 : (maxPrice - minPrice) * 0.18;
  const minY = Math.max(0, minPrice - priceMargin);
  const maxY = maxPrice + priceMargin;
  const priceRange = maxY - minY || 1;

  // Escala X basada en tiempo
  const times = dataSeries.map((d) => new Date(d.fecha).getTime());
  let minTime = Math.min(...times);
  let maxTime = Math.max(...times);

  if (minTime === maxTime) {
    minTime -= 86400000; // 1 día antes si solo hay un punto
  }
  const timeSpan = maxTime - minTime || 1;

  // Mapeo a coordenadas SVG
  const points = useMemo(() => {
    return dataSeries.map((d) => {
      const t = new Date(d.fecha).getTime();
      const x = padLeft + ((t - minTime) / timeSpan) * chartWidth;
      const y = padTop + (1 - (d.precio - minY) / priceRange) * chartHeight;
      return { x, y, precio: d.precio, fecha: d.fecha };
    });
  }, [dataSeries, minTime, timeSpan, chartWidth, chartHeight, padLeft, padTop, minY, priceRange]);

  // Trazados SVG
  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    return points
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const bottomY = padTop + chartHeight;
    const firstX = points[0].x.toFixed(1);
    const lastX = points[points.length - 1].x.toFixed(1);
    return `${linePath} L ${lastX} ${bottomY.toFixed(1)} L ${firstX} ${bottomY.toFixed(1)} Z`;
  }, [linePath, points, padTop, chartHeight]);

  // Punto activo bajo hover (o el último si no hay hover)
  const activeIndex = hoverIndex !== null ? hoverIndex : points.length - 1;
  const activePoint = points[activeIndex];
  const prevPoint = activeIndex > 0 ? points[activeIndex - 1] : null;

  const diffFromPrev = prevPoint ? activePoint.precio - prevPoint.precio : null;
  const pctFromPrev = prevPoint && prevPoint.precio > 0
    ? ((diffFromPrev || 0) / prevPoint.precio) * 100
    : null;

  // Formato de fechas
  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  };

  const formatTooltipDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Guías horizontales de precios (mínimo, medio, máximo)
  const gridLines = useMemo(() => {
    return [
      { valor: maxY - priceMargin, y: padTop + (1 - (maxY - priceMargin - minY) / priceRange) * chartHeight },
      { valor: (minPrice + maxPrice) / 2, y: padTop + (1 - ((minPrice + maxPrice) / 2 - minY) / priceRange) * chartHeight },
      { valor: minPrice, y: padTop + (1 - (minPrice - minY) / priceRange) * chartHeight },
    ];
  }, [minPrice, maxPrice, minY, maxY, priceMargin, priceRange, padTop, chartHeight]);

  if (dataSeries.length <= 1) {
    return (
      <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-4 mb-4 text-center">
        <div className="flex items-center justify-center gap-2 text-zinc-400 text-xs mb-1">
          <Minus className="h-4 w-4 text-emerald-400" />
          <span>Sin variaciones de precio detectadas aún</span>
        </div>
        <p className="text-sm font-semibold text-zinc-300">
          Precio único registrado: <span className="text-emerald-400 font-bold">{formatCurrency(currentPrice)}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3 mb-4 select-none">
      {/* Barra superior interactiva del gráfico */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-300 font-mono">
            {formatTooltipDate(activePoint.fecha)}
          </span>
          {diffFromPrev !== null && diffFromPrev !== 0 && (
            <span
              className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded ${
                diffFromPrev < 0
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-rose-500/15 text-rose-400'
              }`}
            >
              {diffFromPrev < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
              {pctFromPrev !== null ? `${pctFromPrev.toFixed(1)}%` : ''}
            </span>
          )}
        </div>
        <div className="font-mono font-black text-emerald-400 text-sm">
          {formatCurrency(activePoint.precio)}
        </div>
      </div>

      {/* SVG del Gráfico */}
      <div className="relative w-full aspect-[520/180] mt-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Líneas de referencia horizontales */}
          {gridLines.map((gl, i) => (
            <g key={i}>
              <line
                x1={padLeft}
                y1={gl.y}
                x2={padLeft + chartWidth}
                y2={gl.y}
                stroke="#27272a"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padLeft - 6}
                y={gl.y + 3.5}
                textAnchor="end"
                className="fill-zinc-500 text-[10px] font-mono"
              >
                ${Math.round(gl.valor / 1000)}k
              </text>
            </g>
          ))}

          {/* Relleno con gradiente bajo la curva */}
          <path d={areaPath} fill="url(#priceGradient)" />

          {/* Línea principal de precio */}
          <path
            d={linePath}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Línea vertical indicadora bajo el cursor */}
          {activePoint && (
            <line
              x1={activePoint.x}
              y1={padTop}
              x2={activePoint.x}
              y2={padTop + chartHeight}
              stroke="#10b981"
              strokeDasharray="3 3"
              strokeOpacity="0.6"
              strokeWidth="1.5"
            />
          )}

          {/* Puntos sobre la línea */}
          {points.map((p, idx) => {
            const isActive = idx === activeIndex;
            return (
              <g key={idx}>
                {/* Zona de impacto más amplia para hover táctil o mouse */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="14"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex(idx)}
                  onTouchStart={() => setHoverIndex(idx)}
                />
                {/* Punto visible */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? '5' : '3.5'}
                  fill={isActive ? '#34d399' : '#10b981'}
                  stroke="#09090b"
                  strokeWidth={isActive ? '2.5' : '1.5'}
                  className="transition-all duration-150 pointer-events-none"
                />
              </g>
            );
          })}

          {/* Etiquetas del eje X (fechas) */}
          <text
            x={padLeft}
            y={height - 8}
            textAnchor="start"
            className="fill-zinc-400 text-[10px] font-mono"
          >
            {formatDateLabel(points[0].fecha)}
          </text>

          {points.length > 2 && (
            <text
              x={padLeft + chartWidth / 2}
              y={height - 8}
              textAnchor="middle"
              className="fill-zinc-500 text-[10px] font-mono"
            >
              {formatDateLabel(points[Math.floor(points.length / 2)].fecha)}
            </text>
          )}

          <text
            x={padLeft + chartWidth}
            y={height - 8}
            textAnchor="end"
            className="fill-zinc-400 text-[10px] font-mono"
          >
            {formatDateLabel(points[points.length - 1].fecha)}
          </text>
        </svg>
      </div>
    </div>
  );
};
