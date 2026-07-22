import { Plus } from 'lucide-react';

interface ContextMenuProps {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  onClick: () => void;
  onAddCharacter: () => void;
  onAddFaction: () => void;
  onAddGeography: () => void;
}

export default function ContextMenu({
  top,
  left,
  right,
  bottom,
  onClick,
  onAddCharacter,
  onAddFaction,
  onAddGeography,
}: ContextMenuProps) {
  return (
    <div
      style={{ top, left, right, bottom }}
      className="absolute z-50 bg-base/90 backdrop-blur border border-subtle p-2 rounded-xl shadow-lg flex flex-col gap-1 min-w-[150px]"
      onClick={onClick}
    >
      <div className="text-xs font-semibold uppercase text-ghost tracking-wider px-2 py-1 mb-1">
        Add Entity
      </div>
      <button
        className="flex items-center gap-2 px-2 py-1.5 hover:bg-surface rounded-md text-sm text-primary transition-colors text-left"
        onClick={onAddCharacter}
      >
        <Plus size={16} />
        <span>Character</span>
      </button>
      <button
        className="flex items-center gap-2 px-2 py-1.5 hover:bg-surface rounded-md text-sm text-primary transition-colors text-left"
        onClick={onAddFaction}
      >
        <Plus size={16} />
        <span>Faction</span>
      </button>
      <button
        className="flex items-center gap-2 px-2 py-1.5 hover:bg-surface rounded-md text-sm text-primary transition-colors text-left"
        onClick={onAddGeography}
      >
        <Plus size={16} />
        <span>Geography</span>
      </button>
    </div>
  );
}
