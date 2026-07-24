import { useState, memo } from 'react';
import { Plus, LayoutGrid, Maximize2, Trash2, ChevronRight } from 'lucide-react';
import { getEntityTypeConfig, renderEntityIcon } from './entityTypeConfig';

const ADD_ENTITY_TYPES = [
  { type: 'CHARACTER', label: 'Character / Being' },
  { type: 'GOD', label: 'God / Cosmic' },
  { type: 'FACTION', label: 'Faction / Clan' },
  { type: 'LOCATION', label: 'Location / Loka' },
  { type: 'WEAPON', label: 'Weapon / Astra' },
  { type: 'CULTURE', label: 'Culture / Vamsha' },
  { type: 'LORE', label: 'Lore / Knowledge' },
  { type: 'SCENE', label: 'Scene / Process' },
];

const SWATCHES = [
  { color: '#E3A542', type: 'CHARACTER' },
  { color: '#4FC1A6', type: 'FACTION' },
  { color: '#8FB88A', type: 'LOCATION' },
  { color: '#E2705F', type: 'WEAPON' },
  { color: '#7B87D6', type: 'VAMSHA' },
  { color: '#7A84A3', type: 'LORE' },
];

interface MasterFlowContextMenuProps {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  onAddEntity: (entityType: string) => void;
  onAutoArrange: () => void;
  onFitView: () => void;
  onClearLayout: () => void;
  onClose: () => void;
}

const MasterFlowContextMenuComponent = ({
  top, left, right, bottom,
  onAddEntity, onAutoArrange, onFitView, onClearLayout, onClose,
}: MasterFlowContextMenuProps) => {
  const [showSubmenu, setShowSubmenu] = useState(false);

  return (
    <div
      className="flowcraft-context-menu"
      style={{ top, left, right, bottom }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Add Entity Submenu */}
      <div
        className="menu-item relative"
        onMouseEnter={() => setShowSubmenu(true)}
        onMouseLeave={() => setShowSubmenu(false)}
      >
        <Plus size={15} />
        <span>Add Process Node</span>
        <ChevronRight size={13} className="ml-auto text-paper-700" />

        {showSubmenu && (
          <div className="flowcraft-submenu">
            {ADD_ENTITY_TYPES.map(({ type, label }) => {
              const cfg = getEntityTypeConfig(type);
              return (
                <button
                  key={type}
                  className="menu-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddEntity(type);
                    onClose();
                  }}
                >
                  <span style={{ color: cfg.color }} className="flex items-center justify-center">
                    {renderEntityIcon(type, 14)}
                  </span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Color Swatch Bar */}
      <div className="menu-sep" />
      <div className="menu-label">Quick Spec Archetype</div>
      <div className="menu-swatches">
        {SWATCHES.map(({ color, type }) => (
          <button
            key={type}
            style={{ background: color }}
            title={`Add ${type}`}
            onClick={() => {
              onAddEntity(type);
              onClose();
            }}
          />
        ))}
      </div>

      <div className="menu-sep" />

      {/* Auto-arrange */}
      <button className="menu-item" onClick={() => { onAutoArrange(); onClose(); }}>
        <LayoutGrid size={15} />
        <span>Auto-arrange Blueprint Layout</span>
      </button>

      {/* Fit View */}
      <button className="menu-item" onClick={() => { onFitView(); onClose(); }}>
        <Maximize2 size={15} />
        <span>Fit Diagram to Screen</span>
      </button>

      <div className="menu-sep" />

      {/* Reset Layout */}
      <button className="menu-item danger" onClick={() => { onClearLayout(); onClose(); }}>
        <Trash2 size={15} />
        <span>Reset Blueprint Layout</span>
      </button>
    </div>
  );
};

export const MasterFlowContextMenu = memo(MasterFlowContextMenuComponent);
export default MasterFlowContextMenu;
