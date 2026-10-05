'use client';

import React from 'react';
import { HelpCircle, ShoppingBag, BellRing, LineChart, ShieldCheck } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const faqs = [
    {
      icon: ShoppingBag,
      iconColor: 'text-sky-400',
      pregunta: '¿Llantita vende zapatillas directamente?',
      respuesta:
        'No. Llantita es un monitor independiente. No procesa pagos, no cobra comisiones ni almacena mercadería. Al hacer clic en un producto, vas directo a la tienda oficial de Sporting Argentina.',
    },
    {
      icon: LineChart,
      iconColor: 'text-emerald-400',
      pregunta: '¿Cómo comprobar si un descuento es real?',
      respuesta:
        'Cada tarjeta incluye un botón para abrir el historial de precios. Allí podés ver la evolución en el tiempo y comprobar si el comercio infló el precio antes de aplicar la supuesta rebaja.',
    },
    {
      icon: BellRing,
      iconColor: 'text-amber-400',
      pregunta: '¿Cómo recibir avisos de bajadas de precio?',
      respuesta:
        'Contamos con un bot público de Telegram (@llantita_bot) que notifica automáticamente cuando se detecta una rebaja con stock disponible en el catálogo.',
    },
    {
      icon: ShieldCheck,
      iconColor: 'text-purple-400',
      pregunta: '¿Con qué frecuencia se actualiza la información?',
      respuesta:
        'El sistema consulta de forma periódica las publicaciones activas cada 30 minutos, actualizando disponibilidad de talles, valores vigentes y nuevas ofertas.',
    },
  ];

  return (
    <section className="w-full border-t border-zinc-800/80 bg-[#09090b] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
            <HelpCircle className="h-4 w-4 text-zinc-400" />
            <span>Preguntas frecuentes</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
            ¿Cómo funciona Llantita?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Todo lo que necesitás saber antes de buscar calzado o activar alertas de precio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {faqs.map((faq) => {
            const Icon = faq.icon;
            return (
              <div
                key={faq.pregunta}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5 space-y-2.5 transition-colors hover:border-zinc-700"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
                    <Icon className={`h-4 w-4 ${faq.iconColor}`} />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-100">
                    {faq.pregunta}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pl-10.5">
                  {faq.respuesta}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
