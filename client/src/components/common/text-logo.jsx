import React from 'react';

const TextLogo = ({ className = "" }) => {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300">
        NEXORA
      </span>
      <span className="text-2xl font-light tracking-widest text-gray-800 dark:text-gray-100 ml-1">
        LEARN
      </span>
      <div className="ml-2 w-2 h-2 rounded-full bg-purple-600 animate-pulse"></div>
    </div>
  );
};

export default TextLogo;
