import { useState, useMemo, useRef, useEffect } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import { Entity, CharacterData } from '@/types';
import { Input, TagInput } from '@/components/ui';
import { ArrowLeft, Target, Heart, Brain, Activity, User, MessageCircle, Star, Share2, Users, ChevronDown } from 'lucide-react';
import { IndividualTreeGraph } from '@/components/flowchart';
import { hasGenreModule } from '@/lib/genres/genreRegistry';

interface CharacterDetailProps {
  entity: Entity;
  onBack: () => void;
}

export function CharacterDetail({ entity, onBack }: CharacterDetailProps) {
  const { updateEntity, entities, relationships, addRelationship, deleteRelationship, activeProject } = useStoryStore();

  /** True when the active project has the Vedic genre module enabled (or is a legacy project) */
  const isVedicProject = useMemo(
    () => hasGenreModule(activeProject?.genreModules, 'vedic'),
    [activeProject],
  );
  
  // Ensure default data shape
  const [formData, setFormData] = useState<CharacterData>(() => {
    const defaultData: CharacterData = {
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
      updateEntity({
        ...entity,
        data: updated as unknown as Record<string, unknown>
      });
    }, 500);
  };

  // Relationship Helpers
  const getRelationshipTarget = (type: string, label: string) => {
    const rel = relationships.find(r => r.fromEntityId === entity.id && r.type === type && r.metadata?.label === label);
    return rel ? rel.toEntityId : '';
  };

  const handleRelationshipChange = (type: string, label: string, targetId: string) => {
    const existing = relationships.find(r => r.fromEntityId === entity.id && r.type === type && r.metadata?.label === label);
    
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
          // @ts-expect-error - temp bypass for missing dates if any
          createdAt: Date.now(),
          updatedAt: Date.now()
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
        // @ts-expect-error - temp bypass
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }
  };

  const gotras = entities.filter(e => e.type === 'GOTRA');
  const vamshas = entities.filter(e => e.type === 'VAMSHA');
  const characters = entities.filter(e => e.type === 'character' && e.id !== entity.id);

  // Dynamic placeholders based on Arc Type
  const arcPlaceholders = useMemo(() => {
    switch (formData.arc.type) {
      case 'Negative':
      case 'Corruption':
        return {
          beginning: "Their initial flawed but stable state",
          midpoint: "The point of no return",
          end: "Their ultimate downfall or moral collapse"
        };
      case 'Flat':
        return {
          beginning: "The truth they already know",
          midpoint: "The world challenges their truth",
          end: "The world changes to match their truth"
        };
      case 'Redemption':
        return {
          beginning: "Their state of sin or guilt",
          midpoint: "The moment of realization/sacrifice",
          end: "Atonement achieved"
        };
      case 'Tragedy':
        return {
          beginning: "A promising beginning with a fatal flaw",
          midpoint: "A false victory",
          end: "The tragic consequences of their flaw"
        };
      case 'Positive':
      default:
        return {
          beginning: "The Lie they believe",
          midpoint: "The Truth revealed",
          end: "The New Normal"
        };
    }
  }, [formData.arc.type]);

  return (
    <div className="flex flex-col h-full bg-base overflow-y-auto scrollbar-hide">
      {/* Opaque Header */}
      <div className="sticky top-0 z-10 bg-surface border-b border-subtle px-8 py-5 flex items-center gap-6 shrink-0 shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-ghost hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </button>

        <div className="w-16 h-16 rounded-full bg-terracotta flex items-center justify-center text-xl font-bold text-white shadow-soft shrink-0">
          {entity.name.substring(0, 2).toUpperCase()}
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <input 
            value={entity.name} 
            onChange={(e) => updateEntity({ ...entity, name: e.target.value })}
            className="text-3xl font-serif font-bold text-primary bg-transparent border-none outline-none focus:ring-2 focus:ring-terracotta/20 rounded-md px-1 -ml-1"
            placeholder="Character Name"
          />
          <div className="flex items-center gap-3">
            <input 
              value={formData.role} 
              onChange={(e) => handleSave({ role: e.target.value })}
              className="text-sm font-semibold text-terracotta uppercase tracking-wider bg-transparent border-none outline-none focus:bg-black/5 dark:focus:bg-white/5 rounded px-1 -ml-1"
              placeholder="ROLE / ARCHETYPE"
            />
            <span className="w-1.5 h-1.5 rounded-full bg-subtle" />
            <div className="relative flex items-center bg-black/5 dark:bg-white/5 rounded-full px-3 py-1">
              <select
                value={formData.status}
                onChange={(e) => handleSave({ status: e.target.value as CharacterData['status'] })}
                className="text-sm font-semibold text-ghost bg-transparent border-none outline-none cursor-pointer appearance-none pr-5 pl-1"
              >
                <option value="Alive">Alive</option>
                <option value="Dead">Dead</option>
                <option value="Unknown">Unknown</option>
                <option value="Transformed">Transformed</option>
              </select>
              <ChevronDown size={14} className="text-ghost absolute right-2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="p-8 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Module 1: Lineage & Heritage */}
        <div className="bg-surface border border-subtle rounded-2xl p-6 shadow-sm flex flex-col gap-4 lg:col-span-2">
          <div className="flex items-center gap-2 text-primary border-b border-subtle pb-3">
            <Users size={18} className="text-sage" />
            <h3 className="font-bold text-lg">Lineage & Heritage</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Parents */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-ghost uppercase mb-1 block">Father / Parent 1</label>
                <select 
                  value={getRelationshipTarget('DESCENDED_FROM', 'Father')}
                  onChange={(e) => handleRelationshipChange('DESCENDED_FROM', 'Father', e.target.value)}
                  className="w-full text-sm bg-base border border-subtle rounded-md px-3 py-2 text-primary outline-none focus:border-amber-from/50 cursor-pointer"
                >
                  <option value="">Unknown / None</option>
                  {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-ghost uppercase mb-1 block">Mother / Parent 2</label>
                <select 
                  value={getRelationshipTarget('DESCENDED_FROM', 'Mother')}
                  onChange={(e) => handleRelationshipChange('DESCENDED_FROM', 'Mother', e.target.value)}
                  className="w-full text-sm bg-base border border-subtle rounded-md px-3 py-2 text-primary outline-none focus:border-amber-from/50 cursor-pointer"
                >
                  <option value="">Unknown / None</option>
                  {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            {/* Dynasty / Clan — Vedic shows Vamsha/Gotra; universal shows generic Dynasty/Clan */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-ghost uppercase mb-1 block">
                  {isVedicProject ? 'Vamsha (Dynasty)' : 'Dynasty / Clan'}
                </label>
                <select 
                  value={getRelationshipTarget('BELONGS_TO_LINEAGE', 'Vamsha')}
                  onChange={(e) => handleRelationshipChange('BELONGS_TO_LINEAGE', 'Vamsha', e.target.value)}
                  className="w-full text-sm bg-base border border-subtle rounded-md px-3 py-2 text-primary outline-none focus:border-amber-from/50 cursor-pointer"
                >
                  <option value="">None</option>
                  {/* Vedic: shows VAMSHA entities; Universal: shows 'family' entities */}
                  {(isVedicProject ? vamshas : entities.filter(e => e.type === 'family' || e.type === 'VAMSHA'))
                    .map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
              {isVedicProject && (
                <div>
                  <label className="text-xs font-bold text-ghost uppercase mb-1 block">Gotra (Root Lineage)</label>
                  <select 
                    value={getRelationshipTarget('BELONGS_TO_LINEAGE', 'Gotra')}
                    onChange={(e) => handleRelationshipChange('BELONGS_TO_LINEAGE', 'Gotra', e.target.value)}
                    className="w-full text-sm bg-base border border-subtle rounded-md px-3 py-2 text-primary outline-none focus:border-amber-from/50 cursor-pointer"
                  >
                    <option value="">None</option>
                    {gotras.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Module 2: Flowchart Preview */}
        <div className="bg-surface border border-subtle rounded-2xl p-6 shadow-sm flex flex-col gap-4 items-center relative overflow-hidden group min-h-[300px]">
          <div className="w-full flex items-center justify-between border-b border-subtle pb-2 z-10">
            <div className="flex items-center gap-2 text-primary">
              <Share2 size={18} className="text-ghost" />
              <h3 className="font-bold text-lg">Network Flowchart</h3>
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-[250px] relative bg-base rounded-lg border border-subtle mt-2 overflow-hidden">
             <IndividualTreeGraph rootEntityId={entity.id} />
          </div>
        </div>

        {/* Module 3: Goals */}
        <div className="bg-surface border border-subtle rounded-2xl p-6 shadow-sm flex flex-col gap-4 row-span-2">
          <div className="flex items-center gap-2 text-primary border-b border-subtle pb-3">
            <Target size={18} className="text-terracotta" />
            <h3 className="font-bold text-lg">Goals & Fears</h3>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-bold text-ghost uppercase">Primary Goal</label>
              <textarea 
                value={formData.goals.primaryGoal} 
                onChange={(e) => handleSave({ goals: { ...formData.goals, primaryGoal: e.target.value } })}
                className="w-full mt-1 bg-transparent border border-subtle rounded-lg p-2 text-sm focus:border-terracotta/50 focus:ring-1 focus:ring-terracotta/20 outline-none resize-none"
                rows={2} placeholder="What do they want most?"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-ghost uppercase">Secondary Goal</label>
              <textarea 
                value={formData.goals.secondaryGoal} 
                onChange={(e) => handleSave({ goals: { ...formData.goals, secondaryGoal: e.target.value } })}
                className="w-full mt-1 bg-transparent border border-subtle rounded-lg p-2 text-sm focus:border-terracotta/50 focus:ring-1 focus:ring-terracotta/20 outline-none resize-none"
                rows={2} placeholder="Subconscious or secondary desire"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-ghost uppercase">Internal Fear</label>
              <textarea 
                value={formData.goals.internalFear} 
                onChange={(e) => handleSave({ goals: { ...formData.goals, internalFear: e.target.value } })}
                className="w-full mt-1 bg-transparent border border-subtle rounded-lg p-2 text-sm focus:border-terracotta/50 focus:ring-1 focus:ring-terracotta/20 outline-none resize-none"
                rows={2} placeholder="The ghost from their past"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-ghost uppercase">External Threat</label>
              <textarea 
                value={formData.goals.externalThreat} 
                onChange={(e) => handleSave({ goals: { ...formData.goals, externalThreat: e.target.value } })}
                className="w-full mt-1 bg-transparent border border-subtle rounded-lg p-2 text-sm focus:border-terracotta/50 focus:ring-1 focus:ring-terracotta/20 outline-none resize-none"
                rows={2} placeholder="What stands in their way?"
              />
            </div>
          </div>
        </div>

        {/* Module 4: Personality */}
        <div className="bg-surface border border-subtle rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 text-primary border-b border-subtle pb-3">
            <Heart size={18} className="text-clay" />
            <h3 className="font-bold text-lg">Personality</h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-ghost uppercase">MBTI / Type</label>
              <input 
                value={formData.personality.mbti}
                onChange={(e) => handleSave({ personality: { ...formData.personality, mbti: e.target.value } })}
                className="w-24 text-right bg-transparent border-none text-primary font-bold focus:outline-none"
                placeholder="e.g. INTJ"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-ghost uppercase block mb-1">Traits</label>
              <TagInput
                tags={formData.personality.traits}
                onChange={(tags) => handleSave({ personality: { ...formData.personality, traits: tags } })}
                placeholder="Brave, Stubborn, Witty"
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-clay uppercase block mb-1">Flaws</label>
                <TagInput
                  tags={formData.personality.flaws}
                  onChange={(tags) => handleSave({ personality: { ...formData.personality, flaws: tags } })}
                  placeholder="Arrogant"
                  className="w-full border-clay/20"
                  tagClassName="bg-clay/10 text-clay border-clay/20"
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
        </div>

        {/* Module 5: Motivation Web */}
        <div className="bg-surface border border-subtle rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative">
           <div className="flex items-center gap-2 text-primary border-b border-subtle pb-3">
             <Brain size={18} className="text-terracotta" />
             <h3 className="font-bold text-lg">Core Motivations</h3>
           </div>
           <div className="flex flex-col gap-3 mt-2">
             <div className="flex items-start gap-3">
               <div className="w-6 h-6 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center font-bold text-xs shrink-0 mt-1">1</div>
               <textarea 
                 value={formData.motivations[0]} 
                 onChange={(e) => handleSave({ motivations: [e.target.value, formData.motivations[1], formData.motivations[2]] })}
                 className="flex-1 bg-transparent border border-subtle rounded-lg p-2 text-sm focus:border-terracotta/50 focus:ring-1 focus:ring-terracotta/20 outline-none resize-none"
                 rows={2} placeholder="Primary motivation or driving force"
               />
             </div>
             <div className="flex items-start gap-3">
               <div className="w-6 h-6 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center font-bold text-xs shrink-0 mt-1">2</div>
               <textarea 
                 value={formData.motivations[1]} 
                 onChange={(e) => handleSave({ motivations: [formData.motivations[0], e.target.value, formData.motivations[2]] })}
                 className="flex-1 bg-transparent border border-subtle rounded-lg p-2 text-sm focus:border-terracotta/50 focus:ring-1 focus:ring-terracotta/20 outline-none resize-none"
                 rows={2} placeholder="Secondary motivation"
               />
             </div>
             <div className="flex items-start gap-3">
               <div className="w-6 h-6 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center font-bold text-xs shrink-0 mt-1">3</div>
               <textarea 
                 value={formData.motivations[2]} 
                 onChange={(e) => handleSave({ motivations: [formData.motivations[0], formData.motivations[1], e.target.value] })}
                 className="flex-1 bg-transparent border border-subtle rounded-lg p-2 text-sm focus:border-terracotta/50 focus:ring-1 focus:ring-terracotta/20 outline-none resize-none"
                 rows={2} placeholder="Hidden or subconscious motivation"
               />
             </div>
           </div>
        </div>

        {/* Module 6: Character Arc */}
        <div className="bg-surface border border-subtle rounded-2xl p-6 shadow-sm flex flex-col gap-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-subtle pb-3">
            <div className="flex items-center gap-2 text-primary">
              <Activity size={18} className="text-terracotta" />
              <h3 className="font-bold text-lg">Character Arc</h3>
            </div>
            <select 
              value={formData.arc.type}
              onChange={(e) => handleSave({ arc: { ...formData.arc, type: e.target.value as CharacterData['arc']['type'] } })}
              className="text-sm bg-base border border-subtle rounded-md px-2 py-1 text-primary outline-none focus:border-terracotta/50"
            >
              <option value="">Select Arc Type...</option>
              <option value="Positive">Positive (Hero's Journey)</option>
              <option value="Negative">Negative (Fall from Grace)</option>
              <option value="Flat">Flat (Changes the world)</option>
              <option value="Corruption">Corruption (Turns evil)</option>
              <option value="Redemption">Redemption (Atalantes)</option>
              <option value="Tragedy">Tragedy (Fails to overcome flaw)</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-ghost uppercase mb-1 block">Beginning State</label>
              <textarea 
                value={formData.arc.beginningState} 
                onChange={(e) => handleSave({ arc: { ...formData.arc, beginningState: e.target.value } })}
                className="w-full bg-transparent border border-subtle rounded-lg p-2 text-sm focus:border-terracotta/50 focus:ring-1 focus:ring-terracotta/20 outline-none resize-none h-24"
                placeholder={arcPlaceholders.beginning}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-amber-from uppercase mb-1 block">Midpoint Shift</label>
              <textarea 
                value={formData.arc.midpointShift} 
                onChange={(e) => handleSave({ arc: { ...formData.arc, midpointShift: e.target.value } })}
                className="w-full bg-amber-from/5 border border-amber-from/20 rounded-lg p-2 text-sm focus:border-terracotta/50 focus:ring-1 focus:ring-terracotta/20 outline-none resize-none h-24"
                placeholder={arcPlaceholders.midpoint}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-sage uppercase mb-1 block">End State</label>
              <textarea 
                value={formData.arc.endState} 
                onChange={(e) => handleSave({ arc: { ...formData.arc, endState: e.target.value } })}
                className="w-full bg-sage/5 border border-sage/20 rounded-lg p-2 text-sm focus:border-sage/50 focus:ring-1 focus:ring-sage/20 outline-none resize-none h-24"
                placeholder={arcPlaceholders.end}
              />
            </div>
          </div>
        </div>

        {/* Module 7: Physical */}
        <div className="bg-surface border border-subtle rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 text-primary border-b border-subtle pb-3">
            <User size={18} className="text-secondary" />
            <h3 className="font-bold text-lg">Physical</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-ghost uppercase">Height/Weight</label>
              <Input 
                value={formData.physical.height}
                onChange={(e) => handleSave({ physical: { ...formData.physical, height: e.target.value } })}
                placeholder="5'10, 160lbs" className="mt-1" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-ghost uppercase">Build</label>
              <Input 
                value={formData.physical.build}
                onChange={(e) => handleSave({ physical: { ...formData.physical, build: e.target.value } })}
                placeholder="Wiry, athletic" className="mt-1" 
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-ghost uppercase block mb-1">Distinguishing Features</label>
            <textarea 
                value={formData.physical.distinguishingFeatures}
                onChange={(e) => handleSave({ physical: { ...formData.physical, distinguishingFeatures: e.target.value } })}
                placeholder="Scars, tattoos, unique eyes..." 
                className="w-full bg-transparent border border-subtle rounded-lg p-2 text-sm focus:border-terracotta/50 focus:ring-1 focus:ring-terracotta/20 outline-none resize-none h-16"
            />
          </div>
        </div>

        {/* Module 8: Voice & Dialogue */}
        <div className="bg-surface border border-subtle rounded-2xl p-6 shadow-sm flex flex-col gap-4 md:col-span-2">
          <div className="flex items-center gap-2 text-primary border-b border-subtle pb-3">
            <MessageCircle size={18} className="text-terracotta" />
            <h3 className="font-bold text-lg">Voice & Dialogue</h3>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-ghost uppercase block mb-1">Sample Quote</label>
                <textarea 
                  value={formData.voice.sampleQuote}
                  onChange={(e) => handleSave({ voice: { ...formData.voice, sampleQuote: e.target.value } })}
                  placeholder="&quot;Something they would say...&quot;" 
                  className="w-full bg-base border border-subtle rounded-lg p-4 text-lg font-serif italic text-primary focus:border-terracotta/50 focus:ring-1 focus:ring-terracotta/20 outline-none resize-none h-24"
                />
              </div>
            </div>
            <div className="w-48 flex flex-col gap-3 shrink-0">
              <div>
                <label className="text-xs font-bold text-ghost uppercase block mb-1">Sentence Style</label>
                <Input value={formData.voice.sentenceStyle} onChange={(e) => handleSave({ voice: { ...formData.voice, sentenceStyle: e.target.value } })} placeholder="Short, punchy" />
              </div>
              <div>
                <label className="text-xs font-bold text-ghost uppercase block mb-1">Vocabulary</label>
                <Input value={formData.voice.vocabularyLevel} onChange={(e) => handleSave({ voice: { ...formData.voice, vocabularyLevel: e.target.value } })} placeholder="Highly educated" />
              </div>
            </div>
          </div>
        </div>

        {/* Module 9: Arts & Skills */}
        <div className="bg-surface border border-subtle rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 text-primary border-b border-subtle pb-3">
            <Star size={18} className="text-terracotta" />
            <h3 className="font-bold text-lg">Arts & Skills</h3>
          </div>
          <div>
            <label className="text-xs font-bold text-ghost uppercase block mb-2">Skills</label>
            <TagInput
                tags={formData.skills}
                onChange={(tags) => handleSave({ skills: tags })}
                placeholder="Swordsmanship, Alchemy, Stealth..." 
                className="w-full min-h-[5rem]"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
