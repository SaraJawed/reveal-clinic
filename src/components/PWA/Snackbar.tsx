import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SnackbarProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 4000
}) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:bottom-8 z-50 max-w-md mx-auto"
        >
          <div
            className={`flex items-center justify-between p-3.5 rounded-2xl shadow-xl text-white text-xs font-semibold backdrop-blur-md border ${
              type === 'success'
                ? 'bg-emerald-900/90 border-emerald-700/50'
                : type === 'error'
                ? 'bg-rose-900/90 border-rose-700/50'
                : 'bg-slate-900/90 border-slate-700/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
              <span>{message}</span>
            </div>
            <button
              id="snackbar-close-btn"
              onClick={onClose}
              className="ml-3 text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
