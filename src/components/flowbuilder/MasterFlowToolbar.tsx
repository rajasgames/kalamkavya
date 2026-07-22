import { memo } from 'react';
import { Undo2, Redo2, ArrowUpDown, ArrowLeftRight, GitBranch, Eye, EyeOff, Download } from 'lucide-react';
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
          <GitBranch size={15} />
          <span>{activeProject?.title ?? 'World Bible'}</span>
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
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={15} />
          </button>
          <button
            className={`master-flow-toolbar-btn${!canRedo ? ' master-flow-toolbar-btn--disabled' : ''}`}
            onClick={canRedo ? () => redo() : undefined}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={15} />
          </button>
        </div>

        {/* Layout direction */}
        <div className="master-flow-toolbar__group">
          <button
            className={`master-flow-toolbar-btn${layoutDirection === 'TB' ? ' master-flow-toolbar-btn--active' : ''}`}
            onClick={() => setLayoutDirection('TB')}
            title="Top → Down layout"
          >
            <ArrowUpDown size={15} />
            <span>TD</span>
          </button>
          <button
            className={`master-flow-toolbar-btn${layoutDirection === 'LR' ? ' master-flow-toolbar-btn--active' : ''}`}
            onClick={() => setLayoutDirection('LR')}
            title="Left → Right layout"
          >
            <ArrowLeftRight size={15} />
            <span>LR</span>
          </button>
        </div>

        {/* Edge filter */}
        <button
          className={`master-flow-toolbar-btn${!showAllEdges ? ' master-flow-toolbar-btn--active' : ''}`}
          onClick={toggleEdgeFilter}
          title={showAllEdges ? 'Show hierarchy only' : 'Show all connections'}
        >
          {showAllEdges ? <Eye size={15} /> : <EyeOff size={15} />}
          <span>{showAllEdges ? 'All edges' : 'Hierarchy'}</span>
        </button>
      </div>

      {/* Right: export + legend */}
      <div className="master-flow-toolbar__right">
        {/* Color legend */}
        <div className="master-flow-legend">
          {LEGEND.map(({ color, label }) => (
            <div key={label} className="master-flow-legend__item" title={label}>
              <div className="master-flow-legend__dot" style={{ background: color }} />
              <span className="master-flow-legend__label">{label}</span>
            </div>
          ))}
        </div>

        {/* Export */}
        <button className="master-flow-export-btn" onClick={onExportJSON} title="Export as JSON">
          <Download size={14} />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};

export const MasterFlowToolbar = memo(MasterFlowToolbarComponent);
export default MasterFlowToolbar;
