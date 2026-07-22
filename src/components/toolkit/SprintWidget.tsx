import { useState, useEffect } from 'react';
import { Timer, X, Play, Square, RotateCcw } from 'lucide-react';
import { useManuscriptEditor } from '@/hooks/useManuscriptEditor';

interface SprintWidgetProps {
  onClose: () => void;
}

export function SprintWidget({ onClose }: SprintWidgetProps) {
  const [durationMinutes, setDurationMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isActive, setIsActive] = useState(false);
  
  // Track words for WPM calculation
  const { editor } = useManuscriptEditor();
  const [startWordCount, setStartWordCount] = useState(0);
  const currentWordCount = editor?.storage.characterCount.words() || 0;
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play a sound or notification here ideally
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleStart = () => {
    setStartWordCount(currentWordCount);
    setTimeLeft(durationMinutes * 60);
    setIsActive(true);
  };

  const handleStop = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(durationMinutes * 60);
    setStartWordCount(currentWordCount);
  };

  const handlePresetClick = (minutes: number) => {
    if (isActive) return;
    setDurationMinutes(minutes);
    setTimeLeft(minutes * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (durationMinutes * 60)) * 100;
  
  // Stats
  const wordsWritten = Math.max(0, currentWordCount - startWordCount);
  const timeElapsedSeconds = (durationMinutes * 60) - timeLeft;
  const timeElapsedMinutes = timeElapsedSeconds / 60;
  const wpm = timeElapsedMinutes > 0 ? Math.round(wordsWritten / timeElapsedMinutes) : 0;

  return (
    <div className="absolute top-20 right-8 w-80 bg-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 flex flex-col gap-4 z-40 text-primary font-sans animate-in slide-in-from-right-8 fade-in duration-300">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2 text-amber-from font-semibold">
          <Timer size={18} />
          <h4>Word Sprint</h4>
        </div>
        <button onClick={onClose} className="text-ghost hover:text-primary transition-colors p-1">
          <X size={16} />
        </button>
      </div>

      <div className="text-center">
        <div className="text-5xl font-mono font-bold tracking-tight mb-2 drop-shadow-sm">
          {formatTime(timeLeft)}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden mb-4 border border-white/5">
          <div 
            className="h-full bg-amber-from transition-all duration-1000 ease-linear rounded-full" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        {/* Presets */}
        <div className="flex justify-center gap-2 mb-4">
          {[5, 10, 15, 25].map((min) => (
            <button
              key={min}
              onClick={() => handlePresetClick(min)}
              disabled={isActive}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                durationMinutes === min
                  ? 'bg-amber-from text-amber-bg shadow-[0_0_10px_rgba(212,153,90,0.4)]'
                  : 'bg-white/5 text-ghost hover:bg-white/10 disabled:opacity-50'
              }`}
            >
              {min}m
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center bg-black/10 rounded-xl p-3 mb-4 border border-white/5">
          <div className="text-center flex-1 border-r border-white/5">
            <div className="text-2xl font-semibold text-primary">{isActive ? wordsWritten : '--'}</div>
            <div className="text-[10px] text-ghost uppercase tracking-wider font-semibold">Words</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-2xl font-semibold text-primary">{isActive ? wpm : '--'}</div>
            <div className="text-[10px] text-ghost uppercase tracking-wider font-semibold">WPM</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="flex-1 flex items-center justify-center gap-2 bg-amber-from hover:bg-amber-to text-amber-bg py-2 rounded-xl font-semibold transition-all active:scale-95 shadow-[0_4px_15px_rgba(212,153,90,0.3)]"
            >
              <Play size={16} fill="currentColor" /> Start
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/30 py-2 rounded-xl font-semibold transition-all active:scale-95"
            >
              <Square size={16} fill="currentColor" /> Stop
            </button>
          )}
          <button
            onClick={handleReset}
            className="w-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-ghost transition-all rounded-xl active:scale-95 border border-white/5 hover:border-white/10"
            title="Reset Timer"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
