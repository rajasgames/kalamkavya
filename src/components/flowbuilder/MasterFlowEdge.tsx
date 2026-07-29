import { useState, useRef, useCallback, memo } from 'react';
import {
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
  type Edge,
} from '@xyflow/react';
import { getRelationshipColor } from './entityTypeConfig';
import useMasterFlowStore from './masterFlowStore';
import { useStoryStore } from '@/stores/storyStore';

export type MasterFlowEdgeData = {
  label?: string;
  relationshipType?: string;
  relationshipId?: string;
  isHierarchy?: boolean;
};

export type MasterFlowEdge = Edge<MasterFlowEdgeData, 'masterRelation'>;

const MasterFlowEdgeComponent = ({
  id,
  sourceX, sourceY,
  targetX, targetY,
  sourcePosition, targetPosition,
  data,
  selected,
}: EdgeProps<MasterFlowEdge>) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(data?.label ?? data?.relationshipType ?? '');
  const inputRef = useRef<HTMLInputElement>(null);
  const { enableMarchingAnts, selectEdge } = useMasterFlowStore();
  const { relationships, deleteRelationship, addRelationship } = useStoryStore();

  const relType = data?.relationshipType ?? '';
  const strokeColor = selected ? '#E3A542' : getRelationshipColor(relType);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
    borderRadius: 24,
  });

  const startEditing = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDraft(data?.label ?? data?.relationshipType ?? '');
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 10);
  }, [data]);

  const commitLabel = useCallback(() => {
    if (data?.relationshipId && draft.trim()) {
      const existingRel = relationships.find(r => r.id === data.relationshipId);
      if (existingRel) {
        deleteRelationship(existingRel.id);
        addRelationship({
          ...existingRel,
          type: draft.trim().toUpperCase().replace(/\s+/g, '_'),
        });
      }
    }
    setEditing(false);
  }, [data, draft, relationships, deleteRelationship, addRelationship]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitLabel();
    if (e.key === 'Escape') setEditing(false);
  };

  const displayLabel = (data?.label || relType).replace(/_/g, ' ');

  return (
    <>
      {/* Base stroke path */}
      <path
        id={id}
        className={`flowcraft-edge-path ${selected ? 'selected' : ''}`}
        style={{ stroke: strokeColor }}
        d={edgePath}
        onClick={(e) => { e.stopPropagation(); selectEdge(id); }}
        onDoubleClick={startEditing}
        markerEnd={`url(#arrow-${id})`}
      />

      {/* Marching-Ants Animated Overlay */}
      {enableMarchingAnts && (
        <path
          className="flowcraft-edge-flow"
          d={edgePath}
          style={{ stroke: selected ? '#FFFBEB' : '#FFFFFF' }}
        />
      )}

      {/* SVG Arrowhead Marker */}
      <defs>
        <marker
          id={`arrow-${id}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill={strokeColor} className="flowcraft-edge-arrow" />
        </marker>
      </defs>

      {/* Edge Label Rendered outside SVG */}
      <EdgeLabelRenderer>
        <div
          className={`flowcraft-edge-label-wrapper nodrag nopan ${selected ? 'selected' : ''}`}
          style={{ transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)` }}
          onClick={(e) => { e.stopPropagation(); selectEdge(id); }}
          onDoubleClick={startEditing}
        >
          {editing ? (
            <input
              ref={inputRef}
              className="flowcraft-edge-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitLabel}
              onKeyDown={handleKeyDown}
              style={{ width: Math.max(65, draft.length * 8 + 20) }}
            />
          ) : (
            <div className="flowcraft-edge-badge" style={{ borderColor: `${strokeColor}66` }}>
              <span className="flowcraft-edge-text" style={{ color: strokeColor }}>
                {displayLabel || 'connected to'}
              </span>
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export const MasterFlowEdge = memo(MasterFlowEdgeComponent);
export default MasterFlowEdge;
