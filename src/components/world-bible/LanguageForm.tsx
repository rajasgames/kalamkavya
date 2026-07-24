import { useState, useEffect } from 'react';
import { Entity, LanguageData } from '@/types';
import { Input, Label, Select, Textarea } from '@/components/ui';
import { useStoryStore } from '@/stores/storyStore';
import { Sparkles, X } from 'lucide-react';

interface LanguageFormProps {
  entity: Entity;
  onSave: (entity: Entity) => void;
}

export function LanguageForm({ entity, onSave }: LanguageFormProps) {
  const { entities } = useStoryStore();
  const initialData = (entity.data as unknown as Partial<LanguageData>) || {};

  const [name, setName] = useState(entity.name);
  const [writingSystem, setWritingSystem] = useState(initialData.writingSystem || 'Alphabetic');
  const [grammarRules, setGrammarRules] = useState(initialData.grammarRules || '');
  const [history, setHistory] = useState(initialData.history || '');
  
  const [nativeSpeakerIds, setNativeSpeakerIds] = useState<string[]>(initialData.nativeSpeakerIds || []);
  const [commonPhrases, setCommonPhrases] = useState<string[]>(initialData.commonPhrases || []);
  
  const [aiRuleEnabled, setAiRuleEnabled] = useState(entity.hasAIRule || initialData.aiRuleEnabled || false);
  const [aiRuleText, setAiRuleText] = useState(initialData.aiRuleText || '');

  const [phraseInput, setPhraseInput] = useState('');

  const culturesAndSpecies = entities.filter(e => ['culture', 'creature'].includes(e.type.toLowerCase()));

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

  const toggleSpeaker = (id: string) => {
    if (nativeSpeakerIds.includes(id)) {
      setNativeSpeakerIds(nativeSpeakerIds.filter(sid => sid !== id));
    } else {
      setNativeSpeakerIds([...nativeSpeakerIds, id]);
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
          writingSystem,
          grammarRules,
          history,
          nativeSpeakerIds,
          commonPhrases,
          aiRuleEnabled,
          aiRuleText
        } as unknown as Record<string, unknown>
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [
    name, writingSystem, grammarRules, history, nativeSpeakerIds,
    commonPhrases, aiRuleEnabled, aiRuleText, entity, onSave
  ]);

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Language Name</Label>
          <Input 
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. High Valyrian"
            className="font-serif text-lg font-bold"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Writing System</Label>
          <Select
            value={writingSystem}
            onValueChange={setWritingSystem}
            options={[
              { value: 'Alphabetic', label: 'Alphabetic' },
              { value: 'Syllabic', label: 'Syllabic' },
              { value: 'Logographic', label: 'Logographic (Symbols)' },
              { value: 'None', label: 'None (Spoken Only)' },
              { value: 'Other', label: 'Other' },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Grammar & Syntax Rules</Label>
        <Textarea 
          value={grammarRules}
          onChange={e => setGrammarRules(e.target.value)}
          placeholder="e.g. Verbs always come at the end of the sentence."
          className="min-h-[100px]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Common Phrases (Press Enter)</Label>
        <Input 
          value={phraseInput}
          onChange={e => setPhraseInput(e.target.value)}
          onKeyDown={e => handleAddTag(e, phraseInput, setPhraseInput, commonPhrases, setCommonPhrases)}
          placeholder="e.g. Valar Morghulis (All men must die)"
        />
        <div className="flex flex-col gap-2 mt-1">
          {commonPhrases.map(p => (
            <div key={p} className="flex items-center justify-between px-3 py-2 bg-surface border border-subtle rounded-md text-sm text-secondary">
              <span>{p}</span>
              <button onClick={() => removeTag(p, commonPhrases, setCommonPhrases)} className="text-ghost hover:text-destructive"><X size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      {culturesAndSpecies.length > 0 && (
        <div className="flex flex-col gap-2 p-4 bg-surface rounded-xl border border-subtle">
          <Label className="text-sm">Native Speakers (Cultures & Species)</Label>
          <div className="flex flex-col gap-2 mt-2">
            {culturesAndSpecies.map(sp => (
              <label key={sp.id} className="flex items-center gap-2 text-sm text-secondary cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={nativeSpeakerIds.includes(sp.id)}
                  onChange={() => toggleSpeaker(sp.id)}
                  className="rounded border-subtle text-amber-from focus:ring-amber-from bg-base"
                />
                <span className="font-medium">{sp.name}</span> <span className="text-xs text-ghost ml-2 capitalize">({sp.type.toLowerCase()})</span>
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
              Ghostwriter Constraint (Dialogue)
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
            placeholder="e.g. When characters speak this language, format it as: <valyrian>text</valyrian>"
            className="border-destructive/30 bg-white dark:bg-black min-h-[80px]"
          />
        )}
      </div>
    </div>
  );
}
