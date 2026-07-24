import { useState, useEffect } from 'react';
import { Entity, SystemData } from '@/types';
import { Input, Label, Select, Textarea } from '@/components/ui';
import { useStoryStore } from '@/stores/storyStore';
import { Sparkles, X } from 'lucide-react';

interface SystemFormProps {
  entity: Entity;
  onSave: (entity: Entity) => void;
}

export function SystemForm({ entity, onSave }: SystemFormProps) {
  const { entities } = useStoryStore();
  const initialData = (entity.data as unknown as Partial<SystemData>) || {};

  const [name, setName] = useState(entity.name);
  const [systemType, setSystemType] = useState(initialData.systemType || 'Political');
  const [structure, setStructure] = useState(initialData.structure || '');
  const [description, setDescription] = useState(initialData.description || '');
  
  const [rules, setRules] = useState<string[]>(initialData.rules || []);
  const [keyFigures, setKeyFigures] = useState<string[]>(initialData.keyFigures || []);
  
  const [aiRuleEnabled, setAiRuleEnabled] = useState(entity.hasAIRule || initialData.aiRuleEnabled || false);
  const [aiRuleText, setAiRuleText] = useState(initialData.aiRuleText || '');

  const [ruleInput, setRuleInput] = useState('');

  const characters = entities.filter(e => e.type === 'character');

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

  const toggleFigure = (id: string) => {
    if (keyFigures.includes(id)) {
      setKeyFigures(keyFigures.filter(fid => fid !== id));
    } else {
      setKeyFigures([...keyFigures, id]);
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
          systemType,
          structure,
          description,
          rules,
          keyFigures,
          aiRuleEnabled,
          aiRuleText
        } as unknown as Record<string, unknown>
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [
    name, systemType, structure, description, rules, keyFigures,
    aiRuleEnabled, aiRuleText, entity, onSave
  ]);

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>System Name</Label>
          <Input 
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Galactic Senate, The Gold Standard"
            className="font-serif text-lg font-bold"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>System Type</Label>
          <Select
            value={systemType}
            onValueChange={setSystemType}
            options={[
              { value: 'Political', label: 'Political / Governance' },
              { value: 'Economic', label: 'Economic / Trade' },
              { value: 'Legal', label: 'Legal / Justice' },
              { value: 'Guild', label: 'Guild / Trade Union' },
              { value: 'Other', label: 'Other' },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Structure & Hierarchy</Label>
        <Textarea 
          value={structure}
          onChange={e => setStructure(e.target.value)}
          placeholder="e.g. A triumvirate overseeing 12 regional governors."
          className="min-h-[100px]"
        />
      </div>
      
      <div className="flex flex-col gap-1.5">
        <Label>General Description</Label>
        <Textarea 
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="How does this system impact the daily lives of the people?"
          className="min-h-[100px]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Core Rules / Laws (Press Enter)</Label>
        <Input 
          value={ruleInput}
          onChange={e => setRuleInput(e.target.value)}
          onKeyDown={e => handleAddTag(e, ruleInput, setRuleInput, rules, setRules)}
          placeholder="e.g. Magic use is heavily taxed."
        />
        <div className="flex flex-col gap-2 mt-1">
          {rules.map(r => (
            <div key={r} className="flex items-center justify-between px-3 py-2 bg-surface border border-subtle rounded-md text-sm text-secondary">
              <span>{r}</span>
              <button onClick={() => removeTag(r, rules, setRules)} className="text-ghost hover:text-destructive"><X size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      {characters.length > 0 && (
        <div className="flex flex-col gap-2 p-4 bg-surface rounded-xl border border-subtle">
          <Label className="text-sm">Key Figures / Leaders</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {characters.map(c => (
              <label key={c.id} className="flex items-center gap-2 text-sm text-secondary cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={keyFigures.includes(c.id)}
                  onChange={() => toggleFigure(c.id)}
                  className="rounded border-subtle text-amber-from focus:ring-amber-from bg-base"
                />
                <span className="font-medium truncate">{c.name}</span>
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
              Ghostwriter Constraint (Enforcement)
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
            placeholder="e.g. Characters cannot openly trade without mentioning tariffs."
            className="border-destructive/30 bg-white dark:bg-black min-h-[80px]"
          />
        )}
      </div>
    </div>
  );
}
