import { memo, useState, useRef, useCallback, useEffect } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { Trash2, ExternalLink } from 'lucide-react';
import { getEntityTypeConfig } from './entityTypeConfig';
import { useStoryStore } from '@/stores/storyStore';

// ─── Type declarations ────────────────────────────────────────────────────────

export type MasterFlowNodeData = {
  entityId: string;
  name: string;
  entityType: string;
  entityClass: 'MASTER' | 'INSTANCE';
  onEntitySelect?: (id: string) => void;
  onRequestAddRelationship?: (fromId: string) => void;
};

export type MasterFlowNode = Node<MasterFlowNodeData, 'masterEntity'>;

// ─── Component ────────────────────────────────────────────────────────────────

const MasterFlowNodeComponent = ({ data, selected }: NodeProps<MasterFlowNode>) => {
  const { entityType, entityClass, name, onEntitySelect, entityId } = data;
  const config = getEntityTypeConfig(entityType);
  const { relationships } = useStoryStore();

  // Inline title editing
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) setDraft(name);
  }, [name, editing]);

  const startEditing = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDraft(name);
    setEditing(true);
    setTimeout(() => { inputRef.current?.focus(); inputRef.current?.select(); }, 0);
  }, [name]);

  const commitTitle = useCallback(() => {
    // Note: title edits go through storyStore in a real implementation
    // For now we just exit editing mode (name comes from storyStore entities)
    setEditing(false);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitTitle();
    if (e.key === 'Escape') { setEditing(false); }
  };

  // Count connections for this node
  const connectionCount = relationships.filter(
    r => r.fromEntityId === entityId || r.toEntityId === entityId
  ).length;

  const isMaster = entityClass === 'MASTER';

  return (
    <div
      className={`master-flow-node ${selected ? 'master-flow-node--selected' : ''} ${isMaster ? 'master-flow-node--master' : ''}`}
      style={{ borderColor: selected ? config.color : undefined }}
    >
      {/* Handles on all four sides */}
      <Handle type="target"  position={Position.Top}    id="top"    className="master-flow-handle" />
      <Handle type="target"  position={Position.Left}   id="left"   className="master-flow-handle" />
      <Handle type="source"  position={Position.Bottom} id="bottom" className="master-flow-handle" />
      <Handle type="source"  position={Position.Right}  id="right"  className="master-flow-handle" />

      {/* Type badge */}
      <div className="master-flow-node__badge" style={{ color: config.color, background: `${config.color}18` }}>
        <span className="master-flow-node__icon">{config.icon}</span>
        <span className="master-flow-node__type">{config.label.toUpperCase()}</span>
        {isMaster && <span className="master-flow-node__master-dot" style={{ background: config.color }} />}
      </div>

      {/* Name */}
      <div className="master-flow-node__body">
        {editing ? (
          <input
            ref={inputRef}
            className="master-flow-node__input nodrag"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <div
            className="master-flow-node__name"
            onDoubleClick={startEditing}
            title="Double-click to rename"
          >
            {name || 'Unnamed'}
          </div>
        )}
      </div>

      {/* Connection count hint */}
      {connectionCount > 0 && (
        <div className="master-flow-node__connections" style={{ color: config.color }}>
          {connectionCount} connection{connectionCount !== 1 ? 's' : ''}
        </div>
      )}

      {/* Hover action buttons */}
      <div className="master-flow-node__actions">
        {onEntitySelect && (
          <button
            className="master-flow-action-btn nodrag"
            onClick={e => { e.stopPropagation(); onEntitySelect(entityId); }}
            title="Open details"
            style={{ '--btn-color': config.color } as React.CSSProperties}
          >
            <ExternalLink size={12} />
          </button>
        )}
        <button
          className="master-flow-action-btn master-flow-action-btn--danger nodrag"
          onClick={e => { e.stopPropagation(); /* handled by canvas deleteKeyCode */ }}
          title="Select & press Delete to remove"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Color accent bar at top */}
      <div className="master-flow-node__accent" style={{ background: config.color }} />
    </div>
  );
};

export const MasterFlowNode = memo(MasterFlowNodeComponent);
export default MasterFlowNode;
