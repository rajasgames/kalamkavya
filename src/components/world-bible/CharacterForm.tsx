import { useState, useRef, useEffect } from 'react';
import { Entity, CharacterData, Relationship } from '@/types';
import { Label, Input, TagInput } from '@/components/ui';
import { Target, Heart, Brain, Activity, User, Star, Users, Shield, Crown, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useStoryStore } from '@/stores/storyStore';

interface CharacterFormProps {
  entity: Entity;
  onSave: (entity: Entity) => void;
}

export function CharacterForm({ entity, onSave }: CharacterFormProps) {
  const { entities, relationships, addRelationship, deleteRelationship } = useStoryStore();

  // Ensure default data shape
  const [formData, setFormData] = useState<CharacterData>(() => {
    const defaultData: CharacterData = {
      castType: '',
      rank: '',
      species: '',
      role: '',
      status: 'Unknown',
      goals: { primaryGoal: '', secondaryGoal: '', internalFear: '', externalThreat: '' },
      personality: { mbti: '', traits: [], flaws: [], virtues: [] },
      motivations: ['', '', ''],
      arc: { type: '', beginningState: '', midpointShift: '', endState: '' },
      physical: { height: '', build: '', distinguishingFeatures: '', voiceDescription: '' },
      voice: { sentenceStyle: '', vocabularyLevel: '', accentNotes: '', sampleQuote: '' },
      skills: [],
      loreConnections: { factionIds: [], locationIds: [], weaponIds: [], cultureIds: [] },
      moodboardImages: [],
      attributes: {
        discipline: 50, strength: 50, intelligence: 50, perception: 50, memory: 50, charisma: 50, vitality: 50, wisdom: 50, education: 50, senseMastery: 50
      }
    };
    if (entity.data && Object.keys(entity.data).length > 0) {
      return { ...defaultData, ...(entity.data as unknown as CharacterData) };
    }
    return defaultData;
  });

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  // Sync state to store on blur/change
  const handleSave = (newData: Partial<CharacterData>) => {
    const updated = { ...formData, ...newData };
    setFormData(updated);
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      onSave({
        ...entity,
        data: updated as unknown as Record<string, unknown>
      });
    }, 500);
  };

  const updateAttribute = (attr: string, value: number) => {
    handleSave({ attributes: { ...formData.attributes, [attr]: value } as CharacterData['attributes'] });
  };

  // Relationship Helpers
  const getRelationshipTarget = (type: string, label: string) => {
    const rel = relationships.find((r: Relationship) => r.fromEntityId === entity.id && r.type === type && r.metadata?.label === label);
    return rel ? rel.toEntityId : '';
  };

  const handleRelationshipChange = (type: string, label: string, targetId: string) => {
    const existing = relationships.find((r: Relationship) => r.fromEntityId === entity.id && r.type === type && r.metadata?.label === label);
    
    if (existing) {
      if (!targetId) {
        deleteRelationship(existing.id);
      } else if (existing.toEntityId !== targetId) {
        deleteRelationship(existing.id);
        addRelationship({
          id: crypto.randomUUID(),
          projectId: entity.projectId,
          fromEntityId: entity.id,
          toEntityId: targetId,
          type: type,
          directed: true,
          metadata: { label },
        });
      }
    } else if (targetId) {
      addRelationship({
        id: crypto.randomUUID(),
        projectId: entity.projectId,
        fromEntityId: entity.id,
        toEntityId: targetId,
        type: type,
        directed: true,
        metadata: { label },
      });
    }
  };

  const characters = entities.filter((e: Entity) => e.type === 'character' && e.id !== entity.id);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Module 0: Classification & Identity (NEW) */}
      <div className="bg-surface border border-subtle rounded-2xl p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-from/5 rounded-bl-full pointer-events-none" />
        <div className="flex items-center gap-2 text-primary border-b border-subtle pb-3">
          <Crown size={18} className="text-amber-from" />
          <h3 className="font-bold text-lg">Classification</h3>
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-ghost uppercase mb-1 block">Cast Role</label>
              <select
                value={formData.castType}
                onChange={(e) => handleSave({ castType: e.target.value as CharacterData['castType'] })}
                className="w-full text-sm bg-base border border-subtle rounded-md px-3 py-2 text-primary outline-none focus:border-terracotta/50 cursor-pointer"
              >
                <option value="">Select Role...</option>
                <option value="Protagonist">Protagonist</option>
                <option value="Antagonist">Antagonist</option>
                <option value="Supporting">Supporting</option>
                <option value="Commoner">Commoner / Extra</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-ghost uppercase mb-1 block">Power Rank</label>
              <select
                value={formData.rank}
                onChange={(e) => handleSave({ rank: e.target.value as CharacterData['rank'] })}
                className="w-full text-sm bg-base border border-subtle rounded-md px-3 py-2 text-primary outline-none focus:border-terracotta/50 cursor-pointer"
              >
                <option value="">Select Rank...</option>
                <option value="Supreme">Supreme / Cosmic</option>
                <option value="Divine">Divine / Demigod</option>
                <option value="Immortal">Immortal</option>
                <option value="Mortal">Mortal</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-ghost uppercase mb-1 block">Species / Race</label>
            <Input 
              value={formData.species}
              onChange={(e) => handleSave({ species: e.target.value })}
              placeholder="Human, Elf, Naga, Asura..." 
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-ghost uppercase mb-1 block">Archetype</label>
              <Input 
                value={formData.role} 
                onChange={(e) => handleSave({ role: e.target.value })}
                placeholder="The Mentor, The Fool..."
              />
            </div>
            <div>
              <label className="text-xs font-bold text-ghost uppercase mb-1 block">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleSave({ status: e.target.value as CharacterData['status'] })}
                className="w-full text-sm bg-base border border-subtle rounded-md px-3 py-2 text-primary outline-none focus:border-terracotta/50 cursor-pointer"
              >
                <option value="Alive">Alive</option>
                <option value="Dead">Dead</option>
                <option value="Unknown">Unknown</option>
                <option value="Transformed">Transformed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Module 1: Lineage & Heritage */}
      <div className="bg-surface border border-subtle rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2 text-primary border-b border-subtle pb-3">
          <Users size={18} className="text-sage" />
          <h3 className="font-bold text-lg">Lineage & Heritage</h3>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-bold text-ghost uppercase mb-1 block">Parent 1</label>
            <select 
              value={getRelationshipTarget('DESCENDED_FROM', 'Father')}
              onChange={(e) => handleRelationshipChange('DESCENDED_FROM', 'Father', e.target.value)}
              className="w-full text-sm bg-base border border-subtle rounded-md px-3 py-2 text-primary outline-none focus:border-sage/50 cursor-pointer"
            >
              <option value="">Unknown / None</option>
              {characters.map((c: Entity) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-ghost uppercase mb-1 block">Parent 2</label>
            <select 
              value={getRelationshipTarget('DESCENDED_FROM', 'Mother')}
              onChange={(e) => handleRelationshipChange('DESCENDED_FROM', 'Mother', e.target.value)}
              className="w-full text-sm bg-base border border-subtle rounded-md px-3 py-2 text-primary outline-none focus:border-sage/50 cursor-pointer"
            >
              <option value="">Unknown / None</option>
              {characters.map((c: Entity) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-ghost uppercase mb-1 block">
              Dynasty / House / Lineage
            </label>
            <select 
              value={getRelationshipTarget('BELONGS_TO_LINEAGE', 'Vamsha')}
              onChange={(e) => handleRelationshipChange('BELONGS_TO_LINEAGE', 'Vamsha', e.target.value)}
              className="w-full text-sm bg-base border border-subtle rounded-md px-3 py-2 text-primary outline-none focus:border-sage/50 cursor-pointer"
            >
              <option value="">None</option>
              {entities.filter((e: Entity) => e.type === 'family' || e.type === 'dynasty' || e.type === 'VAMSHA')
                .map((v: Entity) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Module 2: Attributes */}
      {formData.attributes && (
        <div className="bg-surface border border-subtle rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 text-primary border-b border-subtle pb-3">
            <Shield size={18} className="text-blue-500" />
            <h3 className="font-bold text-lg">Core Attributes</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.attributes).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-1">
                <Label className="capitalize text-[10px] sm:text-xs text-ghost">{key.replace(/([A-Z])/g, ' $1')}</Label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={value as number}
                  onChange={(e) => updateAttribute(key, parseInt(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 bg-subtle rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-primary font-bold text-right">{value}/100</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Module 3: Goals */}
      <div className="bg-surface border border-subtle rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2 text-primary border-b border-subtle pb-3">
          <Target size={18} className="text-terracotta" />
          <h3 className="font-bold text-lg">Goals & Fears</h3>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-bold text-ghost uppercase mb-1 block">Primary Goal</label>
            <textarea 
              value={formData.goals.primaryGoal} 
              onChange={(e) => handleSave({ goals: { ...formData.goals, primaryGoal: e.target.value } })}
              className="w-full bg-base border border-subtle rounded-lg p-2 text-sm focus:border-terracotta/50 focus:ring-1 focus:ring-terracotta/20 outline-none resize-none"
              rows={2} placeholder="What do they want most?"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-ghost uppercase mb-1 block">Secondary Goal</label>
            <textarea 
              value={formData.goals.secondaryGoal} 
              onChange={(e) => handleSave({ goals: { ...formData.goals, secondaryGoal: e.target.value } })}
              className="w-full bg-base border border-subtle rounded-lg p-2 text-sm focus:border-terracotta/50 focus:ring-1 focus:ring-terracotta/20 outline-none resize-none"
              rows={2} placeholder="Subconscious or secondary desire"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-ghost uppercase mb-1 block">Internal Fear</label>
            <textarea 
              value={formData.goals.internalFear} 
              onChange={(e) => handleSave({ goals: { ...formData.goals, internalFear: e.target.value } })}
              className="w-full bg-base border border-subtle rounded-lg p-2 text-sm focus:border-terracotta/50 focus:ring-1 focus:ring-terracotta/20 outline-none resize-none"
              rows={2} placeholder="The ghost from their past"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-ghost uppercase mb-1 block">External Threat</label>
            <textarea 
              value={formData.goals.externalThreat} 
              onChange={(e) => handleSave({ goals: { ...formData.goals, externalThreat: e.target.value } })}
              className="w-full bg-base border border-subtle rounded-lg p-2 text-sm focus:border-terracotta/50 focus:ring-1 focus:ring-terracotta/20 outline-none resize-none"
              rows={2} placeholder="What stands in their way?"
            />
          </div>
        </div>
      </div>

      {/* Module 4: Personality */}
      <div className="bg-surface border border-subtle rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2 text-primary border-b border-subtle pb-3">
          <Heart size={18} className="text-destructive" />
          <h3 className="font-bold text-lg">Personality</h3>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-bold text-ghost uppercase block mb-1">MBTI / Type</label>
            <Input 
              value={formData.personality.mbti}
              onChange={(e) => handleSave({ personality: { ...formData.personality, mbti: e.target.value } })}
              placeholder="e.g. INTJ"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-ghost uppercase block mb-1">Traits</label>
            <TagInput
              tags={formData.personality.traits}
              onChange={(tags) => handleSave({ personality: { ...formData.personality, traits: tags } })}
              placeholder="Brave, Stubborn..."
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-destructive uppercase block mb-1">Flaws</label>
            <TagInput
              tags={formData.personality.flaws}
              onChange={(tags) => handleSave({ personality: { ...formData.personality, flaws: tags } })}
              placeholder="Arrogant"
              className="w-full border-destructive/20"
              tagClassName="bg-destructive/10 text-destructive border-destructive/20"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-sage uppercase block mb-1">Virtues</label>
            <TagInput
              tags={formData.personality.virtues}
              onChange={(tags) => handleSave({ personality: { ...formData.personality, virtues: tags } })}
              placeholder="Loyal"
              className="w-full border-sage/20"
              tagClassName="bg-sage/10 text-sage border-sage/20"
            />
          </div>
        </div>
      </div>

      {/* Module 5: Motivation Web */}
      <div className="bg-surface border border-subtle rounded-2xl p-5 shadow-sm flex flex-col gap-4">
         <div className="flex items-center gap-2 text-primary border-b border-subtle pb-3">
           <Brain size={18} className="text-secondary" />
           <h3 className="font-bold text-lg">Motivations</h3>
         </div>
         <div className="flex flex-col gap-3">
           <div className="flex items-start gap-2">
             <div className="w-5 h-5 rounded-md bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs shrink-0 mt-1">1</div>
             <textarea 
               value={formData.motivations[0]} 
               onChange={(e) => handleSave({ motivations: [e.target.value, formData.motivations[1], formData.motivations[2]] })}
               className="flex-1 bg-base border border-subtle rounded-lg p-2 text-sm outline-none resize-none"
               rows={2} placeholder="Primary motivation"
             />
           </div>
           <div className="flex items-start gap-2">
             <div className="w-5 h-5 rounded-md bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs shrink-0 mt-1">2</div>
             <textarea 
               value={formData.motivations[1]} 
               onChange={(e) => handleSave({ motivations: [formData.motivations[0], e.target.value, formData.motivations[2]] })}
               className="flex-1 bg-base border border-subtle rounded-lg p-2 text-sm outline-none resize-none"
               rows={2} placeholder="Secondary motivation"
             />
           </div>
           <div className="flex items-start gap-2">
             <div className="w-5 h-5 rounded-md bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs shrink-0 mt-1">3</div>
             <textarea 
               value={formData.motivations[2]} 
               onChange={(e) => handleSave({ motivations: [formData.motivations[0], formData.motivations[1], e.target.value] })}
               className="flex-1 bg-base border border-subtle rounded-lg p-2 text-sm outline-none resize-none"
               rows={2} placeholder="Hidden motivation"
             />
           </div>
         </div>
      </div>

      {/* Module 6: Character Arc */}
      <div className="bg-surface border border-subtle rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-subtle pb-3">
          <div className="flex items-center gap-2 text-primary">
            <Activity size={18} className="text-amber-from" />
            <h3 className="font-bold text-lg">Arc</h3>
          </div>
          <select 
            value={formData.arc.type}
            onChange={(e) => handleSave({ arc: { ...formData.arc, type: e.target.value as CharacterData['arc']['type'] } })}
            className="text-sm bg-base border border-subtle rounded-md px-2 py-1 text-primary outline-none focus:border-amber-from/50"
          >
            <option value="">Type...</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
            <option value="Flat">Flat</option>
            <option value="Corruption">Corruption</option>
            <option value="Redemption">Redemption</option>
            <option value="Tragedy">Tragedy</option>
          </select>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-bold text-ghost uppercase mb-1 block">Beginning State</label>
            <textarea 
              value={formData.arc.beginningState} 
              onChange={(e) => handleSave({ arc: { ...formData.arc, beginningState: e.target.value } })}
              className="w-full bg-base border border-subtle rounded-lg p-2 text-sm outline-none resize-none h-16"
              placeholder="Initial flawed state"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-amber-from uppercase mb-1 block">Midpoint Shift</label>
            <textarea 
              value={formData.arc.midpointShift} 
              onChange={(e) => handleSave({ arc: { ...formData.arc, midpointShift: e.target.value } })}
              className="w-full bg-amber-from/5 border border-amber-from/20 rounded-lg p-2 text-sm outline-none resize-none h-16"
              placeholder="The revelation"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-sage uppercase mb-1 block">End State</label>
            <textarea 
              value={formData.arc.endState} 
              onChange={(e) => handleSave({ arc: { ...formData.arc, endState: e.target.value } })}
              className="w-full bg-sage/5 border border-sage/20 rounded-lg p-2 text-sm outline-none resize-none h-16"
              placeholder="Resolution"
            />
          </div>
        </div>
      </div>

      {/* Module 7: Physical & Voice */}
      <div className="bg-surface border border-subtle rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2 text-primary border-b border-subtle pb-3">
          <User size={18} className="text-primary" />
          <h3 className="font-bold text-lg">Physical & Voice</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-ghost uppercase block mb-1">Height/Weight</label>
            <Input 
              value={formData.physical.height}
              onChange={(e) => handleSave({ physical: { ...formData.physical, height: e.target.value } })}
              placeholder="5'10, 160lbs" 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-ghost uppercase block mb-1">Build</label>
            <Input 
              value={formData.physical.build}
              onChange={(e) => handleSave({ physical: { ...formData.physical, build: e.target.value } })}
              placeholder="Wiry, athletic" 
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-ghost uppercase block mb-1">Features</label>
          <textarea 
              value={formData.physical.distinguishingFeatures}
              onChange={(e) => handleSave({ physical: { ...formData.physical, distinguishingFeatures: e.target.value } })}
              placeholder="Scars, tattoos..." 
              className="w-full bg-base border border-subtle rounded-lg p-2 text-sm outline-none resize-none h-16"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-ghost uppercase block mb-1">Sample Quote</label>
          <textarea 
            value={formData.voice.sampleQuote}
            onChange={(e) => handleSave({ voice: { ...formData.voice, sampleQuote: e.target.value } })}
            placeholder="&quot;Quote...&quot;" 
            className="w-full bg-base border border-subtle rounded-lg p-3 text-sm font-serif italic text-primary outline-none resize-none h-20"
          />
        </div>
      </div>

      {/* Module 8: Arts & Skills */}
      <div className="bg-surface border border-subtle rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2 text-primary border-b border-subtle pb-3">
          <Star size={18} className="text-amber-from" />
          <h3 className="font-bold text-lg">Skills</h3>
        </div>
        <div>
          <TagInput
              tags={formData.skills}
              onChange={(tags) => handleSave({ skills: tags })}
              placeholder="Swordsmanship, Alchemy..." 
              className="w-full min-h-[5rem]"
          />
        </div>
      </div>
      
      {/* Module 9: Moodboard */}
      <div className="bg-surface border border-subtle rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2 text-primary border-b border-subtle pb-3">
          <ImageIcon size={18} className="text-blue-500" />
          <h3 className="font-bold text-lg">Moodboard</h3>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-xs text-secondary">Paste image URLs to build a visual reference for this character.</p>
          <div className="flex gap-2">
            <Input 
              placeholder="https://example.com/image.jpg" 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const target = e.target as HTMLInputElement;
                  if (target.value.trim()) {
                    const newImages = [...(formData.moodboardImages || []), target.value.trim()];
                    handleSave({ moodboardImages: newImages });
                    target.value = '';
                  }
                }
              }}
            />
          </div>
          
          {(formData.moodboardImages && formData.moodboardImages.length > 0) && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {formData.moodboardImages.map((img, idx) => (
                <div key={idx} className="relative group rounded-lg overflow-hidden border border-subtle aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="Moodboard reference" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => {
                        const newImages = [...(formData.moodboardImages || [])];
                        newImages.splice(idx, 1);
                        handleSave({ moodboardImages: newImages });
                      }}
                      className="p-2 bg-destructive text-white rounded-full hover:scale-110 transition-transform"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
