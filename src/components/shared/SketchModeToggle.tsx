import { useEffect } from 'react';
import { Pencil } from 'lucide-react';

interface SketchModeToggleProps {
  storageKey: string;
  isSketchMode: boolean;
  onToggle: (mode: boolean) => void;
}

export function SketchModeToggle({ storageKey, isSketchMode, onToggle }: SketchModeToggleProps) {
  
  // Also synchronize across tabs or components if needed
  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        onToggle(stored === 'true');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [storageKey, onToggle]);

  const toggle = () => {
    const nextVal = !isSketchMode;
    localStorage.setItem(storageKey, String(nextVal));
    onToggle(nextVal);
  };

  return (
    <button
      onClick={toggle}
      title={isSketchMode ? "Disable Sketch Mode" : "Enable Sketch Mode"}
      className={`p-2 rounded-md transition-all duration-200 ${
        isSketchMode 
          ? 'bg-amber-from/20 text-amber-from shadow-[0_0_8px_rgba(212,153,90,0.2)]' 
          : 'text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'
      }`}
    >
      <Pencil size={16} />
    </button>
  );
}
