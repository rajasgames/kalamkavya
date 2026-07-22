import { useState, useMemo } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import { FileText, Map, Sparkles, Sword, Users, BookOpen } from 'lucide-react';
import { MagicSystemCard, WeaponCard, CultureCard } from '../world-bible';
import { WeaponData, RarityTierData } from '@/types';

interface EntityGridProps {
  typeFilters: string[]; // empty means all
  onEntityClick?: (id: string) => void;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'location':
    case 'region':
    case 'landmark':
      return <Map size={18} className="text-sage" />;
    case 'MAGIC_SYSTEM':
      return <Sparkles size={18} className="text-amber-from" />;
    case 'WEAPON':
      return <Sword size={18} className="text-clay" />;
    case 'faction':
    case 'race':
    case 'character':
      return <Users size={18} className="text-amber-from" />;
    case 'myth':
    case 'CULTURE':
      return <BookOpen size={18} className="text-secondary" />;
    default:
      return <FileText size={18} className="text-ghost" />;
  }
};

export function EntityGrid({ typeFilters, onEntityClick }: EntityGridProps) {
  const { entities } = useStoryStore();

  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [selectedSubTypes, setSelectedSubTypes] = useState<string[]>([]);
  const [selectedMagicSystems, setSelectedMagicSystems] = useState<string[]>([]);

  const isWeaponView = typeFilters.length === 1 && typeFilters[0] === 'WEAPON';

  const rarityTiers = entities
    .filter(e => e.type === 'RARITY_TIER')
    .sort((a, b) => {
      const aData = a.data as unknown as RarityTierData;
      const bData = b.data as unknown as RarityTierData;
      return (aData.displayOrder || 0) - (bData.displayOrder || 0);
    });

  const SUB_TYPES = ['SWORD', 'MACE', 'SPEAR', 'BOW', 'DAGGER', 'STAFF', 'AXE', 'POLEARM', 'EXOTIC', 'MYTHOLOGICAL'];
  const magicSystems = entities.filter(e => e.type === 'MAGIC_SYSTEM');

  const filteredEntities = useMemo(() => {
    let result = entities.filter(e => {
      // Don't show config entities in normal grids unless explicitly requested
      if (e.type === 'RARITY_TIER' && !typeFilters.includes('RARITY_TIER')) return false;
      
      if (typeFilters.length === 0) return true;
      return typeFilters.includes(e.type);
    });

    if (isWeaponView) {
      result = result.filter(e => {
        const data = (e.data || {}) as unknown as WeaponData;
        const rarityMatch = selectedRarities.length === 0 || selectedRarities.includes(data.rarityTierId);
        const subTypeMatch = selectedSubTypes.length === 0 || selectedSubTypes.includes(data.subType);
        const magicMatch = selectedMagicSystems.length === 0 || 
                           (data.magicSystemIds && data.magicSystemIds.some(id => selectedMagicSystems.includes(id)));
        return rarityMatch && subTypeMatch && magicMatch;
      });
    }

    return result;
  }, [entities, typeFilters, isWeaponView, selectedRarities, selectedSubTypes, selectedMagicSystems]);

  const toggleFilter = (val: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(val)) {
      setList(list.filter(i => i !== val));
    } else {
      setList([...list, val]);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {isWeaponView && (
        <div className="flex flex-col gap-4 p-5 bg-surface border border-subtle rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-primary">Filter Catalog</h3>
            {(selectedRarities.length > 0 || selectedSubTypes.length > 0 || selectedMagicSystems.length > 0) && (
              <button 
                onClick={() => {
                  setSelectedRarities([]);
                  setSelectedSubTypes([]);
                  setSelectedMagicSystems([]);
                }}
                className="text-xs text-clay hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-secondary font-bold uppercase tracking-wider">Rarity</label>
              <div className="flex flex-wrap gap-2">
                {rarityTiers.map(tier => {
                  const tData = tier.data as unknown as RarityTierData;
                  const isSelected = selectedRarities.includes(tier.id);
                  return (
                    <button
                      key={tier.id}
                      onClick={() => toggleFilter(tier.id, selectedRarities, setSelectedRarities)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        isSelected 
                          ? `${tData.bgColor} ${tData.textColor} border-transparent shadow-sm` 
                          : 'bg-base text-ghost border-subtle hover:text-primary hover:border-primary/30'
                      }`}
                    >
                      {tier.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-secondary font-bold uppercase tracking-wider">Sub-Type</label>
              <div className="flex flex-wrap gap-2">
                {SUB_TYPES.map(st => (
                  <button
                    key={st}
                    onClick={() => toggleFilter(st, selectedSubTypes, setSelectedSubTypes)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                      selectedSubTypes.includes(st)
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-base text-ghost border-subtle hover:text-primary hover:border-primary/30'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {magicSystems.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="text-xs text-secondary font-bold uppercase tracking-wider">Magic Compatibility</label>
                <div className="flex flex-wrap gap-2">
                  {magicSystems.map(ms => (
                    <button
                      key={ms.id}
                      onClick={() => toggleFilter(ms.id, selectedMagicSystems, setSelectedMagicSystems)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        selectedMagicSystems.includes(ms.id)
                          ? 'bg-terracotta text-white border-terracotta shadow-sm'
                          : 'bg-base text-ghost border-subtle hover:text-primary hover:border-primary/30'
                      }`}
                    >
                      {ms.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {filteredEntities.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-ghost border-2 border-dashed border-subtle rounded-xl">
          <FileText size={32} className="mb-2 opacity-50" />
          <p>No entries found matching filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
          {filteredEntities.map((entity) => {
            if (entity.type === 'MAGIC_SYSTEM') {
              return <MagicSystemCard key={entity.id} entity={entity} onClick={() => onEntityClick?.(entity.id)} />;
            }
            if (entity.type === 'WEAPON') {
              return <WeaponCard key={entity.id} entity={entity} onClick={() => onEntityClick?.(entity.id)} />;
            }
            if (entity.type === 'CULTURE') {
              return <CultureCard key={entity.id} entity={entity} onClick={() => onEntityClick?.(entity.id)} />;
            }
            return (
              <div 
                key={entity.id}
                onClick={() => onEntityClick?.(entity.id)}
                className="group flex flex-col bg-surface border border-subtle p-4 rounded-xl cursor-pointer glass-card-hover shadow-soft"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-subtle group-hover:bg-terracotta/10 group-hover:border-terracotta/30 transition-colors">
                    {getTypeIcon(entity.type)}
                  </div>
                </div>
                <h3 className="font-serif font-bold text-primary text-lg leading-tight group-hover:text-terracotta transition-colors line-clamp-2">
                  {entity.name}
                </h3>
                <p className="text-xs text-ghost mt-1 uppercase tracking-wider font-bold">
                  {entity.type}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
