import React from 'react';

const TextLogo = ({ className = "" }) => {
  return (
    <div className={`group inline-flex items-center select-none cursor-pointer tracking-tight ${className}`}>
      <span className="text-xl sm:text-2xl font-black tracking-[0.15em] bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300 group-hover:from-sky-300 group-hover:via-indigo-200 group-hover:to-purple-300 transition-all duration-300 drop-shadow-[0_2px_10px_rgba(255,255,255,0.08)]">
        NEXORA
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] group-hover:shadow-[0_0_12px_#38bdf8] group-hover:scale-125 transition-all duration-300 ml-2 animate-pulse" />
    </div>
  );
};

export default TextLogo;
