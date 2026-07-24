import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface IntroSplashProps {
  onComplete?: () => void;
  manualTrigger?: boolean;
}

export function IntroSplash({ onComplete, manualTrigger = false }: IntroSplashProps) {
  const [stage, setStage] = useState(0);
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto progression timers
  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 1200);
    const timer3 = setTimeout(() => setStage(3), 2000);
    const timer4 = setTimeout(() => setStage(4), 2700);

    let finishTimer: NodeJS.Timeout | null = null;
    if (!manualTrigger) {
      finishTimer = setTimeout(() => {
        handleDismiss();
      }, 3400);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      if (finishTimer) clearTimeout(finishTimer);
    };
  }, [manualTrigger]);

  // Ambient Gold Dust Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      alpha: number;
      speedY: number;
      speedX: number;
    }> = Array.from({ length: 45 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      speedY: -(Math.random() * 0.4 + 0.1),
      speedX: (Math.random() - 0.5) * 0.3,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#f59e0b';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    if (onComplete) onComplete();
  };

  const STAGES = [
    { title: 'Connecting IndexedDB Engine...', percent: 25 },
    { title: 'Hydrating World Bible & Cast Schemas...', percent: 55 },
    { title: 'Calibrating AI Synthesizer & Prompts...', percent: 85 },
    { title: 'Kalam Kavya Engine Ready', percent: 100 },
    { title: 'Launching Workspace...', percent: 100 },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0d0b09] text-amber-50 overflow-hidden font-sans select-none"
        >
          {/* Ambient Particle Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-80" />

          {/* Glowing Radial Backdrop Orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-amber-600/20 via-amber-500/15 to-teal-500/10 rounded-full blur-[100px] opacity-70 animate-pulse pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Central Animated Content Card */}
          <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
            {/* Animated Logo Container with Dual Sacred Rings */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-8"
            >
              {/* Outer Counter-Clockwise Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 35, ease: 'linear', repeat: Infinity }}
                className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border border-amber-500/20 border-dashed flex items-center justify-center pointer-events-none"
              />

              {/* Inner Clockwise Decorative Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
                className="absolute inset-2 rounded-full border-2 border-dashed border-amber-500/40 pointer-events-none"
              />

              {/* Center Main Favicon Emblem Shield */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-600 to-teal-700 p-[3px] shadow-2xl shadow-amber-600/40 cursor-pointer group"
                  onClick={handleDismiss}
                  title="Click to Enter"
                >
                  <div className="w-full h-full bg-[#161310] rounded-[22px] flex items-center justify-center relative overflow-hidden p-3.5">
                    {/* Glowing Aura Effect behind Favicon */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-amber-400/10 to-transparent group-hover:opacity-100 transition-opacity" />
                    <img
                      src="/favicon.svg"
                      alt="Kalam Kavya Favicon"
                      className="w-full h-full object-contain drop-shadow-[0_4px_16px_rgba(245,158,11,0.5)] transform group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Main Typography Header (Single-Line Title Emphasis) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.65 }}
              className="space-y-2 mb-8"
            >
              <div className="flex items-center justify-center gap-2 text-amber-400 text-xs font-semibold tracking-widest uppercase">
                <Sparkles size={14} className="animate-spin text-amber-400" />
                <span>Inkwell Pro Studio</span>
              </div>

              {/* Single line "कalam काvya Engine" with Gold Gradient Shimmer */}
              <h1 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight whitespace-nowrap bg-gradient-to-r from-amber-100 via-amber-300 to-amber-50 bg-clip-text text-transparent drop-shadow-sm flex items-center justify-center gap-2">
                <span>कalam काvya</span>
                <span className="text-amber-400 font-sans font-light text-2xl sm:text-3xl">Engine</span>
              </h1>

              <p className="text-xs sm:text-sm text-amber-200/70 font-sans tracking-wide max-w-xs mx-auto">
                Architecting Epic Worlds & High-Fantasy Narratives
              </p>
            </motion.div>

            {/* Dynamic Status Progress Bar */}
            <div className="w-56 sm:w-72 space-y-3 mx-auto">
              <div className="h-1.5 w-full bg-amber-950/70 rounded-full overflow-hidden p-0.5 border border-amber-500/30 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-teal-400 rounded-full"
                  initial={{ width: '5%' }}
                  animate={{
                    width: `${STAGES[Math.min(stage, STAGES.length - 1)].percent}%`,
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-amber-300/80">
                <motion.span
                  key={stage}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="truncate max-w-[200px]"
                >
                  {STAGES[Math.min(stage, STAGES.length - 1)].title}
                </motion.span>
                <span className="font-semibold text-amber-400 shrink-0">
                  {STAGES[Math.min(stage, STAGES.length - 1)].percent}%
                </span>
              </div>
            </div>

            {/* Interactive Fast-Forward / Enter Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: stage >= 1 ? 1 : 0.6, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <button
                onClick={handleDismiss}
                className="group relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border border-amber-500/40 hover:border-amber-400 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 active:scale-95"
              >
                <span>{stage >= 3 ? 'Enter Workspace' : 'Skip Intro'}</span>
                <ArrowRight size={16} className="text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
