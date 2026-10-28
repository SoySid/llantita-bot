'use client';

import React from 'react';
import { Send, ExternalLink } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

interface FooterProps {
  ultimaActualizacion: string | null;
}

export const Footer: React.FC<FooterProps> = ({ ultimaActualizacion }) => {
  return (
    <footer className="section-core-bg py-16 sm:py-24 px-6 md:px-16 relative overflow-hidden text-center">
      <div className="noise-overlay" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1713] border border-orange-500/30 text-xs text-orange-400 mb-6 font-semibold">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span>CANAL OFICIAL DE ALERTAS</span>
        </div>

        <h2 className="headline text-4xl sm:text-6xl md:text-7xl mb-6">
          No llegues cuando<br />ya no queda tu talle
        </h2>

        <p className="text-stone-300 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Los pares en piso histórico suelen agotarse en minutos. Sumate al canal gratuito de Telegram para recibir la notificación al instante con enlace directo a la tienda.
        </p>

        <a
          href="https://t.me/llantita_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-telegram px-8 sm:px-10 py-4 rounded text-lg sm:text-xl font-bold uppercase inline-flex items-center gap-3 cursor-pointer"
        >
          <span>Unirme al canal de Telegram</span>
          <Send className="w-5 h-5 fill-current shrink-0" />
        </a>

        {/* Créditos */}
        <div className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded overflow-hidden bg-[#181512] border border-[#3d332a]">
              <img
                src="/cat-shield.jpg"
                alt="Llantita"
                className="h-full w-full object-cover select-none pointer-events-none"
              />
            </div>
            <span className="text-stone-200 font-bold tracking-wider">LLANTITA</span>
            <span>·</span>
            <span>
              Desarrollado por <strong className="text-stone-200 font-semibold">Alfredo López (@SoySid)</strong>
            </span>
          </div>

          <div className="flex items-center gap-5 text-stone-300">
            <a
              href="https://github.com/SoySid/llantita-bot"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-400 transition-colors inline-flex items-center gap-1.5"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>

            <a
              href="https://t.me/llantita_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-400 transition-colors inline-flex items-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5 text-orange-400" />
              <span>Telegram</span>
            </a>

            <a
              href="https://www.sporting.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-400 transition-colors inline-flex items-center gap-1"
            >
              <span>Sporting</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="mt-4 text-xs text-stone-400">
          {ultimaActualizacion
            ? `Última sincronización con Sporting: hace ${formatTimeAgo(ultimaActualizacion)}`
            : 'Escaneo continuo de catálogo cada 30 minutos'}
        </div>
      </div>
    </footer>
  );
};
