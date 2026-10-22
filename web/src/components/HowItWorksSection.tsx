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
    <section className="w-full bg-[#0e0e11] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Columna lateral */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Cómo funciona Llantita
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Monitoreamos el catálogo oficial de Sporting para detectar ofertas genuinas y disponibilidad real en cada número.
            </p>

            <div className="pt-2">
              <a
                href="https://t.me/llantita_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-zinc-800 active:scale-[0.96] transition-[background-color,color,transform] duration-150 ease-out cursor-pointer"
              >
                <Send className="h-3.5 w-3.5 text-[#229ED9]" />
                <span>Canal de Telegram (@llantita_bot)</span>
              </a>
            </div>
          </div>

          {/* Columna principal: Acordeón limpio sobre fondo tonal */}
          <div className="lg:col-span-8 space-y-3">
            {FAQS.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={item.pregunta} className="rounded-2xl bg-zinc-900/60 p-5 transition-[background-color] duration-150">
                  <button
                    type="button"
                    onClick={() => toggleItem(idx)}
                    className="flex w-full items-start justify-between gap-4 text-left group cursor-pointer"
                  >
                    <span className="text-base font-bold text-zinc-100 group-hover:text-white transition-colors duration-150">
                      {item.pregunta}
                    </span>
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-zinc-400 group-hover:text-zinc-200 transition-transform">
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ease-out ${
                          isOpen ? 'rotate-180 text-white' : ''
                        }`}
                      />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="pt-3 pr-4 animate-in fade-in duration-150 ease-out">
                      <p className="text-sm text-zinc-300 leading-relaxed">
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
