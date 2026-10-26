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
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-canvas/95 backdrop-blur-md border-t border-surface-border px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.3)]">
      {/* Botón Volver Arriba / Filtros */}
      <button
        onClick={onScrollToTop}
        className="flex items-center gap-1.5 rounded-xl bg-surface-card px-4 py-2.5 text-sm font-display font-bold text-ink active:scale-[0.96] active:bg-surface-elevated transition-[background-color,transform] duration-150 ease-out cursor-pointer"
        aria-label={filterCount > 0 ? `Ver ${filterCount} filtros aplicados` : 'Volver arriba'}
      >
        {filterCount > 0 ? (
          <>
            <SlidersHorizontal className="h-4 w-4 text-infrared" />
            <span>Filtros ({filterCount})</span>
          </>
        ) : (
          <>
            <ArrowUp className="h-4 w-4 text-ink-secondary" />
            <span>Subir</span>
          </>
        )}
      </button>

      {/* Botón directo a Telegram */}
      <a
        href="https://t.me/llantita_bot"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-infrared hover:bg-infrared-hover text-white px-4 py-2.5 text-sm font-display font-bold active:scale-[0.97] transition-[background-color,transform] duration-150 ease-out cursor-pointer"
      >
        <Send className="h-4 w-4" />
        <span>Alertas Telegram</span>
      </a>
    </div>
  );
};
