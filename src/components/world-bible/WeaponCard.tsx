import { Entity, WeaponData, RarityTierData } from '@/types';
import { Sword } from 'lucide-react';
import { useStoryStore } from '@/stores/storyStore';
import { RarityBadge } from './RarityBadge';

interface WeaponCardProps {
  entity: Entity;
  onClick?: () => void;
}

export function WeaponCard({ entity, onClick }: WeaponCardProps) {
  const { entities } = useStoryStore();
  const data = (entity.data as unknown as Partial<WeaponData>) || {};
  
  // Resolve Rarity Tier
  const rarityEntity = entities.find(e => e.type === 'RARITY_TIER' && e.id === data.rarityTierId);
  const rarityTier = rarityEntity ? (rarityEntity.data as unknown as RarityTierData) : null;
  
  const hasAIRule = entity.hasAIRule || data.aiRuleEnabled;

  return (
    <div 
      onClick={onClick}
      className="group flex flex-col bg-surface border border-subtle p-4 rounded-xl cursor-pointer glass-card-hover shadow-soft"
    >
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-surface flex items-center justify-center border border-subtle group-hover:bg-amber-from/10 group-hover:border-amber-from/30 transition-colors">
            <Sword size={18} className="text-clay" />
          </div>
          {rarityTier && <RarityBadge rarityTier={rarityTier} size="sm" variant="badge" />}
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
      
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {data.subType && (
          <span className="text-[10px] text-primary bg-surface border border-subtle px-2 py-0.5 rounded font-medium uppercase tracking-wider">
            {data.subType}
          </span>
        )}
      </div>

      {data.properties && data.properties.length > 0 && (
        <div className="mt-3 flex gap-1 flex-wrap">
          {data.properties.slice(0, 3).map((prop, idx) => (
             <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 text-secondary truncate max-w-full">
               {prop}
             </span>
          ))}
          {data.properties.length > 3 && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 text-secondary">
              +{data.properties.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
