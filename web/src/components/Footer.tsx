'use client';

import React from 'react';
import { Send, ExternalLink } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

interface FooterProps {
  ultimaActualizacion: string | null;
}

export const Footer: React.FC<FooterProps> = ({ ultimaActualizacion }) => {
  return (
    <>
      {/* DIVISOR MECÁNICO 3: CORTE BISELADO CON CONECTOR */}
      <div className="relative w-full h-10 bg-[#090808] flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 1200 40" className="w-full h-full preserve-3d" preserveAspectRatio="none">
          <path
            d="M0,0 L480,0 L510,25 L690,25 L720,0 L1200,0"
            fill="none"
            stroke="#ff5500"
            strokeOpacity="0.45"
            strokeWidth="2"
          />
        </svg>
        <span className="absolute hud-mono text-[11px] text-stone-500 tracking-[0.4em] -top-1">
          SEC // 03
        </span>
      </div>

      {/* SECCIÓN 3: NÚCLEO TÉRMICO + SCANLINES CRT */}
      <footer className="section-core-bg py-20 sm:py-28 px-6 md:px-16 relative overflow-hidden text-center">
        <div className="noise-overlay" />

        {/* Anillos concéntricos térmicos gigantes */}
        <div className="w-[420px] sm:w-[700px] h-[420px] sm:h-[700px] rounded-full border border-orange-500/20 absolute -bottom-[260px] sm:-bottom-[420px] left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="w-[320px] sm:w-[520px] h-[320px] sm:h-[520px] rounded-full border border-dashed border-orange-400/30 absolute -bottom-[200px] sm:-bottom-[330px] left-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 hud-mono text-xs text-orange-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            CANAL DE TRANSMISIÓN ACTIVO
          </div>

          <h2 className="headline text-4xl sm:text-6xl md:text-7xl mb-6">
            No llegues cuando<br />ya no queda tu talle
          </h2>

          <p className="text-stone-300/80 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Los pares en piso histórico duran minutos en stock. Conectate al radar de Telegram y recibí el aviso en el segundo exacto.
          </p>

          <a
            href="https://t.me/llantita_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-telegram px-7 sm:px-9 py-3.5 sm:py-4 rounded text-xl sm:text-2xl font-extrabold uppercase inline-flex items-center gap-3 cursor-pointer shadow-[0_0_24px_rgba(255,85,0,0.6)]"
          >
            <span>ENTRAR AL CANAL DE TELEGRAM</span>
            <svg className="w-5 sm:w-6 h-5 sm:h-6 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M21.9 2.6L1.8 10.4c-1.3.5-1.3 1.3-.2 1.6l5.1 1.6 11.9-7.5c.6-.3 1.1-.1.7.2l-9.6 8.7-.4 5.3c.5 0 .8-.2 1.1-.5l2.6-2.5 5.3 3.9c1 .5 1.7.3 1.9-.9L23.6 4c.3-1.4-.5-2-1.7-1.4z" />
            </svg>
          </a>

          {/* Estado de Latencia / Telemetría */}
          <div className="mt-16 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between hud-mono text-xs text-stone-500 gap-3">
            <span>LLANTITA // MONITOR TÁCTICO DE CALZADO</span>
            <span>STATUS: ONLINE — LATENCIA 42MS</span>
          </div>

          {/* Enlaces y Créditos Técnicos */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-stone-500">
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-6 shrink-0 filter drop-shadow(0 1px 3px rgba(0,0,0,0.8)) overflow-hidden bg-[#181512]"
                style={{
                  clipPath: 'polygon(12% 0%, 88% 0%, 100% 10%, 100% 74%, 50% 100%, 0% 74%, 0% 10%)',
                }}
              >
                <img
                  src="/cat-shield.jpg"
                  alt="Llantita"
                  className="h-full w-full object-cover select-none pointer-events-none"
                />
              </div>
              <span className="text-stone-300 font-bold tracking-wider">LLANTITA</span>
              <span>·</span>
              <span>
                Desarrollado por <strong className="text-stone-300 font-semibold">Alfredo López (@SoySid)</strong>
              </span>
            </div>

            <div className="flex items-center gap-4 hud-mono uppercase tracking-wider text-stone-400">
              <a
                href="https://github.com/SoySid/llantita-bot"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-400 transition-colors inline-flex items-center gap-1.5"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </a>

              <a
                href="https://t.me/llantita_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-400 transition-colors inline-flex items-center gap-1"
              >
                <Send className="h-3 w-3 text-orange-400" />
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

          <div className="mt-4 text-[11px] hud-mono text-stone-600">
            {ultimaActualizacion
              ? `ÚLTIMA SINCRONIZACIÓN: HACE ${formatTimeAgo(ultimaActualizacion).toUpperCase()}`
              : 'ESCANEO CONTINUO CADA 30 MIN'}
          </div>
        </div>
      </footer>
    </>
  );
};
