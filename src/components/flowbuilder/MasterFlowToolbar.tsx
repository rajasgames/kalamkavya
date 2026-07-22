import { memo, useState } from 'react';
import { 
  Undo2, 
  Redo2, 
  ArrowUpDown, 
  ArrowLeftRight, 
  GitBranch, 
  Eye, 
  EyeOff, 
  Download,
  Palette
} from 'lucide-react';
import { useStore as useTemporalStore } from 'zustand';
import useMasterFlowStore from './masterFlowStore';
import { useStoryStore } from '@/stores/storyStore';

interface MasterFlowToolbarProps {
  onExportJSON: () => void;
}

const MasterFlowToolbarComponent = ({ onExportJSON }: MasterFlowToolbarProps) => {
  const { layoutDirection, showAllEdges, setLayoutDirection, toggleEdgeFilter } = useMasterFlowStore();
  const temporalStore = useMasterFlowStore.temporal;
  const { undo, redo, pastStates, futureStates } = useTemporalStore(temporalStore);
  const { activeProject, entities } = useStoryStore();
  const [showLegend, setShowLegend] = useState(false);

  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;

  // Color legend entries
  const LEGEND = [
    { color: '#6366F1', label: 'Character' },
    { color: '#F59E0B', label: 'Divine' },
    { color: '#10B981', label: 'Faction' },
    { color: '#0EA5E9', label: 'Place' },
    { color: '#EF4444', label: 'Weapon' },
    { color: '#D97706', label: 'Lineage' },
    { color: '#8B5CF6', label: 'Mystical' },
  ];

  return (
    <div className="master-flow-toolbar">
      {/* Left: project info */}
      <div className="master-flow-toolbar__left">
        <div className="master-flow-toolbar__title">
          <GitBranch size={15} className="text-amber-from shrink-0" />
          <span className="truncate max-w-[140px] sm:max-w-[200px]">{activeProject?.title ?? 'World Bible'}</span>
        </div>
        <div className="master-flow-toolbar__count">
          {entities.length} entities
        </div>
      </div>

      {/* Center: controls */}
      <div className="master-flow-toolbar__center">
        {/* Undo / Redo */}
        <div className="master-flow-toolbar__group">
          <button
            className={`master-flow-toolbar-btn${!canUndo ? ' master-flow-toolbar-btn--disabled' : ''}`}
            onClick={canUndo ? () => undo() : undefined}
            disabled={!canUndo}
            title="Undo layout change (Ctrl+Z)"
          >
            <Undo2 size={14} />
          </button>
          <button
            className={`master-flow-toolbar-btn${!canRedo ? ' master-flow-toolbar-btn--disabled' : ''}`}
            onClick={canRedo ? () => redo() : undefined}
            disabled={!canRedo}
            title="Redo layout change (Ctrl+Y)"
          >
            <Redo2 size={14} />
          </button>
        </div>

        {/* Layout direction */}
        <div className="master-flow-toolbar__group">
          <button
            className={`master-flow-toolbar-btn${layoutDirection === 'TB' ? ' master-flow-toolbar-btn--active' : ''}`}
            onClick={() => setLayoutDirection('TB')}
            title="Top → Down layout"
          >
            <ArrowUpDown size={14} />
            <span className="hidden sm:inline">Top-Down</span>
          </button>
          <button
            className={`master-flow-toolbar-btn${layoutDirection === 'LR' ? ' master-flow-toolbar-btn--active' : ''}`}
            onClick={() => setLayoutDirection('LR')}
            title="Left → Right layout"
          >
            <ArrowLeftRight size={14} />
            <span className="hidden sm:inline">Left-Right</span>
          </button>
        </div>

        {/* Edge filter */}
        <button
          className={`master-flow-toolbar-btn${!showAllEdges ? ' master-flow-toolbar-btn--active' : ''}`}
          onClick={toggleEdgeFilter}
          title={showAllEdges ? 'Show hierarchy only' : 'Show all connections'}
        >
          {showAllEdges ? <Eye size={14} /> : <EyeOff size={14} />}
          <span className="hidden sm:inline">{showAllEdges ? 'All Links' : 'Hierarchy'}</span>
        </button>
      </div>

      {/* Right: export + legend toggle */}
      <div className="master-flow-toolbar__right">
        {/* Color legend button & popover */}
        <div className="relative">
          <button
            className={`master-flow-toolbar-btn ${showLegend ? 'master-flow-toolbar-btn--active' : ''}`}
            onClick={() => setShowLegend(!showLegend)}
            title="Toggle Node Legend"
          >
            <Palette size={14} className="text-amber-from" />
            <span className="hidden md:inline">Legend</span>
          </button>

          {showLegend && (
            <div className="absolute top-full right-0 mt-2 p-3 bg-surface border border-subtle rounded-xl shadow-xl z-50 flex flex-col gap-2 min-w-[140px] backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ghost border-b border-subtle pb-1">
                Node Categories
              </span>
              {LEGEND.map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-secondary">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inline Legend for ultra wide screens */}
        <div className="hidden xl:flex master-flow-legend">
          {LEGEND.slice(0, 4).map(({ color, label }) => (
            <div key={label} className="master-flow-legend__item" title={label}>
              <div className="master-flow-legend__dot" style={{ background: color }} />
              <span className="master-flow-legend__label">{label}</span>
            </div>
          ))}
        </div>

        {/* Export */}
        <button className="master-flow-export-btn" onClick={onExportJSON} title="Export Flowchart JSON">
          <Download size={13} />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};

export const MasterFlowToolbar = memo(MasterFlowToolbarComponent);
export default MasterFlowToolbar;
