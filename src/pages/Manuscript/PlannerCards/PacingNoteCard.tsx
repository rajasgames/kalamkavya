import { useState, useEffect } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import { Scene } from '@/types';
import { BentoBox } from '@/components/ui/BentoBox';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Activity } from 'lucide-react';

interface PacingNoteCardProps {
  scene: Scene;
}

const PACING_TYPES = ['Action', 'Dialogue', 'Reflection', 'Reveal', 'Transition'] as const;

export function PacingNoteCard({ scene }: PacingNoteCardProps) {
  const { updateScene } = useStoryStore();

  const [pacingNote, setPacingNote] = useState(scene.planning?.pacingNote || '');
  const [pacingType, setPacingType] = useState<typeof PACING_TYPES[number] | undefined>(scene.planning?.pacingType);

  useEffect(() => {
    setPacingNote(scene.planning?.pacingNote || '');
    setPacingType(scene.planning?.pacingType);
  }, [scene.id, scene.planning]);

  const saveChanges = async (updates: Partial<typeof scene.planning>) => {
    const newPlanning = { ...scene.planning, ...updates };
    await updateScene({ ...scene, planning: newPlanning, updatedAt: Date.now() });
  };

  const handleNoteBlur = () => {
    if (pacingNote !== scene.planning?.pacingNote) {
      saveChanges({ pacingNote });
    }
  };

  const handleTypeChange = (type: typeof PACING_TYPES[number]) => {
    setPacingType(type);
    saveChanges({ pacingType: type });
  };

  return (
    <BentoBox title="Pacing & Beats" icon={<Activity size={18} />} variant="default">
      <div className="flex flex-col gap-4 mt-2">
        {/* Beat Type Selector */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-bold text-secondary uppercase tracking-wider">Primary Beat Type</Label>
          <div className="flex flex-wrap gap-2">
            {PACING_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  pacingType === type
                    ? 'bg-amber-from text-black shadow-md shadow-amber-from/20 scale-105'
                    : 'bg-elevated border border-subtle text-secondary hover:border-amber-from/50 hover:text-primary'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Pacing Notes */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-subtle">
          <Label className="text-xs font-bold text-secondary uppercase tracking-wider">Pacing Notes</Label>
          <Textarea 
            value={pacingNote}
            onChange={(e) => setPacingNote(e.target.value)}
            onBlur={handleNoteBlur}
            placeholder="Notes on rhythm, tension, or emotional beats..."
            rows={3}
            className="text-sm font-serif"
          />
        </div>
      </div>
    </BentoBox>
  );
}
