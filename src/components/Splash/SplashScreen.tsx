import React, { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      <div className="relative w-full max-w-md h-full bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center text-white px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-500 to-sky-300 p-0.5 shadow-2xl shadow-blue-500/40 mb-6">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-sky-400 animate-pulse" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            REVEAL CLINIC
          </h1>
          <p className="text-xs font-medium text-sky-300 tracking-widest uppercase mt-2">
            Aesthetic & Medical Dermatology
          </p>

          {/* Loading Ring */}
          <div className="mt-12 flex items-center gap-2 text-slate-400 text-xs font-medium">
            <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <span>Initializing PWA Portal...</span>
          </div>
        </motion.div>

        <div className="absolute bottom-8 text-[11px] text-slate-500 text-center">
          Powered by Reveal PWA Architecture • Secure & Encrypted
        </div>
      </div>
    </div>
  );
};
