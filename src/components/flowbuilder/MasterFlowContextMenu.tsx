import { useState, memo } from 'react';
import { Plus, LayoutGrid, Maximize2, Trash2, ChevronRight } from 'lucide-react';
import { getEntityTypeConfig } from './entityTypeConfig';

// A curated set of entity types the user can add directly from the canvas
const ADD_ENTITY_TYPES = [
  { type: 'CHARACTER', label: 'Character' },
  { type: 'GOD',       label: 'God / Deity' },
  { type: 'FACTION',   label: 'Faction' },
  { type: 'LOCATION',  label: 'Location / Loka' },
  { type: 'WEAPON',    label: 'Weapon / Astra' },
  { type: 'CULTURE',   label: 'Culture / Lineage' },
  { type: 'LORE',      label: 'Lore / Knowledge' },
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
  const [showEntityTypes, setShowEntityTypes] = useState(false);

  return (
    <div
      className="master-flow-context-menu"
      style={{ top, left, right, bottom }}
      onClick={e => e.stopPropagation()}
    >
      {/* Add Entity → submenu */}
      <div
        className="master-flow-menu-item"
        onMouseEnter={() => setShowEntityTypes(true)}
        onMouseLeave={() => setShowEntityTypes(false)}
      >
        <Plus size={15} />
        <span>Add Entity</span>
        <ChevronRight size={13} className="master-flow-menu-chevron" />

        {showEntityTypes && (
          <div className="master-flow-submenu">
            {ADD_ENTITY_TYPES.map(({ type, label }) => {
              const config = getEntityTypeConfig(type);
              return (
                <button
                  key={type}
                  className="master-flow-menu-item"
                  onClick={e => { e.stopPropagation(); onAddEntity(type); onClose(); }}
                >
                  <span style={{ color: config.color, fontSize: 14 }}>{config.icon}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="master-flow-menu-divider" />

      {/* Auto-arrange */}
      <button
        className="master-flow-menu-item"
        onClick={() => { onAutoArrange(); onClose(); }}
      >
        <LayoutGrid size={15} />
        <span>Auto-arrange</span>
      </button>

      {/* Fit View */}
      <button
        className="master-flow-menu-item"
        onClick={() => { onFitView(); onClose(); }}
      >
        <Maximize2 size={15} />
        <span>Fit to view</span>
      </button>

      <div className="master-flow-menu-divider" />

      {/* Clear Layout */}
      <button
        className="master-flow-menu-item master-flow-menu-item--danger"
        onClick={() => { onClearLayout(); onClose(); }}
      >
        <Trash2 size={15} />
        <span>Reset layout</span>
      </button>
    </div>
  );
};

export const MasterFlowContextMenu = memo(MasterFlowContextMenuComponent);
export default MasterFlowContextMenu;
