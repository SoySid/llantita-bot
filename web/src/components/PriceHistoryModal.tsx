'use client';

import React, { useEffect, useState } from 'react';
import { formatCurrency, parseTalles, safeExternalUrl } from '@/lib/utils';
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
  // Solo consideramos piso histórico cuando hay más de 1 movimiento y una baja real respecto al máximo
  const isAllTimeLow = history.length > 1 && minPrice < maxPrice && product.precio <= minPrice;
  const tallesList = parseTalles(product.talles);

  return (
    <div
      className="backdrop-enter fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="price-modal-title"
        className="modal-enter origin-center relative w-full max-w-xl rounded-t-3xl sm:rounded-2xl bg-surface p-5 sm:p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-6 overflow-hidden max-h-[90dvh] sm:max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Indicador táctil en móvil */}
        <div className="w-10 h-1 bg-surface-elevated rounded-full mx-auto mb-3 sm:hidden shrink-0" />

        {/* Header Modal con Thumbnail y BrandBadge */}
        <div className="flex items-start justify-between gap-3 pb-3">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Foto del modelo */}
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-bone p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
              {product.imagen_url ? (
                <img
                  src={safeExternalUrl(product.imagen_url)}
                  alt={product.nombre}
                  className="h-full w-full object-contain mix-blend-multiply"
                />
              ) : (
                <span className="text-[13px] font-display text-ink-muted">Sin foto</span>
              )}
            </div>

            <div className="min-w-0">
              <BrandBadge marca={product.marca} className="mb-1" />
              <h2
                id="price-modal-title"
                className="font-display text-base sm:text-lg font-bold text-ink line-clamp-2 leading-snug"
              >
                {product.nombre}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-secondary hover:text-ink hover:bg-surface-card focus-visible:ring-2 focus-visible:ring-infrared active:scale-[0.92] transition-[background-color,color,transform] duration-150 ease-out shrink-0 cursor-pointer"
            aria-label="Cerrar ventana de historial"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Talles disponibles dentro del modal */}
        {tallesList.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pb-3">
            <span className="text-[13px] font-semibold text-ink-muted">Talles disponibles:</span>
            <div className="flex flex-wrap gap-1.5">
              {tallesList.map((t, idx) => (
                <span
                  key={idx}
                  className="font-display text-[13px] font-bold tabular-nums px-2 py-0.5 rounded bg-canvas text-ink"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Resumen de precios */}
        <div className="my-2 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="rounded-xl bg-canvas p-3.5">
            <span className="text-[13px] font-medium text-ink-secondary">Precio actual</span>
            <p className="font-display text-lg font-bold text-ink mt-0.5 tabular-nums">
              {formatCurrency(product.precio)}
            </p>
          </div>
          <div className="rounded-xl bg-canvas p-3.5">
            <span className="text-[13px] font-medium text-ink-secondary">Mínimo registrado</span>
            <p className="font-display text-lg font-bold text-volt mt-0.5 tabular-nums">
              {formatCurrency(minPrice)}
            </p>
          </div>
          <div className="rounded-xl bg-canvas p-3.5 col-span-2 sm:col-span-1">
            <span className="text-[13px] font-medium text-ink-secondary">Máximo registrado</span>
            <p className="font-display text-lg font-bold text-ink-muted mt-0.5 tabular-nums">
              {formatCurrency(maxPrice)}
            </p>
          </div>
        </div>

        {/* Alerta de mínimo histórico verificada */}
        {isAllTimeLow && product.activo !== false && (
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-volt-soft px-3.5 py-2 text-[13px] font-medium text-volt">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-volt" />
            <span>Piso histórico detectado: el precio más bajo registrado</span>
          </div>
        )}

        {/* Aviso de producto sin stock */}
        {product.activo === false && (
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-infrared-soft px-3.5 py-2 text-[13px] text-infrared">
            <AlertCircle className="h-4 w-4 shrink-0 text-infrared" />
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
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1 mt-3">
          <h3 className="font-display text-sm font-bold text-ink-secondary mb-2">
            Movimientos registrados
          </h3>

          {loading ? (
            <div className="py-8 text-center text-[13px] text-ink-muted">
              Cargando historial...
            </div>
          ) : history.length <= 1 ? (
            <div className="py-5 text-center text-[13px] text-ink-muted rounded-xl bg-canvas">
              Precio estable sin variaciones registradas desde su incorporación.
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
                    className="flex items-center justify-between rounded-xl bg-canvas px-3.5 py-2.5 text-[13px]"
                  >
                    <div className="flex items-center gap-2 text-ink-secondary font-display text-[13px]">
                      <Calendar className="h-3.5 w-3.5 text-ink-muted" />
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
                        <span className="text-volt font-display font-bold text-[13px]">Baja</span>
                      )}
                      {isRise && (
                        <span className="text-infrared font-display font-bold text-[13px]">Alza</span>
                      )}
                      <span className="font-display font-bold text-ink tabular-nums">
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
        <div className="mt-4 pt-3 flex items-center justify-between gap-3">
          <span className="text-[13px] text-ink-muted">
            Sporting Argentina
          </span>
          {product.activo === false ? (
            <span className="inline-flex items-center gap-2 rounded-xl bg-surface-card text-ink-muted font-display font-bold text-[13px] px-4 py-2 cursor-not-allowed">
              <span>Sin stock</span>
            </span>
          ) : (
            <a
              href={safeExternalUrl(product.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-infrared hover:bg-infrared-hover focus-visible:ring-2 focus-visible:ring-volt active:scale-[0.96] text-white font-display font-bold text-[13px] px-4 py-2.5 transition-[background-color,transform] duration-150 ease-out cursor-pointer"
            >
              <span>Ver en Sporting</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
