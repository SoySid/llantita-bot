'use client';

import React from 'react';

interface AboutSectionProps {
  onExploreClick?: () => void;
  totalProductos?: number;
  ultimaActualizacion?: string | null;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onExploreClick,
  totalProductos = 1872,
}) => {
  return (
    <section className="hero-viewport relative select-none h-screen min-h-[660px] max-h-[1080px] flex flex-col justify-between overflow-hidden p-[3.2vh_4vw] lg:p-[3.6vh_5.5vw]">
      {/* Bordes incandescentes */}
      <div className="left-burn-edge" aria-hidden="true" />
      <div className="right-burn-edge" aria-hidden="true" />

      {/* Marco metálico superior HUD */}
      <svg
        className="hud-frame-top"
        viewBox="0 0 340 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M10 0H330L305 34H230L218 22H122L110 34H35L10 0Z" fill="#181412" stroke="#4a3525" strokeWidth="1.5"/>
        <path d="M50 0H290L275 20H65L50 0Z" fill="#261912" stroke="#ff6a1a" strokeOpacity="0.45" strokeWidth="1"/>
        <line x1="0" y1="22" x2="42" y2="22" stroke="#5a3d28" strokeWidth="1"/>
        <line x1="298" y1="22" x2="340" y2="22" stroke="#5a3d28" strokeWidth="1"/>
      </svg>

      {/* Marco metálico inferior HUD */}
      <svg
        className="hud-frame-bottom"
        viewBox="0 0 340 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M15 48L42 10H112L126 24H214L228 10H298L325 48H15Z" fill="#141312" stroke="#2e2c2a" strokeWidth="2"/>
        <path d="M52 48L70 22H110L122 34H218L230 22H270L288 48H52Z" fill="#0d0c0b" stroke="#242220" strokeWidth="1.5"/>
      </svg>

      {/* Marco lateral izquierdo HUD */}
      <svg
        className="hud-frame-left hidden lg:block"
        viewBox="0 0 36 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M0 10L24 38V175L12 190V250L24 265V402L0 430" stroke="#59351f" strokeWidth="1.5" fill="rgba(20,14,10,0.45)"/>
        <line x1="18" y1="60" x2="18" y2="160" stroke="#ff6a1a" strokeOpacity="0.3" strokeWidth="1"/>
      </svg>

      {/* Marco lateral derecho HUD */}
      <svg
        className="hud-frame-right hidden lg:block"
        viewBox="0 0 48 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M48 0L14 34V185L26 200V260L14 275V426L48 460H48V0Z" fill="#121110" stroke="#2c2a29" strokeWidth="2"/>
        <path d="M44 45L24 65V175L34 190V270L24 285V395L44 415" stroke="#3a3735" strokeWidth="1.2"/>
      </svg>

      {/* Capa de chispas y brasas de fuego */}
      <div className="embers-layer" aria-hidden="true">
        <span className="ember" style={{ width: 4, height: 4, top: '19%', left: '34%' }} />
        <span className="ember" style={{ width: 6, height: 3, top: '21%', left: '56%', transform: 'rotate(35deg)' }} />
        <span className="ember" style={{ width: 3, height: 3, top: '14%', left: '48%' }} />
        <span className="ember" style={{ width: 5, height: 2, top: '31%', left: '5.8%', transform: 'rotate(-65deg)' }} />
        <span className="ember" style={{ width: 3, height: 3, top: '43%', left: '54%' }} />
        <span className="ember" style={{ width: 4, height: 4, top: '67%', left: '23%' }} />
        <span className="ember" style={{ width: 5, height: 3, top: '69%', left: '29.5%', transform: 'rotate(25deg)' }} />
        <span className="ember" style={{ width: 4, height: 2, top: '73%', left: '45%' }} />
        <span className="ember" style={{ width: 6, height: 3, top: '85%', left: '19%', transform: 'rotate(-20deg)' }} />
        <span className="ember" style={{ width: 9, height: 3, top: '90%', left: '8.5%', transform: 'rotate(-45deg)', background: '#ff944d' }} />
        <span className="ember" style={{ width: 4, height: 4, top: '95%', left: '31%' }} />
        <span className="ember" style={{ width: 4, height: 4, top: '95%', left: '67%' }} />
        <span className="ember" style={{ width: 5, height: 2, top: '88%', left: '93%' }} />
      </div>

      {/* Barra Superior con Insignia Metálica */}
      <header className="relative z-10 flex items-center justify-between w-full px-1 sm:px-4">
        {/* Insignia metálica LLANTITA */}
        <div className="brand-badge">
          <div className="cat-shield-wrapper">
            <img src="/cat-shield.jpg" alt="Escudo Gato Llantita" />
          </div>
          <span className="brand-title">LLANTITA</span>
          <span className="rivet tr" />
          <span className="rivet br" />
        </div>

        {/* Acciones superiores */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="status-pill font-barlow tracking-wider">
            {totalProductos > 0 ? `${totalProductos.toLocaleString('es-AR')} PARES ACTIVOS` : '1.872 PARES ACTIVOS'}
          </div>

          <a
            href="https://t.me/llantita_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="telegram-btn"
          >
            <span>ALERTAS TELEGRAM</span>
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.9 2.6L1.8 10.4c-.8.3-.8 1.1-.1 1.4l5.1 1.6 11.8-7.4c.6-.3 1.1-.1.7.2l-9.6 8.7-.3 4.8c.4 0 .6-.2.9-.4l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8L22.9 3.8c.3-1.1-.4-1.6-1-1.2z"/>
            </svg>
          </a>
        </div>
      </header>

      {/* Escenario Central */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] items-center w-full flex-1 px-1 sm:px-4 py-2 sm:py-4 gap-4 sm:gap-6">
        {/* Columna Izquierda: Texto y Coordenadas */}
        <div className="max-w-[640px] pt-1">
          {/* Eje de coordenadas X/Y HUD */}
          <div className="coord-axis">
            <svg width="46" height="48" viewBox="0 0 46 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="9" fill="#8d8984" fontFamily="monospace" fontSize="9">Y</text>
              <circle cx="3" cy="17" r="2" stroke="#8d8984" strokeWidth="1"/>
              <path d="M3 19V42H30" stroke="#8d8984" strokeWidth="1"/>
              <circle cx="33" cy="42" r="2" stroke="#8d8984" strokeWidth="1"/>
              <text x="38" y="45" fill="#8d8984" fontFamily="monospace" fontSize="9">1</text>
            </svg>
          </div>

          <h1 className="font-anton text-4xl sm:text-6xl lg:text-[clamp(3.2rem,5.5vw,5.4rem)] leading-[1.01] tracking-[0.01em] text-[#e5e5e5] drop-shadow-[0_6px_24px_rgba(0,0,0,0.85)] mb-4">
            Descuentos reales<br />en zapatillas
          </h1>

          <p className="font-sans text-sm sm:text-base lg:text-[clamp(0.95rem,1.3vw,1.2rem)] text-[#969696] max-w-[520px] leading-relaxed mb-6">
            Monitoreamos bajas de precio y stock en Sporting cada 30 minutos para que compres en su piso histórico.
          </p>

          {onExploreClick && (
            <button
              onClick={onExploreClick}
              className="inline-flex items-center gap-3 px-5 py-3 rounded-md bg-[#1d1916] hover:bg-[#26211d] border border-[#5c4737] hover:border-[#ff6a1a] text-[#f2ede7] hover:text-white font-barlow font-bold text-base tracking-wider uppercase transition-all active:scale-[0.98] cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
            >
              <span>EXPLORAR CATÁLOGO</span>
              <svg className="w-4 h-4 text-[#ff6a1a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Columna Derecha: Escena Holográfica + Zapatilla Realista */}
        <div className="sneaker-showcase relative flex items-center justify-center h-full">
          <div className="relative w-[340px] sm:w-[440px] lg:w-[480px] h-[460px] flex items-center justify-center">
            
            {/* Mira / Cuadrícula fina trasera */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-45">
              <div className="w-[320px] sm:w-[440px] h-[1px] bg-gradient-to-r from-transparent via-orange-500/60 to-transparent"></div>
              <div className="h-[320px] sm:h-[440px] w-[1px] bg-gradient-to-b from-transparent via-orange-500/60 to-transparent absolute"></div>
            </div>

            {/* Círculo Naranja Vertical Trasero */}
            <svg viewBox="0 0 400 400" className="w-[300px] sm:w-[380px] h-[300px] sm:h-[380px] absolute pointer-events-none select-none">
              <defs>
                <radialGradient id="orangeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ff6600" stopOpacity="0.42"/>
                  <stop offset="60%" stopColor="#ff3300" stopOpacity="0.12"/>
                  <stop offset="100%" stopColor="#ff3300" stopOpacity="0"/>
                </radialGradient>
              </defs>
              <circle cx="200" cy="200" r="185" fill="url(#orangeGlow)" />
              <circle cx="200" cy="200" r="165" fill="none" stroke="#ff6a00" strokeOpacity="0.55" strokeWidth="1.5" />
              <circle cx="200" cy="200" r="142" fill="none" stroke="#ff8800" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="8 6" className="ring-spin" style={{ transformOrigin: '200px 200px' }} />
              <circle cx="200" cy="200" r="115" fill="none" stroke="#ff5500" strokeOpacity="0.35" strokeWidth="1" />
            </svg>

            {/* Código de barras superior derecho */}
            <div className="hud-barcode-top-right">
              <div className="barcode-bars">
                <span style={{ width: 2 }} /><span style={{ width: 1 }} /><span style={{ width: 3 }} /><span style={{ width: 1 }} /><span style={{ width: 2 }} /><span style={{ width: 4 }} /><span style={{ width: 1 }} /><span style={{ width: 2 }} /><span style={{ width: 1 }} /><span style={{ width: 3 }} /><span style={{ width: 2 }} /><span style={{ width: 1 }} /><span style={{ width: 2 }} /><span style={{ width: 3 }} /><span style={{ width: 1 }} /><span style={{ width: 2 }} /><span style={{ width: 1 }} /><span style={{ width: 3 }} />
              </div>
              <div className="barcode-label">21AE 0503</div>
            </div>

            {/* Ángulo HUD derecho */}
            <div className="absolute right-0 sm:right-2 bottom-32 sm:bottom-36 w-6 h-6 border-r border-b border-stone-400/50 pointer-events-none">
              <div className="w-4 h-[1px] bg-stone-400/50 rotate-45 origin-bottom-right absolute bottom-0 right-0"></div>
            </div>

            {/* ZAPATILLA CON ANIMACIÓN 3D Y RESPLANDOR */}
            <div id="sneakerContainer" className="sneaker-wrapper relative z-20 flex items-center justify-center -mt-6">
              {/* Resplandor de lava debajo de la suela */}
              <div className="w-56 sm:w-72 h-14 sm:h-16 bg-orange-500/40 rounded-full blur-2xl absolute bottom-2 pointer-events-none"></div>
              
              {/* Imagen PNG transparente con filtros tácticos */}
              <img 
                id="sneakerImg"
                src="/running-sneaker.png" 
                alt="Zapatilla Táctica Llantita" 
                className="sneaker-photo select-none pointer-events-none"
              />
            </div>

            {/* PLATAFORMA HOLOGRÁFICA NARANJA EN LA BASE */}
            <div className="absolute -bottom-10 sm:-bottom-12 w-[340px] sm:w-[500px] lg:w-[540px] h-[180px] sm:h-[220px] flex items-center justify-center pointer-events-none z-10 overflow-visible">
              <div className="holo-base w-full h-full flex items-center justify-center relative">
                <svg viewBox="0 0 500 500" className="w-[320px] sm:w-[440px] lg:w-[480px] h-[320px] sm:h-[440px] lg:h-[480px] overflow-visible">
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

            {/* Metadatos inferiores derechos (01 / X-DS) */}
            <div className="hud-bottom-right-meta hidden sm:block">
              <div className="num-code font-mono text-2xl text-[#b8aba0] tracking-wider leading-none">01</div>
              <div className="sub-code font-mono text-xs text-[#8c857e] tracking-[0.14em] mt-1 mb-2">X-DS</div>
              <div className="hud-data-blocks">
                <span style={{ width: 7, height: 14 }} />
                <span style={{ width: 3, height: 18 }} />
                <span style={{ width: 2, height: 18 }} />
                <span style={{ width: 10, height: 18 }} />
                <span style={{ width: 18, height: 14, border: '1px solid #8c857e', background: 'transparent' }} />
              </div>
              <div className="barcode-label" style={{ letterSpacing: '0.2em', marginTop: 4 }}>01z0 - 0 8</div>
            </div>

          </div>
        </div>
      </div>

      {/* Código de barras inferior izquierdo */}
      <div className="hud-barcode-bottom-left">
        <div className="barcode-bars">
          <span style={{ width: 1 }} /><span style={{ width: 3 }} /><span style={{ width: 1 }} /><span style={{ width: 2 }} /><span style={{ width: 1 }} /><span style={{ width: 4 }} /><span style={{ width: 2 }} /><span style={{ width: 1 }} /><span style={{ width: 3 }} /><span style={{ width: 1 }} /><span style={{ width: 2 }} /><span style={{ width: 3 }} /><span style={{ width: 1 }} /><span style={{ width: 2 }} /><span style={{ width: 4 }} /><span style={{ width: 1 }} /><span style={{ width: 3 }} /><span style={{ width: 1 }} />
        </div>
        <div className="barcode-label">9 118222188 9</div>
      </div>
    </section>
  );
};
