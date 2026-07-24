import { useState, useEffect } from 'react';
import { Entity, CultureData } from '@/types';
import { Input, Label, Select, Textarea } from '@/components/ui';
import { useStoryStore } from '@/stores/storyStore';
import { Sparkles, MapPin, X } from 'lucide-react';

interface CultureFormProps {
  entity: Entity;
  onSave: (entity: Entity) => void;
}

export function CultureForm({ entity, onSave }: CultureFormProps) {
  const { entities } = useStoryStore();
  const initialData = (entity.data as unknown as Partial<CultureData>) || {};

  const [name, setName] = useState(entity.name);
  const [associatedRegionId, setAssociatedRegionId] = useState(initialData.associatedRegionId || '');
  const [languageNotes, setLanguageNotes] = useState(initialData.languageNotes || '');
  const [coreValues, setCoreValues] = useState<string[]>(initialData.coreValues || []);
  const [socialStructure, setSocialStructure] = useState(initialData.socialStructure || '');
  const [keyCustoms, setKeyCustoms] = useState(initialData.keyCustoms || '');
  const [taboos, setTaboos] = useState<string[]>(initialData.taboos || []);
  const [religiousBeliefs, setReligiousBeliefs] = useState(initialData.religiousBeliefs || '');
  const [artAndMusic, setArtAndMusic] = useState(initialData.artAndMusic || '');
  const [factionIds, setFactionIds] = useState<string[]>(initialData.factionIds || []);
  const [aiRuleEnabled, setAiRuleEnabled] = useState(entity.hasAIRule || initialData.aiRuleEnabled || false);
  const [aiRuleText, setAiRuleText] = useState(initialData.aiRuleText || '');

  // temporary inputs for tags
  const [coreValueInput, setCoreValueInput] = useState('');
  const [tabooInput, setTabooInput] = useState('');

  // Fetch Geography entities (Location, Region, Landmark)
  const geographyEntities = entities.filter(e => ['location', 'region', 'landmark'].includes(e.type));
  // Fetch Faction entities
  const factionEntities = entities.filter(e => e.type === 'faction');

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

  const toggleArrayItem = (id: string, list: string[], setList: (val: string[]) => void) => {
    if (list.includes(id)) {
      setList(list.filter(i => i !== id));
    } else {
      setList([...list, id]);
    }
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
          associatedRegionId,
          languageNotes,
          coreValues,
          socialStructure,
          keyCustoms,
          taboos,
          religiousBeliefs,
          artAndMusic,
          factionIds,
          aiRuleEnabled,
          aiRuleText
        } as unknown as Record<string, unknown>
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [
    name, associatedRegionId, languageNotes, coreValues, socialStructure,
    keyCustoms, taboos, religiousBeliefs, artAndMusic, factionIds,
    aiRuleEnabled, aiRuleText, entity, onSave
  ]);

  return (
    <div className="flex flex-col gap-8 pb-12">
      
      {/* Basic Info */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Culture Name</Label>
          <Input 
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. The Riverfolk of Oakhaven"
            className="font-serif text-lg font-bold"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-1"><MapPin size={14} className="text-sage" /> Associated Region</Label>
          <Select
            value={associatedRegionId}
            onValueChange={setAssociatedRegionId}
            options={[
              { value: '', label: '-- None / Nomadic --' },
              ...geographyEntities.map(e => ({ value: e.id, label: e.name }))
            ]}
          />
        </div>
      </div>

      {/* Core Values & Taboos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label>Core Values (Press Enter)</Label>
          <Input 
            value={coreValueInput}
            onChange={e => setCoreValueInput(e.target.value)}
            onKeyDown={e => handleAddTag(e, coreValueInput, setCoreValueInput, coreValues, setCoreValues)}
            placeholder="e.g. Honor, Kinship, Sea"
          />
          {coreValues.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {coreValues.map(cv => (
                <span key={cv} className="inline-flex items-center gap-1 px-2 py-1 bg-surface border border-subtle rounded-md text-xs font-medium text-secondary">
                  {cv}
                  <button onClick={() => removeTag(cv, coreValues, setCoreValues)} className="text-ghost hover:text-destructive">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Cultural Taboos (Press Enter)</Label>
          <Input 
            value={tabooInput}
            onChange={e => setTabooInput(e.target.value)}
            onKeyDown={e => handleAddTag(e, tabooInput, setTabooInput, taboos, setTaboos)}
            placeholder="e.g. Speaking of the Dead"
          />
          {taboos.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {taboos.map(tb => (
                <span key={tb} className="inline-flex items-center gap-1 px-2 py-1 bg-destructive/5 border border-destructive/20 rounded-md text-xs font-medium text-destructive">
                  {tb}
                  <button onClick={() => removeTag(tb, taboos, setTaboos)} className="text-destructive/50 hover:text-destructive">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Deep Lore */}
      <div className="flex flex-col gap-6">
        <h3 className="font-serif text-lg font-bold text-primary border-b border-subtle pb-2">Cultural Lore</h3>
        
        <div className="flex flex-col gap-1.5">
          <Label>Language & Communication Notes</Label>
          <Textarea 
            value={languageNotes}
            onChange={e => setLanguageNotes(e.target.value)}
            placeholder="Idioms, dialects, gestures, or naming conventions..."
            className="min-h-[100px]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Social Structure & Governance</Label>
          <Textarea 
            value={socialStructure}
            onChange={e => setSocialStructure(e.target.value)}
            placeholder="Matriarchy? Caste system? Council of elders?"
            className="min-h-[100px]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Key Customs & Traditions</Label>
          <Textarea 
            value={keyCustoms}
            onChange={e => setKeyCustoms(e.target.value)}
            placeholder="Festivals, rites of passage, greeting customs..."
            className="min-h-[100px]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Religious Beliefs</Label>
          <Textarea 
            value={religiousBeliefs}
            onChange={e => setReligiousBeliefs(e.target.value)}
            placeholder="Pantheons, ancestor worship, or secular philosophies..."
            className="min-h-[100px]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Art, Music & Architecture</Label>
          <Textarea 
            value={artAndMusic}
            onChange={e => setArtAndMusic(e.target.value)}
            placeholder="Distinctive styles, materials used, musical instruments..."
            className="min-h-[100px]"
          />
        </div>
      </div>

      {/* Factions */}
      {factionEntities.length > 0 && (
        <div className="flex flex-col gap-2 p-4 bg-surface rounded-xl border border-subtle">
          <Label className="text-sm">Embodying or Opposing Factions</Label>
          <p className="text-xs text-ghost mb-2">Select factions that strongly represent or conflict with this culture.</p>
          <div className="flex flex-col gap-2">
            {factionEntities.map(faction => (
              <label key={faction.id} className="flex items-center gap-2 text-sm text-secondary cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={factionIds.includes(faction.id)}
                  onChange={() => toggleArrayItem(faction.id, factionIds, setFactionIds)}
                  className="rounded border-subtle text-amber-from focus:ring-amber-from bg-base"
                />
                {faction.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* AI Constraint Block */}
      <div className={`p-4 rounded-xl border ${aiRuleEnabled ? 'border-destructive/30 bg-destructive/5' : 'border-subtle bg-surface'} transition-colors`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className={aiRuleEnabled ? "text-destructive" : "text-ghost"} />
            <h3 className={`font-bold text-sm ${aiRuleEnabled ? 'text-destructive' : 'text-primary'}`}>
              Ghostwriter Constraint (Culture & Taboos)
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
          Enforce strict cultural norms, dialects, or taboos when the AI generates dialogue or scenes involving this culture.
        </p>
        {aiRuleEnabled && (
          <Textarea 
            value={aiRuleText}
            onChange={e => setAiRuleText(e.target.value)}
            placeholder="e.g. NEVER use contractions in dialogue. Characters must always refer to the ocean with reverence. They will aggressively shun anyone who speaks of the dead."
            className="border-destructive/30 bg-white dark:bg-black min-h-[80px]"
          />
        )}
      </div>

    </div>
  );
}
