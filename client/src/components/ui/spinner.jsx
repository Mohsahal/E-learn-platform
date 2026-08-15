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
    <div className="fixed inset-0 min-h-screen flex flex-col items-center justify-center bg-[#020617] relative overflow-hidden z-[10000]">
      {/* Background orbs */}
      <motion.div 
        animate={{ 
          x: [0, 50, 0], 
          y: [0, 50, 0] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" 
      />
      <motion.div 
        animate={{ 
          x: [0, -50, 0], 
          y: [0, -50, 0] 
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" 
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity:30 pointer-events-none" />

      {/* Animated Logo */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div 
          animate={{ scale: [1, 0.98, 1], opacity: [1, 0.8, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-1"
        >
          <span className="text-4xl sm:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            NEXORA
          </span>
          <span className="text-4xl sm:text-5xl font-light tracking-widest text-gray-100 ml-1">
            LEARN
          </span>
          <motion.div 
            animate={{ scale: [1, 0.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-3 h-3 rounded-full bg-purple-600 ml-2 shadow-[0_0_20px_#9333ea]"
          />
        </motion.div>

        {/* Loading Progress */}
        <div className="w-48 h-1.5 bg-white/10 rounded-full mt-8 overflow-hidden relative">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}

export function SpinnerOverlay() {
  return <div className="w-full h-full min-h-[100px]" />;
}
