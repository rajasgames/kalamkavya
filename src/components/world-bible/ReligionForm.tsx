import { useState, useEffect } from 'react';
import { Entity, ReligionData } from '@/types';
import { Input, Label, Select, Textarea } from '@/components/ui';
import { useStoryStore } from '@/stores/storyStore';
import { Sparkles, X } from 'lucide-react';

interface ReligionFormProps {
  entity: Entity;
  onSave: (entity: Entity) => void;
}

export function ReligionForm({ entity, onSave }: ReligionFormProps) {
  const { entities } = useStoryStore();
  const initialData = (entity.data as unknown as Partial<ReligionData>) || {};

  const [name, setName] = useState(entity.name);
  const [founderId, setFounderId] = useState(initialData.founderId || '');
  const [placeOfWorship, setPlaceOfWorship] = useState(initialData.placeOfWorship || '');
  
  const [coreBeliefs, setCoreBeliefs] = useState<string[]>(initialData.coreBeliefs || []);
  const [rituals, setRituals] = useState<string[]>(initialData.rituals || []);
  const [holyTexts, setHolyTexts] = useState<string[]>(initialData.holyTexts || []);
  const [taboos, setTaboos] = useState<string[]>(initialData.taboos || []);
  const [deityIds, setDeityIds] = useState<string[]>(initialData.deityIds || []);
  
  const [aiRuleEnabled, setAiRuleEnabled] = useState(entity.hasAIRule || initialData.aiRuleEnabled || false);
  const [aiRuleText, setAiRuleText] = useState(initialData.aiRuleText || '');

  const [beliefInput, setBeliefInput] = useState('');
  const [ritualInput, setRitualInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [tabooInput, setTabooInput] = useState('');

  const characters = entities.filter(e => e.type === 'character');
  const gods = entities.filter(e => e.type.toLowerCase() === 'god' || e.type.toLowerCase() === 'character'); // Allow characters to be deities

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

  const toggleDeity = (id: string) => {
    if (deityIds.includes(id)) {
      setDeityIds(deityIds.filter(did => did !== id));
    } else {
      setDeityIds([...deityIds, id]);
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
          placeOfWorship,
          coreBeliefs,
          rituals,
          holyTexts,
          taboos,
          deityIds,
          aiRuleEnabled,
          aiRuleText
        } as unknown as Record<string, unknown>
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [
    name, founderId, placeOfWorship, coreBeliefs, rituals, holyTexts,
    taboos, deityIds, aiRuleEnabled, aiRuleText, entity, onSave
  ]);

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Religion Name</Label>
          <Input 
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. The Faith of the Seven"
            className="font-serif text-lg font-bold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Founder / Prophet</Label>
            <Select
              value={founderId}
              onValueChange={setFounderId}
              options={[
                { value: '', label: '-- Unknown / None --' },
                ...characters.map(e => ({ value: e.id, label: e.name }))
              ]}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Primary Place of Worship</Label>
            <Input 
              value={placeOfWorship}
              onChange={e => setPlaceOfWorship(e.target.value)}
              placeholder="e.g. Temples, Shrines, Forests"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label>Core Beliefs (Press Enter)</Label>
          <Input 
            value={beliefInput}
            onChange={e => setBeliefInput(e.target.value)}
            onKeyDown={e => handleAddTag(e, beliefInput, setBeliefInput, coreBeliefs, setCoreBeliefs)}
            placeholder="e.g. Reincarnation, Balance"
          />
          <div className="flex flex-wrap gap-2 mt-1">
            {coreBeliefs.map(b => (
              <span key={b} className="inline-flex items-center gap-1 px-2 py-1 bg-surface border border-subtle rounded-md text-xs font-medium text-secondary">
                {b} <button onClick={() => removeTag(b, coreBeliefs, setCoreBeliefs)}><X size={12} /></button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Rituals & Holidays (Press Enter)</Label>
          <Input 
            value={ritualInput}
            onChange={e => setRitualInput(e.target.value)}
            onKeyDown={e => handleAddTag(e, ritualInput, setRitualInput, rituals, setRituals)}
            placeholder="e.g. The Spring Equinox Fast"
          />
          <div className="flex flex-wrap gap-2 mt-1">
            {rituals.map(r => (
              <span key={r} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-from/10 border border-amber-from/20 rounded-md text-xs font-medium text-amber-from">
                {r} <button onClick={() => removeTag(r, rituals, setRituals)}><X size={12} /></button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Holy Texts (Press Enter)</Label>
          <Input 
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            onKeyDown={e => handleAddTag(e, textInput, setTextInput, holyTexts, setHolyTexts)}
            placeholder="e.g. The Book of Ages"
          />
          <div className="flex flex-wrap gap-2 mt-1">
            {holyTexts.map(t => (
              <span key={t} className="inline-flex items-center gap-1 px-2 py-1 bg-surface border border-subtle rounded-md text-xs font-medium text-secondary">
                {t} <button onClick={() => removeTag(t, holyTexts, setHolyTexts)}><X size={12} /></button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Taboos / Sins (Press Enter)</Label>
          <Input 
            value={tabooInput}
            onChange={e => setTabooInput(e.target.value)}
            onKeyDown={e => handleAddTag(e, tabooInput, setTabooInput, taboos, setTaboos)}
            placeholder="e.g. Eating Meat"
          />
          <div className="flex flex-wrap gap-2 mt-1">
            {taboos.map(t => (
              <span key={t} className="inline-flex items-center gap-1 px-2 py-1 bg-destructive/10 border border-destructive/20 rounded-md text-xs font-medium text-destructive">
                {t} <button onClick={() => removeTag(t, taboos, setTaboos)}><X size={12} /></button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {gods.length > 0 && (
        <div className="flex flex-col gap-2 p-4 bg-surface rounded-xl border border-subtle">
          <Label className="text-sm">Worshipped Deities / Figures</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {gods.map(g => (
              <label key={g.id} className="flex items-center gap-2 text-sm text-secondary cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={deityIds.includes(g.id)}
                  onChange={() => toggleDeity(g.id)}
                  className="rounded border-subtle text-amber-from focus:ring-amber-from bg-base"
                />
                <span className="font-medium truncate">{g.name}</span>
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
              Ghostwriter Constraint (Religion)
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
            placeholder="e.g. Followers of this religion must strictly avoid violence in their actions."
            className="border-destructive/30 bg-white dark:bg-black min-h-[80px]"
          />
        )}
      </div>
    </div>
  );
}
