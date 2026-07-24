import { useState, useEffect } from 'react';
import { Entity, WeaponData, RarityTierData } from '@/types';
import { Input, Label, Select } from '@/components/ui';
import { useStoryStore } from '@/stores/storyStore';
import { Trash2 } from 'lucide-react';
import { RarityBadge } from './RarityBadge';

interface WeaponFormProps {
  entity: Entity;
  onSave: (entity: Entity) => void;
}

const SUB_TYPES = [
  { value: 'SWORD', label: 'Sword' },
  { value: 'MACE', label: 'Mace' },
  { value: 'SPEAR', label: 'Spear' },
  { value: 'BOW', label: 'Bow' },
  { value: 'DAGGER', label: 'Dagger' },
  { value: 'STAFF', label: 'Staff' },
  { value: 'AXE', label: 'Axe' },
  { value: 'POLEARM', label: 'Polearm' },
  { value: 'EXOTIC', label: 'Exotic' },
  { value: 'MYTHOLOGICAL', label: 'Mythological' }
];

export function WeaponForm({ entity, onSave }: WeaponFormProps) {
  const { entities } = useStoryStore();
  const initialData = (entity.data as unknown as Partial<WeaponData>) || {};
  
  const [name, setName] = useState(entity.name);
  const [subType, setSubType] = useState<WeaponData['subType']>(initialData.subType || 'SWORD');
  const [rarityTierId, setRarityTierId] = useState(initialData.rarityTierId || '');
  
  const [materials, setMaterials] = useState<string[]>(initialData.materials || []);
  const [properties, setProperties] = useState<string[]>(initialData.properties || []);
  
  const [physicalDescription, setPhysicalDescription] = useState(initialData.physicalDescription || '');
  const [originRegion, setOriginRegion] = useState(initialData.originRegion || '');
  const [historicalPeriod, setHistoricalPeriod] = useState(initialData.historicalPeriod || '');
  
  const [magicSystemIds, setMagicSystemIds] = useState<string[]>(initialData.magicSystemIds || []);
  const [knownUsersIds, setKnownUsersIds] = useState<string[]>(initialData.knownUsersIds || []);
  
  const [aiRuleEnabled, setAiRuleEnabled] = useState(entity.hasAIRule || initialData.aiRuleEnabled || false);
  const [aiRuleText, setAiRuleText] = useState(initialData.aiRuleText || '');
  
  const [materialInput, setMaterialInput] = useState('');
  const [propertyInput, setPropertyInput] = useState('');

  // Lookups
  const characters = entities.filter(e => e.type === 'character' || e.type === 'CHARACTER');
  const magicSystems = entities.filter(e => e.type === 'MAGIC_SYSTEM' || e.type === 'system');
  const rarityTiers = entities
    .filter(e => e.type === 'RARITY_TIER')
    .sort((a, b) => {
      const aData = a.data as unknown as RarityTierData;
      const bData = b.data as unknown as RarityTierData;
      return (aData.displayOrder || 0) - (bData.displayOrder || 0);
    });

  const selectedRarityEntity = rarityTiers.find(t => t.id === rarityTierId);

  // Auto-save debounced
  useEffect(() => {
    const timer = setTimeout(() => {
      onSave({
        ...entity,
        name,
        hasAIRule: aiRuleEnabled,
        data: {
          ...entity.data,
          subType,
          rarityTierId,
          materials,
          properties,
          physicalDescription,
          originRegion,
          historicalPeriod,
          magicSystemIds,
          knownUsersIds,
          aiRuleEnabled,
          aiRuleText
        } as unknown as Record<string, unknown>
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [
    name, subType, rarityTierId, materials, properties, physicalDescription, 
    originRegion, historicalPeriod, magicSystemIds, knownUsersIds, aiRuleEnabled, aiRuleText, 
    entity, onSave
  ]);

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

  const handleRemoveTag = (tag: string, list: string[], setList: (val: string[]) => void) => {
    setList(list.filter(t => t !== tag));
  };

  const toggleArrayItem = (id: string, list: string[], setList: (val: string[]) => void) => {
    if (list.includes(id)) {
      setList(list.filter(item => item !== id));
    } else {
      setList([...list, id]);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col gap-1.5">
        <Label>Weapon Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Sub-Type</Label>
          <Select 
            value={subType} 
            onValueChange={(val) => setSubType(val as WeaponData['subType'])} 
            options={SUB_TYPES} 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Rarity Tier</Label>
          <select
            value={rarityTierId}
            onChange={(e) => setRarityTierId(e.target.value)}
            className="w-full bg-surface border border-subtle rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-amber-from"
          >
            <option value="">Select Rarity Tier...</option>
            {rarityTiers.map(tier => (
              <option key={tier.id} value={tier.id}>
                {tier.name}
              </option>
            ))}
          </select>
          {selectedRarityEntity && (
            <div className="mt-1">
              <RarityBadge rarityTier={selectedRarityEntity.data as unknown as RarityTierData} size="md" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Materials</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {materials.map(mat => (
            <span key={mat} className="px-2 py-1 bg-surface border border-subtle rounded-md text-xs flex items-center gap-1">
              {mat}
              <button onClick={() => handleRemoveTag(mat, materials, setMaterials)} className="text-ghost hover:text-destructive">
                <Trash2 size={12} />
              </button>
            </span>
          ))}
        </div>
        <Input 
          value={materialInput}
          onChange={(e) => setMaterialInput(e.target.value)}
          onKeyDown={(e) => handleAddTag(e, materialInput, setMaterialInput, materials, setMaterials)}
          placeholder="e.g. Damascus Steel (Press Enter)"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Properties / Special Abilities</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {properties.map(prop => (
            <span key={prop} className="px-2 py-1 bg-surface border border-subtle rounded-md text-xs flex items-center gap-1">
              {prop}
              <button onClick={() => handleRemoveTag(prop, properties, setProperties)} className="text-ghost hover:text-destructive">
                <Trash2 size={12} />
              </button>
            </span>
          ))}
        </div>
        <Input 
          value={propertyInput}
          onChange={(e) => setPropertyInput(e.target.value)}
          onKeyDown={(e) => handleAddTag(e, propertyInput, setPropertyInput, properties, setProperties)}
          placeholder="e.g. Armor-piercing (Press Enter)"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Physical Description</Label>
        <textarea
          value={physicalDescription}
          onChange={(e) => setPhysicalDescription(e.target.value)}
          rows={3}
          className="w-full bg-surface border border-subtle rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-amber-from resize-y"
          placeholder="What does it look like?"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Origin Region</Label>
          <Input value={originRegion} onChange={(e) => setOriginRegion(e.target.value)} placeholder="e.g. Northern Wastes" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Historical Period</Label>
          <Input value={historicalPeriod} onChange={(e) => setHistoricalPeriod(e.target.value)} placeholder="e.g. The First Age" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="flex flex-col gap-1.5">
          <Label>Magic Compatibility</Label>
          <div className="flex flex-col gap-2 p-3 bg-surface border border-subtle rounded-lg max-h-48 overflow-y-auto">
            {magicSystems.length === 0 ? (
              <span className="text-xs text-ghost italic">No magic systems found.</span>
            ) : (
              magicSystems.map(ms => (
                <label key={ms.id} className="flex items-center gap-2 text-sm text-primary cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={magicSystemIds.includes(ms.id)}
                    onChange={() => toggleArrayItem(ms.id, magicSystemIds, setMagicSystemIds)}
                    className="rounded border-subtle bg-base text-amber-from focus:ring-amber-from"
                  />
                  {ms.name}
                </label>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Known Users</Label>
          <div className="flex flex-col gap-2 p-3 bg-surface border border-subtle rounded-lg max-h-48 overflow-y-auto">
            {characters.length === 0 ? (
              <span className="text-xs text-ghost italic">No characters found.</span>
            ) : (
              characters.map(char => (
                <label key={char.id} className="flex items-center gap-2 text-sm text-primary cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={knownUsersIds.includes(char.id)}
                    onChange={() => toggleArrayItem(char.id, knownUsersIds, setKnownUsersIds)}
                    className="rounded border-subtle bg-base text-amber-from focus:ring-amber-from"
                  />
                  {char.name}
                </label>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AI Rule Constraints */}
      <div className="mt-6 border border-destructive/30 bg-destructive/5 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-destructive font-bold flex items-center gap-2">
              #AI-Rule Constraint
            </Label>
            <p className="text-xs text-secondary mt-1">
              Enforce hard rules for the Ghostwriter AI (e.g. "Only the chosen one can wield this").
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox"
              checked={aiRuleEnabled}
              onChange={(e) => setAiRuleEnabled(e.target.checked)}
              className="rounded border-destructive/50 text-destructive focus:ring-destructive"
            />
            <span className="text-sm font-bold text-primary">Enable</span>
          </label>
        </div>
        
        {aiRuleEnabled && (
          <textarea
            value={aiRuleText}
            onChange={(e) => setAiRuleText(e.target.value)}
            rows={3}
            className="w-full bg-base border border-destructive/40 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-destructive resize-y"
            placeholder="State the absolute rules the AI must follow..."
          />
        )}
      </div>
    </div>
  );
}
