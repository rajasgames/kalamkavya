import { useRef, useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  SelectionMode,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  addEdge,
  MarkerType,
} from '@xyflow/react';
import dagre from 'dagre';
import { useStoryStore } from '@/stores/storyStore';
import useMasterFlowStore from './masterFlowStore';
import { MasterFlowNode, type MasterFlowNodeData } from './MasterFlowNode';
import { MasterFlowEdge } from './MasterFlowEdge';
import { MasterFlowContextMenu } from './MasterFlowContextMenu';
import { MasterFlowToolbar } from './MasterFlowToolbar';
import { getEntityTypeConfig, getRelationshipColor } from './entityTypeConfig';
import './MasterFlowStyles.css';

// ─── Node / Edge type registration ───────────────────────────────────────────

const nodeTypes = { masterEntity: MasterFlowNode };
const edgeTypes  = { masterRelation: MasterFlowEdge };

// ─── Dagre auto-layout helper ─────────────────────────────────────────────────

const autoLayout = (
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR'
): Node[] => {
  if (nodes.length === 0) return nodes;

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep: 80, ranksep: 130, ranker: 'tight-tree' });

  nodes.forEach(n => g.setNode(n.id, { width: 190, height: 70 }));
  edges.forEach(e => g.setEdge(e.source, e.target));

  dagre.layout(g);

  return nodes.map(n => {
    const pos = g.node(n.id);
    if (!pos) return n;
    return { ...n, position: { x: pos.x - 95, y: pos.y - 35 } };
  });
};

// ─── Export helpers ───────────────────────────────────────────────────────────

const exportJSON = (entities: ReturnType<typeof useStoryStore.getState>['entities'],
                    relationships: ReturnType<typeof useStoryStore.getState>['relationships']) => {
  const data = {
    entities: entities.map(e => ({ id: e.id, name: e.name, type: e.type, entityClass: e.entityClass })),
    relationships: relationships.map(r => ({ id: r.id, from: r.fromEntityId, to: r.toEntityId, type: r.type })),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'world-bible-flowchart.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface MasterFlowCanvasProps {
  onEntitySelect?: (entityId: string) => void;
  onRequestAddEntity?: (defaultType?: string) => void;
}

// ─── Inner canvas (needs ReactFlowProvider context) ───────────────────────────

const MasterFlowCanvasInner = ({ onEntitySelect, onRequestAddEntity }: MasterFlowCanvasProps) => {
  const { fitView, screenToFlowPosition } = useReactFlow();

  const { activeProjectId, entities, relationships } = useStoryStore();
  const {
    positions, setPositions, loadPositions, savePositions, clearPositions,
    layoutDirection, showAllEdges,
  } = useMasterFlowStore();

  // Local RF state
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Context menu state
  const canvasRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState<{
    top?: number; left?: number; right?: number; bottom?: number;
    flowPosition: { x: number; y: number };
  } | null>(null);

  // Track whether we've done the initial dagre layout for this project
  const hasInitialLayout = useRef(false);
  const prevProjectId = useRef<string | null>(null);

  // ── Load positions when active project changes ──────────────────────────────
  useEffect(() => {
    if (activeProjectId !== prevProjectId.current) {
      prevProjectId.current = activeProjectId;
      hasInitialLayout.current = false;
      if (activeProjectId) {
        loadPositions(activeProjectId);
      }
    }
  }, [activeProjectId, loadPositions]);

  // ── Build RF nodes/edges from storyStore entities ───────────────────────────
  useEffect(() => {
    if (!activeProjectId) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const projEntities   = entities.filter(e => e.projectId === activeProjectId);
    const projRelationships = relationships.filter(r => r.projectId === activeProjectId);

    // Build RF nodes from entities
    let rfNodes: Node[] = projEntities.map(entity => {
      const savedPos = positions[entity.id];
      return {
        id: entity.id,
        type: 'masterEntity',
        position: savedPos ?? { x: 0, y: 0 },
        data: {
          entityId: entity.id,
          name: entity.name,
          entityType: entity.type,
          entityClass: entity.entityClass ?? 'INSTANCE',
          onEntitySelect,
        } satisfies MasterFlowNodeData,
      };
    });

    // Build RF edges from relationships
    const nodeIds = new Set(rfNodes.map(n => n.id));
    const rfEdges: Edge[] = projRelationships
      .filter(r => nodeIds.has(r.fromEntityId) && nodeIds.has(r.toEntityId))
      .map(r => {
        const color = getRelationshipColor(r.type);
        const isHierarchy = r.type.toUpperCase().includes('HIERARCHY') ||
                            r.type.toUpperCase().includes('INHERITS')  ||
                            r.type.toUpperCase().includes('DESCENDED');
        return {
          id: r.id,
          source: r.fromEntityId,
          target: r.toEntityId,
          type: 'masterRelation',
          markerEnd: { type: MarkerType.ArrowClosed, color },
          style: { stroke: color },
          data: {
            label: r.metadata?.label as string | undefined,
            relationshipType: r.type,
            isHierarchy,
          },
        };
      });

    const visibleEdges = showAllEdges
      ? rfEdges
      : rfEdges.filter(e => (e.data as { isHierarchy?: boolean })?.isHierarchy);

    // Run dagre layout ONCE for new projects / first load when no positions saved
    const noSavedPositions = rfNodes.every(n => !positions[n.id]);
    if (!hasInitialLayout.current && rfNodes.length > 0 && noSavedPositions) {
      rfNodes = autoLayout(rfNodes, rfEdges, layoutDirection);
      hasInitialLayout.current = true;
      // Persist these computed positions
      const newPositions: Record<string, { x: number; y: number }> = {};
      rfNodes.forEach(n => { newPositions[n.id] = n.position; });
      setPositions(newPositions);
      savePositions(activeProjectId, newPositions);
    } else {
      // Apply saved positions (preserve existing for known entities)
      rfNodes = rfNodes.map(n => ({
        ...n,
        position: positions[n.id] ?? n.position,
      }));
      hasInitialLayout.current = true;
    }

    setNodes(rfNodes);
    setEdges(visibleEdges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProjectId, entities, relationships, showAllEdges]);
  // Note: `positions` intentionally excluded — we only want external store changes
  // (not drag updates) to re-trigger the build. Drag positions are applied via onNodesChange.

  // ── Node/Edge change handlers ───────────────────────────────────────────────
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes(nds => {
      const updated = applyNodeChanges(changes, nds);
      // Persist position changes
      const posChanges = changes.filter(c => c.type === 'position' && c.position);
      if (posChanges.length > 0 && activeProjectId) {
        const newPositions = { ...positions };
        posChanges.forEach(c => {
          if (c.type === 'position' && c.position) {
            newPositions[c.id] = c.position;
          }
        });
        // Debounce handled by the store / localStorage
        savePositions(activeProjectId, newPositions);
        setPositions(newPositions);
      }
      return updated;
    });
  }, [activeProjectId, positions, savePositions, setPositions]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges(eds => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target || connection.source === connection.target) return;
    const color = '#A1A1AA';
    setEdges(eds => addEdge({
      ...connection,
      type: 'masterRelation',
      markerEnd: { type: MarkerType.ArrowClosed, color },
      style: { stroke: color },
      data: { relationshipType: 'CONNECTED', isHierarchy: false },
    }, eds));
  }, []);

  // ── Keyboard shortcuts ──────────────────────────────────────────────────────
  useEffect(() => {
    const { undo, redo } = useMasterFlowStore.temporal.getState();
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement;
      const isTyping = active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA' || active?.isContentEditable;
      if (isTyping) return;
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Context menu ────────────────────────────────────────────────────────────
  const onPaneContextMenu = useCallback((e: React.MouseEvent | MouseEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const pane = canvasRef.current.getBoundingClientRect();
    let top: number | undefined  = e.clientY - pane.top;
    let left: number | undefined = e.clientX - pane.left;
    const right  = left  > pane.width  - 220 ? pane.width  - left  : undefined;
    const bottom = top   > pane.height - 220 ? pane.height - top   : undefined;
    if (right  !== undefined) left = undefined;
    if (bottom !== undefined) top  = undefined;
    setMenu({ top, left, right, bottom, flowPosition: screenToFlowPosition({ x: e.clientX, y: e.clientY }) });
  }, [screenToFlowPosition]);

  const onPaneClick = useCallback(() => setMenu(null), []);

  // ── Auto arrange ────────────────────────────────────────────────────────────
  const handleAutoArrange = useCallback(() => {
    const arranged = autoLayout(nodes, edges, layoutDirection);
    setNodes(arranged);
    if (activeProjectId) {
      const newPositions: Record<string, { x: number; y: number }> = {};
      arranged.forEach(n => { newPositions[n.id] = n.position; });
      setPositions(newPositions);
      savePositions(activeProjectId, newPositions);
    }
    setTimeout(() => fitView({ padding: 0.15, duration: 400 }), 50);
  }, [nodes, edges, layoutDirection, activeProjectId, setPositions, savePositions, fitView]);

  // ── Export ──────────────────────────────────────────────────────────────────
  const handleExportJSON = useCallback(() => {
    const { entities: ents, relationships: rels } = useStoryStore.getState();
    exportJSON(ents, rels);
  }, []);

  // ── Empty state ─────────────────────────────────────────────────────────────
  const hasEntities = entities.filter(e => e.projectId === activeProjectId).length > 0;

  return (
    <div className="master-flow-canvas-wrapper" ref={canvasRef}>
      <MasterFlowToolbar
        onExportJSON={handleExportJSON}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onPaneContextMenu={onPaneContextMenu}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        panOnDrag={[1, 2]}
        selectionOnDrag
        selectionMode={SelectionMode.Partial}
        deleteKeyCode={['Delete', 'Backspace']}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.1}
        maxZoom={3}
        defaultEdgeOptions={{ type: 'masterRelation' }}
      >
        <Background color="var(--border-subtle)" variant={BackgroundVariant.Dots} gap={20} size={1.5} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={n => {
            const entityType = (n.data as MasterFlowNodeData)?.entityType ?? '';
            return getEntityTypeConfig(entityType).color;
          }}
          nodeStrokeWidth={0}
          maskColor="rgba(0,0,0,0.08)"
          zoomable
          pannable
        />
      </ReactFlow>

      {/* Empty state overlay */}
      {!hasEntities && (
        <div className="master-flow-empty">
          <div className="master-flow-empty__icon">✦</div>
          <div className="master-flow-empty__title">No entities yet</div>
          <div className="master-flow-empty__hint">
            Right-click on the canvas to add your first entity, or add entries from the World Bible sections.
          </div>
        </div>
      )}

      {/* Context menu */}
      {menu && (
        <MasterFlowContextMenu
          top={menu.top}
          left={menu.left}
          right={menu.right}
          bottom={menu.bottom}
          onAddEntity={(type) => onRequestAddEntity?.(type)}
          onAutoArrange={handleAutoArrange}
          onFitView={() => { fitView({ padding: 0.15, duration: 400 }); }}
          onClearLayout={() => {
            if (activeProjectId) clearPositions(activeProjectId);
            hasInitialLayout.current = false;
            handleAutoArrange();
          }}
          onClose={onPaneClick}
        />
      )}
    </div>
  );
};

// ─── Public export (wraps with ReactFlowProvider) ─────────────────────────────

export function MasterFlowCanvas(props: MasterFlowCanvasProps) {
  // ReactFlowProvider is provided by WorldMap.tsx wrapper
  return <MasterFlowCanvasInner {...props} />;
}

export default MasterFlowCanvas;
