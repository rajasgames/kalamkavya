import { useState, useEffect } from 'react';
import { Entity, SpeciesData } from '@/types';
import { Input, Label, Select, Textarea } from '@/components/ui';
import { Sparkles, X } from 'lucide-react';

interface SpeciesFormProps {
  entity: Entity;
  onSave: (entity: Entity) => void;
}

export function SpeciesForm({ entity, onSave }: SpeciesFormProps) {
  const initialData = (entity.data as unknown as Partial<SpeciesData>) || {};

  const [name, setName] = useState(entity.name);
  const [classification, setClassification] = useState(initialData.classification || 'Mammal');
  const [habitat, setHabitat] = useState(initialData.habitat || '');
  const [lifespan, setLifespan] = useState(initialData.lifespan || '');
  const [diet, setDiet] = useState(initialData.diet || '');
  const [intelligence, setIntelligence] = useState(initialData.intelligence || 'Sentient');
  const [physicalTraits, setPhysicalTraits] = useState<string[]>(initialData.physicalTraits || []);
  const [abilities, setAbilities] = useState<string[]>(initialData.abilities || []);
  const [aiRuleEnabled, setAiRuleEnabled] = useState(entity.hasAIRule || initialData.aiRuleEnabled || false);
  const [aiRuleText, setAiRuleText] = useState(initialData.aiRuleText || '');

  const [traitInput, setTraitInput] = useState('');
  const [abilityInput, setAbilityInput] = useState('');

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
          classification,
          habitat,
          lifespan,
          diet,
          intelligence,
          physicalTraits,
          abilities,
          aiRuleEnabled,
          aiRuleText
        } as unknown as Record<string, unknown>
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [
    name, classification, habitat, lifespan, diet, intelligence,
    physicalTraits, abilities, aiRuleEnabled, aiRuleText, entity, onSave
  ]);

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Species Name</Label>
          <Input 
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. High Elves, Sandworms"
            className="font-serif text-lg font-bold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Classification</Label>
            <Select
              value={classification}
              onValueChange={setClassification}
              options={[
                { value: 'Mammal', label: 'Mammal' },
                { value: 'Reptile', label: 'Reptile' },
                { value: 'Avian', label: 'Avian' },
                { value: 'Aquatic', label: 'Aquatic' },
                { value: 'Amphibian', label: 'Amphibian' },
                { value: 'Insectoid', label: 'Insectoid' },
                { value: 'Plant', label: 'Plant' },
                { value: 'Energy', label: 'Energy' },
                { value: 'Other', label: 'Other' },
              ]}
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <Label>Intelligence</Label>
            <Select
              value={intelligence}
              onValueChange={setIntelligence}
              options={[
                { value: 'Sentient', label: 'Sentient (Human-like)' },
                { value: 'Semi-Sentient', label: 'Semi-Sentient (Animalistic but smart)' },
                { value: 'Non-Sentient', label: 'Non-Sentient (Beast)' },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-1.5">
          <Label>Habitat</Label>
          <Input value={habitat} onChange={e => setHabitat(e.target.value)} placeholder="e.g. Deep Sea" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Lifespan</Label>
          <Input value={lifespan} onChange={e => setLifespan(e.target.value)} placeholder="e.g. 500 years" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Diet</Label>
          <Input value={diet} onChange={e => setDiet(e.target.value)} placeholder="e.g. Carnivore" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label>Physical Traits (Press Enter)</Label>
          <Input 
            value={traitInput}
            onChange={e => setTraitInput(e.target.value)}
            onKeyDown={e => handleAddTag(e, traitInput, setTraitInput, physicalTraits, setPhysicalTraits)}
            placeholder="e.g. Prehensile Tail, Gills"
          />
          <div className="flex flex-wrap gap-2 mt-1">
            {physicalTraits.map(t => (
              <span key={t} className="inline-flex items-center gap-1 px-2 py-1 bg-surface border border-subtle rounded-md text-xs font-medium text-secondary">
                {t} <button onClick={() => removeTag(t, physicalTraits, setPhysicalTraits)}><X size={12} /></button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Special Abilities (Press Enter)</Label>
          <Input 
            value={abilityInput}
            onChange={e => setAbilityInput(e.target.value)}
            onKeyDown={e => handleAddTag(e, abilityInput, setAbilityInput, abilities, setAbilities)}
            placeholder="e.g. Night Vision, Acid Spit"
          />
          <div className="flex flex-wrap gap-2 mt-1">
            {abilities.map(a => (
              <span key={a} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-from/10 border border-amber-from/20 rounded-md text-xs font-medium text-amber-from">
                {a} <button onClick={() => removeTag(a, abilities, setAbilities)}><X size={12} /></button>
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
              Ghostwriter Constraint (Behavior)
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
            placeholder="e.g. They communicate only through clicks and whistles."
            className="border-destructive/30 bg-white dark:bg-black min-h-[80px]"
          />
        )}
      </div>
    </div>
  );
}
