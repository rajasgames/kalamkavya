import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroSplashProps {
  onComplete?: () => void;
  manualTrigger?: boolean;
}

export function IntroSplash({ onComplete, manualTrigger = false }: IntroSplashProps) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress animation from 0 to 100%
    const startTime = Date.now();
    const duration = manualTrigger ? 1200 : 1600;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(currentProgress);

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(() => {
          handleDismiss();
        }, 150);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [manualTrigger]);

  const handleDismiss = () => {
    setVisible(false);
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-canvas/95 backdrop-blur-2xl text-primary overflow-hidden font-sans select-none cursor-pointer"
        >
          {/* Subtle Theme-Aligned Soft Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] bg-terracotta/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Minimalist Center Container */}
          <div className="relative z-10 flex flex-col items-center max-w-xs px-6 text-center">
            {/* Clean Brand Logo Container */}
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 6 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-5"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-surface/80 border border-subtle backdrop-blur-md shadow-soft flex items-center justify-center p-3 relative overflow-hidden group">
                <img
                  src="/brand_logo.png"
                  alt="Kalam Kavya Brand Logo"
                  className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </motion.div>

            {/* Clean Theme-Matching Brand Title */}
            <motion.div
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.45 }}
              className="space-y-1"
            >
              <h1 className="text-2xl sm:text-3xl font-serif font-extrabold tracking-tight text-primary whitespace-nowrap">
                कalam काvya
              </h1>
            </motion.div>

            {/* Whisper-Thin Minimal Theme Progress Line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-32 sm:w-40 mt-7 space-y-1.5"
            >
              <div className="h-[2px] w-full bg-subtle/70 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-terracotta rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.1 }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
