'use client';

import React from 'react';
import { Send, ArrowDown, TrendingDown, Check } from 'lucide-react';

interface AboutSectionProps {
  onExploreClick?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onExploreClick }) => {
  return (
    <section className="w-full border-b border-zinc-800 bg-gradient-to-b from-zinc-950 via-[#0b0b0e] to-[#09090b] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Columna Izquierda: Explicación directa sin vueltas */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/90 px-3 py-1 text-xs font-mono text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Rastreo cada 30 min · Catálogo Sporting Argentina</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase leading-tight sm:leading-none">
              Comprá zapatillas cuando bajan de verdad.
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl">
              Llantita monitorea las publicaciones de Sporting de forma automática. Compara cada precio
              contra su historial para comprobar si una rebaja es genuina o si inflaron el valor antes
              de la promoción, y te muestra únicamente lo que tiene stock en tu número.
            </p>

            {/* Lista técnica concreta (sin tarjetas infladas) */}
            <div className="pt-1 space-y-2 text-xs sm:text-sm text-zinc-300">
              <div className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>Historial de precios para verificar que no inflaron el valor previo</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>Filtro estricto por talle en depósito para no entrar a pares agotados</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>Sin comisiones: hacés clic y comprás directo en la tienda oficial</span>
              </div>
            </div>

            {/* Acciones principales */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              {onExploreClick && (
                <button
                  type="button"
                  onClick={onExploreClick}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
                >
                  <span>Explorar catálogo</span>
                  <ArrowDown className="h-4 w-4 text-zinc-700" />
                </button>
              )}

              <a
                href="https://t.me/llantita_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700/80 bg-zinc-900/80 hover:bg-zinc-800 hover:border-zinc-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-zinc-100 transition-colors"
              >
                <Send className="h-4 w-4 text-[#229ED9]" />
                <span>Alertas en Telegram (@llantita_bot)</span>
              </a>
            </div>

          </div>

          {/* Columna Derecha: Tarjeta de demostración en vivo (Show, don't tell) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-zinc-800 bg-[#0d0d12]/90 backdrop-blur-md p-4 sm:p-5 shadow-2xl space-y-4">
              
              {/* Encabezado del visor */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 text-xs">
                <span className="font-mono text-zinc-400 uppercase tracking-wider text-[11px]">
                  Ejemplo de detección
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Rebaja confirmada
                </span>
              </div>

              {/* Muestra del calzado */}
              <div className="flex items-center gap-3.5">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 border border-zinc-800/60 shadow-inner">
                  <img
                    src="https://sporting.vteximg.com.br/arquivos/ids/2293460/6IF4496-000-1.jpg?v=639004605348770000"
                    alt="adidas Daily 4.0"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                    ADIDAS
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    Zapatillas adidas Daily 4.0
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-base sm:text-lg font-black text-white">
                      $90.999
                    </span>
                    <span className="text-xs text-zinc-500 line-through font-mono">
                      $116.999
                    </span>
                    <span className="text-[10px] font-black font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded">
                      -22%
                    </span>
                  </div>
                </div>
              </div>

              {/* Gráfico temporal de inspección */}
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <TrendingDown className="h-3.5 w-3.5" />
                    Ahorro de $26.000
                  </span>
                  <span>Últimos 14 días</span>
                </div>

                {/* Línea SVG simple de histórico de precio */}
                <div className="h-10 w-full flex items-end pt-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40">
                    <defs>
                      <linearGradient id="gradientDrop" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Área con gradiente */}
                    <polygon
                      points="0,8 120,8 160,32 200,32 200,40 0,40"
                      fill="url(#gradientDrop)"
                    />
                    {/* Línea de precio cayendo */}
                    <polyline
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points="0,8 120,8 160,32 200,32"
                    />
                    {/* Puntos clave */}
                    <circle cx="120" cy="8" r="3.5" fill="#71717a" />
                    <circle cx="200" cy="32" r="4" fill="#34d399" />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-0.5">
                  <span>Precio anterior: $116.999</span>
                  <span className="text-emerald-400 font-semibold">Hoy: $90.999</span>
                </div>
              </div>

              {/* Talles en stock del ejemplo */}
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1 border-t border-zinc-800/60">
                <span>Talles verificados en depósito:</span>
                <div className="flex gap-1">
                  {['41', '42', '43'].map((t) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.5 rounded bg-zinc-800 text-white font-bold text-[10px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
