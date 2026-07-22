import { useEffect, useState } from 'react';

interface ProgressRingProps {
  currentWordCount: number;
  targetWordCount: number;
  size?: number;
  strokeWidth?: number;
}

export function ProgressRing({ 
  currentWordCount, 
  targetWordCount, 
  size = 120, 
  strokeWidth = 8 
}: ProgressRingProps) {
  const [offset, setOffset] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = targetWordCount > 0 ? Math.min(100, (currentWordCount / targetWordCount) * 100) : 0;
  
  // Set initial offset to fully empty
  useEffect(() => {
    setOffset(circumference);
    
    // Trigger animation to current percentage after mount
    const targetOffset = circumference - (percent / 100) * circumference;
    const timeout = setTimeout(() => {
      setOffset(targetOffset);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [percent, circumference]);

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90 drop-shadow-sm">
        <defs>
          <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4995A" />
            <stop offset="100%" stopColor="#E8A85C" />
          </linearGradient>
        </defs>
        {/* Background track */}
        <circle
          stroke="var(--border-subtle)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Animated progress stroke */}
        <circle
          stroke="url(#amberGrad)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 600ms ease-out' }}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Centered text */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-xl font-bold font-serif text-primary">
          {Math.floor(percent)}%
        </span>
      </div>
    </div>
  );
}
