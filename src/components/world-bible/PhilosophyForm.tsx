import { useState, useEffect } from 'react';
import { Entity, PhilosophyData } from '@/types';
import { Input, Label, Select, Textarea } from '@/components/ui';
import { useStoryStore } from '@/stores/storyStore';
import { Sparkles, X } from 'lucide-react';

interface PhilosophyFormProps {
  entity: Entity;
  onSave: (entity: Entity) => void;
}

export function PhilosophyForm({ entity, onSave }: PhilosophyFormProps) {
  const { entities } = useStoryStore();
  const initialData = (entity.data as unknown as Partial<PhilosophyData>) || {};

  const [name, setName] = useState(entity.name);
  const [founderId, setFounderId] = useState(initialData.founderId || '');
  const [societalImpact, setSocietalImpact] = useState(initialData.societalImpact || '');
  
  const [corePrinciples, setCorePrinciples] = useState<string[]>(initialData.corePrinciples || []);
  const [associatedFactions, setAssociatedFactions] = useState<string[]>(initialData.associatedFactions || []);
  
  const [aiRuleEnabled, setAiRuleEnabled] = useState(entity.hasAIRule || initialData.aiRuleEnabled || false);
  const [aiRuleText, setAiRuleText] = useState(initialData.aiRuleText || '');

  const [principleInput, setPrincipleInput] = useState('');

  const characters = entities.filter(e => e.type === 'character');
  const factions = entities.filter(e => e.type === 'faction');

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

  const toggleFaction = (id: string) => {
    if (associatedFactions.includes(id)) {
      setAssociatedFactions(associatedFactions.filter(fid => fid !== id));
    } else {
      setAssociatedFactions([...associatedFactions, id]);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onSave({
        ...entity,
        name,
        hasAIRule: aiRuleEnabled,
        data: {
          ...entity.data,
          founderId,
          societalImpact,
          corePrinciples,
          associatedFactions,
          aiRuleEnabled,
          aiRuleText
        } as unknown as Record<string, unknown>
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [
    name, founderId, societalImpact, corePrinciples, associatedFactions,
    aiRuleEnabled, aiRuleText, entity, onSave
  ]);

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Philosophy Name</Label>
          <Input 
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Stoicism, The Way of the Leaf"
            className="font-serif text-lg font-bold"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Founder / Key Philosopher</Label>
          <Select
            value={founderId}
            onValueChange={setFounderId}
            options={[
              { value: '', label: '-- Unknown / None --' },
              ...characters.map(e => ({ value: e.id, label: e.name }))
            ]}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Societal Impact</Label>
        <Textarea 
          value={societalImpact}
          onChange={e => setSocietalImpact(e.target.value)}
          placeholder="How does this philosophy influence the world?"
          className="min-h-[100px]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Core Principles (Press Enter)</Label>
        <Input 
          value={principleInput}
          onChange={e => setPrincipleInput(e.target.value)}
          onKeyDown={e => handleAddTag(e, principleInput, setPrincipleInput, corePrinciples, setCorePrinciples)}
          placeholder="e.g. Do no harm to living things."
        />
        <div className="flex flex-col gap-2 mt-1">
          {corePrinciples.map(p => (
            <div key={p} className="flex items-center justify-between px-3 py-2 bg-surface border border-subtle rounded-md text-sm text-secondary">
              <span>{p}</span>
              <button onClick={() => removeTag(p, corePrinciples, setCorePrinciples)} className="text-ghost hover:text-destructive"><X size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      {factions.length > 0 && (
        <div className="flex flex-col gap-2 p-4 bg-surface rounded-xl border border-subtle">
          <Label className="text-sm">Associated Factions</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {factions.map(f => (
              <label key={f.id} className="flex items-center gap-2 text-sm text-secondary cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={associatedFactions.includes(f.id)}
                  onChange={() => toggleFaction(f.id)}
                  className="rounded border-subtle text-amber-from focus:ring-amber-from bg-base"
                />
                <span className="font-medium truncate">{f.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className={`p-4 rounded-xl border ${aiRuleEnabled ? 'border-destructive/30 bg-destructive/5' : 'border-subtle bg-surface'} transition-colors`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className={aiRuleEnabled ? "text-destructive" : "text-ghost"} />
            <h3 className={`font-bold text-sm ${aiRuleEnabled ? 'text-destructive' : 'text-primary'}`}>
              Ghostwriter Constraint (Ideology)
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
            placeholder="e.g. Followers of this philosophy always try to find the logical solution first."
            className="border-destructive/30 bg-white dark:bg-black min-h-[80px]"
          />
        )}
      </div>
    </div>
  );
}
