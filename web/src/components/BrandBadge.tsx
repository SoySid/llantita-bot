import React from 'react';

interface BrandProps {
  marca?: string | null;
  className?: string;
}

export const BrandIcon: React.FC<{ marca?: string | null; className?: string }> = ({
  marca = '',
  className = 'h-4 w-4',
}) => {
  const m = (marca || '').toUpperCase();

  if (m === 'NIKE') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.504-.41-1.143-.28-1.918.13-.775.476-1.6 1.036-2.478.467-.71 1.232-1.643 2.297-2.8a6.122 6.122 0 00-.784 1.848c-.28 1.195-.028 2.072.756 2.632.373.261.886.392 1.54.392.522 0 1.11-.084 1.764-.252L24 7.8z" />
      </svg>
    );
  }
  if (m === 'ADIDAS' || m === 'ADIDAS ORIGINALS') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="m24 19.535-8.697-15.07-4.659 2.687 7.145 12.383Zm-8.287 0L9.969 9.59 5.31 12.277l4.192 7.258ZM4.658 14.723l2.776 4.812H1.223L0 17.41Z" />
      </svg>
    );
  }
  if (m === 'PUMA') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.845 3.008c-.417-.533-1.146-.106-1.467.08-2.284 1.346-2.621 3.716-3.417 5.077-.626 1.09-1.652 1.89-2.58 1.952-.686.049-1.43-.084-2.168-.405-1.807-.781-2.78-1.792-3.017-1.97-.487-.37-4.23-4.015-7.28-4.164 0 0-.372-.75-.465-.763-.222-.025-.45.451-.616.501-.15.053-.413-.512-.565-.487-.153.02-.302.586-.6.877-.22.213-.486.2-.637.463-.052.096-.034.265-.093.42-.127.32-.551.354-.555.697 0 .381.357.454.669.72.248.212.265.362.554.461.258.088.632-.187.964-.088.277.081.543.14.602.423.054.256 0 .658-.34.613-.112-.015-.598-.174-1.198-.11-.725.077-1.553.309-1.634 1.11-.041.447.514.97 1.055.866.371-.071.196-.506.399-.716.267-.27 1.772.944 3.172.944.593 0 1.031-.15 1.467-.605.04-.029.093-.102.155-.11a.632.632 0 01.195.088c1.131.897 1.984 2.7 6.13 2.721.582.007 1.25.279 1.796.777.48.433.764 1.125 1.037 1.825.418 1.053 1.161 2.069 2.292 3.203.06.068.99.78 1.06.833.012.01.084.167.053.255-.02.69-.123 2.67 1.365 2.753.366.02.275-.231.275-.41-.005-.341-.065-.685.113-1.04.253-.478-.526-.709-.509-1.756.019-.784-.645-.651-.984-1.25-.19-.343-.368-.532-.35-.946.073-2.38-.517-3.948-.805-4.327-.227-.294-.423-.403-.207-.54 1.24-.815 1.525-1.574 1.525-1.574.66-1.541 1.256-2.945 2.075-3.57.166-.12.589-.44.852-.56.763-.362 1.173-.578 1.388-.788.356-.337.635-1.053.294-1.48z" />
      </svg>
    );
  }
  if (m === 'FILA') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.814 8.027c-.614 0-1.113.498-1.113 1.113v5.72a1.113 1.113 0 0 0 2.226 0V9.14c0-.614-.498-1.113-1.113-1.113m-2.849.078H1.113a1.113 1.113 0 0 0 0 2.226h4.852a1.113 1.113 0 0 0 0-2.226m17.411 4.417L21.03 8.705c-.275-.444-.65-.658-1.125-.658-.488 0-.904.229-1.162.658l-2.715 4.5c-.186.308-.4.436-.753.436h-2.019a.275.275 0 0 1-.285-.284V9.102c0-.613-.497-1.075-1.11-1.075-.614 0-1.11.463-1.11 1.076v5.215c0 .784.774 1.544 1.544 1.544h4.064c.576 0 .963-.42 1.292-.996l2.114-3.627c.018-.04.053-.091.093-.091.043 0 .07.051.091.088l1.384 2.22c.058.094.069.141.032.225-.033.077-.108.093-.23.093h-1.943a1.044 1.044 0 1 0 0 2.088h3.17c.77 0 1.638-.734 1.638-1.693 0-.608-.117-.822-.624-1.647M5.431 10.954H1.113c-.615 0-1.113.498-1.113 1.113v2.715a1.113 1.113 0 1 0 2.226 0v-1.268c0-.185.15-.334.334-.334h2.87a1.113 1.113 0 0 0 0-2.226" />
      </svg>
    );
  }
  if (m === 'UNDER ARMOUR') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.954 12c-.089.066-.195.142-.324.233-.826.585-2.023.985-3.58.985h-.104c-1.556 0-2.755-.4-3.58-.985A36.43 36.43 0 018.042 12c.09-.067.196-.143.324-.234.825-.584 2.024-.985 3.58-.985h.104c1.557 0 2.756.401 3.58.985.129.09.235.167.325.234M24 7.181s-.709-.541-2.95-1.365c-1.968-.721-3.452-.883-3.452-.883l.006 4.243c0 .598-.162 1.143-.618 1.765-1.672-.61-3.254-.985-4.981-.985-1.728 0-3.308.375-4.98.985-.457-.619-.62-1.168-.62-1.765l.007-4.243s-1.494.16-3.463.883C.709 6.642 0 7.181 0 7.181c.093 1.926 1.78 3.638 4.435 4.82C1.777 13.18.09 14.887 0 16.818c0 0 .709.54 2.949 1.365 1.968.721 3.453.883 3.453.883l-.007-4.244c0-.597.164-1.143.619-1.764 1.672.61 3.252.983 4.98.983 1.727 0 3.309-.374 4.98-.983.457.62.62 1.167.62 1.764l-.006 4.244s1.484-.16 3.452-.883c2.241-.826 2.95-1.365 2.95-1.365-.093-1.927-1.78-3.64-4.435-4.819 2.657-1.182 4.343-2.888 4.435-4.82" />
      </svg>
    );
  }
  if (m === 'TOPPER') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.5 7h19v3.8h-7v8.2h-5v-8.2h-7V7z" />
      </svg>
    );
  }
  if (m === 'SALOMON') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2 15c-2.8 0-4.5-1.4-4.5-3.2 0-2.4 4.2-2.5 4.2-4.1 0-.7-.6-1.2-1.5-1.2-1 0-1.9.5-2.6 1.3l-1.5-1.7c1.1-1.2 2.6-1.8 4.2-1.8 2.6 0 4.2 1.4 4.2 3.2 0 2.5-4.2 2.6-4.2 4.2 0 .8.7 1.3 1.6 1.3 1.1 0 2.1-.6 2.9-1.5l1.4 1.7c-1.1 1.2-2.4 1.8-3.9 1.8z" />
      </svg>
    );
  }
  if (m === 'SAUCONY') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="8" cy="8" r="1.8" />
        <circle cx="12" cy="7.5" r="1.8" />
        <circle cx="16" cy="8" r="1.8" />
        <path d="M3 17c4-2 7-3 10-1 3 2 6 2 8 0" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (m === 'ON') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="8.5" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <path d="M15.5 7.5v9h2.4v-9h-2.4z" />
      </svg>
    );
  }
  if (m === 'HOKA') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 7.5c-3 2.2-7.5 4.8-12 4.8-2.2 0-3.8-.6-4.8-1.6 2.8 3.2 7.2 5.8 12.2 5.8 2.2 0 3.8-.6 4.8-1.6-1.6-2.2-1.6-5.4-.2-7.4z" />
      </svg>
    );
  }
  if (m === 'JOMA') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.5 5h4.5v8.5c0 1.7 1.2 2.8 2.8 2.8s2.8-1.1 2.8-2.8V5h4.5v8.5c0 4-3.3 7.2-7.3 7.2s-7.3-3.2-7.3-7.2V5z" />
      </svg>
    );
  }
  if (m === 'SHIMANO') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="12" cy="12" r="3.5" />
      </svg>
    );
  }
  if (m === 'FOOTY') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12,2.5 15,8.8 21.5,9.7 16.8,14.3 17.9,20.8 12,17.7 6.1,20.8 7.2,14.3 2.5,9.7 9,8.8" />
      </svg>
    );
  }
  if (m === 'ATOMIK' || m === 'VOLTA') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <polygon points="13,2 3,13.5 12,13.5 11,22 21,10.5 12,10.5" />
      </svg>
    );
  }
  if (m === 'HUSH PUPPIES') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.5 9c0-3.5 2.8-5.5 6.5-5.5s6.5 2 6.5 5.5v5.5c0 3.5-2.8 5-6.5 5s-6.5-1.5-6.5-5V9zm2.5 5.5c0 1.8 1.8 2.5 4 2.5s4-.7 4-2.5v-3.5H8v3.5z" />
      </svg>
    );
  }

  return (
    <span className="flex h-4 w-4 items-center justify-center rounded text-[10px] font-black uppercase bg-zinc-800 text-zinc-400">
      {(marca || '?').charAt(0)}
    </span>
  );
};

export const BrandWordmark: React.FC<{ marca?: string | null; isSelected?: boolean; className?: string }> = ({
  marca = '',
  isSelected = false,
  className = '',
}) => {
  const m = (marca || '').toUpperCase();

  if (m === 'NIKE') {
    return (
      <span className={`font-black italic uppercase tracking-tighter text-xs font-sans scale-y-110 ${className}`}>
        NIKE
      </span>
    );
  }
  if (m === 'ADIDAS' || m === 'ADIDAS ORIGINALS') {
    return (
      <span className={`font-extrabold lowercase tracking-tight text-xs font-sans ${className}`}>
        adidas
      </span>
    );
  }
  if (m === 'PUMA') {
    return (
      <span className={`font-black uppercase tracking-wider text-[11px] font-sans ${className}`}>
        PUMA
      </span>
    );
  }
  if (m === 'FILA') {
    return (
      <span className={`font-black uppercase tracking-widest text-[11px] font-mono ${className}`}>
        <span className={isSelected ? 'text-zinc-950' : 'text-rose-500'}>F</span>ILA
      </span>
    );
  }
  if (m === 'TOPPER') {
    return (
      <span className={`font-black uppercase tracking-tight text-[11px] font-sans ${className}`}>
        TOPPER
      </span>
    );
  }
  if (m === 'UNDER ARMOUR') {
    return (
      <span className={`font-black uppercase tracking-tighter text-[9px] leading-tight font-sans ${className}`}>
        UNDER ARMOUR
      </span>
    );
  }
  if (m === 'SALOMON') {
    return (
      <span className={`font-black uppercase tracking-widest text-[10px] font-mono ${className}`}>
        SALOMON
      </span>
    );
  }
  if (m === 'SAUCONY') {
    return (
      <span className={`font-extrabold uppercase tracking-tight text-[11px] italic font-serif ${className}`}>
        Saucony
      </span>
    );
  }
  if (m === 'ON') {
    return (
      <span className={`font-black tracking-normal text-xs font-sans ${className}`}>
        On
      </span>
    );
  }
  if (m === 'HOKA') {
    return (
      <span className={`font-black uppercase tracking-wider text-[10px] font-sans ${className}`}>
        HOKA
      </span>
    );
  }
  if (m === 'SHIMANO') {
    return (
      <span className={`font-black italic uppercase tracking-normal text-[10px] font-sans ${isSelected ? 'text-zinc-950' : 'text-sky-400'} ${className}`}>
        SHIMANO
      </span>
    );
  }
  if (m === 'JOMA') {
    return (
      <span className={`font-black uppercase tracking-tight text-[10px] font-sans ${className}`}>
        JOMA
      </span>
    );
  }
  if (m === 'FOOTY') {
    return (
      <span className={`font-black uppercase tracking-wide text-[10px] font-sans ${className}`}>
        FOOTY
      </span>
    );
  }
  if (m === 'ATOMIK') {
    return (
      <span className={`font-black italic uppercase tracking-wider text-[10px] font-sans ${className}`}>
        ATOMIK
      </span>
    );
  }
  if (m === 'HUSH PUPPIES') {
    return (
      <span className={`font-bold tracking-tight text-[10px] font-sans ${className}`}>
        Hush Puppies
      </span>
    );
  }

  return (
    <span className={`text-[11px] font-black uppercase tracking-tight truncate max-w-full ${className}`}>
      {marca || 'Calzado'}
    </span>
  );
};

export const BrandBadge: React.FC<BrandProps> = ({ marca, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-950/85 backdrop-blur-xs border border-zinc-800/90 text-zinc-100 shadow-xs ${className}`}>
      <BrandIcon marca={marca} className="h-3.5 w-3.5 shrink-0 text-zinc-300" />
      <BrandWordmark marca={marca} className="text-zinc-100" />
    </div>
  );
};
