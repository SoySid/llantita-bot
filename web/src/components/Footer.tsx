import React from 'react';
import { Send, ExternalLink } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

interface FooterProps {
  ultimaActualizacion: string | null;
}

export const Footer: React.FC<FooterProps> = ({ ultimaActualizacion }) => {
  return (
    <footer className="w-full bg-canvas pt-12 pb-24 sm:pb-12 text-ink-secondary text-[13px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Izquierda: Michi, Marca y Desarrollador */}
          <div className="flex items-center gap-3.5">
            <img
              src="/logo.jpg"
              alt="Llantita"
              className="h-10 w-10 rounded-full object-cover shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display font-bold text-ink text-base tracking-tight">
                  Llantita
                </span>
                <span className="text-ink-muted">·</span>
                <span className="text-[13px] text-ink-secondary">
                  Desarrollado por <strong className="text-ink font-bold">Alfredo López (@SoySid)</strong>
                </span>
              </div>
              <p className="text-[13px] text-ink-muted mt-0.5">
                Rastreador de ofertas y bajas de precio en Sporting Argentina
              </p>
            </div>
          </div>

          {/* Derecha: Enlaces limpios */}
          <div className="flex items-center gap-5 text-[13px] font-medium">
            <a
              href="https://github.com/SoySid/llantita-bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-ink-secondary hover:text-ink focus-visible:ring-2 focus-visible:ring-infrared transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>

            <a
              href="https://t.me/llantita_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-ink-secondary hover:text-ink focus-visible:ring-2 focus-visible:ring-infrared transition-colors"
            >
              <Send className="h-3.5 w-3.5 text-volt" />
              <span>Telegram</span>
            </a>

            <a
              href="https://www.sporting.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-ink-secondary hover:text-ink focus-visible:ring-2 focus-visible:ring-infrared transition-colors"
            >
              <span>Sporting</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Línea inferior limpia con sincronización real */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[13px] text-ink-muted">
          <p>© {new Date().getFullYear()} Llantita. Precios tomados del catálogo público.</p>
          <span className="text-[13px]">
            {ultimaActualizacion ? `Última sincronización: hace ${formatTimeAgo(ultimaActualizacion)}` : 'Monitoreo automático cada 30 min'}
          </span>
        </div>

      </div>
    </footer>
  );
};
