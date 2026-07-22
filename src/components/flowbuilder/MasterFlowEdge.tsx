import { useState, useRef, useCallback, memo } from 'react';
import {
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
  type Edge,
} from '@xyflow/react';
import { getRelationshipColor } from './entityTypeConfig';

// ─── Type declarations ────────────────────────────────────────────────────────

export type MasterFlowEdgeData = {
  label?: string;
  relationshipType?: string;
  isHierarchy?: boolean;
};

export type MasterFlowEdge = Edge<MasterFlowEdgeData, 'masterRelation'>;

// ─── Component ────────────────────────────────────────────────────────────────

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

  const relType = data?.relationshipType ?? '';
  const strokeColor = getRelationshipColor(relType);
  const isHierarchy = data?.isHierarchy ?? false;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  const startEditing = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDraft(data?.label ?? data?.relationshipType ?? '');
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [data]);

  const commitLabel = useCallback(() => {
    // Label edits reflect in the display; underlying relationship type stays in storyStore
    setEditing(false);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitLabel();
    if (e.key === 'Escape') setEditing(false);
  };

  const displayLabel = data?.label || relType.replace(/_/g, ' ');

  return (
    <>
      {/* Edge path */}
      <path
        id={id}
        className={`master-flow-edge-path${selected ? ' master-flow-edge-path--selected' : ''}`}
        style={{
          stroke: strokeColor,
          strokeDasharray: isHierarchy ? undefined : '0',
        }}
        d={edgePath}
        onClick={e => { if (e.detail === 2) startEditing(e); }}
      />

      {/* Arrow head marker inline */}
      <defs>
        <marker
          id={`arrow-${id}`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={strokeColor} />
        </marker>
      </defs>

      {/* Edge label via EdgeLabelRenderer (renders outside SVG) */}
      <EdgeLabelRenderer>
        <div
          className={`master-flow-edge-label nodrag nopan${selected ? ' master-flow-edge-label--selected' : ''}`}
          style={{ transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)` }}
          onDoubleClick={startEditing}
        >
          {editing ? (
            <input
              ref={inputRef}
              className="master-flow-edge-input"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onBlur={commitLabel}
              onKeyDown={handleKeyDown}
              style={{ width: Math.max(60, draft.length * 7 + 24) }}
            />
          ) : (
            <>
              {displayLabel && (
                <span
                  className="master-flow-edge-text"
                  style={{ color: strokeColor, borderColor: `${strokeColor}40` }}
                >
                  {displayLabel}
                </span>
              )}
              {selected && !displayLabel && (
                <span className="master-flow-edge-add">+ label</span>
              )}
            </>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export const MasterFlowEdge = memo(MasterFlowEdgeComponent);
export default MasterFlowEdge;
