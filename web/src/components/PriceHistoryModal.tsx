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
  const isAllTimeLow = history.length > 1 && minPrice < maxPrice && product.precio <= minPrice;
  const tallesList = parseTalles(product.talles);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="price-modal-title"
        className="relative w-full max-w-xl rounded-t-2xl sm:rounded-xl bg-[#14110f] border border-[#3d3328] p-4 sm:p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-6 overflow-hidden max-h-[90dvh] sm:max-h-[90vh] flex flex-col shadow-[0_15px_40px_rgba(0,0,0,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Remaches decorativos en esquinas (desktop) */}
        <span className="rivet tl hidden sm:block" />
        <span className="rivet tr hidden sm:block" />
        <span className="rivet br hidden sm:block" />
        <span className="rivet bl hidden sm:block" />

        {/* Indicador táctil en móvil */}
        <div className="w-10 h-1 bg-[#2e261f] rounded-full mx-auto mb-3 sm:hidden shrink-0" />

        {/* Header Modal con Thumbnail y BrandBadge */}
        <div className="flex items-start justify-between gap-3 pb-3">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Foto del modelo */}
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded bg-[#1c1814] border border-[#332a20] p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
              {product.imagen_url ? (
                <img
                  src={safeExternalUrl(product.imagen_url)}
                  alt={product.nombre}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-xs font-mono text-[#8a8074]">Sin foto</span>
              )}
            </div>

            <div className="min-w-0">
              <span className="font-barlow text-xs font-bold text-[#ff6a1a] uppercase tracking-wider block mb-0.5">
                {product.marca ? product.marca.toUpperCase() : 'CALZADO'}
              </span>
              <h2
                id="price-modal-title"
                className="font-anton text-lg sm:text-xl text-[#f2ede7] line-clamp-2 leading-snug tracking-wide"
              >
                {product.nombre}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded p-1.5 text-[#8a8074] hover:text-[#f2ede7] hover:bg-[#221c17] active:scale-[0.92] transition-all shrink-0 cursor-pointer"
            aria-label="Cerrar ventana de historial"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Talles disponibles */}
        {tallesList.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pb-2.5">
            <span className="text-xs font-barlow font-bold text-[#8a8074] uppercase tracking-wider">Talles disponibles:</span>
            <div className="flex flex-wrap gap-1">
              {tallesList.map((t, idx) => (
                <span
                  key={idx}
                  className="font-mono text-xs font-bold tabular-nums px-2 py-0.5 rounded bg-[#0d0b0a] text-[#c7beaf] border border-[#2b241c]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Resumen de telemetría de precios */}
        <div className="my-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div className="rounded bg-[#0d0b0a] border border-[#2b241c] p-3">
            <span className="text-xs font-barlow font-bold text-[#8a8074] uppercase tracking-wider">Precio actual</span>
            <p className="font-anton text-lg text-[#f2ede7] mt-0.5 tracking-wide tabular-nums">
              {formatCurrency(product.precio)}
            </p>
          </div>
          <div className="rounded bg-[#0d0b0a] border border-[#2b241c] p-3">
            <span className="text-xs font-barlow font-bold text-[#8a8074] uppercase tracking-wider">Mínimo registrado</span>
            <p className="font-anton text-lg text-[#ff944d] mt-0.5 tracking-wide tabular-nums">
              {formatCurrency(minPrice)}
            </p>
          </div>
          <div className="rounded bg-[#0d0b0a] border border-[#2b241c] p-3 col-span-2 sm:col-span-1">
            <span className="text-xs font-barlow font-bold text-[#8a8074] uppercase tracking-wider">Máximo registrado</span>
            <p className="font-anton text-lg text-[#736c64] mt-0.5 tracking-wide tabular-nums">
              {formatCurrency(maxPrice)}
            </p>
          </div>
        </div>

        {/* Alerta de mínimo histórico verificada */}
        {isAllTimeLow && product.activo !== false && (
          <div className="mb-2.5 flex items-center gap-2 rounded bg-[#211a13] border border-[#593922] px-3 py-1.5 text-xs font-mono text-[#ff944d]">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#ff6a1a]" />
            <span>PISO HISTÓRICO CONFIRMADO: PRECIO MÁS BAJO REGISTRADO</span>
          </div>
        )}

        {/* Aviso de producto sin stock */}
        {product.activo === false && (
          <div className="mb-2.5 flex items-center gap-2 rounded bg-[#261512] border border-[#59261f] px-3 py-1.5 text-xs font-mono text-[#ff5100]">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#ff5100]" />
            <span>SIN STOCK DISPONIBLE EN SPORTING</span>
          </div>
        )}

        {/* Gráfico interactivo estilo Osciloscopio */}
        {!loading && (
          <PriceChart
            history={history}
            currentPrice={product.precio}
            lastUpdated={product.ultima_actualizacion}
          />
        )}

        {/* Historial de cambios */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5 pr-1 mt-2">
          <h3 className="font-barlow text-xs font-bold text-[#8a8074] uppercase tracking-wider mb-1">
            Telemetría de movimientos
          </h3>

          {loading ? (
            <div className="py-6 text-center text-xs font-mono text-[#8a8074]">
              SINCRONIZANDO HISTORIAL...
            </div>
          ) : history.length <= 1 ? (
            <div className="py-4 text-center text-xs font-mono text-[#8a8074] rounded bg-[#0d0b0a] border border-[#241e18]">
              PRECIO ESTABLE SIN VARIACIONES REGISTRADAS.
            </div>
          ) : (
            <div className="space-y-1">
              {history.map((item, index) => {
                const prev = index > 0 ? history[index - 1] : null;
                const isDrop = prev && item.precio < prev.precio;
                const isRise = prev && item.precio > prev.precio;

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded bg-[#0d0b0a] border border-[#241e18] px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2 text-[#a39b91] font-mono">
                      <Calendar className="h-3 w-3 text-[#736c64]" />
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
                        <span className="text-[#ff6a1a] font-barlow font-bold uppercase tracking-wider text-xs">Baja</span>
                      )}
                      {isRise && (
                        <span className="text-[#ff5100] font-barlow font-bold uppercase tracking-wider text-xs">Alza</span>
                      )}
                      <span className="font-mono font-bold text-[#f2ede7] tabular-nums">
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
        <div className="mt-3 pt-3 flex items-center justify-between gap-3 border-t border-[#29221b]">
          <span className="text-xs font-mono text-[#736c64]">
            SPORTING ARGENTINA
          </span>
          {product.activo === false ? (
            <span className="inline-flex items-center gap-2 rounded bg-[#1c1814] text-[#736c64] font-barlow font-bold text-xs uppercase tracking-wider px-4 py-2 cursor-not-allowed">
              <span>Sin stock</span>
            </span>
          ) : (
            <a
              href={safeExternalUrl(product.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded bg-gradient-to-r from-[#ff7b29] to-[#ff5100] border border-[#ffa366] text-[#1c110a] font-barlow font-bold text-xs uppercase tracking-wider px-4 py-2 shadow-[0_0_12px_rgba(255,85,10,0.5)] active:scale-[0.96] transition-all cursor-pointer"
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
