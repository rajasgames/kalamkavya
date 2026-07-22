import { Entity, CultureData } from '@/types';
import { BookOpen, MapPin } from 'lucide-react';
import { useStoryStore } from '@/stores/storyStore';

interface CultureCardProps {
  entity: Entity;
  onClick?: () => void;
}

export function CultureCard({ entity, onClick }: CultureCardProps) {
  const { entities } = useStoryStore();
  const data = (entity.data as unknown as Partial<CultureData>) || {};
  
  const hasAIRule = entity.hasAIRule || data.aiRuleEnabled;
  
  const associatedRegion = data.associatedRegionId 
    ? entities.find(e => e.id === data.associatedRegionId) 
    : null;

  return (
    <div 
      onClick={onClick}
      className="group flex flex-col bg-elevated border border-subtle p-4 rounded-xl cursor-pointer hover:border-amber-from/50 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="w-8 h-8 shrink-0 rounded-lg bg-surface flex items-center justify-center border border-subtle group-hover:bg-amber-from/10 group-hover:border-amber-from/30 transition-colors">
          <BookOpen size={18} className="text-secondary" />
        </div>
        {hasAIRule && (
          <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-clay/10 text-clay border border-clay/20 uppercase tracking-wider">
            #AI-Rule
          </span>
        )}
      </div>
      
      <h3 className="font-serif font-bold text-primary text-lg leading-tight group-hover:text-amber-from transition-colors line-clamp-2">
        {entity.name}
      </h3>
      
      {associatedRegion && (
        <div className="flex items-center gap-1.5 mt-2">
          <MapPin size={12} className="text-sage" />
          <span className="text-xs text-sage truncate">
            {associatedRegion.name}
          </span>
        </div>
      )}

      {data.coreValues && data.coreValues.length > 0 && (
        <div className="mt-3 flex gap-1 flex-wrap">
          {data.coreValues.slice(0, 3).map((val, idx) => (
             <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-amber-from/10 text-amber-from border border-amber-from/20 truncate max-w-full font-medium">
               {val}
             </span>
          ))}
          {data.coreValues.length > 3 && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 text-secondary">
              +{data.coreValues.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
