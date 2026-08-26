import React from 'react';

const TextLogo = ({ className = "" }) => {
  return (
    <div className={`group inline-flex items-center select-none cursor-pointer ${className}`}>
      <span className="text-lg sm:text-xl font-black tracking-[0.14em] bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300 group-hover:from-sky-300 group-hover:via-indigo-200 group-hover:to-purple-300 transition-all duration-300 drop-shadow-[0_2px_10px_rgba(255,255,255,0.08)]">
        NEXORA
      </span>
      <span className="text-sm sm:text-base font-light tracking-[0.24em] text-slate-400 group-hover:text-slate-200 transition-all duration-300 ml-1.5 uppercase">
        LEARN
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] group-hover:shadow-[0_0_12px_#38bdf8] group-hover:scale-125 transition-all duration-300 ml-1.5 animate-pulse" />
    </div>
  );
};

export default TextLogo;
