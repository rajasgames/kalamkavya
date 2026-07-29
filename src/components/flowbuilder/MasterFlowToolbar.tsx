import { memo, useState } from 'react';
import { 
  Undo2, 
  Redo2, 
  ArrowUpDown, 
  ArrowLeftRight, 
  Activity, 
  Download,
  Palette,
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { useStore as useTemporalStore } from 'zustand';
import { useReactFlow } from '@xyflow/react';
import useMasterFlowStore from './masterFlowStore';

import { getEntityTypeConfig, renderEntityIcon } from './entityTypeConfig';

interface MasterFlowToolbarProps {
  onAddNode: (type: string) => void;
}

const ADD_NODE_MENU = [
  { type: 'CHARACTER', label: 'Character Node' },
  { type: 'FACTION', label: 'Faction / Clan' },
  { type: 'LOCATION', label: 'Location / Loka' },
  { type: 'WEAPON', label: 'Weapon / Astra' },
  { type: 'SCENE', label: 'Scene / Process' },
  { type: 'LORE', label: 'Lore / Knowledge' },
];

const LEGEND = [
  { type: 'CHARACTER', label: 'Character / Being' },
  { type: 'FACTION', label: 'Faction / Army' },
  { type: 'LOCATION', label: 'Location / Realm' },
  { type: 'WEAPON', label: 'Weapon / Astra' },
  { type: 'VAMSHA', label: 'Lineage / Culture' },
  { type: 'LORE', label: 'Lore / Magic' },
  { type: 'SCENE', label: 'Scene / Process' },
];

const MasterFlowToolbarComponent = ({ onAddNode }: MasterFlowToolbarProps) => {
  const { 
    layoutDirection, 
    enableMarchingAnts, 
    setLayoutDirection, 
    toggleMarchingAnts,
    setExportModalOpen,
  } = useMasterFlowStore();

  const temporalStore = useMasterFlowStore.temporal;
  const { undo, redo, pastStates, futureStates } = useTemporalStore(temporalStore);
  const { zoomIn, zoomOut, fitView, getZoom } = useReactFlow();

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;
  const zoomPercent = Math.round(getZoom() * 100) || 100;

  return (
    <div className="flowcraft-toolbar">


      {/* Add Node Dropdown */}
      <div className="relative">
        <button
          className="btn btn-icon btn-primary"
          onClick={() => setShowAddMenu(!showAddMenu)}
          title="Add Node"
        >
          <Plus size={14} />
        </button>

        {showAddMenu && (
          <div className="flowcraft-dropdown-menu">
            {ADD_NODE_MENU.map(({ type, label }) => {
              const cfg = getEntityTypeConfig(type);
              return (
                <button
                  key={type}
                  className="flowcraft-dropdown-item"
                  onClick={() => {
                    onAddNode(type);
                    setShowAddMenu(false);
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

      <div className="flowcraft-tb-div" />

      {/* Undo / Redo */}
      <div className="flowcraft-tb-group">
        <button
          className="btn btn-icon"
          onClick={() => undo()}
          disabled={!canUndo}
          title="Undo layout movement (Ctrl+Z)"
        >
          <Undo2 size={14} />
        </button>
        <button
          className="btn btn-icon"
          onClick={() => redo()}
          disabled={!canRedo}
          title="Redo layout movement (Ctrl+Y)"
        >
          <Redo2 size={14} />
        </button>
      </div>

      <div className="flowcraft-tb-div" />

      {/* Auto-Layout Directions */}
      <div className="flowcraft-tb-group">
        <button
          className={`btn btn-icon ${layoutDirection === 'TB' ? 'btn-primary' : ''}`}
          onClick={() => setLayoutDirection('TB')}
          title="Arrange Vertical (Top → Down)"
        >
          <ArrowUpDown size={14} />
        </button>
        <button
          className={`btn btn-icon ${layoutDirection === 'LR' ? 'btn-primary' : ''}`}
          onClick={() => setLayoutDirection('LR')}
          title="Arrange Horizontal (Left → Right)"
        >
          <ArrowLeftRight size={14} />
        </button>
      </div>

      <div className="flowcraft-tb-div" />

      <button
        className={`btn btn-icon ${enableMarchingAnts ? 'btn-ghost-outline' : ''}`}
        onClick={toggleMarchingAnts}
        title={enableMarchingAnts ? 'Disable Flow Marching Ants Animation' : 'Enable Flow Marching Ants Animation'}
      >
        <Activity size={14} className={enableMarchingAnts ? 'text-teal animate-pulse' : 'text-paper-500'} />
      </button>

      <div className="flowcraft-tb-div" />

      {/* Zoom Controls */}
      <div className="flowcraft-tb-group">
        <button className="btn btn-icon" onClick={() => zoomOut()} title="Zoom Out">
          <ZoomOut size={14} />
        </button>
        <span className="flowcraft-zoom-readout">{zoomPercent}%</span>
        <button className="btn btn-icon" onClick={() => zoomIn()} title="Zoom In">
          <ZoomIn size={14} />
        </button>
        <button className="btn btn-icon" onClick={() => fitView({ padding: 0.2 })} title="Fit Canvas to View">
          <Maximize2 size={14} />
        </button>
      </div>

      <div className="flowcraft-tb-div" />

      {/* Legend & Export */}
      <div className="flowcraft-tb-group">
        <div className="relative">
          <button
            className={`btn btn-icon ${showLegend ? 'btn-primary' : ''}`}
            onClick={() => setShowLegend(!showLegend)}
            title="Node Type Legend"
          >
            <Palette size={14} />
          </button>

          {showLegend && (
            <div className="flowcraft-dropdown-menu right-0 min-w-[200px] p-3 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-paper-700 block pb-1 border-b border-subtle">
                6-Hue Functional System
              </span>
              {LEGEND.map(({ type, label }) => {
                const cfg = getEntityTypeConfig(type);
                return (
                  <div key={type} className="flex items-center gap-2 text-xs">
                    <span className="shrink-0 flex items-center justify-center" style={{ color: cfg.color }}>
                      {renderEntityIcon(type, 13)}
                    </span>
                    <span className="text-paper-300 font-mono text-[11px]">{label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button className="btn btn-icon btn-primary" onClick={() => setExportModalOpen(true)} title="Export Diagram">
          <Download size={14} />
        </button>
      </div>
    </div>
  );
};

export const MasterFlowToolbar = memo(MasterFlowToolbarComponent);
export default MasterFlowToolbar;
