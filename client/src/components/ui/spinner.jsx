import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function Spinner({ className, size = "default", ...props }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <Loader2
      className={cn("animate-spin text-gray-600", sizeClasses[size], className)}
      {...props}
    />
  );
}

export function SpinnerFullPage() {
  return (
    <div className="fixed inset-0 min-h-screen flex flex-col items-center justify-center bg-[#030712] relative overflow-hidden z-[10000] select-none">
      {/* Ambient Volumetric Lighting */}
      <motion.div 
        animate={{ 
          x: [0, 40, -30, 0], 
          y: [0, -30, 40, 0],
          scale: [1, 1.08, 0.95, 1] 
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[18%] left-[25%] w-[520px] h-[520px] bg-indigo-600/12 rounded-full blur-[140px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          x: [0, -40, 30, 0], 
          y: [0, 40, -30, 0],
          scale: [1, 0.95, 1.08, 1] 
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[18%] right-[25%] w-[560px] h-[560px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" 
      />

      {/* Subtle Architectural Grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)"
        }}
      />

      {/* Clean Full-Bleed Centerpiece (No card box) */}
      <motion.div 
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center px-4"
      >
        {/* Precision Geometric Prism Emblem */}
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [0.85, 1.2, 0.85], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-2 rounded-full bg-gradient-to-r from-sky-400/25 via-indigo-600/20 to-purple-600/25 blur-xl"
          />

          <svg viewBox="0 0 120 120" className="w-full h-full relative z-10 drop-shadow-[0_8px_24px_rgba(56,189,248,0.25)]">
            <defs>
              <linearGradient id="spinnerPrismA" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="spinnerPrismB" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="spinnerPrismC" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="spinnerHaloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#818cf8" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Orbiting Halo Rings */}
            <motion.circle 
              cx="60" cy="60" r="54" 
              fill="none" 
              stroke="url(#spinnerHaloGrad)" 
              strokeWidth="1.2" 
              strokeDasharray="14 10 4 10"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ originX: "60px", originY: "60px" }}
            />
            <motion.circle 
              cx="60" cy="60" r="46" 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.08)" 
              strokeWidth="1" 
              strokeDasharray="30 40"
              animate={{ rotate: -360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              style={{ originX: "60px", originY: "60px" }}
            />

            {/* Isometric Faceted Monogram 'N' */}
            <polygon points="36,28 46,22 46,92 36,98" fill="url(#spinnerPrismA)" />
            <polygon points="46,22 84,80 74,92 36,34" fill="url(#spinnerPrismB)" opacity="0.92" />
            <polygon points="74,22 84,28 84,98 74,92" fill="url(#spinnerPrismC)" />

            <motion.circle 
              cx="60" cy="57" r="3" 
              fill="#ffffff" 
              animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>

        {/* Luxury Typography */}
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[0.25em] pl-[0.25em] bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
            NEXORA
          </h1>
          <div className="w-[1px] h-6 bg-gradient-to-b from-transparent via-white/25 to-transparent hidden sm:block" />
          <span className="text-lg sm:text-xl font-light tracking-[0.38em] pl-[0.38em] text-slate-400 uppercase hidden sm:inline-block">
            LEARN
          </span>
        </div>

        {/* Sleek Hairline Progress Loader */}
        <div className="w-56 mt-7 flex flex-col items-center">
          <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative">
            <motion.div 
              animate={{ 
                x: ["-100%", "100%"] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: [0.4, 0, 0.2, 1] 
              }}
              className="w-1/2 h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.8)]"
            />
          </div>
          <span className="mt-2.5 text-[10px] tracking-[0.22em] text-slate-500 font-medium uppercase">
            LOADING
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export function SpinnerOverlay() {
  return <div className="w-full h-full min-h-[100px]" />;
}
