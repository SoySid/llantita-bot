'use client';

import React, { useState } from 'react';
import { ChevronDown, RefreshCw, BarChart3, BellRing } from 'lucide-react';

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
    <section className="section-carbon-bg py-16 sm:py-24 px-4 sm:px-8 md:px-16 relative overflow-hidden">
      <div className="noise-overlay" />

      <div className="max-w-[1360px] mx-auto relative z-10">
        {/* Cabecera */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-orange-400 text-xs font-semibold uppercase block mb-2">
            Transparencia y datos
          </span>
          <h2 className="section-title text-4xl sm:text-5xl md:text-6xl text-white">
            Cómo detectamos las ofertas
          </h2>
          <p className="text-stone-300 mt-3 text-base sm:text-lg leading-relaxed">
            Filtramos el humo de las rebajas infladas para avisarte únicamente cuando un par toca su piso histórico real.
          </p>
        </div>

        {/* 3 Pasos Clave */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-16">
          <div className="bg-[#171412] border border-[#2e2620] rounded-lg p-6 sm:p-7 relative transition-colors hover:border-[#ff5500]">
            <div className="w-10 h-10 rounded-md bg-[#221c17] border border-[#3d3228] flex items-center justify-center text-orange-400 mb-4">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="section-title text-2xl text-stone-100 mb-2">
              Barrido de catálogo
            </h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              Extraemos el listado completo de pares, modelos y talles disponibles en Sporting cada 30 minutos sin interrupción.
            </p>
          </div>

          <div className="bg-[#171412] border border-[#2e2620] rounded-lg p-6 sm:p-7 relative transition-colors hover:border-[#ff5500]">
            <div className="w-10 h-10 rounded-md bg-[#221c17] border border-[#3d3228] flex items-center justify-center text-orange-400 mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="section-title text-2xl text-stone-100 mb-2">
              Contraste histórico
            </h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              Cruzamos el precio actual contra nuestra base de datos histórica. Si subieron el precio para fingir un descuento, queda descartado.
            </p>
          </div>

          <div className="bg-[#171412] border border-[#2e2620] rounded-lg p-6 sm:p-7 relative transition-colors hover:border-[#ff5500]">
            <div className="w-10 h-10 rounded-md bg-[#221c17] border border-[#3d3228] flex items-center justify-center text-orange-400 mb-4">
              <BellRing className="w-5 h-5" />
            </div>
            <h3 className="section-title text-2xl text-stone-100 mb-2">
              Aviso a Telegram
            </h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              Si el calzado quiebra su precio mínimo y cuenta con talles disponibles, el bot envía la alerta con enlace directo a la tienda.
            </p>
          </div>
        </div>

        {/* Acordeón de Preguntas Frecuentes */}
        <div className="max-w-3xl mx-auto pt-8">
          <div className="mb-6 text-center sm:text-left">
            <h3 className="section-title text-2xl sm:text-3xl text-stone-100">
              Preguntas frecuentes
            </h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((item, idx) => {
              const isOpen = openIndex === idx;
              const contentId = `faq-content-${idx}`;
              return (
                <div
                  key={item.pregunta}
                  className="bg-[#161311] border border-[#2a231d] rounded-lg p-4 sm:p-5 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(idx)}
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    className="flex w-full items-start justify-between gap-4 text-left group cursor-pointer"
                  >
                    <span className="font-semibold text-base sm:text-lg text-stone-200 group-hover:text-orange-400 transition-colors">
                      {item.pregunta}
                    </span>
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-stone-400 group-hover:text-orange-400">
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-orange-400' : ''
                        }`}
                      />
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      id={contentId}
                      className="mt-3 text-sm text-stone-300 leading-relaxed pt-2"
                    >
                      {item.respuesta}
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
