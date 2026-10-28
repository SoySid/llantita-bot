'use client';

import React, { useEffect, useRef } from 'react';

interface AboutSectionProps {
  onExploreClick?: () => void;
  totalProductos?: number;
  ultimaActualizacion?: string | null;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onExploreClick,
  totalProductos = 1897,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const embers = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.8 + 0.8,
      speedX: (Math.random() - 0.3) * 0.7,
      speedY: -(Math.random() * 0.9 + 0.2),
      alpha: Math.random() * 0.85 + 0.15,
      angle: Math.random() * Math.PI * 2,
      stretch: Math.random() * 3 + 1,
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
        grad.addColorStop(0, `rgba(255, 200, 110, ${p.alpha})`);
        grad.addColorStop(0.5, `rgba(255, 95, 0, ${p.alpha * 0.8})`);
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
    <section className="hero-bg flex flex-col justify-between px-4 sm:px-8 md:px-14 pt-20 sm:pt-24 pb-4 sm:pb-8 select-none relative min-h-[100dvh] overflow-hidden">
      <div className="noise-overlay" />
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Marco Superior Central Biselado */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-7 pointer-events-none z-20 hidden md:flex flex-col items-center">
        <div
          className="w-full h-full border-b-2 border-l-2 border-r-2 border-orange-500/40 bg-gradient-to-b from-orange-950/50 to-transparent"
          style={{ clipPath: 'polygon(0 0, 100% 0, 88% 100%, 12% 100%)' }}
        >
          <div className="w-3/5 h-1.5 mx-auto mt-1 bg-orange-500/30 rounded-full" />
        </div>
      </div>

      {/* Marco Lateral Izquierdo */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-96 pointer-events-none z-20 opacity-80 hidden lg:block">
        <svg viewBox="0 0 36 400" className="w-full h-full fill-[#171312] stroke-orange-500/40 stroke-1">
          <path d="M0,0 L28,35 L28,140 L14,155 L14,245 L28,260 L28,365 L0,400 Z" />
          <rect x="4" y="55" width="12" height="55" fill="none" stroke="#ff6600" strokeOpacity="0.3" />
          <rect x="6" y="185" width="14" height="16" fill="#ff7700" fillOpacity="0.25" />
        </svg>
      </div>

      {/* Marco Lateral Derecho */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-96 pointer-events-none z-20 opacity-85 hidden lg:block">
        <svg viewBox="0 0 40 400" className="w-full h-full fill-[#151414] stroke-[#332e2e] stroke-2">
          <path d="M40,0 L8,35 L8,145 L22,160 L22,240 L8,255 L8,365 L40,400 Z" />
          <circle cx="22" cy="80" r="6" fill="none" stroke="#443e3e" strokeWidth="2" />
          <rect x="15" y="280" width="14" height="50" rx="2" fill="#0d0c0c" stroke="#2c2828" />
        </svg>
      </div>

      {/* CONTENIDO CENTRAL */}
      <div className="relative z-20 flex-1 grid grid-cols-12 items-center max-w-[1440px] w-full mx-auto py-4 sm:py-8 gap-6 lg:gap-8">
        <div className="col-span-12 lg:col-span-6 pl-1 sm:pl-4 md:pl-8 relative text-left flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#1e1713]/80 border border-orange-500/30 text-[10px] sm:text-xs hud-mono text-orange-400/90 tracking-widest uppercase mb-3 sm:mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff5500] animate-pulse" />
            <span>RADAR DE PRECIOS // SPORTING</span>
          </div>

          <h1 className="headline text-4xl sm:text-6xl xl:text-[5.4rem] mb-3 sm:mb-5 leading-[0.95] tracking-tight">
            Descuentos reales<br />
            en zapatillas
          </h1>

          <p className="text-stone-300/85 text-sm sm:text-lg sm:text-xl font-normal max-w-xl leading-relaxed sm:leading-snug tracking-normal mb-6 sm:mb-8 text-pretty">
            Monitoreamos bajas de precio y stock en Sporting cada<br className="hidden sm:inline" />
            {' '}30 minutos para que compres en su piso histórico.
          </p>

          {onExploreClick && (
            <button
              onClick={onExploreClick}
              className="inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded bg-[#1c1410] border border-orange-500/40 hover:border-orange-500 text-stone-200 hover:text-white font-barlow font-bold text-base sm:text-lg tracking-wider uppercase transition-all shadow-[0_4px_20px_rgba(0,0,0,0.8)] active:scale-[0.98] cursor-pointer w-full sm:w-auto"
            >
              <span>EXPLORAR RADAR</span>
              <svg className="w-4 h-4 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        <div className="col-span-12 lg:col-span-6 relative flex items-center justify-center h-full mt-4 sm:mt-6 lg:mt-0">
          <div className="relative w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[460px] md:max-w-[500px] h-[240px] xs:h-[280px] sm:h-[400px] md:h-[440px] flex items-center justify-center">
            {/* Retícula en cruz */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-45">
              <div className="w-[260px] xs:w-[300px] sm:w-[440px] h-[1px] bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
              <div className="h-[240px] xs:h-[280px] sm:h-[420px] w-[1px] bg-gradient-to-b from-transparent via-orange-500/60 to-transparent absolute" />
            </div>

            {/* Radar Glowing Rings */}
            <svg viewBox="0 0 400 400" className="w-[240px] xs:w-[280px] sm:w-[380px] h-[240px] xs:h-[280px] sm:h-[380px] absolute pointer-events-none select-none">
              <defs>
                <radialGradient id="orangeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ff6600" stopOpacity="0.42" />
                  <stop offset="60%" stopColor="#ff3300" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#ff3300" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="200" cy="200" r="185" fill="url(#orangeGlow)" />
              <circle cx="200" cy="200" r="165" fill="none" stroke="#ff6a00" strokeOpacity="0.55" strokeWidth="1.5" />
              <circle cx="200" cy="200" r="142" fill="none" stroke="#ff8800" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="8 6" className="ring-spin" style={{ transformOrigin: '200px 200px' }} />
              <circle cx="200" cy="200" r="115" fill="none" stroke="#ff5500" strokeOpacity="0.35" strokeWidth="1" />
            </svg>

            {/* Código de barras superior derecho */}
            <div className="absolute top-2 sm:top-8 md:top-12 -right-1 sm:-right-4 hud-mono text-[8px] sm:text-[9px] text-stone-400/60 tracking-widest flex flex-col items-end">
              <div className="flex h-5 sm:h-6 items-stretch gap-[2px] opacity-60">
                <span className="w-[2px] bg-stone-400" /><span className="w-[1px] bg-stone-400" /><span className="w-[3px] bg-stone-400" />
                <span className="w-[1px] bg-stone-400 ml-1" /><span className="w-[2px] bg-stone-400" /><span className="w-[4px] bg-stone-400" />
                <span className="w-[1px] bg-stone-400" /><span className="w-[2px] bg-stone-400 ml-0.5" /><span className="w-[3px] bg-stone-400" />
                <span className="w-[1px] bg-stone-400" /><span className="w-[2px] bg-stone-400" /><span className="w-[1px] bg-stone-400" />
                <span className="w-[3px] bg-stone-400 ml-1" /><span className="w-[2px] bg-stone-400" /><span className="w-[1px] bg-stone-400" />
              </div>
              <span className="mt-0.5">21AE 0503</span>
            </div>

            {/* Ángulo HUD derecho */}
            <div className="absolute right-2 bottom-20 sm:bottom-32 md:bottom-36 w-5 sm:w-6 h-5 sm:h-6 border-r border-b border-stone-400/50 pointer-events-none">
              <div className="w-3 sm:w-4 h-[1px] bg-stone-400/50 rotate-45 origin-bottom-right absolute bottom-0 right-0" />
            </div>

            {/* Zapatilla flotante 3D */}
            <div className="sneaker-wrapper relative z-20 flex items-center justify-center -mt-3 sm:-mt-6">
              <div className="w-44 xs:w-52 sm:w-72 h-10 xs:h-12 sm:h-16 bg-orange-500/40 rounded-full blur-xl sm:blur-2xl absolute bottom-2 pointer-events-none" />
              <img 
                src="https://pngimg.com/uploads/running_shoes/running_shoes_PNG5816.png" 
                alt="Zapatilla Táctica Llantita" 
                className="sneaker-photo select-none pointer-events-none w-[220px] xs:w-[260px] sm:w-[380px] md:w-[440px] max-w-full"
              />
            </div>

            {/* Base Holográfica Táctil */}
            <div className="absolute -bottom-6 xs:-bottom-8 sm:-bottom-12 w-[260px] xs:w-[320px] sm:w-[500px] md:w-[540px] h-[130px] xs:h-[150px] sm:h-[200px] md:h-[220px] flex items-center justify-center pointer-events-none z-10">
              <div className="holo-base w-full h-full flex items-center justify-center relative">
                <svg viewBox="0 0 500 500" className="w-[240px] xs:w-[300px] sm:w-[440px] md:w-[480px] h-[240px] xs:h-[300px] sm:h-[440px] md:h-[480px] overflow-visible">
                  <defs>
                    <radialGradient id="baseFire" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ff7700" stopOpacity="0.7" />
                      <stop offset="45%" stopColor="#ff4400" stopOpacity="0.32" />
                      <stop offset="75%" stopColor="#ff2200" stopOpacity="0.06" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="250" cy="250" r="240" fill="url(#baseFire)" />
                  <circle cx="250" cy="250" r="230" fill="none" stroke="#ff5500" strokeWidth="1.5" strokeOpacity="0.5" />
                  <circle cx="250" cy="250" r="210" fill="none" stroke="#ff8800" strokeWidth="2.5" strokeDasharray="18 8 4 8" className="ring-spin" style={{ transformOrigin: '250px 250px' }} />
                  <circle cx="250" cy="250" r="192" fill="none" stroke="#ff6600" strokeWidth="8" strokeDasharray="2 6" strokeOpacity="0.75" className="ring-spin-rev" style={{ transformOrigin: '250px 250px' }} />
                  <circle cx="250" cy="250" r="168" fill="none" stroke="#ffaa00" strokeWidth="4" strokeOpacity="0.9" />
                  <circle cx="250" cy="250" r="145" fill="none" stroke="#ff5500" strokeWidth="12" strokeOpacity="0.35" />
                  <circle cx="250" cy="250" r="125" fill="none" stroke="#ffcc66" strokeWidth="2" strokeDasharray="40 18" className="ring-spin" style={{ transformOrigin: '250px 250px' }} />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER DEL HERO */}
      <footer className="relative z-30 flex items-end justify-between w-full pb-2 px-1 sm:px-4">
        <div className="hud-mono text-[9px] sm:text-[10px] text-stone-400/60 tracking-widest">
          <div className="flex items-stretch h-5 sm:h-7 gap-[2px] opacity-60">
            <span className="w-[2px] bg-stone-400" /><span className="w-[1px] bg-stone-400" /><span className="w-[3px] bg-stone-400" />
            <span className="w-[2px] bg-stone-400 ml-0.5" /><span className="w-[1px] bg-stone-400" /><span className="w-[4px] bg-stone-400" />
            <span className="w-[1px] bg-stone-400" /><span className="w-[2px] bg-stone-400" /><span className="w-[3px] bg-stone-400 ml-0.5" />
            <span className="w-[1px] bg-stone-400" /><span className="w-[2px] bg-stone-400" /><span className="w-[2px] bg-stone-400" />
          </div>
          <div className="mt-0.5 text-[8px] tracking-[0.25em]">8 118222188 9</div>
        </div>

        <div className="hud-mono text-right text-stone-400/70 mr-1 sm:mr-6">
          <div className="text-lg sm:text-2xl font-bold text-stone-300/60 leading-none tracking-wider">01</div>
          <div className="text-[10px] sm:text-xs tracking-widest text-stone-400/70 mb-1">X-DS</div>
        </div>
      </footer>
    </section>
  );
};
