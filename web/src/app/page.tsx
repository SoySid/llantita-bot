'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroFilters } from '@/components/HeroFilters';
import { FeaturedDeals, DealProduct } from '@/components/FeaturedDeals';
import { ProductGrid } from '@/components/ProductGrid';
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
  const [selectedTalle, setSelectedTalle] = useState('');
  const [selectedMarca, setSelectedMarca] = useState('');
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
      if (selectedTalle) params.set('talle', selectedTalle);
      if (selectedMarca) params.set('marca', selectedMarca);
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
  }, [debouncedQuery, selectedTalle, selectedMarca, selectedOrden, soloOfertas, currentPage]);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSelectedTalle('');
    setSelectedMarca('');
    setSelectedOrden('descuento');
    setSoloOfertas(false);
    setCurrentPage(1);
  };

  const handleScrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={topRef} className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100">
      {/* 1. Header con indicador de tiempo */}
      <Navbar
        ultimaActualizacion={ultimaActualizacion}
        totalProductos={totalProductos}
      />

      {/* 2. Hero con buscador y filtros */}
      <HeroFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTalle={selectedTalle}
        onTalleChange={(talle) => {
          setSelectedTalle(talle);
          setCurrentPage(1);
        }}
        selectedMarca={selectedMarca}
        onMarcaChange={(marca) => {
          setSelectedMarca(marca);
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

      <main className="flex-1 pb-16 sm:pb-0">
        {/* 3. Carrusel de Bajas Destacadas (si no hay búsqueda activa) */}
        {!searchQuery && !selectedTalle && !selectedMarca && (
          <FeaturedDeals
            deals={featuredDeals}
            onSelectProduct={setSelectedProductForHistory}
          />
        )}

        {/* 4. Grilla de Productos */}
        <ProductGrid
          productos={productos}
          loading={loading}
          total={totalFound}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            topRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenHistory={setSelectedProductForHistory}
          selectedTalle={selectedTalle}
          onResetFilters={handleResetFilters}
        />
      </main>

      {/* 5. Modal de Historial de Precios */}
      <PriceHistoryModal
        product={selectedProductForHistory}
        onClose={() => setSelectedProductForHistory(null)}
      />

      {/* 6. Barra fija inferior en móvil */}
      <StickyActionBar
        onScrollToTop={handleScrollToTop}
        selectedTalle={selectedTalle}
      />

      {/* 7. Footer técnico */}
      <Footer ultimaActualizacion={ultimaActualizacion} />
    </div>
  );
}
