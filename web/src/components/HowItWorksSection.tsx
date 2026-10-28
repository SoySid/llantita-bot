'use client';

import React, { useState } from 'react';
import { ChevronDown, Send } from 'lucide-react';

interface FaqItem {
  pregunta: string;
  respuesta: string;
}

const FAQS: FaqItem[] = [
  {
    pregunta: '¿Cómo sé si una oferta es real o inflada?',
    respuesta:
      'Registramos el historial de cada modelo semana a semana. Si una tienda sube un calzado antes de una fecha comercial para simular una rebaja, nuestro sistema lo detecta y solo destaca productos que realmente perforaron su piso de precio histórico.',
  },
  {
    pregunta: '¿Llantita vende calzado o cobra comisión?',
    respuesta:
      'No. Llantita es un monitor público e independiente. No procesa cobros ni almacena mercadería: cada enlace te redirige de forma directa a la tienda oficial de Sporting Argentina.',
  },
  {
    pregunta: '¿Con qué frecuencia se actualiza el stock y los talles?',
    respuesta:
      'El catálogo se revisa automáticamente cada 30 minutos. Comprobamos la disponibilidad real de cada numeración física para que no encuentres modelos agotados.',
  },
  {
    pregunta: '¿Cómo recibir avisos de bajadas de precio?',
    respuesta:
      'Podés sumarte al canal gratuito de Telegram (@llantita_bot). El bot envía un aviso inmediato únicamente cuando un modelo baja a su piso de precio y tiene talles listos para comprar.',
  },
];

export const HowItWorksSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="section-carbon-bg py-20 sm:py-28 px-4 sm:px-8 md:px-16 relative overflow-hidden">
      <div className="noise-overlay" />

      {/* Decoración técnica lateral izquierda */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3 opacity-35 pointer-events-none">
        <span className="hud-mono text-[10px] text-orange-400 [writing-mode:vertical-rl] tracking-widest">
          SYS_PIPELINE_V2.4
        </span>
        <div className="w-[1px] h-32 bg-orange-500" />
      </div>

      <div className="max-w-[1360px] mx-auto relative z-10">
        {/* Cabecera de la Sección 2 */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="hud-mono text-xs text-orange-400 tracking-[0.3em] uppercase block mb-2">
            SEC // 02 — ARQUITECTURA DE RASTREO
          </span>
          <h2 className="section-title text-4xl sm:text-5xl md:text-6xl text-white">
            Protocolo de intercepción
          </h2>
          <p className="text-stone-400 mt-3 text-sm sm:text-base leading-relaxed">
            Así filtramos el humo de las falsas ofertas para avisarte únicamente cuando un par toca su mínimo real.
          </p>
        </div>

        {/* 3 Tarjetas de Arquitectura / Protocolo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          <div className="bg-[#0e0d0c]/90 border-t-2 border-orange-500 p-6 sm:p-8 relative shadow-2xl transition-transform hover:-translate-y-1 duration-200">
            <span className="hud-mono text-5xl font-bold text-orange-500/20 absolute top-4 right-6 pointer-events-none">
              01
            </span>
            <h3 className="section-title text-2xl sm:text-3xl text-orange-300 mb-3">
              Barrido de Catálogo
            </h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              Extraemos el listado completo de pares y talles disponibles cada 30 minutos sin interrupción.
            </p>
          </div>

          <div className="bg-[#0e0d0c]/90 border-t-2 border-orange-500 p-6 sm:p-8 relative shadow-2xl transition-transform hover:-translate-y-1 duration-200">
            <span className="hud-mono text-5xl font-bold text-orange-500/20 absolute top-4 right-6 pointer-events-none">
              02
            </span>
            <h3 className="section-title text-2xl sm:text-3xl text-orange-300 mb-3">
              Contraste Histórico
            </h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              Comparamos el valor actual contra la base de datos histórica para descartar precios inflados.
            </p>
          </div>

          <div className="bg-[#0e0d0c]/90 border-t-2 border-orange-500 p-6 sm:p-8 relative shadow-2xl transition-transform hover:-translate-y-1 duration-200">
            <span className="hud-mono text-5xl font-bold text-orange-500/20 absolute top-4 right-6 pointer-events-none">
              03
            </span>
            <h3 className="section-title text-2xl sm:text-3xl text-orange-300 mb-3">
              Disparo a Telegram
            </h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              Si el descuento supera el umbral real, el bot envía la alerta instantánea con link directo al carrito.
            </p>
          </div>
        </div>

        {/* Acordeón de Preguntas Frecuentes */}
        <div className="max-w-3xl mx-auto pt-6 border-t border-stone-800/80">
          <div className="mb-8 text-center sm:text-left">
            <span className="hud-mono text-xs text-orange-400 tracking-[0.25em] uppercase block mb-1">
              CONSULTAS OPERATIVAS
            </span>
            <h3 className="section-title text-2xl sm:text-3xl text-stone-200">
              Preguntas Frecuentes
            </h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((item, idx) => {
              const isOpen = openIndex === idx;
              const contentId = `faq-content-${idx}`;
              return (
                <div
                  key={item.pregunta}
                  className="tactical-card p-4 sm:p-5 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(idx)}
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    className="flex w-full items-start justify-between gap-4 text-left group cursor-pointer"
                  >
                    <span className="section-title text-lg sm:text-xl text-stone-200 group-hover:text-orange-400 transition-colors">
                      {item.pregunta}
                    </span>
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-stone-400 group-hover:text-orange-400 transition-transform">
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ease-out ${
                          isOpen ? 'rotate-180 text-orange-400' : ''
                        }`}
                      />
                    </span>
                  </button>

                  {isOpen && (
                    <div id={contentId} role="region" className="pt-3 pr-4 animate-in fade-in duration-150">
                      <p className="text-sm text-stone-300/85 leading-relaxed">
                        {item.respuesta}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
