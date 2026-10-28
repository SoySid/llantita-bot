'use client';

import React, { useEffect, useRef } from 'react';
import { ArrowDown, Flame } from 'lucide-react';

interface AboutSectionProps {
  onExploreClick?: () => void;
  totalProductos?: number;
  ultimaActualizacion?: string | null;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onExploreClick,
  totalProductos = 1800,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resizeCanvas = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const embers = Array.from({ length: 48 }, () => ({
      x: Math.random() * (canvas.width || 800),
      y: Math.random() * (canvas.height || 600),
      size: Math.random() * 2.5 + 0.8,
      speedX: (Math.random() - 0.45) * 0.6,
      speedY: -(Math.random() * 0.8 + 0.25),
      alpha: Math.random() * 0.8 + 0.2,
      angle: Math.random() * Math.PI * 2,
      stretch: Math.random() * 2.5 + 1,
    }));

    const animateEmbers = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of embers) {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * p.stretch);
        grad.addColorStop(0, `rgba(255, 180, 80, ${p.alpha})`);
        grad.addColorStop(0.5, `rgba(255, 85, 0, ${p.alpha * 0.75})`);
        grad.addColorStop(1, 'rgba(255, 40, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * p.stretch, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(animateEmbers);
    };

    animId = requestAnimationFrame(animateEmbers);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section className="hero-bg flex flex-col justify-between px-4 sm:px-8 md:px-14 pt-24 sm:pt-28 pb-8 relative min-h-[92dvh] overflow-hidden">
      <div className="noise-overlay" />
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Contenido Central */}
      <div className="relative z-20 flex-1 grid grid-cols-12 items-center max-w-7xl w-full mx-auto py-6 sm:py-12 gap-8 lg:gap-12">
        
        {/* Columna Izquierda: Mensaje y Acción */}
        <div className="col-span-12 lg:col-span-6 flex flex-col items-start text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1815] border border-[#382e25] text-xs font-semibold text-orange-400 mb-4 sm:mb-6">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>SPORTING ARGENTINA · MONITOR CONTINUO</span>
          </div>

          <h1 className="headline text-5xl sm:text-7xl xl:text-8xl mb-4 sm:mb-6 uppercase">
            Descuentos reales<br />
            en zapatillas
          </h1>

          <p className="text-stone-300 text-base sm:text-xl font-normal max-w-xl leading-relaxed mb-8">
            Revisamos bajas de precio y stock real cada 30 minutos para que compres únicamente cuando un par toca su piso histórico.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {onExploreClick && (
              <button
                type="button"
                onClick={onExploreClick}
                className="btn-telegram px-7 py-3.5 rounded text-sm sm:text-base font-bold uppercase inline-flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Explorar ofertas</span>
                <ArrowDown className="w-4 h-4" />
              </button>
            )}

            <div className="px-4 py-3 rounded bg-[#181513] border border-[#2e2620] text-xs text-stone-300 text-center sm:text-left">
              <span className="font-bold text-orange-400 tabular-nums">+{totalProductos.toLocaleString('es-AR')}</span> pares bajo monitoreo
            </div>
          </div>
        </div>

        {/* Columna Derecha: Zapatilla Flotante & Resplandor Cálido */}
        <div className="col-span-12 lg:col-span-6 relative flex items-center justify-center mt-6 lg:mt-0">
          <div className="relative w-full max-w-[340px] sm:max-w-[480px] h-[260px] sm:h-[400px] flex items-center justify-center">
            
            {/* Halo de fuego suave de fondo */}
            <div className="absolute w-56 sm:w-80 h-32 sm:h-48 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Zapatilla Flotante */}
            <div className="sneaker-wrapper relative z-20 flex items-center justify-center">
              <div className="w-48 sm:w-72 h-10 sm:h-14 bg-orange-500/25 rounded-full blur-2xl absolute -bottom-4 pointer-events-none" />
              <img
                src="https://pngimg.com/uploads/running_shoes/running_shoes_PNG5816.png"
                alt="Zapatilla deportiva en oferta"
                className="sneaker-photo select-none pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de continuidad inferior */}
      <div className="relative z-20 flex items-center justify-between max-w-7xl w-full mx-auto pt-4 text-xs text-stone-400">
        <span>Actualización automática cada 30 min</span>
        <span>Sin registros inflados ni cupones falsos</span>
      </div>
    </section>
  );
};
