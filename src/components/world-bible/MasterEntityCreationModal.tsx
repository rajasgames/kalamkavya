import { useState, useEffect, useMemo } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import { Entity } from '@/types';
import { Modal, Input, Button, Label, Textarea } from '@/components/ui';
import { getEntityTypesForGenre } from '@/lib/genres/genreRegistry';
import { Sparkles, Zap } from 'lucide-react';

interface MasterEntityCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Initial entity type value or category ID to select */
  defaultType?: string;
  /** Optional callback fired with the new entity ID upon creation */
  onCreated?: (entityId: string) => void;
}

export function MasterEntityCreationModal({
  isOpen,
  onClose,
  defaultType = 'character',
  onCreated,
}: MasterEntityCreationModalProps) {
  const { activeProject, addEntity } = useStoryStore();
  const [name, setName] = useState('');
  const [type, setType] = useState(defaultType);
  const [entityClass, setEntityClass] = useState<'MASTER' | 'INSTANCE'>('INSTANCE');
  const [description, setDescription] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const genreModules = useMemo(
    () => activeProject?.genreModules ?? ['vedic'],
    [activeProject],
  );

  const availableEntityTypes = useMemo(
    () => getEntityTypesForGenre(genreModules),
    [genreModules],
  );

  // Sync default type when opened
  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setShowAdvanced(false);
      
      const isKnownType = availableEntityTypes.some(et => et.value === defaultType);
      if (isKnownType) {
        setType(defaultType);
      } else {
        setType(availableEntityTypes[0]?.value ?? 'character');
      }
    }
  }, [isOpen, defaultType, availableEntityTypes]);

  const handleSubmit = async (e: React.FormEvent, openDetail = false) => {
    e.preventDefault();
    if (!activeProject || !name.trim()) return;

    const newEntityId = crypto.randomUUID();
    const newEntity: Entity = {
      id: newEntityId,
      projectId: activeProject.id,
      type,
      entityClass,
      name: name.trim(),
      categorySlug: type,
      data: {
        description: description.trim(),
        createdAt: new Date().toISOString(),
      },
      hasAIRule: false,
    };

    await addEntity(newEntity);
    onClose();

    if (openDetail && onCreated) {
      onCreated(newEntityId);
    }
  };

  const selectedTypeLabel = availableEntityTypes.find(t => t.value === type)?.label ?? type;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Create New ${selectedTypeLabel}`}>
      <form onSubmit={(e) => handleSubmit(e, false)} className="flex flex-col gap-4 mt-2">
        {/* Entry Name */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center justify-between">
            <span>Name *</span>
            <span className="text-[10px] text-ghost uppercase tracking-wider">Required</span>
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter entry name..."
            autoFocus
          />
        </div>

        {/* Category / Type Selector */}
        <div className="flex flex-col gap-1.5">
          <Label>Entry Category</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-2 bg-base rounded-xl border border-subtle scrollbar-hide">
            {availableEntityTypes.map(t => {
              const isSelected = type === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs text-left transition-all border ${
                    isSelected
                      ? 'bg-amber-from/15 border-amber-from text-amber-from font-semibold shadow-sm'
                      : 'bg-surface border-subtle text-secondary hover:text-primary hover:border-subtle/80'
                  }`}
                >
                  <Zap size={14} className={isSelected ? 'text-amber-from shrink-0' : 'text-ghost shrink-0'} />
                  <span className="truncate">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description Notes */}
        <div className="flex flex-col gap-1.5">
          <Label>Brief Description / Overview</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add brief details or notes..."
            rows={2}
          />
        </div>

        {/* Collapsible Advanced Options */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-ghost hover:text-amber-from font-medium flex items-center gap-1 transition-colors"
          >
            {showAdvanced ? '– Hide Advanced Options' : '+ Advanced Options (Architecture Class)'}
          </button>

          {showAdvanced && (
            <div className="mt-3 p-3 bg-surface rounded-xl border border-subtle flex flex-col gap-2">
              <Label className="text-xs font-semibold">Architecture Class</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEntityClass('INSTANCE')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    entityClass === 'INSTANCE'
                      ? 'bg-amber-from/15 border-amber-from text-amber-from font-semibold'
                      : 'bg-base border-subtle text-ghost hover:text-primary'
                  }`}
                >
                  <div className="text-xs font-bold">INSTANCE Node</div>
                  <div className="text-[10px] text-secondary mt-0.5">Individual character, item, or place.</div>
                </button>

                <button
                  type="button"
                  onClick={() => setEntityClass('MASTER')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    entityClass === 'MASTER'
                      ? 'bg-amber-from/15 border-amber-from text-amber-from font-semibold'
                      : 'bg-base border-subtle text-ghost hover:text-primary'
                  }`}
                >
                  <div className="text-xs font-bold">MASTER World Rule</div>
                  <div className="text-[10px] text-secondary mt-0.5">Core cosmic law or archetype rule.</div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 mt-2 pt-4 border-t border-subtle">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={(e) => handleSubmit(e, true)}
              disabled={!name.trim()}
              className="gap-1.5 text-xs border border-subtle hover:border-amber-from/50"
            >
              <Sparkles size={14} className="shrink-0" /> Open Full Editor
            </Button>
            <Button type="submit" disabled={!name.trim()} className="gap-1.5 text-xs">
              Create Entry
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
