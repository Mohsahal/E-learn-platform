import React from 'react';

const TextLogo = ({ className = "", showIcon = true, iconSize = 28 }) => {
  return (
    <div className={`group inline-flex items-center gap-2.5 select-none cursor-pointer ${className}`}>
      {showIcon && (
        <div 
          className="relative flex items-center justify-center flex-shrink-0"
          style={{ width: iconSize, height: iconSize }}
        >
          {/* Subtle Ambient Glow on Hover */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-sky-400/30 via-indigo-600/30 to-purple-600/30 blur-md opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
          
          <svg viewBox="0 0 120 120" className="w-full h-full relative z-10 drop-shadow-[0_2px_8px_rgba(56,189,248,0.4)]">
            <defs>
              <linearGradient id="headerPrismA" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="headerPrismB" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="headerPrismC" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="headerHaloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#818cf8" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Orbiting Halo Ring with Interactive Hover Spin */}
            <circle 
              cx="60" cy="60" r="54" 
              fill="none" 
              stroke="url(#headerHaloGrad)" 
              strokeWidth="2" 
              strokeDasharray="14 10 4 10" 
              className="group-hover:rotate-180 transition-transform duration-700 origin-center"
            />
            <circle 
              cx="60" cy="60" r="46" 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.1)" 
              strokeWidth="1" 
            />

            {/* Isometric Faceted Monogram 'N' (Same as Starting Spinner) */}
            <polygon points="36,28 46,22 46,92 36,98" fill="url(#headerPrismA)" />
            <polygon points="46,22 84,80 74,92 36,34" fill="url(#headerPrismB)" opacity="0.92" />
            <polygon points="74,22 84,28 84,98 74,92" fill="url(#headerPrismC)" />

            {/* Center Flare Dot */}
            <circle cx="60" cy="57" r="3.5" fill="#ffffff" className="animate-pulse" />
          </svg>
        </div>
      )}

      {/* Brand Typography */}
      <div className="flex items-center tracking-tight leading-none">
        <span className="text-lg sm:text-xl font-black tracking-[0.14em] bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300 group-hover:from-sky-300 group-hover:via-indigo-200 group-hover:to-purple-300 transition-all duration-300 drop-shadow-[0_2px_10px_rgba(255,255,255,0.08)]">
          NEXORA
        </span>
        <span className="text-sm sm:text-base font-light tracking-[0.24em] text-slate-400 group-hover:text-slate-200 transition-all duration-300 ml-1.5 uppercase">
          LEARN
        </span>
      </div>

      {/* Pulsing Accent Dot */}
      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] group-hover:shadow-[0_0_12px_#38bdf8] group-hover:scale-125 transition-all duration-300 ml-0.5 animate-pulse" />
    </div>
  );
};

export default TextLogo;
