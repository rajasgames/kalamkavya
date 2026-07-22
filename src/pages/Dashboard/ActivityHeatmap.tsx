import { Card } from '@/components/ui';
import { Flame } from 'lucide-react';

export function ActivityHeatmap() {
  // Generate dummy data for the last 90 days for demo purposes
  // In a real app, we'd query the DB for DailyProgress
  const today = new Date();
  const days = Array.from({ length: 90 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (89 - i));
    return {
      date: d,
      count: Math.random() > 0.5 ? Math.floor(Math.random() * 2000) : 0
    };
  });

  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-white/5';
    if (count < 500) return 'bg-amber-from/30';
    if (count < 1000) return 'bg-amber-from/60';
    if (count < 2000) return 'bg-amber-from/90';
    return 'bg-amber-from shadow-[0_0_8px_rgba(212,153,90,0.6)]';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold tracking-wider text-ghost uppercase flex items-center gap-2">
          <Flame size={16} className="text-amber-from" /> Writing Activity
        </h3>
        <span className="text-xs text-amber-from font-semibold bg-amber-from/10 px-2 py-1 rounded-full">
          12 Day Streak
        </span>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-2">
        {days.map((day, i) => (
          <div 
            key={i}
            title={`${day.date.toDateString()}: ${day.count} words`}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-sm transition-colors cursor-pointer hover:ring-1 hover:ring-primary ${getIntensity(day.count)}`}
          />
        ))}
      </div>
      
      <div className="flex justify-between text-[10px] text-ghost font-medium">
        <span>90 days ago</span>
        <span>Today</span>
      </div>
    </Card>
  );
}
