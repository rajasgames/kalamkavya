import { useState, useEffect, useMemo } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import { Entity } from '@/types';
import { Modal, Input, Button, Label, Select } from '@/components/ui';
import { getEntityTypesForGenre } from '@/lib/genres/genreRegistry';

interface EntityCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** An entity type value (e.g. 'character', 'LOKA') or a category ID (e.g. 'cast') */
  defaultType?: string;
}

export function EntityCreationModal({ isOpen, onClose, defaultType = 'character' }: EntityCreationModalProps) {
  const { activeProject, addEntity } = useStoryStore();
  const [name, setName] = useState('');
  const [type, setType] = useState(defaultType);
  const [entityClass, setEntityClass] = useState<'MASTER' | 'INSTANCE'>('INSTANCE');

  /**
   * Legacy projects without genreModules fall back to ['universal'].
   */
  const genreModules = useMemo(
    () => activeProject?.genreModules ?? ['universal'],
    [activeProject],
  );

  const entityTypes = useMemo(
    () => getEntityTypesForGenre(genreModules),
    [genreModules],
  );

  useEffect(() => {
    if (isOpen) {
      setName('');
      // If defaultType is already a valid entity type value, use it directly.
      // Otherwise it's a category/sidebar ID — resolve it to the first matching type.
      const isKnownType = entityTypes.some(et => et.value === defaultType);
      if (isKnownType) {
        setType(defaultType);
      } else {
        // Fallback: pick first entity type from the list
        setType(entityTypes[0]?.value ?? 'character');
      }
    }
  }, [isOpen, defaultType, entityTypes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !name.trim()) return;

    const newEntity: Entity = {
      id: crypto.randomUUID(),
      projectId: activeProject.id,
      type,
      entityClass,
      name: name.trim(),
      categorySlug: type,
      data: {},
      hasAIRule: false,
    };

    await addEntity(newEntity);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Entry">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col gap-1.5">
          <Label>Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. The Spire of Aethelgard"
            autoFocus
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Entry Type</Label>
          <Select
            value={type}
            onValueChange={setType}
            options={entityTypes}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Entity Class (Architecture Tier)</Label>
          <Select
            value={entityClass}
            onValueChange={(val) => setEntityClass(val as 'MASTER' | 'INSTANCE')}
            options={[
              { value: 'INSTANCE', label: 'Character Node (Instance)' },
              { value: 'MASTER', label: 'World Rule (Master Node)' },
            ]}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-subtle">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!name.trim()}>
            Create Entry
          </Button>
        </div>
      </form>
    </Modal>
  );
}
