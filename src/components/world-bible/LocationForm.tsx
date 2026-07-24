import { useState, useEffect } from 'react';
import { Entity, LocationData } from '@/types';
import { Input, Label, Select, Textarea } from '@/components/ui';
import { useStoryStore } from '@/stores/storyStore';
import { Sparkles, MapPin, X } from 'lucide-react';

interface LocationFormProps {
  entity: Entity;
  onSave: (entity: Entity) => void;
}

export function LocationForm({ entity, onSave }: LocationFormProps) {
  const { entities } = useStoryStore();
  const initialData = (entity.data as unknown as Partial<LocationData>) || {};

  const [name, setName] = useState(entity.name);
  const [locationType, setLocationType] = useState(initialData.locationType || 'Region');
  const [climate, setClimate] = useState(initialData.climate || '');
  const [terrain, setTerrain] = useState(initialData.terrain || '');
  const [rulerId, setRulerId] = useState(initialData.rulerId || '');
  const [population, setPopulation] = useState(initialData.population || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [resources, setResources] = useState<string[]>(initialData.resources || []);
  const [aiRuleEnabled, setAiRuleEnabled] = useState(entity.hasAIRule || initialData.aiRuleEnabled || false);
  const [aiRuleText, setAiRuleText] = useState(initialData.aiRuleText || '');

  // temporary input for resources
  const [resourceInput, setResourceInput] = useState('');

  // Fetch Characters or Factions for rulers
  const rulerEntities = entities.filter(e => ['character', 'faction'].includes(e.type));

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

  // Auto-save debounced
  useEffect(() => {
    const timer = setTimeout(() => {
      onSave({
        ...entity,
        name,
        hasAIRule: aiRuleEnabled,
        data: {
          ...entity.data,
          locationType,
          climate,
          terrain,
          rulerId,
          population,
          description,
          resources,
          aiRuleEnabled,
          aiRuleText
        } as unknown as Record<string, unknown>
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [
    name, locationType, climate, terrain, rulerId, population,
    description, resources, aiRuleEnabled, aiRuleText, entity, onSave
  ]);

  return (
    <div className="flex flex-col gap-8 pb-12">
      
      {/* Basic Info */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Location Name</Label>
          <Input 
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. The Whispering Woods"
            className="font-serif text-lg font-bold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-1"><MapPin size={14} className="text-sage" /> Type</Label>
            <Select
              value={locationType}
              onValueChange={setLocationType}
              options={[
                { value: 'Planet', label: 'Planet' },
                { value: 'Continent', label: 'Continent' },
                { value: 'Region', label: 'Region' },
                { value: 'City', label: 'City' },
                { value: 'Building', label: 'Building' },
                { value: 'Landmark', label: 'Landmark' },
                { value: 'Other', label: 'Other' },
              ]}
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <Label>Governing Entity / Ruler</Label>
            <Select
              value={rulerId}
              onValueChange={setRulerId}
              options={[
                { value: '', label: '-- None / Unknown --' },
                ...rulerEntities.map(e => ({ value: e.id, label: e.name }))
              ]}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>General Description</Label>
        <Textarea 
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="A brief overview of the location's appearance and significance..."
          className="min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-1.5">
          <Label>Climate</Label>
          <Input 
            value={climate}
            onChange={e => setClimate(e.target.value)}
            placeholder="e.g. Tropical, Arid, Arctic"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Terrain</Label>
          <Input 
            value={terrain}
            onChange={e => setTerrain(e.target.value)}
            placeholder="e.g. Mountainous, Swampland"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Population</Label>
          <Input 
            value={population}
            onChange={e => setPopulation(e.target.value)}
            placeholder="e.g. 1.2 Million"
          />
        </div>
      </div>

      {/* Resources */}
      <div className="flex flex-col gap-2">
        <Label>Resources & Exports (Press Enter)</Label>
        <Input 
          value={resourceInput}
          onChange={e => setResourceInput(e.target.value)}
          onKeyDown={e => handleAddTag(e, resourceInput, setResourceInput, resources, setResources)}
          placeholder="e.g. Iron, Spice, Timber"
        />
        {resources.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {resources.map(res => (
              <span key={res} className="inline-flex items-center gap-1 px-2 py-1 bg-surface border border-subtle rounded-md text-xs font-medium text-secondary">
                {res}
                <button onClick={() => removeTag(res, resources, setResources)} className="text-ghost hover:text-destructive">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* AI Constraint Block */}
      <div className={`p-4 rounded-xl border ${aiRuleEnabled ? 'border-destructive/30 bg-destructive/5' : 'border-subtle bg-surface'} transition-colors`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className={aiRuleEnabled ? "text-destructive" : "text-ghost"} />
            <h3 className={`font-bold text-sm ${aiRuleEnabled ? 'text-destructive' : 'text-primary'}`}>
              Ghostwriter Constraint (Atmosphere & Rules)
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
        <p className="text-xs text-ghost mb-3">
          Enforce sensory details or environmental rules when generating scenes in this location.
        </p>
        {aiRuleEnabled && (
          <Textarea 
            value={aiRuleText}
            onChange={e => setAiRuleText(e.target.value)}
            placeholder="e.g. It is always raining here. Never describe sunlight."
            className="border-destructive/30 bg-white dark:bg-black min-h-[80px]"
          />
        )}
      </div>

    </div>
  );
}
