import { useState, useEffect } from 'react';
import { Entity, ItemData } from '@/types';
import { Input, Label, Select, Textarea } from '@/components/ui';
import { useStoryStore } from '@/stores/storyStore';
import { Sparkles, X } from 'lucide-react';

interface ItemFormProps {
  entity: Entity;
  onSave: (entity: Entity) => void;
}

export function ItemForm({ entity, onSave }: ItemFormProps) {
  const { entities } = useStoryStore();
  const initialData = (entity.data as unknown as Partial<ItemData>) || {};

  const [name, setName] = useState(entity.name);
  const [itemType, setItemType] = useState(initialData.itemType || 'Artifact');
  const [originRegionId, setOriginRegionId] = useState(initialData.originRegionId || '');
  const [currentOwnerId, setCurrentOwnerId] = useState(initialData.currentOwnerId || '');
  const [value, setValue] = useState(initialData.value || '');
  const [history, setHistory] = useState(initialData.history || '');
  
  const [materials, setMaterials] = useState<string[]>(initialData.materials || []);
  const [properties, setProperties] = useState<string[]>(initialData.properties || []);
  
  const [aiRuleEnabled, setAiRuleEnabled] = useState(entity.hasAIRule || initialData.aiRuleEnabled || false);
  const [aiRuleText, setAiRuleText] = useState(initialData.aiRuleText || '');

  const [matInput, setMatInput] = useState('');
  const [propInput, setPropInput] = useState('');

  const characters = entities.filter(e => e.type === 'character');
  const locations = entities.filter(e => ['location', 'region'].includes(e.type));

  const handleAddTag = (
    e: React.KeyboardEvent, 
    input: string, 
    setInput: (val: string) => void, 
    list: string[], 
    setList: (val: string[]) => void
  ) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!list.includes(input.trim())) {
        setList([...list, input.trim()]);
      }
      setInput('');
    }
  };

  const removeTag = (val: string, list: string[], setList: (val: string[]) => void) => {
    setList(list.filter(item => item !== val));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onSave({
        ...entity,
        name,
        hasAIRule: aiRuleEnabled,
        data: {
          ...entity.data,
          itemType,
          originRegionId,
          currentOwnerId,
          value,
          history,
          materials,
          properties,
          aiRuleEnabled,
          aiRuleText
        } as unknown as Record<string, unknown>
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [
    name, itemType, originRegionId, currentOwnerId, value, history,
    materials, properties, aiRuleEnabled, aiRuleText, entity, onSave
  ]);

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Item Name</Label>
          <Input 
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. The One Ring"
            className="font-serif text-lg font-bold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Item Type</Label>
            <Select
              value={itemType}
              onValueChange={setItemType}
              options={[
                { value: 'Weapon', label: 'Weapon' },
                { value: 'Armor', label: 'Armor' },
                { value: 'Artifact', label: 'Artifact' },
                { value: 'Relic', label: 'Relic' },
                { value: 'Vehicle', label: 'Vehicle' },
                { value: 'Consumable', label: 'Consumable' },
                { value: 'Other', label: 'Other' },
              ]}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Current Owner</Label>
            <Select
              value={currentOwnerId}
              onValueChange={setCurrentOwnerId}
              options={[
                { value: '', label: '-- Unknown / Lost --' },
                ...characters.map(e => ({ value: e.id, label: e.name }))
              ]}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Origin Region</Label>
            <Select
              value={originRegionId}
              onValueChange={setOriginRegionId}
              options={[
                { value: '', label: '-- Unknown --' },
                ...locations.map(e => ({ value: e.id, label: e.name }))
              ]}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>History & Significance</Label>
        <Textarea 
          value={history}
          onChange={e => setHistory(e.target.value)}
          placeholder="How was this item created? Why is it important?"
          className="min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label>Materials Made Of (Press Enter)</Label>
          <Input 
            value={matInput}
            onChange={e => setMatInput(e.target.value)}
            onKeyDown={e => handleAddTag(e, matInput, setMatInput, materials, setMaterials)}
            placeholder="e.g. Gold, Mithril, Wood"
          />
          <div className="flex flex-wrap gap-2 mt-1">
            {materials.map(m => (
              <span key={m} className="inline-flex items-center gap-1 px-2 py-1 bg-surface border border-subtle rounded-md text-xs font-medium text-secondary">
                {m} <button onClick={() => removeTag(m, materials, setMaterials)}><X size={12} /></button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Magical/Tech Properties (Press Enter)</Label>
          <Input 
            value={propInput}
            onChange={e => setPropInput(e.target.value)}
            onKeyDown={e => handleAddTag(e, propInput, setPropInput, properties, setProperties)}
            placeholder="e.g. Invisibility, Unbreakable"
          />
          <div className="flex flex-wrap gap-2 mt-1">
            {properties.map(p => (
              <span key={p} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-from/10 border border-amber-from/20 rounded-md text-xs font-medium text-amber-from">
                {p} <button onClick={() => removeTag(p, properties, setProperties)}><X size={12} /></button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-xl border ${aiRuleEnabled ? 'border-destructive/30 bg-destructive/5' : 'border-subtle bg-surface'} transition-colors`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className={aiRuleEnabled ? "text-destructive" : "text-ghost"} />
            <h3 className={`font-bold text-sm ${aiRuleEnabled ? 'text-destructive' : 'text-primary'}`}>
              Ghostwriter Constraint (Effects)
            </h3>
          </div>
          <label className="flex items-center gap-2 text-xs font-bold text-secondary cursor-pointer uppercase tracking-wider">
            Enable
            <input 
              type="checkbox" 
              checked={aiRuleEnabled}
              onChange={(e) => setAiRuleEnabled(e.target.checked)}
              className="rounded text-destructive focus:ring-destructive border-subtle"
            />
          </label>
        </div>
        {aiRuleEnabled && (
          <Textarea 
            value={aiRuleText}
            onChange={e => setAiRuleText(e.target.value)}
            placeholder="e.g. Anyone who touches it immediately feels a sense of dread."
            className="border-destructive/30 bg-white dark:bg-black min-h-[80px]"
          />
        )}
      </div>
    </div>
  );
}
