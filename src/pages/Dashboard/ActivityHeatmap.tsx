import { Card, Badge } from '@/components/ui';
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
    if (count === 0) return 'bg-subtle';
    if (count < 500) return 'bg-ink/20';
    if (count < 1000) return 'bg-ink/40';
    if (count < 2000) return 'bg-ink/60';
    return 'bg-ink/80';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold tracking-wider text-ghost uppercase flex items-center gap-2">
          <Flame size={16} className="text-primary" /> Writing Activity
        </h3>
        <Badge variant="outline">12 Day Streak</Badge>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-2">
        {days.map((day, i) => (
          <div 
            key={i}
            title={`${day.date.toDateString()}: ${day.count} words`}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-none transition-colors cursor-pointer hover:bg-ink ${getIntensity(day.count)}`}
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
