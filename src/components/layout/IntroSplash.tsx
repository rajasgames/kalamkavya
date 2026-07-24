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
    const duration = manualTrigger ? 1500 : 2000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(currentProgress);

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(() => {
          handleDismiss();
        }, 200);
      }
    }, 30);

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
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0d0b09] text-amber-50 overflow-hidden font-sans select-none cursor-pointer"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Minimalist Center Container */}
          <div className="relative z-10 flex flex-col items-center max-w-xs px-6 text-center">
            {/* Minimal Icon Shield with Soft Glow */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent p-0.5 border border-amber-500/30 shadow-2xl shadow-amber-900/40">
                <div className="w-full h-full bg-[#141210] rounded-[22px] flex items-center justify-center p-3.5 relative overflow-hidden">
                  <img
                    src="/favicon.svg"
                    alt="Kalam Kavya Logo"
                    className="w-full h-full object-contain drop-shadow-[0_2px_12px_rgba(245,158,11,0.4)]"
                  />
                </div>
              </div>
            </motion.div>

            {/* Clean Single-Line Title */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="space-y-1"
            >
              <h1 className="text-2xl sm:text-3xl font-serif font-extrabold tracking-tight whitespace-nowrap bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 bg-clip-text text-transparent">
                कalam काvya
              </h1>
            </motion.div>

            {/* Whisper-Thin Minimal Progress Line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="w-36 sm:w-44 mt-8 space-y-1.5"
            >
              <div className="h-[2px] w-full bg-amber-950/60 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-amber-400/90 rounded-full"
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
