'use client';

import React from 'react';
import { Send, Search, ArrowUp } from 'lucide-react';

interface StickyActionBarProps {
  onScrollToTop: () => void;
  selectedTalle?: string;
}

export const StickyActionBar: React.FC<StickyActionBarProps> = ({ onScrollToTop, selectedTalle }) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0f17]/95 border-t border-slate-800/90 backdrop-blur-xl px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3">
      {/* Botón Volver Arriba / Buscar */}
      <button
        onClick={onScrollToTop}
        className="flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-700/80 px-3 py-2 text-xs font-semibold text-slate-300 active:bg-slate-800"
      >
        <Search className="h-3.5 w-3.5 text-emerald-400" />
        <span>Buscar {selectedTalle ? `(${selectedTalle})` : ''}</span>
      </button>

      {/* Botón directo a Telegram al alcance del pulgar */}
      <a
        href="https://t.me/llantita_bot"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#229ED9] to-[#1E88E5] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#229ED9]/20 active:opacity-90 transition-opacity"
      >
        <Send className="h-3.5 w-3.5" />
        <span>Alertas Telegram</span>
      </a>
    </div>
  );
};
