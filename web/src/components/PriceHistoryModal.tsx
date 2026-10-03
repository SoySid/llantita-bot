'use client';

import React, { useEffect, useState } from 'react';
import { formatCurrency, formatTimeAgo } from '@/lib/utils';
import { DealProduct } from './FeaturedDeals';
import { PriceChart } from './PriceChart';
import { X, ExternalLink, Calendar, CheckCircle2, TrendingDown, AlertCircle } from 'lucide-react';

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

  // Cerrar al apretar Escape
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-2xl bg-[#111827] border border-slate-700/80 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              {product.marca || 'Sporting Argentina'}
            </span>
            <h2 className="text-base font-bold text-white mt-0.5 line-clamp-2">
              {product.nombre}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Resumen de precios */}
        <div className="my-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3">
            <span className="text-[10px] uppercase font-semibold text-slate-400">Precio actual</span>
            <p className="text-lg font-bold text-emerald-400 mt-0.5">
              {formatCurrency(product.precio)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3">
            <span className="text-[10px] uppercase font-semibold text-slate-400">Mínimo registrado</span>
            <p className="text-lg font-bold text-white mt-0.5">
              {formatCurrency(minPrice)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-semibold text-slate-400">Máximo registrado</span>
            <p className="text-lg font-bold text-slate-400 mt-0.5">
              {formatCurrency(maxPrice)}
            </p>
          </div>
        </div>

        {/* Badge Mínimo Histórico */}
        {isAllTimeLow && product.activo !== false && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>
              <strong>Precio más bajo histórico:</strong> Este producto se encuentra en el valor más bajo registrado por Llantita Bot.
            </span>
          </div>
        )}

        {/* Aviso de producto sin stock o descontinuado */}
        {product.activo === false && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3.5 py-2 text-xs text-amber-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
            <span>
              <strong>Producto agotado:</strong> Este modelo ya no figura en el catálogo activo de Sporting.
            </span>
          </div>
        )}

        {/* Gráfico de evolución de precios */}
        {!loading && (
          <PriceChart
            history={history}
            currentPrice={product.precio}
            lastUpdated={product.ultima_actualizacion}
          />
        )}

        {/* Línea de tiempo de variaciones */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Movimientos registrados por el bot:
          </h3>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Cargando historial de variaciones...
            </div>
          ) : history.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 rounded-xl bg-slate-900/50 border border-slate-800/60">
              Aún no se han registrado cambios de precio para este modelo desde su incorporación.
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item, index) => {
                const prev = index > 0 ? history[index - 1] : null;
                const isDrop = prev && item.precio < prev.precio;
                const isRise = prev && item.precio > prev.precio;

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-slate-900/70 border border-slate-800 px-3.5 py-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
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
                        <span className="text-emerald-400 font-semibold text-[11px]">Baja</span>
                      )}
                      {isRise && (
                        <span className="text-rose-400 font-semibold text-[11px]">Alza</span>
                      )}
                      <span className="font-mono font-bold text-slate-100">
                        {formatCurrency(item.precio)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Modal con enlace de compra */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Fuente directa: Sporting.com.ar
          </span>
          {product.activo === false ? (
            <span className="inline-flex items-center gap-2 rounded-xl bg-slate-800 text-slate-400 font-semibold text-xs px-4 py-2.5 cursor-not-allowed">
              <span>Sin stock en Sporting</span>
            </span>
          ) : (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2.5 transition-all shadow-md shadow-emerald-600/20"
            >
              <span>Ver producto en Sporting</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
