import { useState, useEffect } from 'react';
import { Entity, MagicSystemData, PowerRank } from '@/types';
import { Button, Input, Label, Select } from '@/components/ui';
import { useStoryStore } from '@/stores/storyStore';
import { useAIStore } from '@/stores/aiStore';
import { streamAI } from '@/lib/ai/streamAI';
import { GripVertical, Plus, Trash2, Sparkles, Activity } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface MagicSystemFormProps {
  entity: Entity;
  onSave: (entity: Entity) => void;
}

const SOURCE_TYPES = [
  { value: 'Cosmic', label: 'Cosmic' },
  { value: 'Divine', label: 'Divine' },
  { value: 'Internal', label: 'Internal' },
  { value: 'Elemental', label: 'Elemental' },
  { value: 'Technological', label: 'Technological' }
];

export function MagicSystemForm({ entity, onSave }: MagicSystemFormProps) {
  const { entities } = useStoryStore();
  const { isStreaming, streamedText } = useAIStore();
  
  const initialData = (entity.data as unknown as MagicSystemData) || {};
  
  const [name, setName] = useState(entity.name);
  const [sourceType, setSourceType] = useState<MagicSystemData['sourceType']>(initialData.sourceType || 'Elemental');
  const [howItWorks, setHowItWorks] = useState(initialData.howItWorks || '');
  const [limitations, setLimitations] = useState(initialData.limitations || '');
  const [awakeningConditions, setAwakeningConditions] = useState(initialData.awakeningConditions || '');
  const [sideEffects, setSideEffects] = useState<string[]>(initialData.sideEffects || []);
  const [powerRanks, setPowerRanks] = useState<PowerRank[]>(initialData.powerRanks || []);
  const [knownPractitioners, setKnownPractitioners] = useState<string[]>(initialData.knownPractitioners || []);
  
  const [aiRuleEnabled, setAiRuleEnabled] = useState(entity.hasAIRule || initialData.aiRuleEnabled || false);
  const [aiRuleText, setAiRuleText] = useState(initialData.aiRuleText || '');
  
  const [sideEffectInput, setSideEffectInput] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Character lookup for Practitioners
  const characters = entities.filter(e => e.type === 'character' || e.type === 'CHARACTER');

  // Handle Dnd Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Auto-save debounced
  useEffect(() => {
    const timer = setTimeout(() => {
      onSave({
        ...entity,
        name,
        hasAIRule: aiRuleEnabled,
        data: {
          ...entity.data,
          sourceType,
          howItWorks,
          limitations,
          sideEffects,
          awakeningConditions,
          powerRanks,
          knownPractitioners,
          aiRuleEnabled,
          aiRuleText
        } as unknown as Record<string, unknown>
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [
    name, sourceType, howItWorks, limitations, sideEffects, awakeningConditions, 
    powerRanks, knownPractitioners, aiRuleEnabled, aiRuleText, entity, onSave
  ]);

  // Handle AI Pre-fill completion
  useEffect(() => {
    if (isGenerating && !isStreaming) {
      setIsGenerating(false);
      try {
        // Extract JSON from streamedText
        const jsonMatch = streamedText.match(/```json\n([\s\S]*?)\n```/) || streamedText.match(/({[\s\S]*})/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]) as Partial<MagicSystemData & { name: string }>;
          if (parsed.name) setName(parsed.name);
          if (parsed.sourceType) setSourceType(parsed.sourceType);
          if (parsed.howItWorks) setHowItWorks(parsed.howItWorks);
          if (parsed.limitations) setLimitations(parsed.limitations);
          if (parsed.sideEffects) setSideEffects(parsed.sideEffects);
          if (parsed.awakeningConditions) setAwakeningConditions(parsed.awakeningConditions);
          if (parsed.powerRanks) setPowerRanks(parsed.powerRanks);
        }
      } catch (e) {
        console.error('Failed to parse AI response', e);
      }
    }
  }, [isStreaming, isGenerating, streamedText]);

  const handleGenerateLore = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    await streamAI({
      systemPrompt: 'You are an expert world-building assistant. Given this concept, extrapolate a magic system. Return a JSON object with keys: name, sourceType, howItWorks, limitations, sideEffects (array), awakeningConditions, powerRanks (array of {id, name, description}). Wrap JSON in ```json blocks.',
      userMessage: aiPrompt,
      onChunk: () => {},
      onDone: () => {},
      onError: (code) => {
        console.error(`AI Error: ${code}`);
        setIsGenerating(false);
      }
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPowerRanks((ranks) => {
        const oldIndex = ranks.findIndex(r => r.id === active.id);
        const newIndex = ranks.findIndex(r => r.id === over.id);
        return arrayMove(ranks, oldIndex, newIndex);
      });
    }
  };

  const addRank = () => {
    setPowerRanks([...powerRanks, { id: crypto.randomUUID(), name: '', description: '' }]);
  };

  const updateRank = (id: string, field: keyof PowerRank, value: string) => {
    setPowerRanks(ranks => ranks.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeRank = (id: string) => {
    setPowerRanks(ranks => ranks.filter(r => r.id !== id));
  };

  const addSideEffect = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && sideEffectInput.trim()) {
      e.preventDefault();
      if (!sideEffects.includes(sideEffectInput.trim())) {
        setSideEffects([...sideEffects, sideEffectInput.trim()]);
      }
      setSideEffectInput('');
    }
  };

  const removeSideEffect = (effect: string) => {
    setSideEffects(sideEffects.filter(s => s !== effect));
  };

  const togglePractitioner = (charId: string) => {
    if (knownPractitioners.includes(charId)) {
      setKnownPractitioners(knownPractitioners.filter(id => id !== charId));
    } else {
      setKnownPractitioners([...knownPractitioners, charId]);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* AI Generator Box */}
      <div className="bg-amber-from/5 border border-amber-from/30 p-4 rounded-xl flex flex-col gap-3">
        <Label className="flex items-center gap-2 text-amber-from font-bold">
          <Sparkles size={16} /> Generate with AI
        </Label>
        <p className="text-xs text-secondary">
          Describe your magic system in plain text. The AI will extrapolate rules, limitations, and power ranks.
        </p>
        <div className="flex gap-2">
          <Input 
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g. A magic system based on eating specific metals..."
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateLore()}
          />
          <Button 
            onClick={handleGenerateLore} 
            disabled={isGenerating || !aiPrompt.trim()}
            className="shrink-0"
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>System Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Source Type</Label>
        <Select value={sourceType} onValueChange={(val) => setSourceType(val as MagicSystemData['sourceType'])} options={SOURCE_TYPES} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>How It Works</Label>
        <textarea
          value={howItWorks}
          onChange={(e) => setHowItWorks(e.target.value)}
          rows={4}
          className="w-full bg-surface border border-subtle rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-amber-from resize-y"
          placeholder="Describe the fundamental mechanics..."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Limitations & Costs</Label>
        <textarea
          value={limitations}
          onChange={(e) => setLimitations(e.target.value)}
          rows={3}
          className="w-full bg-surface border border-subtle rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-amber-from resize-y"
          placeholder="What restricts this power? What is the cost of using it?"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Awakening / Access Conditions</Label>
        <textarea
          value={awakeningConditions}
          onChange={(e) => setAwakeningConditions(e.target.value)}
          rows={2}
          className="w-full bg-surface border border-subtle rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-amber-from resize-y"
          placeholder="How does someone acquire this power?"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Side Effects</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {sideEffects.map(effect => (
            <span key={effect} className="px-2 py-1 bg-surface border border-subtle rounded-md text-xs flex items-center gap-1">
              {effect}
              <button onClick={() => removeSideEffect(effect)} className="text-ghost hover:text-clay">
                <Trash2 size={12} />
              </button>
            </span>
          ))}
        </div>
        <Input 
          value={sideEffectInput}
          onChange={(e) => setSideEffectInput(e.target.value)}
          onKeyDown={addSideEffect}
          placeholder="Type a side effect and press Enter..."
        />
      </div>

      {/* Power Ranks Dnd List */}
      <div className="flex flex-col gap-3 mt-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Activity size={16} /> Power Ranks
          </Label>
          <Button variant="ghost" size="sm" onClick={addRank} className="h-7 text-xs">
            <Plus size={14} className="mr-1" /> Add Rank
          </Button>
        </div>
        
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={powerRanks} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {powerRanks.map((rank) => (
                <SortableRankItem 
                  key={rank.id} 
                  rank={rank} 
                  onUpdate={updateRank} 
                  onRemove={removeRank} 
                />
              ))}
              {powerRanks.length === 0 && (
                <div className="text-center p-4 border border-dashed border-subtle rounded-lg text-ghost text-sm">
                  No power ranks defined.
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="flex flex-col gap-1.5 mt-4">
        <Label>Known Practitioners</Label>
        <div className="flex flex-col gap-2 p-3 bg-surface border border-subtle rounded-lg max-h-48 overflow-y-auto">
          {characters.length === 0 ? (
            <span className="text-xs text-ghost italic">No characters found in Cast.</span>
          ) : (
            characters.map(char => (
              <label key={char.id} className="flex items-center gap-2 text-sm text-primary cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={knownPractitioners.includes(char.id)}
                  onChange={() => togglePractitioner(char.id)}
                  className="rounded border-subtle bg-base text-amber-from focus:ring-amber-from"
                />
                {char.name}
              </label>
            ))
          )}
        </div>
      </div>

      {/* AI Rule Constraints */}
      <div className="mt-6 border border-clay/30 bg-clay/5 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-clay font-bold flex items-center gap-2">
              #AI-Rule Constraint
            </Label>
            <p className="text-xs text-secondary mt-1">
              Enforce hard rules for the Ghostwriter AI (e.g. "Do not allow characters to bypass rank limits").
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox"
              checked={aiRuleEnabled}
              onChange={(e) => setAiRuleEnabled(e.target.checked)}
              className="rounded border-clay/50 text-clay focus:ring-clay"
            />
            <span className="text-sm font-bold text-primary">Enable</span>
          </label>
        </div>
        
        {aiRuleEnabled && (
          <textarea
            value={aiRuleText}
            onChange={(e) => setAiRuleText(e.target.value)}
            rows={3}
            className="w-full bg-base border border-clay/40 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-clay resize-y"
            placeholder="State the absolute rules the AI must follow..."
          />
        )}
      </div>
    </div>
  );
}

// Sub-component for Sortable Ranks
interface SortableRankItemProps {
  rank: PowerRank;
  onUpdate: (id: string, field: keyof PowerRank, value: string) => void;
  onRemove: (id: string) => void;
}

function SortableRankItem({ rank, onUpdate, onRemove }: SortableRankItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: rank.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex gap-2 items-start bg-surface border border-subtle p-3 rounded-lg group"
    >
      <div {...attributes} {...listeners} className="mt-2 text-ghost hover:text-primary cursor-grab">
        <GripVertical size={16} />
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <Input 
          value={rank.name}
          onChange={(e) => onUpdate(rank.id, 'name', e.target.value)}
          placeholder="Rank Name (e.g. Novice)"
          className="h-8 text-sm font-bold"
        />
        <Input 
          value={rank.description}
          onChange={(e) => onUpdate(rank.id, 'description', e.target.value)}
          placeholder="What can they do at this rank?"
          className="h-8 text-sm"
        />
      </div>
      <button 
        onClick={() => onRemove(rank.id)}
        className="mt-2 text-ghost hover:text-clay opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
