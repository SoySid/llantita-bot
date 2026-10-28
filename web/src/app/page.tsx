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
    <div ref={topRef} className="min-h-dvh flex flex-col bg-canvas text-ink">
      {/* 1. Header con indicador de tiempo */}
      <Navbar
        ultimaActualizacion={ultimaActualizacion}
        totalProductos={totalProductos}
      />

      {/* 2. Sección principal editorial */}
      <AboutSection
        onExploreClick={handleScrollToCatalog}
        totalProductos={totalProductos}
        ultimaActualizacion={ultimaActualizacion}
      />

      {/* 3. Hero con buscador y filtros */}
      <div ref={catalogRef}>
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
      </div>

      <main className="flex-1 pb-28 sm:pb-0">
        {/* 4. Podio Bento de Rebajas Récord (si no hay filtros activos) */}
        {isPodioVisible && (
          <FeaturedDeals
            deals={featuredDeals}
            onSelectProduct={setSelectedProductForHistory}
          />
        )}

        {/* 5. Grilla de Productos */}
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

        {/* 6. Preguntas frecuentes / Cómo funciona */}
        <HowItWorksSection />
      </main>

      {/* 7. Modal de Historial de Precios */}
      <PriceHistoryModal
        product={selectedProductForHistory}
        onClose={() => setSelectedProductForHistory(null)}
      />

      {/* 8. Barra fija inferior en móvil */}
      <StickyActionBar
        onScrollToTop={handleScrollToTop}
        selectedTalles={selectedTalles}
        selectedMarcas={selectedMarcas}
        soloOfertas={soloOfertas}
        searchQuery={searchQuery}
      />

      {/* 9. Footer técnico */}
      <Footer ultimaActualizacion={ultimaActualizacion} />
    </div>
  );
}
