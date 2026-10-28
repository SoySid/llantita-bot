'use client';

import { Send, ArrowUp, SlidersHorizontal } from 'lucide-react';

interface StickyActionBarProps {
  onScrollToTop: () => void;
  selectedTalles?: string[];
  selectedMarcas?: string[];
  soloOfertas?: boolean;
  searchQuery?: string;
}

export const StickyActionBar: React.FC<StickyActionBarProps> = ({
  onScrollToTop,
  selectedTalles = [],
  selectedMarcas = [],
  soloOfertas = false,
  searchQuery = '',
}) => {
  const filterCount =
    selectedTalles.length +
    selectedMarcas.length +
    (soloOfertas ? 1 : 0) +
    (searchQuery.trim().length > 0 ? 1 : 0);

  return (
    <div data-ui="bottom-bar" className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d0b0a]/95 backdrop-blur-md px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.8)]"> {/* taste-skill-ignore */}
      {/* Botón Volver Arriba / Filtros */}
      <button
        onClick={onScrollToTop}
        className="flex items-center gap-1.5 rounded bg-[#181411] border border-[#382f25] px-3.5 py-2 text-xs font-barlow font-bold uppercase text-[#f2ede7] active:scale-[0.96] transition-transform cursor-pointer"
        aria-label={filterCount > 0 ? `Ver ${filterCount} filtros aplicados` : 'Volver arriba'}
      >
        {filterCount > 0 ? (
          <>
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#ff6a1a]" />
            <span>Filtros ({filterCount})</span>
          </>
        ) : (
          <>
            <ArrowUp className="h-3.5 w-3.5 text-[#a39b91]" />
            <span>Subir</span>
          </>
        )}
      </button>

      {/* Botón directo a Telegram */}
      <a
        href="https://t.me/llantita_bot"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 rounded bg-[#ff5500] hover:bg-[#ff6a1a] text-black px-3.5 py-2 text-xs font-barlow font-bold uppercase active:scale-[0.97] transition-colors cursor-pointer"
      >
        <Send className="h-3.5 w-3.5" />
        <span>Alertas Telegram</span>
      </a>
    </div>
  );
};
