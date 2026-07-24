import { memo, useState, useRef, useCallback, useEffect } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { ExternalLink, Sliders, Trash2 } from 'lucide-react';
import { getEntityTypeConfig, formatSpecId, renderEntityIcon } from './entityTypeConfig';
import { useStoryStore } from '@/stores/storyStore';
import useMasterFlowStore from './masterFlowStore';

export type MasterFlowNodeData = {
  entityId: string;
  name: string;
  description?: string;
  entityType: string;
  entityClass: 'MASTER' | 'INSTANCE';
  targetPosition?: Position;
  sourcePosition?: Position;
  onEntitySelect?: (id: string) => void;
  onRequestAddRelationship?: (fromId: string) => void;
};

export type MasterFlowNode = Node<MasterFlowNodeData, 'masterEntity'>;

const MasterFlowNodeComponent = ({ id: nodeId, data, selected }: NodeProps<MasterFlowNode>) => {
  const { entityType, entityClass, name, description: initialDesc, onEntitySelect, entityId } = data;
  const config = getEntityTypeConfig(entityType);
  const specId = formatSpecId(entityType, entityId);
  const { entities, relationships, updateEntity, deleteEntity } = useStoryStore();
  const { selectNode, addToast } = useMasterFlowStore();

  const currentEntity = entities.find(e => e.id === entityId);

  // Title editing state
  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(name || '');
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Description editing state
  const [editingDesc, setEditingDesc] = useState(false);
  const [draftDesc, setDraftDesc] = useState(initialDesc || '');
  const descInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!editingTitle) setDraftTitle(name || '');
  }, [name, editingTitle]);

  useEffect(() => {
    if (!editingDesc) setDraftDesc(initialDesc || '');
  }, [initialDesc, editingDesc]);

  const startTitleEditing = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDraftTitle(name || '');
    setEditingTitle(true);
    setTimeout(() => {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }, 10);
  }, [name]);

  const commitTitle = useCallback(() => {
    if (draftTitle.trim() && draftTitle !== name && currentEntity) {
      updateEntity({ ...currentEntity, name: draftTitle.trim() });
      addToast(`Renamed entity to "${draftTitle.trim()}"`, 'success');
    }
    setEditingTitle(false);
  }, [draftTitle, currentEntity, name, updateEntity, addToast]);

  const commitDesc = useCallback(() => {
    if (draftDesc !== initialDesc && currentEntity) {
      updateEntity({
        ...currentEntity,
        data: { ...(currentEntity.data || {}), notes: draftDesc },
      });
      addToast('Updated node notes', 'info');
    }
    setEditingDesc(false);
  }, [draftDesc, currentEntity, initialDesc, updateEntity, addToast]);

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitTitle();
    if (e.key === 'Escape') setEditingTitle(false);
  };

  const handleDescKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) commitDesc();
    if (e.key === 'Escape') setEditingDesc(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteEntity(entityId);
    addToast(`Deleted node ${name}`, 'info');
  };

  // Connection count
  const connectionCount = relationships.filter(
    r => r.fromEntityId === entityId || r.toEntityId === entityId
  ).length;

  const isMaster = entityClass === 'MASTER';

  return (
    <div
      className={`flowcraft-node ${selected ? 'flowcraft-node--selected' : ''} ${isMaster ? 'flowcraft-node--master' : ''}`}
      style={{
        '--accent-color': config.color,
        '--accent-bg': config.bg,
        borderColor: selected ? config.color : undefined,
      } as React.CSSProperties}
      data-type={entityType.toLowerCase()}
    >
      {/* 4-Way Connection Handles */}
      <Handle type="target" position={Position.Top} id="top" className="flowcraft-handle handle-top" />
      <Handle type="target" position={Position.Left} id="left" className="flowcraft-handle handle-left" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="flowcraft-handle handle-bottom" />
      <Handle type="source" position={Position.Right} id="right" className="flowcraft-handle handle-right" />

      {/* Top Spec Tag Header */}
      <div className="flowcraft-node__header">
        <span className="flowcraft-node__type-icon flex items-center justify-center" style={{ color: config.color }}>
          {renderEntityIcon(entityType, 12)}
        </span>
        <span className="flowcraft-node__type-label" style={{ color: config.color }}>
          {config.label.toUpperCase()}
        </span>
        <span className="flowcraft-node__spec-id">{specId}</span>
        {isMaster && <span className="flowcraft-node__master-badge" title="Master Entity" />}
      </div>

      {/* Quick Action Icons */}
      <div className="flowcraft-node__actions">
        <button
          className="flowcraft-action-btn nodrag"
          onClick={(e) => { e.stopPropagation(); selectNode(nodeId); }}
          title="Open Inspector"
        >
          <Sliders size={11} />
        </button>
        {onEntitySelect && (
          <button
            className="flowcraft-action-btn nodrag"
            onClick={(e) => { e.stopPropagation(); onEntitySelect(entityId); }}
            title="View Full Entity Dossier"
          >
            <ExternalLink size={11} />
          </button>
        )}
        <button
          className="flowcraft-action-btn flowcraft-action-btn--danger nodrag"
          onClick={handleDelete}
          title="Delete Node"
        >
          <Trash2 size={11} />
        </button>
      </div>

      {/* Editable Node Title */}
      <div className="flowcraft-node__body">
        {editingTitle ? (
          <input
            ref={titleInputRef}
            className="flowcraft-node__name-input nodrag"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={handleTitleKeyDown}
          />
        ) : (
          <h4
            className="flowcraft-node__name"
            onDoubleClick={startTitleEditing}
            title="Double-click to rename"
          >
            {name || 'Unnamed Node'}
          </h4>
        )}

        {/* Editable Description / Spec Notes */}
        {editingDesc ? (
          <textarea
            ref={descInputRef}
            className="flowcraft-node__desc-input nodrag"
            value={draftDesc}
            onChange={(e) => setDraftDesc(e.target.value)}
            onBlur={commitDesc}
            onKeyDown={handleDescKeyDown}
            placeholder="Add spec notes..."
            rows={2}
          />
        ) : (
          <p
            className="flowcraft-node__desc"
            onDoubleClick={(e) => { e.stopPropagation(); setEditingDesc(true); }}
            title="Double-click to edit description"
          >
            {initialDesc || <span className="placeholder">Double-click to add spec notes...</span>}
          </p>
        )}
      </div>

      {/* Footer Connection Count Indicator */}
      {connectionCount > 0 && (
        <div className="flowcraft-node__footer">
          <span className="conn-pill" style={{ color: config.color, borderColor: `${config.color}33` }}>
            ● {connectionCount} connection{connectionCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Color Accent Indicator Strip */}
      <div className="flowcraft-node__accent-bar" style={{ background: config.color }} />
    </div>
  );
};

export const MasterFlowNode = memo(MasterFlowNodeComponent);
export default MasterFlowNode;
