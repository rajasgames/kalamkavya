import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function InkRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't trigger on input/textarea to prevent annoyance while typing
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const id = Date.now() + Math.random();
      const newRipple: Ripple = {
        id,
        x: e.clientX,
        y: e.clientY,
        size: Math.floor(Math.random() * 20) + 40,
      };

      setRipples((prev) => [...prev.slice(-8), newRipple]);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ opacity: 0.6, transform: 'scale(0.2)' }}
            animate={{ opacity: 0, transform: 'scale(2.2)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => {
              setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
            }}
            style={{
              position: 'absolute',
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(128, 128, 128, 0.15) 0%, rgba(128, 128, 128, 0.05) 50%, rgba(128, 128, 128, 0) 75%)',
              border: '1px solid rgba(128, 128, 128, 0.15)',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
