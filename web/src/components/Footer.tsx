import React from 'react';
import { Send, Database, Cpu, ExternalLink } from 'lucide-react';

interface FooterProps {
  ultimaActualizacion: string | null;
}

export const Footer: React.FC<FooterProps> = ({ ultimaActualizacion }) => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#080c14] py-12 text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1: Sobre el bot */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-white text-sm">Llantita Bot</span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 border border-slate-700">
                v2.0
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Sistema automatizado de monitoreo y detección de bajas de precio para calzado deportivo en Sporting Argentina.
            </p>
          </div>

          {/* Columna 2: Estado del Scraper */}
          <div>
            <span className="font-bold text-white text-sm block mb-2">Infraestructura</span>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-2">
                <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                <span>Barrido programado cada 30 min en GitHub Actions</span>
              </li>
              <li className="flex items-center gap-2">
                <Database className="h-3.5 w-3.5 text-cyan-400" />
                <span>Base de datos serverless en Neon PostgreSQL</span>
              </li>
              <li className="flex items-center gap-2">
                <Send className="h-3.5 w-3.5 text-[#229ED9]" />
                <a
                  href="https://t.me/llantita_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors underline underline-offset-2"
                >
                  Bot de Telegram (@llantita_bot)
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Enlaces y Fuentes */}
          <div>
            <span className="font-bold text-white text-sm block mb-2">Fuentes y Despliegue</span>
            <p className="text-slate-400 leading-relaxed mb-3">
              Los datos se extraen de la API pública de catálogo de Sporting Argentina para comparar variaciones reales de precio sin intermediarios.
            </p>
            <a
              href="https://www.sporting.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <span>Visitar tienda oficial Sporting</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Llantita Bot. Desarrollado por Alfredo Lopez.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://t.me/llantita_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              Canal de Alertas
            </a>
            <span>·</span>
            <span className="text-slate-500">
              {ultimaActualizacion ? `Última sincronización: ${new Date(ultimaActualizacion).toLocaleTimeString('es-AR')}` : 'En línea'}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
