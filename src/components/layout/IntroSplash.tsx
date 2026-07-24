import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Feather } from 'lucide-react';

interface IntroSplashProps {
  onComplete?: () => void;
}

export function IntroSplash({ onComplete }: IntroSplashProps) {
  const [stage, setStage] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 400);
    const timer2 = setTimeout(() => setStage(2), 1100);
    const timer3 = setTimeout(() => setStage(3), 1800);
    const timer4 = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#12100e] text-amber-50 overflow-hidden font-sans select-none"
        >
          {/* Ambient Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-600/20 via-terracotta/25 to-teal-500/15 rounded-full blur-3xl opacity-60 animate-pulse" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-2xl" />

          {/* Center Graphic */}
          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            {/* Animated Logo Container */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6"
            >
              {/* Rotating Decorative Outer Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-amber-500/30 border-dashed flex items-center justify-center"
              />

              {/* Glowing Icon Shield */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-500 via-terracotta to-teal-700 p-0.5 shadow-2xl shadow-amber-600/30"
                >
                  <div className="w-full h-full bg-[#161412] rounded-[22px] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent" />
                    <Feather size={42} className="text-amber-400 drop-shadow-md transform -rotate-12" />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Typography */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-semibold tracking-widest uppercase">
                <Sparkles size={13} className="animate-spin" />
                <span>Inkwell Pro Studio</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
                कalam काvya Engine
              </h1>

              <p className="text-xs text-amber-200/60 font-sans tracking-wide">
                Architecting Worlds & Epic Narratives
              </p>
            </motion.div>

            {/* Dynamic Status Progress Bar */}
            <div className="w-48 sm:w-56 mt-8 space-y-2">
              <div className="h-1 w-full bg-amber-950/60 rounded-full overflow-hidden p-0.5 border border-amber-500/20">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 via-terracotta to-teal-400 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: stage === 0 ? '20%' : stage === 1 ? '55%' : stage === 2 ? '85%' : '100%' 
                  }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </div>

              <motion.p
                key={stage}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                className="text-[10px] font-mono text-amber-400/70 tracking-wider uppercase"
              >
                {stage === 0 && 'Connecting IndexedDB...'}
                {stage === 1 && 'Hydrating AI Prompt Engine...'}
                {stage === 2 && 'Loading World Bible...'}
                {stage === 3 && 'Workspace Ready'}
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
