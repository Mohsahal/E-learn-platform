import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";

/**
 * Modern Skeleton Loader System
 * Premium feel with staggered animations and shimmer effects.
 */

const ShimmerSkeleton = ({ className, delay = 0, ...props }) => (
  <Skeleton
    variant="shimmer"
    className={className}
    style={{ animationDelay: `${delay}ms` }}
    {...props}
  />
);

// --- Variant: Card Loader ---
export const SkeletonCard = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden glass-card h-full flex flex-col border-none bg-slate-900/40">
          <ShimmerSkeleton className="aspect-video w-full rounded-none" delay={i * 100} />
          <CardContent className="p-5 flex-grow space-y-3">
            <ShimmerSkeleton className="h-6 w-3/4" delay={i * 100 + 50} />
            <div className="space-y-2">
              <ShimmerSkeleton className="h-4 w-full" delay={i * 100 + 100} />
              <ShimmerSkeleton className="h-4 w-5/6" delay={i * 100 + 150} />
            </div>
          </CardContent>
          <CardFooter className="p-5 pt-0 flex justify-between items-center bg-transparent border-none">
            <ShimmerSkeleton className="h-8 w-24 rounded-full" delay={i * 100 + 200} />
            <ShimmerSkeleton className="h-5 w-16" delay={i * 100 + 250} />
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

// --- Variant: List Loader (Avatar + Lines) ---
export const SkeletonList = ({ count = 3 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 items-start p-4 rounded-xl glass border-none bg-slate-900/30">
          <ShimmerSkeleton className="h-12 w-12 rounded-full flex-shrink-0" delay={i * 150} />
          <div className="flex-grow space-y-3 pt-1">
            <ShimmerSkeleton className="h-5 w-1/3" delay={i * 150 + 50} />
            <div className="space-y-2">
              <ShimmerSkeleton className="h-3 w-full" delay={i * 150 + 100} />
              <ShimmerSkeleton className="h-3 w-2/3" delay={i * 150 + 150} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Variant: Table Loader ---
export const SkeletonTable = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full glass rounded-xl overflow-hidden border-none bg-slate-900/20">
      {/* Header */}
      <div className="grid border-b border-white/5 p-4 bg-white/5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, j) => (
          <div key={j} className="px-2">
            <ShimmerSkeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div 
          key={i} 
          className="grid border-b border-white/5 p-4 last:border-0 hover:bg-white/5 transition-colors"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="px-2">
              <ShimmerSkeleton className="h-4 w-full max-w-[120px]" delay={i * 50 + j * 30} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// --- Variant: Profile Loader ---
export const SkeletonProfile = () => {
  return (
    <div className="glass-card p-8 space-y-8 bg-slate-900/50 border-none">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
        <ShimmerSkeleton className="h-32 w-32 rounded-2xl flex-shrink-0" />
        <div className="flex-grow space-y-4 pt-2">
          <div className="space-y-2">
            <ShimmerSkeleton className="h-10 w-64 mx-auto md:mx-0" />
            <ShimmerSkeleton className="h-5 w-48 mx-auto md:mx-0" />
          </div>
          <div className="flex gap-3 justify-center md:justify-start">
            <ShimmerSkeleton className="h-8 w-24 rounded-full" />
            <ShimmerSkeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
            <ShimmerSkeleton className="h-4 w-24" delay={i * 100} />
            <ShimmerSkeleton className="h-8 w-full" delay={i * 100 + 50} />
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        <ShimmerSkeleton className="h-6 w-32" />
        <div className="space-y-3">
          <ShimmerSkeleton className="h-4 w-full" delay={200} />
          <ShimmerSkeleton className="h-4 w-full" delay={250} />
          <ShimmerSkeleton className="h-4 w-3/4" delay={300} />
        </div>
      </div>
    </div>
  );
};
// --- Variant: Global Page Loader (Executive Luxury Starting Logo Show) ---
export const GlobalSkeletonLoader = () => {
  const [progress, setProgress] = React.useState(18);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev < 92 ? prev + Math.floor(Math.random() * 8 + 4) : 98));
    }, 240);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#030712] relative overflow-hidden select-none">
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
      <motion.div 
        animate={{ 
          scale: [0.85, 1.2, 0.85],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-purple-600/12 rounded-full blur-[100px] pointer-events-none" 
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
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center px-4"
      >
        {/* Precision Geometric Prism Emblem */}
        <div className="relative w-24 h-24 mb-7 flex items-center justify-center">
          {/* Radial Backlight */}
          <motion.div 
            animate={{ scale: [0.85, 1.2, 0.85], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-2 rounded-full bg-gradient-to-r from-sky-400/25 via-indigo-600/20 to-purple-600/25 blur-xl"
          />

          <svg viewBox="0 0 120 120" className="w-full h-full relative z-10 drop-shadow-[0_8px_24px_rgba(56,189,248,0.25)]">
            <defs>
              <linearGradient id="reactPrismA" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="reactPrismB" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="reactPrismC" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="reactHaloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#818cf8" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Orbiting Halo Ring 1 */}
            <motion.circle 
              cx="60" cy="60" r="54" 
              fill="none" 
              stroke="url(#reactHaloGrad)" 
              strokeWidth="1.2" 
              strokeDasharray="14 10 4 10"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ originX: "60px", originY: "60px" }}
            />

            {/* Orbiting Halo Ring 2 */}
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
            <polygon points="36,28 46,22 46,92 36,98" fill="url(#reactPrismA)" />
            <polygon points="46,22 84,80 74,92 36,34" fill="url(#reactPrismB)" opacity="0.92" />
            <polygon points="74,22 84,28 84,98 74,92" fill="url(#reactPrismC)" />

            {/* Center Flare Dot */}
            <motion.circle 
              cx="60" cy="57" r="3" 
              fill="#ffffff" 
              animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>

        {/* Luxury Typography Hierarchy */}
        <div className="flex items-center justify-center gap-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[0.25em] pl-[0.25em] bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 drop-shadow-[0_4px_24px_rgba(255,255,255,0.12)]">
            NEXORA
          </h1>
          <div className="w-[1px] h-7 bg-gradient-to-b from-transparent via-white/25 to-transparent hidden sm:block" />
          <span className="text-xl sm:text-2xl font-light tracking-[0.38em] pl-[0.38em] text-slate-400 uppercase hidden sm:inline-block">
            LEARN
          </span>
        </div>

        {/* Minimalist Subtitle */}
        <div className="mt-3.5 flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.32em] text-slate-500 uppercase">
          <span className="w-1 h-1 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
          <span>Intelligent Learning Platform</span>
          <span className="w-1 h-1 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
        </div>

        {/* Sleek Hairline Progress Loader with Live Telemetry */}
        <div className="w-64 mt-9 flex flex-col items-center">
          <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative">
            <motion.div 
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.3 }}
              className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 rounded-full shadow-[0_0_14px_rgba(56,189,248,0.9)]"
            />
          </div>

          <div className="w-full mt-3 flex items-center justify-between text-[10px] tracking-[0.22em] text-slate-500 font-medium uppercase">
            <span>INITIALIZING</span>
            <span className="text-sky-400 font-mono">{progress}%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
