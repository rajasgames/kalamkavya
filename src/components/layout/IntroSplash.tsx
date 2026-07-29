import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroSplashProps {
  onComplete?: () => void;
  manualTrigger?: boolean;
}

export function IntroSplash({ onComplete, manualTrigger = false }: IntroSplashProps) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    if (onComplete) onComplete();
  }, [onComplete]);

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
  }, [manualTrigger, handleDismiss]);


  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transform: 'scale(0.98)' }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-canvas text-primary overflow-hidden font-sans select-none cursor-pointer"
        >
          {/* Minimalist Center Container */}
          <div className="relative z-10 flex flex-col items-center max-w-xs px-6 text-center">
            {/* Direct Clean Brand Logo */}
            <motion.div
              initial={{ opacity: 0, transform: 'scale(0.88) translateY(6px)' }}
              animate={{ opacity: 1, transform: 'scale(1) translateY(0px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-5 flex items-center justify-center"
            >
              <img
                src="/brand_logo.png"
                alt="Kalam Kavya Brand Logo"
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
              />
            </motion.div>

            {/* Clean Theme-Matching Brand Title */}
            <motion.div
              initial={{ opacity: 0, transform: 'translateY(8px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
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
