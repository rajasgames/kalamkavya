import { useMemo } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import { Flame, Target, BookOpen, Brain, Activity, TrendingUp } from 'lucide-react';

export function Analytics() {
  const { 
    activeProject, 
    scenes, 
    dailyProgress, 
    entities, 
    relationships, 
    generationLogs 
  } = useStoryStore();

  // --- 1. Word Count Progress ---
  const totalWords = useMemo(() => {
    return scenes.reduce((acc, scene) => acc + scene.wordCount, 0);
  }, [scenes]);

  const targetWords = activeProject?.targetWordCount || 50000;
  const progressPercent = Math.min(100, Math.round((totalWords / targetWords) * 100));
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // --- 2. 30-Day Sparkline ---
  const sparklineData = useMemo(() => {
    const data: number[] = [];
    if (!activeProject) return data;
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dp = dailyProgress.find(p => p.projectId === activeProject.id && p.date === dateStr);
      data.push(dp ? dp.wordsWritten : 0);
    }
    return data;
  }, [dailyProgress, activeProject]);

  const maxSpark = Math.max(...sparklineData, 1);
  const sparklinePath = sparklineData.map((val, i) => {
    const x = (i / 29) * 200;
    const y = 40 - (val / maxSpark) * 40;
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ');

  // --- 3. 90-Day Heatmap ---
  const heatmapData = useMemo(() => {
    const data: { date: string, count: number }[] = [];
    if (!activeProject) return data;
    const today = new Date();
    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dp = dailyProgress.find(p => p.projectId === activeProject.id && p.date === dateStr);
      data.push({ date: dateStr, count: dp ? dp.wordsWritten : 0 });
    }
    return data;
  }, [dailyProgress, activeProject]);

  // --- 4. Streak Counter ---
  const streak = useMemo(() => {
    let currentStreak = 0;
    if (!activeProject) return currentStreak;
    const today = new Date();
    // Start checking from today, going backwards
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dp = dailyProgress.find(p => p.projectId === activeProject.id && p.date === dateStr);
      
      const count = dp ? dp.wordsWritten : 0;
      if (count >= 100) {
        currentStreak++;
      } else {
        // If it's today and count < 100, we don't break the streak yet (they still have time).
        // But if it's yesterday or earlier, streak breaks.
        if (i !== 0) break;
      }
    }
    return currentStreak;
  }, [dailyProgress, activeProject]);

  // --- 5. World-Building Stats ---
  const entityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (!activeProject) return [];
    entities.forEach(e => {
      if (e.projectId === activeProject.id) {
        counts[e.type] = (counts[e.type] || 0) + 1;
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [entities, activeProject]);
  const maxEntityCount = Math.max(...entityCounts.map(c => c[1]), 1);

  const edgeCount = relationships.filter(r => r.projectId === activeProject?.id).length;

  // --- 6. Context Engine Adoption ---
  const aiStats = useMemo(() => {
    if (!activeProject) return { percent: 0, total: 0 };
    const logs = generationLogs.filter(l => l.projectId === activeProject.id);
    if (logs.length === 0) return { percent: 0, total: 0 };
    const withContext = logs.filter(l => l.entityCount > 0).length;
    return {
      percent: Math.round((withContext / logs.length) * 100),
      total: logs.length
    };
  }, [generationLogs, activeProject]);

  if (!activeProject) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-secondary">Please select a project to view insights.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-base overflow-y-auto">
      <div className="p-6 shrink-0 border-b border-subtle">
        <h2 className="font-serif text-2xl text-primary flex items-center gap-2">
          <Activity className="text-amber-from" /> Insights
        </h2>
        <p className="text-sm text-secondary">Analytics for {activeProject.title}</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(200px,_auto)]">
          
          {/* Card: Progress */}
          <div className="bg-surface border border-subtle rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
            <h3 className="absolute top-4 left-6 text-xs font-semibold text-ghost uppercase tracking-wider flex items-center gap-2">
              <Target size={14} /> Progress
            </h3>
            
            <div className="relative flex items-center justify-center mt-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" className="text-black/5 dark:text-white/5" />
                <circle 
                  cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" 
                  className="text-amber-from transition-all duration-1000 ease-out"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-serif font-bold text-2xl text-primary">{progressPercent}%</span>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="font-serif text-xl text-primary">{totalWords.toLocaleString()}</p>
              <p className="text-[10px] uppercase tracking-wider text-secondary">of {targetWords.toLocaleString()} words</p>
            </div>
          </div>

          {/* Card: Streak */}
          <div className="bg-surface border border-subtle rounded-2xl p-6 flex flex-col justify-between">
            <h3 className="text-xs font-semibold text-ghost uppercase tracking-wider flex items-center gap-2">
              <Flame size={14} className={streak > 2 ? "text-clay" : ""} /> Writing Streak
            </h3>
            <div className="flex flex-col items-center justify-center flex-1 py-4">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-6xl font-bold text-primary">{streak}</span>
                <span className="font-serif text-xl text-secondary">days</span>
              </div>
              <p className="text-sm text-ghost mt-2">consecutive days with &gt;100 words</p>
            </div>
            <div className="h-[40px] w-full mt-4 relative">
              {/* Sparkline */}
              <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <path d={sparklinePath} fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-from/50 opacity-50" strokeLinecap="round" strokeLinejoin="round" />
                <path d={sparklinePath} fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-from animate-[dash_2s_linear_infinite]" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" />
              </svg>
              <div className="absolute top-0 right-0 text-[10px] text-ghost flex items-center gap-1">
                <TrendingUp size={10} /> 30d Activity
              </div>
            </div>
          </div>

          {/* Card: Heatmap */}
          <div className="bg-surface border border-subtle rounded-2xl p-6 lg:col-span-2 xl:col-span-1 flex flex-col">
            <h3 className="text-xs font-semibold text-ghost uppercase tracking-wider flex items-center gap-2 mb-4">
              <Activity size={14} /> 90-Day Activity
            </h3>
            <div className="flex-1 flex flex-col justify-center overflow-x-auto max-w-full pb-1">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(12px,1fr))] gap-1 min-w-[280px] max-w-[400px]">
                {heatmapData.map((day, i) => {
                  let colorClass = "bg-transparent border border-subtle"; // 0 words
                  if (day.count > 0 && day.count < 500) colorClass = "bg-amber-from/40 border border-transparent";
                  else if (day.count >= 500) colorClass = "bg-amber-from border border-transparent shadow-[0_0_8px_rgba(212,153,90,0.4)]";

                  return (
                    <div 
                      key={i} 
                      className={`w-3 h-3 rounded-[2px] ${colorClass}`} 
                      title={`${day.date}: ${day.count} words`}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-ghost uppercase tracking-wider">
                <span>Less</span>
                <div className="w-3 h-3 rounded-[2px] border border-subtle" />
                <div className="w-3 h-3 rounded-[2px] bg-amber-from/40" />
                <div className="w-3 h-3 rounded-[2px] bg-amber-from" />
                <span>More</span>
              </div>
            </div>
          </div>

          {/* Card: AI Context Adoption */}
          <div className="bg-surface border border-subtle rounded-2xl p-6 flex flex-col justify-between">
            <h3 className="text-xs font-semibold text-ghost uppercase tracking-wider flex items-center gap-2">
              <Brain size={14} /> AI Context Adoption
            </h3>
            <div className="flex flex-col items-center justify-center flex-1">
              <div className="relative">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-black/5 dark:text-white/5" />
                  <circle 
                    cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    className={`${aiStats.percent >= 70 ? 'text-sage' : 'text-amber-from'} transition-all duration-1000 ease-out`}
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={(2 * Math.PI * 40) - (aiStats.percent / 100) * (2 * Math.PI * 40)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif font-bold text-xl text-primary">{aiStats.percent}%</span>
                </div>
              </div>
              <p className="text-sm text-secondary mt-4 text-center">
                Calls with explicit context
              </p>
              <p className="text-[10px] text-ghost mt-1 uppercase tracking-wider">Target: &gt;70%</p>
            </div>
          </div>

          {/* Card: World-Building */}
          <div className="bg-surface border border-subtle rounded-2xl p-6 lg:col-span-2 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-semibold text-ghost uppercase tracking-wider flex items-center gap-2">
                <BookOpen size={14} /> World Density
              </h3>
              <div className="text-xs text-secondary bg-elevated px-2 py-1 rounded border border-subtle">
                <strong className="text-primary">{edgeCount}</strong> Relationships
              </div>
            </div>
            
            <div className="flex-1 space-y-4 max-h-[160px] overflow-y-auto pr-2">
              {entityCounts.length === 0 ? (
                <div className="h-full flex items-center justify-center text-ghost italic text-sm">
                  No entities added yet.
                </div>
              ) : (
                entityCounts.map(([type, count]) => {
                  const width = `${(count / maxEntityCount) * 100}%`;
                  return (
                    <div key={type} className="flex items-center gap-3">
                      <div className="w-24 text-xs text-secondary truncate" title={type}>
                        {type.replace('_', ' ')}
                      </div>
                      <div className="flex-1 h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-sage rounded-full"
                          style={{ width }}
                        />
                      </div>
                      <div className="w-8 text-right text-xs font-mono text-primary font-medium">
                        {count}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
