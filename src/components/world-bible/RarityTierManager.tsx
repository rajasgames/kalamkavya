import { useState, useEffect } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import { Entity, RarityTierData } from '@/types';
import { Button, Input, Label, Select } from '@/components/ui';
import { RarityBadge } from './RarityBadge';
import { GripVertical, Plus, Trash2, Save, Undo } from 'lucide-react';
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

const DEFAULT_RARITY_TIERS: RarityTierData[] = [
  {
    name: 'Common',
    displayOrder: 1,
    bgColor: 'bg-black/5 dark:bg-white/5',
    textColor: 'text-ghost',
    badgeStyle: 'solid',
    description: 'Everyday items, easily found'
  },
  {
    name: 'Uncommon',
    displayOrder: 2,
    bgColor: 'bg-surface border-subtle',
    textColor: 'text-primary',
    badgeStyle: 'outline',
    description: 'Quality items, harder to find'
  },
  {
    name: 'Rare',
    displayOrder: 3,
    bgColor: 'bg-sage/10',
    textColor: 'text-sage',
    badgeStyle: 'solid',
    description: 'Rare, powerful artifacts'
  },
  {
    name: 'Legendary',
    displayOrder: 4,
    bgColor: 'bg-gradient-to-r from-amber-400 to-orange-500',
    textColor: 'text-white',
    badgeStyle: 'gradient',
    description: 'Legendary items of immense power'
  },
  {
    name: 'Unique',
    displayOrder: 5,
    bgColor: 'bg-clay/10',
    textColor: 'text-clay',
    badgeStyle: 'solid',
    description: 'One-of-a-kind artifacts'
  },
  {
    name: 'Mythological',
    displayOrder: 6,
    bgColor: 'bg-purple-900',
    textColor: 'text-purple-100',
    badgeStyle: 'solid',
    description: 'Divine artifacts from ancient myths'
  }
];

export function RarityTierManager() {
  const { entities, activeProject, addEntity, updateEntity, deleteEntity } = useStoryStore();
  
  const rarityEntities = entities
    .filter(e => e.type === 'RARITY_TIER')
    .sort((a, b) => {
      const aData = a.data as unknown as RarityTierData;
      const bData = b.data as unknown as RarityTierData;
      return (aData.displayOrder || 0) - (bData.displayOrder || 0);
    });

  // Seeder logic: if project is active and zero rarity tiers exist, seed them.
  useEffect(() => {
    if (activeProject && rarityEntities.length === 0) {
      DEFAULT_RARITY_TIERS.forEach((tier) => {
        addEntity({
          id: crypto.randomUUID(),
          projectId: activeProject.id,
          type: 'RARITY_TIER',
          name: tier.name,
          categorySlug: 'rarity-tiers',
          data: tier as unknown as Record<string, unknown>,
          hasAIRule: false
        });
      });
    }
  }, [activeProject, rarityEntities.length, addEntity]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = rarityEntities.findIndex(r => r.id === active.id);
      const newIndex = rarityEntities.findIndex(r => r.id === over.id);
      const newOrder = arrayMove(rarityEntities, oldIndex, newIndex);
      
      // Update displayOrders
      newOrder.forEach((entity, index) => {
        const currentData = entity.data as unknown as RarityTierData;
        if (currentData.displayOrder !== index + 1) {
          updateEntity({
            ...entity,
            data: { ...currentData, displayOrder: index + 1 } as unknown as Record<string, unknown>
          });
        }
      });
    }
  };

  const handleAddTier = () => {
    if (!activeProject) return;
    const order = rarityEntities.length + 1;
    addEntity({
      id: crypto.randomUUID(),
      projectId: activeProject.id,
      type: 'RARITY_TIER',
      name: `New Tier ${order}`,
      categorySlug: 'rarity-tiers',
      data: {
        name: `New Tier ${order}`,
        displayOrder: order,
        bgColor: 'bg-black/10 dark:bg-white/10',
        textColor: 'text-primary',
        badgeStyle: 'solid',
        description: ''
      },
      hasAIRule: false
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-primary">Rarity Tiers</h2>
          <p className="text-secondary text-sm">
            Manage the global rarity system for weapons and gear in your world.
          </p>
        </div>
        <Button onClick={handleAddTier} className="gap-2">
          <Plus size={16} /> Add Rarity Tier
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={rarityEntities} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-4">
            {rarityEntities.map((entity) => (
              <SortableRarityItem 
                key={entity.id} 
                entity={entity} 
                onUpdate={updateEntity}
                onDelete={deleteEntity}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

interface SortableRarityItemProps {
  entity: Entity;
  onUpdate: (entity: Entity) => void;
  onDelete: (id: string) => void;
}

function SortableRarityItem({ entity, onUpdate, onDelete }: SortableRarityItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: entity.id });
  const [isEditing, setIsEditing] = useState(false);
  const data = entity.data as unknown as RarityTierData;

  const [formData, setFormData] = useState<RarityTierData>(data);

  // Sync if external updates happen
  useEffect(() => {
    setFormData(entity.data as unknown as RarityTierData);
  }, [entity.data]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    onUpdate({
      ...entity,
      name: formData.name, // keep entity name in sync with rarity name
      data: formData as unknown as Record<string, unknown>
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="bg-elevated border border-subtle rounded-xl flex flex-col p-4 shadow-sm"
    >
      {isEditing ? (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2 border-b border-subtle pb-4">
            <h3 className="text-sm font-bold text-primary">Edit Rarity Tier</h3>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={handleCancel} className="gap-2 text-xs h-8">
                <Undo size={14} /> Cancel
              </Button>
              <Button size="sm" onClick={handleSave} className="gap-2 text-xs h-8">
                <Save size={14} /> Save
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Name</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label>Badge Style</Label>
              <Select 
                value={formData.badgeStyle} 
                onValueChange={(val: string) => setFormData({...formData, badgeStyle: val as RarityTierData['badgeStyle']})}
                options={[
                  { value: 'solid', label: 'Solid' },
                  { value: 'gradient', label: 'Gradient' },
                  { value: 'outline', label: 'Outline' }
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Background Color (Tailwind Classes)</Label>
              <Input 
                value={formData.bgColor} 
                onChange={(e) => setFormData({...formData, bgColor: e.target.value})} 
                placeholder="e.g. bg-amber-500 or bg-gradient-to-r..."
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label>Text Color (Tailwind Classes)</Label>
              <Input 
                value={formData.textColor} 
                onChange={(e) => setFormData({...formData, textColor: e.target.value})} 
                placeholder="e.g. text-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Description</Label>
            <Input 
              value={formData.description || ''} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          <div className="mt-2 p-4 bg-surface rounded-lg flex items-center gap-4">
            <Label className="shrink-0 text-secondary">Live Preview:</Label>
            <RarityBadge rarityTier={formData} size="md" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 group">
          <div {...attributes} {...listeners} className="text-ghost hover:text-primary cursor-grab py-2">
            <GripVertical size={16} />
          </div>
          
          <div className="flex-1 grid grid-cols-[1fr_2fr] gap-4 items-center">
            <div className="flex items-center">
              <RarityBadge rarityTier={data} size="md" />
            </div>
            <div className="text-sm text-secondary truncate">
              {data.description || <span className="italic opacity-50">No description</span>}
            </div>
          </div>
          
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>Edit</Button>
            <button 
              onClick={() => {
                if(confirm(`Delete rarity tier "${data.name}"?`)) onDelete(entity.id);
              }}
              className="text-ghost hover:text-clay p-2"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
