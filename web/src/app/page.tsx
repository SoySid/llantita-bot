'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { AboutSection } from '@/components/AboutSection';
import { HeroFilters } from '@/components/HeroFilters';
import { FeaturedDeals, DealProduct } from '@/components/FeaturedDeals';
import { ProductGrid } from '@/components/ProductGrid';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { PriceHistoryModal } from '@/components/PriceHistoryModal';
import { StickyActionBar } from '@/components/StickyActionBar';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  // Estado general
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string | null>(null);
  const [totalProductos, setTotalProductos] = useState<number>(0);
  const [marcasDisponibles, setMarcasDisponibles] = useState<Array<{ marca: string; cantidad: number }>>([]);
  const [featuredDeals, setFeaturedDeals] = useState<DealProduct[]>([]);

  // Filtros del catálogo
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedTalles, setSelectedTalles] = useState<string[]>([]);
  const [selectedMarcas, setSelectedMarcas] = useState<string[]>([]);
  const [selectedOrden, setSelectedOrden] = useState('descuento');
  const [soloOfertas, setSoloOfertas] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Productos y paginación
  const [productos, setProductos] = useState<DealProduct[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFound, setTotalFound] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modal de Historial
  const [selectedProductForHistory, setSelectedProductForHistory] = useState<DealProduct | null>(null);

  const topRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  // 1. Debounce para la búsqueda de texto
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 2. Cargar estado inicial y destacados
  useEffect(() => {
    const fetchEstado = async () => {
      try {
        const res = await fetch('/api/estado');
        if (res.ok) {
          const data = await res.json();
          setUltimaActualizacion(data.ultima_actualizacion);
          setTotalProductos(data.total_productos || 0);
          setMarcasDisponibles(data.marcas || []);
          setFeaturedDeals(data.destacados || []);
        }
      } catch (err) {
        console.error('Error cargando estado inicial:', err);
      }
    };

    fetchEstado();
  }, []);

  // 3. Consultar productos cada vez que cambien los filtros
  const fetchProductos = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedQuery) params.set('q', debouncedQuery);
      if (selectedTalles.length > 0) params.set('talles', selectedTalles.join(','));
      if (selectedMarcas.length > 0) params.set('marcas', selectedMarcas.join(','));
      if (selectedOrden) params.set('orden', selectedOrden);
      if (soloOfertas) params.set('solo_ofertas', 'true');
      params.set('page', currentPage.toString());
      params.set('limit', '24');

      const res = await fetch(`/api/productos?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProductos(data.productos || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalFound(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Error al consultar productos:', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, selectedTalles, selectedMarcas, selectedOrden, soloOfertas, currentPage]);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSelectedTalles([]);
    setSelectedMarcas([]);
    setSelectedOrden('descuento');
    setSoloOfertas(false);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedTalles.length > 0 ||
    selectedMarcas.length > 0 ||
    soloOfertas ||
    debouncedQuery.length > 0;

  const handleScrollToTop = () => {
    if (hasActiveFilters && catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isPodioVisible = !debouncedQuery && selectedTalles.length === 0 && selectedMarcas.length === 0 && !soloOfertas;
  const podioIds = useMemo(() => new Set(featuredDeals.slice(0, 4).map((d) => d.id)), [featuredDeals]);
  const catalogProducts = useMemo(() => {
    if (isPodioVisible && selectedOrden === 'descuento') {
      return productos.filter((p) => !podioIds.has(p.id));
    }
    return productos;
  }, [productos, isPodioVisible, selectedOrden, podioIds]);

  return (
    <div ref={topRef} className="min-h-dvh flex flex-col bg-[#111010] text-white">
      {/* 1. Header con indicador de tiempo */}
      <Navbar
        ultimaActualizacion={ultimaActualizacion}
        totalProductos={totalProductos}
      />

      {/* SECCIÓN 0: HERO PRINCIPAL (Brasas, HUD, Holograma y Zapatilla 3D) */}
      <AboutSection
        onExploreClick={handleScrollToCatalog}
        totalProductos={totalProductos}
        ultimaActualizacion={ultimaActualizacion}
      />

      {/* DIVISOR MECÁNICO 1 (Transición entre Hero y Sección 1) */}
      <div className="relative w-full h-12 bg-[#0b0a0a] flex items-center justify-center z-30">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
        <div
          className="absolute px-6 sm:px-8 py-1.5 bg-[#161312] border border-orange-500/40 hud-mono text-xs text-orange-400 tracking-[0.3em] uppercase select-none"
          style={{ clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0 50%)' }}
        >
          SEC // 01 — TELEMETRÍA EN VIVO
        </div>
      </div>

      {/* SECCIÓN 1: FONDO DE GRILLA DE RADAR TÁCTICO + FILTROS + CATÁLOGO */}
      <section
        ref={catalogRef}
        className="section-grid-bg py-16 sm:py-24 px-3 sm:px-8 md:px-14 relative overflow-hidden"
      >
        <div className="noise-overlay" />

        {/* Marca de agua gigante de fondo para dar profundidad */}
        <div
          className="absolute -right-6 sm:-right-10 top-10 font-bold text-[8rem] sm:text-[14rem] leading-none text-white/[0.02] pointer-events-none select-none"
          style={{ fontFamily: 'var(--font-teko), sans-serif' }}
        >
          RADAR // 01
        </div>

        <div className="max-w-[1360px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 border-l-4 border-orange-500 pl-4 sm:pl-5">
            <div>
              <span className="hud-mono text-orange-400 text-xs tracking-[0.25em] uppercase block mb-1">
                DETECCIÓN DE CAÍDAS &gt; 35%
              </span>
              <h2 className="section-title text-3xl sm:text-5xl md:text-6xl text-stone-100">
                Anomalías y catálogo en radar
              </h2>
            </div>
            <p className="hud-mono text-stone-400 text-xs mt-3 md:mt-0">
              ESCANEO AUTOMÁTICO // CADA 1.800 SEGUNDOS
            </p>
          </div>

          {/* Filtros del radar */}
          <HeroFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTalles={selectedTalles}
            onTallesChange={(talles) => {
              setSelectedTalles(talles);
              setCurrentPage(1);
            }}
            selectedMarcas={selectedMarcas}
            onMarcasChange={(marcas) => {
              setSelectedMarcas(marcas);
              setCurrentPage(1);
            }}
            marcasDisponibles={marcasDisponibles}
            selectedOrden={selectedOrden}
            onOrdenChange={(orden) => {
              setSelectedOrden(orden);
              setCurrentPage(1);
            }}
            soloOfertas={soloOfertas}
            onSoloOfertasChange={(val) => {
              setSoloOfertas(val);
              setCurrentPage(1);
            }}
            onReset={handleResetFilters}
          />

          {/* Podio Bento de Rebajas Récord (si no hay filtros activos) */}
          {isPodioVisible && (
            <div className="mb-8">
              <FeaturedDeals
                deals={featuredDeals}
                onSelectProduct={setSelectedProductForHistory}
              />
            </div>
          )}

          {/* Grilla de Productos */}
          <ProductGrid
            productos={catalogProducts}
            loading={loading}
            total={totalFound}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenHistory={setSelectedProductForHistory}
            selectedTalles={selectedTalles}
            onResetFilters={handleResetFilters}
          />
        </div>
      </section>

      {/* DIVISOR MECÁNICO 2: CINTA DE ADVERTENCIA INDUSTRIAL */}
      <div className="hazard-strip relative z-30" />

      {/* SECCIÓN 2: MALLA DE CARBONO + HALO LATERAL + ARQUITECTURA */}
      <HowItWorksSection />

      {/* SECCIÓN 3: NÚCLEO TÉRMICO + SCANLINES + CTA TELEGRAM + FOOTER */}
      <Footer ultimaActualizacion={ultimaActualizacion} />

      {/* Modal de Historial de Precios */}
      <PriceHistoryModal
        product={selectedProductForHistory}
        onClose={() => setSelectedProductForHistory(null)}
      />

      {/* Barra fija inferior en móvil */}
      <StickyActionBar
        onScrollToTop={handleScrollToTop}
        selectedTalles={selectedTalles}
        selectedMarcas={selectedMarcas}
        soloOfertas={soloOfertas}
        searchQuery={searchQuery}
      />
    </div>
  );
}
