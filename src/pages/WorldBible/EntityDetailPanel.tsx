import { useStoryStore } from '@/stores/storyStore';
import { X, Globe2 } from 'lucide-react';
import { MagicSystemForm, WeaponForm, CultureForm, CultureCard, CharacterForm } from '@/components/world-bible';
import { IndividualTreeGraph } from '@/components/flowchart';
import { CultureData } from '@/types';
import { useState } from 'react';

interface EntityDetailPanelProps {
  entityId: string;
  onClose: () => void;
}

export function EntityDetailPanel({ entityId, onClose }: EntityDetailPanelProps) {
  const { entities, updateEntity } = useStoryStore();
  const [viewMode, setViewMode] = useState<'form' | 'tree'>('form');
  const entity = entities.find(e => e.id === entityId);

  if (!entity) return null;

  const isGeography = ['location', 'region', 'landmark'].includes(entity.type);
  const relatedCultures = isGeography 
    ? entities.filter(e => e.type === 'CULTURE' && (e.data as unknown as CultureData)?.associatedRegionId === entity.id)
    : [];

  return (
    <div className="w-1/3 min-w-[400px] border-l border-subtle bg-base h-full flex flex-col shadow-xl z-20 animate-in slide-in-from-right-full duration-300">
      <div className="flex items-center justify-between p-4 border-b border-subtle bg-surface shrink-0">
        <h2 className="font-serif text-lg font-bold text-primary truncate pr-4">
          Edit {entity.type}
        </h2>
        <div className="flex items-center gap-2">
          {['character', 'FACTION'].includes(entity.type.toLowerCase()) && (
            <div className="bg-elevated p-1 rounded-lg border border-subtle flex">
              <button
                onClick={() => setViewMode('form')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'form' ? 'bg-amber-from/20 text-amber-from' : 'text-ghost hover:text-primary'}`}
              >
                Form
              </button>
              <button
                onClick={() => setViewMode('tree')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'tree' ? 'bg-amber-from/20 text-amber-from' : 'text-ghost hover:text-primary'}`}
              >
                Tree
              </button>
            </div>
          )}
          <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-ghost hover:text-primary transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        {viewMode === 'tree' ? (
          <div className="w-full h-full flex flex-col gap-4">
            <h3 className="text-sm font-bold text-primary">Relationship Tree</h3>
            <div className="flex-1 min-h-[400px]">
              <IndividualTreeGraph rootEntityId={entity.id} />
            </div>
          </div>
        ) : entity.type === 'MAGIC_SYSTEM' ? (
          <MagicSystemForm key={entity.id} entity={entity} onSave={updateEntity} />
        ) : entity.type === 'WEAPON' ? (
          <WeaponForm key={entity.id} entity={entity} onSave={updateEntity} />
        ) : entity.type === 'CULTURE' ? (
          <CultureForm key={entity.id} entity={entity} onSave={updateEntity} />
        ) : entity.type === 'character' ? (
          <CharacterForm key={entity.id} entity={entity} onSave={updateEntity} />
        ) : (
          <div className="flex flex-col gap-6">
            {isGeography && relatedCultures.length > 0 && (
              <div className="flex flex-col gap-3 p-4 bg-amber-from/5 border border-amber-from/20 rounded-xl">
                <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                  <Globe2 size={16} className="text-amber-from" /> 
                  Cultures in this Region
                </h3>
                <div className="flex flex-col gap-2">
                  {relatedCultures.map(culture => (
                    <div key={culture.id} className="pointer-events-none">
                      <CultureCard entity={culture} />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-ghost mt-1">
                  (Close this panel and click the culture card in the grid to edit it)
                </p>
              </div>
            )}

            <div className="text-secondary text-sm">
              <p className="mb-4">Standard fields go here. Specialized forms (like Magic Systems or Weapons) render custom UI.</p>
              <div className="p-4 bg-surface rounded-lg border border-subtle">
                <pre className="text-xs text-ghost whitespace-pre-wrap">
                  {JSON.stringify(entity, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
