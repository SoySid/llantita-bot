'use client';

import React, { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { DealProduct } from './FeaturedDeals';
import { PriceChart } from './PriceChart';
import { BrandBadge } from './BrandBadge';
import { X, ExternalLink, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface HistoryItem {
  id: number;
  precio: number;
  fecha: string;
}

interface PriceHistoryModalProps {
  product: DealProduct | null;
  onClose: () => void;
}

export const PriceHistoryModal: React.FC<PriceHistoryModalProps> = ({ product, onClose }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!product) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/historial/${product.id}`);
        if (res.ok) {
          const data = await res.json();
          setHistory(data.historial || []);
        }
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [product]);

  // Cerrar al presionar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const minPrice = history.length > 0 ? Math.min(...history.map((h) => h.precio)) : product.precio;
  const maxPrice = history.length > 0 ? Math.max(...history.map((h) => h.precio)) : product.precio;
  const isAllTimeLow = product.precio <= minPrice;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-t-3xl sm:rounded-2xl bg-zinc-900 border-t sm:border border-zinc-800 shadow-2xl p-4 sm:p-6 overflow-hidden max-h-[92vh] sm:max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Indicador táctil en móvil */}
        <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-3 sm:hidden shrink-0" />

        {/* Header Modal con Thumbnail y BrandBadge */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Foto del modelo */}
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-white p-1.5 shrink-0 flex items-center justify-center border border-zinc-800 overflow-hidden shadow-xs">
              {product.imagen_url ? (
                <img
                  src={product.imagen_url}
                  alt={product.nombre}
                  className="h-full w-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
                />
              ) : (
                <span className="text-[10px] text-zinc-400 font-mono">Sin foto</span>
              )}
            </div>

            <div className="min-w-0">
              <BrandBadge marca={product.marca} className="mb-1" />
              <h2 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug">
                {product.nombre}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Resumen de precios */}
        <div className="my-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Precio actual</span>
            <p className="text-lg font-black text-white mt-0.5">
              {formatCurrency(product.precio)}
            </p>
          </div>
          <div className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Mínimo registrado</span>
            <p className="text-lg font-black text-emerald-400 mt-0.5">
              {formatCurrency(minPrice)}
            </p>
          </div>
          <div className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-3 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Máximo registrado</span>
            <p className="text-lg font-black text-zinc-400 mt-0.5">
              {formatCurrency(maxPrice)}
            </p>
          </div>
        </div>

        {/* Alerta de mínimo histórico directa */}
        {isAllTimeLow && product.activo !== false && (
          <div className="mb-3.5 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <span>Mínimo histórico detectado para este modelo</span>
          </div>
        )}

        {/* Aviso de producto sin stock */}
        {product.activo === false && (
          <div className="mb-3.5 flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs text-amber-300">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
            <span>Sin stock disponible en Sporting</span>
          </div>
        )}

        {/* Gráfico interactivo */}
        {!loading && (
          <PriceChart
            history={history}
            currentPrice={product.precio}
            lastUpdated={product.ultima_actualizacion}
          />
        )}

        {/* Historial de cambios */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1 mt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
            Movimientos registrados
          </h3>

          {loading ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              Cargando historial...
            </div>
          ) : history.length === 0 ? (
            <div className="py-6 text-center text-xs text-zinc-500 rounded-xl bg-zinc-950/50 border border-zinc-800/60 font-mono">
              Sin variaciones de precio registradas desde su incorporación.
            </div>
          ) : (
            <div className="space-y-1.5">
              {history.map((item, index) => {
                const prev = index > 0 ? history[index - 1] : null;
                const isDrop = prev && item.precio < prev.precio;
                const isRise = prev && item.precio > prev.precio;

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-zinc-950/70 border border-zinc-800/80 px-3.5 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
                      <Calendar className="h-3 w-3 text-zinc-500" />
                      <span>{new Date(item.fecha).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isDrop && (
                        <span className="text-emerald-400 font-bold text-[11px] font-mono">Baja</span>
                      )}
                      {isRise && (
                        <span className="text-rose-400 font-bold text-[11px] font-mono">Alza</span>
                      )}
                      <span className="font-mono font-black text-white">
                        {formatCurrency(item.precio)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Modal con enlace a Sporting */}
        <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between gap-3">
          <span className="text-[11px] text-zinc-500 font-mono">
            Sporting Argentina
          </span>
          {product.activo === false ? (
            <span className="inline-flex items-center gap-2 rounded-xl bg-zinc-800 text-zinc-400 font-bold text-xs px-4 py-2 cursor-not-allowed">
              <span>Sin stock</span>
            </span>
          ) : (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-black text-xs px-4 py-2 transition-all shadow-sm"
            >
              <span>Ver en Sporting</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
