import { User, Flag, MapPin } from 'lucide-react';

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
      className="absolute z-50 bg-base/90 backdrop-blur border border-subtle p-2 rounded-xl shadow-lg flex flex-col gap-1 min-w-[160px]"
      onClick={onClick}
    >
      <div className="text-xs font-semibold uppercase text-ghost tracking-wider px-2 py-1 mb-1">
        Add Entity Node
      </div>
      <button
        className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-surface rounded-md text-sm text-primary transition-colors text-left"
        onClick={onAddCharacter}
      >
        <User size={14} className="text-brass shrink-0" />
        <span>Character</span>
      </button>
      <button
        className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-surface rounded-md text-sm text-primary transition-colors text-left"
        onClick={onAddFaction}
      >
        <Flag size={14} className="text-teal shrink-0" />
        <span>Faction</span>
      </button>
      <button
        className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-surface rounded-md text-sm text-primary transition-colors text-left"
        onClick={onAddGeography}
      >
        <MapPin size={14} className="text-sage shrink-0" />
        <span>Geography</span>
      </button>
    </div>
  );
}
