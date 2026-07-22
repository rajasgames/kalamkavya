import { Entity, CharacterData } from '@/types';
import { Label, Select } from '@/components/ui';

interface CharacterFormProps {
  entity: Entity;
  onSave: (entity: Entity) => void;
}

export function CharacterForm({ entity, onSave }: CharacterFormProps) {
  const data = (entity.data as unknown as CharacterData) || {};
  const attributes = data.attributes || {
    discipline: 50, strength: 50, intelligence: 50, perception: 50, memory: 50, charisma: 50, vitality: 50, wisdom: 50, education: 50, senseMastery: 50
  };

  const updateData = (updates: Partial<CharacterData>) => {
    onSave({ ...entity, data: { ...data, ...updates } as unknown as Record<string, unknown> });
  };

  const updateAttribute = (attr: string, value: number) => {
    updateData({ attributes: { ...attributes, [attr]: value } as CharacterData['attributes'] });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <Label>Ashrama (Life Stage)</Label>
        <Select
          value={data.ashrama || ''}
          onValueChange={(val) => updateData({ ashrama: val as any })}
          options={[
            { value: '', label: 'None / Unknown' },
            { value: 'Brahmacharya', label: 'Brahmacharya (Student)' },
            { value: 'Grihastha', label: 'Grihastha (Householder)' },
            { value: 'Vanaprastha', label: 'Vanaprastha (Forest Dweller)' },
            { value: 'Sannyasa', label: 'Sannyasa (Renunciate)' },
          ]}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Practitioner Path</Label>
        <Select
          value={data.practitionerPath || ''}
          onValueChange={(val) => updateData({ practitionerPath: val })}
          options={[
            { value: '', label: 'Mundane / None' },
            { value: 'Rishi', label: 'Rishi (Seer)' },
            { value: 'Brahmarishi', label: 'Brahmarishi (Highest Seer)' },
            { value: 'Aghori', label: 'Aghori (Esoteric Ascetic)' },
            { value: 'Naga Sadhu', label: 'Naga Sadhu (Warrior Ascetic)' },
            { value: 'Sant', label: 'Sant (Mystic)' },
            { value: 'Rajguru', label: 'Rajguru (Royal Advisor)' },
            { value: 'Acharya', label: 'Acharya (Master)' },
          ]}
        />
      </div>

      <div className="p-4 bg-surface rounded-xl border border-subtle">
        <h3 className="text-sm font-bold text-primary mb-4">Core Attributes</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(attributes).map(([key, value]) => (
            <div key={key} className="flex flex-col gap-1">
              <Label className="capitalize text-xs">{key.replace(/([A-Z])/g, ' $1')}</Label>
              <input
                type="range"
                min="1"
                max="100"
                value={value}
                onChange={(e) => updateAttribute(key as any, parseInt(e.target.value))}
                className="w-full accent-amber-from"
              />
              <span className="text-[10px] text-ghost text-right">{value}/100</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
