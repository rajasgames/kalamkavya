import { useState, useEffect } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import { Scene } from '@/types';
import { BentoBox } from '@/components/ui/BentoBox';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';
import { X, Target } from 'lucide-react';

interface SceneCardProps {
  scene: Scene;
}

export function SceneCard({ scene }: SceneCardProps) {
  const { updateScene, entities } = useStoryStore();

  const [goal, setGoal] = useState(scene.planning?.goal || '');
  const [conflict, setConflict] = useState(scene.planning?.conflict || '');
  const [outcome, setOutcome] = useState(scene.planning?.outcome || '');
  
  const [characterIds, setCharacterIds] = useState<string[]>(scene.planning?.characters || []);
  const [locationId, setLocationId] = useState<string>(scene.planning?.locationId || '');

  // Keep local state in sync if scene changes from outside
  useEffect(() => {
    setGoal(scene.planning?.goal || '');
    setConflict(scene.planning?.conflict || '');
    setOutcome(scene.planning?.outcome || '');
    setCharacterIds(scene.planning?.characters || []);
    setLocationId(scene.planning?.locationId || '');
  }, [scene.id, scene.planning]);

  const saveChanges = async (updates: Partial<typeof scene.planning>) => {
    const newPlanning = { ...scene.planning, ...updates };
    await updateScene({ ...scene, planning: newPlanning, updatedAt: Date.now() });
  };

  const handleGoalBlur = () => {
    if (goal !== scene.planning?.goal) saveChanges({ goal });
  };

  const handleConflictBlur = () => {
    if (conflict !== scene.planning?.conflict) saveChanges({ conflict });
  };

  const handleOutcomeBlur = () => {
    if (outcome !== scene.planning?.outcome) saveChanges({ outcome });
  };

  const handleLocationChange = (value: string) => {
    setLocationId(value);
    saveChanges({ locationId: value });
  };

  const handleAddCharacter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id || characterIds.includes(id)) return;
    
    const newIds = [...characterIds, id];
    setCharacterIds(newIds);
    saveChanges({ characters: newIds });
    // Reset select
    e.target.value = '';
  };

  const handleRemoveCharacter = (id: string) => {
    const newIds = characterIds.filter(c => c !== id);
    setCharacterIds(newIds);
    saveChanges({ characters: newIds });
  };

  const availableCharacters = entities.filter(e => e.type === 'character');
  const availableLocations = entities.filter(e => e.type === 'location');

  return (
    <BentoBox title="Scene Goals & Conflict" icon={<Target size={18} />} variant="default">
      <div className="flex flex-col gap-4 mt-2">
        {/* Goal */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-bold text-secondary uppercase tracking-wider">Goal (What they want)</Label>
          <Textarea 
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onBlur={handleGoalBlur}
            placeholder="What does the POV character want in this scene?"
            rows={2}
          />
        </div>

        {/* Conflict */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-bold text-secondary uppercase tracking-wider">Conflict (What opposes them)</Label>
          <Textarea 
            value={conflict}
            onChange={(e) => setConflict(e.target.value)}
            onBlur={handleConflictBlur}
            placeholder="What is stopping them from getting it?"
            rows={2}
          />
        </div>

        {/* Outcome */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-bold text-secondary uppercase tracking-wider">Outcome (What changes)</Label>
          <Textarea 
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            onBlur={handleOutcomeBlur}
            placeholder="Do they get what they want? Yes, but... / No, and..."
            rows={2}
          />
        </div>

        {/* Characters (Multi-select via badges) */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-subtle">
          <Label className="text-xs font-bold text-secondary uppercase tracking-wider">Linked Characters</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {characterIds.map(id => {
              const char = entities.find(e => e.id === id);
              if (!char) return null;
              return (
                <span key={id} className="inline-flex items-center gap-1 bg-amber-from/10 border border-amber-from/20 text-amber-from text-xs px-2 py-1 rounded-md">
                  {char.name}
                  <button onClick={() => handleRemoveCharacter(id)} className="hover:text-primary transition-colors">
                    <X size={12} />
                  </button>
                </span>
              );
            })}
          </div>
          <select 
            className="w-full bg-elevated border border-subtle rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-amber-from"
            onChange={handleAddCharacter}
            value=""
          >
            <option value="" disabled>Add a character...</option>
            {availableCharacters.filter(c => !characterIds.includes(c.id)).map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Location (Single Select) */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-subtle">
          <Label className="text-xs font-bold text-secondary uppercase tracking-wider">Linked Location</Label>
          <Select 
            value={locationId}
            onValueChange={handleLocationChange}
            options={availableLocations.map(l => ({ value: l.id, label: l.name }))}
            placeholder="Select a location..."
          />
        </div>
      </div>
    </BentoBox>
  );
}
