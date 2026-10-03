'use client';

import { Send, ArrowUp } from 'lucide-react';

interface StickyActionBarProps {
  onScrollToTop: () => void;
  selectedTalle?: string;
}

export const StickyActionBar: React.FC<StickyActionBarProps> = ({ onScrollToTop, selectedTalle }) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 border-t border-zinc-800 backdrop-blur-xl px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3">
      {/* Botón Volver Arriba / Filtros */}
      <button
        onClick={onScrollToTop}
        className="flex items-center gap-1.5 rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-300 active:bg-zinc-800 transition-colors"
      >
        <ArrowUp className="h-3.5 w-3.5 text-zinc-400" />
        <span>Subir {selectedTalle ? `(Talle ${selectedTalle})` : ''}</span>
      </button>

      {/* Botón directo a Telegram al alcance del pulgar */}
      <a
        href="https://t.me/llantita_bot"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 px-4 py-2 text-xs font-bold shadow-md active:scale-[0.98] transition-all"
      >
        <Send className="h-3.5 w-3.5" />
        <span>Alertas Telegram</span>
      </a>
    </div>
  );
};
