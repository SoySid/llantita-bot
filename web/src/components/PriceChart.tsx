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

  const dataSeries = useMemo(() => {
    if (!history || history.length === 0) {
      return [
        {
          precio: currentPrice,
          fecha: lastUpdated || new Date().toISOString(),
        },
      ];
    }

    const sorted = [...history].sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );

    const ultimo = sorted[sorted.length - 1];
    const fechaUltimo = new Date(ultimo.fecha).getTime();
    const ahora = lastUpdated ? new Date(lastUpdated).getTime() : Date.now();

    if (ahora - fechaUltimo > 12 * 3600 * 1000) {
      sorted.push({
        precio: currentPrice,
        fecha: new Date(ahora).toISOString(),
      });
    }

    return sorted;
  }, [history, currentPrice, lastUpdated]);

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

  const priceMargin = maxPrice === minPrice ? maxPrice * 0.1 || 1000 : (maxPrice - minPrice) * 0.18;
  const minY = Math.max(0, minPrice - priceMargin);
  const maxY = maxPrice + priceMargin;
  const priceRange = maxY - minY || 1;

  const times = dataSeries.map((d) => new Date(d.fecha).getTime());
  let minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  if (minTime === maxTime) {
    minTime -= 86400000;
  }
  const timeSpan = maxTime - minTime || 1;

  const points = useMemo(() => {
    return dataSeries.map((d) => {
      const t = new Date(d.fecha).getTime();
      const x = padLeft + ((t - minTime) / timeSpan) * chartWidth;
      const y = padTop + (1 - (d.precio - minY) / priceRange) * chartHeight;
      return { x, y, precio: d.precio, fecha: d.fecha };
    });
  }, [dataSeries, minTime, timeSpan, chartWidth, chartHeight, padLeft, padTop, minY, priceRange]);

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

  const activeIndex = hoverIndex !== null ? hoverIndex : points.length - 1;
  const activePoint = points[activeIndex];
  const prevPoint = activeIndex > 0 ? points[activeIndex - 1] : null;

  const diffFromPrev = prevPoint ? activePoint.precio - prevPoint.precio : null;
  const pctFromPrev = prevPoint && prevPoint.precio > 0
    ? ((diffFromPrev || 0) / prevPoint.precio) * 100
    : null;

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

  const gridLines = useMemo(() => {
    return [
      { valor: maxY - priceMargin, y: padTop + (1 - (maxY - priceMargin - minY) / priceRange) * chartHeight },
      { valor: (minPrice + maxPrice) / 2, y: padTop + (1 - ((minPrice + maxPrice) / 2 - minY) / priceRange) * chartHeight },
      { valor: minPrice, y: padTop + (1 - (minPrice - minY) / priceRange) * chartHeight },
    ];
  }, [minPrice, maxPrice, minY, maxY, priceMargin, priceRange, padTop, chartHeight]);

  if (dataSeries.length <= 1) {
    return (
      <div className="rounded bg-[#0d0b0a] border border-[#2b241c] p-3.5 mb-3 text-center">
        <div className="flex items-center justify-center gap-2 text-[#8a8074] text-xs mb-1">
          <Minus className="h-3.5 w-3.5 text-[#ff6a1a]" />
          <span>Sin variaciones de precio detectadas aún</span>
        </div>
        <p className="text-xs text-[#a39b91]">
          Precio registrado: <span className="font-anton text-base text-[#f2ede7] tabular-nums">{formatCurrency(currentPrice)}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded bg-[#0d0b0a] border border-[#2b241c] p-3.5 mb-3 select-none">
      {/* Barra superior */}
      <div className="flex items-center justify-between pb-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#8a8074] tabular-nums text-xs">
            {formatTooltipDate(activePoint.fecha)}
          </span>
          {diffFromPrev !== null && diffFromPrev !== 0 && (
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.2 rounded tabular-nums ${
                diffFromPrev < 0
                  ? 'bg-[#26170e] text-[#ff6a1a] border border-[#59351e]'
                  : 'bg-[#291410] text-[#ff5100] border border-[#59221b]'
              }`}
            >
              {diffFromPrev < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
              {pctFromPrev !== null ? `${pctFromPrev.toFixed(1)}%` : ''}
            </span>
          )}
        </div>
        <div className="font-anton text-lg text-[#ff6a1a] tabular-nums tracking-wide">
          {formatCurrency(activePoint.precio)}
        </div>
      </div>

      {/* SVG del Gráfico Osciloscopio */}
      <div className="relative w-full aspect-[520/180] mt-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6a1a" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ff5100" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {gridLines.map((gl, i) => (
            <g key={i}>
              <line
                x1={padLeft}
                y1={gl.y}
                x2={padLeft + chartWidth}
                y2={gl.y}
                stroke="#292119"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padLeft - 6}
                y={gl.y + 3.5}
                textAnchor="end"
                className="fill-[#736c64] text-xs tabular-nums"
              >
                ${Math.round(gl.valor / 1000)}k
              </text>
            </g>
          ))}

          <path d={areaPath} fill="url(#priceGradient)" />

          <path
            d={linePath}
            fill="none"
            stroke="#ff6a1a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {activePoint && (
            <line
              x1={activePoint.x}
              y1={padTop}
              x2={activePoint.x}
              y2={padTop + chartHeight}
              stroke="#ff944d"
              strokeDasharray="3 3"
              strokeOpacity="0.6"
              strokeWidth="1.5"
            />
          )}

          {points.map((p, idx) => {
            const isActive = idx === activeIndex;
            return (
              <g key={idx}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="14"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex(idx)}
                  onTouchStart={() => setHoverIndex(idx)}
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? '5' : '3.5'}
                  fill={isActive ? '#ff944d' : '#ff6a1a'}
                  stroke="#0d0b0a"
                  strokeWidth={isActive ? '2.5' : '1.5'}
                  className="transition-[r,fill] duration-150 pointer-events-none"
                />
              </g>
            );
          })}

          <text
            x={padLeft}
            y={height - 8}
            textAnchor="start"
            className="fill-[#8a8074] text-[11px] tabular-nums"
          >
            {formatDateLabel(points[0].fecha)}
          </text>

          {points.length > 2 && (
            <text
              x={padLeft + chartWidth / 2}
              y={height - 8}
              textAnchor="middle"
              className="fill-[#736c64] text-[11px] tabular-nums"
            >
              {formatDateLabel(points[Math.floor(points.length / 2)].fecha)}
            </text>
          )}

          <text
            x={padLeft + chartWidth}
            y={height - 8}
            textAnchor="end"
            className="fill-[#8a8074] text-[11px] tabular-nums"
          >
            {formatDateLabel(points[points.length - 1].fecha)}
          </text>
        </svg>
      </div>
    </div>
  );
};
