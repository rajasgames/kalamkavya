import { Entity, MagicSystemData } from '@/types';
import { Sparkles, Activity } from 'lucide-react';

interface MagicSystemCardProps {
  entity: Entity;
  onClick?: () => void;
}

export function MagicSystemCard({ entity, onClick }: MagicSystemCardProps) {
  const data = entity.data as unknown as Partial<MagicSystemData>;
  const ranksCount = data.powerRanks?.length || 0;
  const hasAIRule = entity.hasAIRule || data.aiRuleEnabled;

  return (
    <div 
      onClick={onClick}
      className="group flex flex-col bg-elevated border border-subtle p-4 rounded-xl cursor-pointer hover:border-amber-from/50 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-subtle group-hover:bg-amber-from/10 group-hover:border-amber-from/30 transition-colors">
          <Sparkles size={18} className="text-amber-from" />
        </div>
        {hasAIRule && (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-clay/10 text-clay border border-clay/20 uppercase tracking-wider">
            #AI-Rule
          </span>
        )}
      </div>
      
      <h3 className="font-serif font-bold text-primary text-lg leading-tight group-hover:text-amber-from transition-colors line-clamp-2">
        {entity.name}
      </h3>
      
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {data.sourceType && (
          <span className="text-[10px] text-primary bg-surface border border-subtle px-2 py-0.5 rounded font-medium uppercase tracking-wider">
            {data.sourceType}
          </span>
        )}
        <span className="flex items-center gap-1 text-[10px] text-secondary font-medium uppercase tracking-wider">
          <Activity size={12} />
          {ranksCount > 0 ? `Ranks: 1–${ranksCount}` : 'No Ranks'}
        </span>
      </div>
    </div>
  );
}
