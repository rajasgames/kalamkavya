import { useRef, useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  SelectionMode,
  Position,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';
import dagre from 'dagre';
import { useStoryStore } from '@/stores/storyStore';
import useMasterFlowStore from './masterFlowStore';
import { MasterFlowNode, type MasterFlowNodeData } from './MasterFlowNode';
import { MasterFlowEdge } from './MasterFlowEdge';
import { MasterFlowContextMenu } from './MasterFlowContextMenu';
import { MasterFlowToolbar } from './MasterFlowToolbar';
import { MasterFlowInspector } from './MasterFlowInspector';
import { MasterFlowExportModal } from './MasterFlowExportModal';
import { MasterFlowShortcuts } from './MasterFlowShortcuts';
import { MasterFlowToasts } from './MasterFlowToasts';
import { getEntityTypeConfig, getRelationshipColor } from './entityTypeConfig';
import './MasterFlowStyles.css';

// ─── Node / Edge type registration ───────────────────────────────────────────

const nodeTypes = { masterEntity: MasterFlowNode };
const edgeTypes = { masterRelation: MasterFlowEdge };

// ─── Dagre auto-layout helper ─────────────────────────────────────────────────

const autoLayout = (
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR'
): Node[] => {
  if (nodes.length === 0) return nodes;

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep: 90, ranksep: 140, ranker: 'tight-tree' });

  nodes.forEach(n => g.setNode(n.id, { width: 248, height: 110 }));
  edges.forEach(e => g.setEdge(e.source, e.target));

  dagre.layout(g);

  const targetPosition = direction === 'TB' ? Position.Top : Position.Left;
  const sourcePosition = direction === 'TB' ? Position.Bottom : Position.Right;

  return nodes.map(n => {
    const pos = g.node(n.id);
    if (!pos) return n;
    return {
      ...n,
      targetPosition,
      sourcePosition,
      position: { x: pos.x - 124, y: pos.y - 55 },
    };
  });
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface MasterFlowCanvasProps {
  onEntitySelect?: (entityId: string) => void;
  onRequestAddEntity?: (defaultType?: string) => void;
}

// ─── Inner canvas (needs ReactFlowProvider context) ───────────────────────────

const MasterFlowCanvasInner = ({ onEntitySelect, onRequestAddEntity }: MasterFlowCanvasProps) => {
  const { fitView, screenToFlowPosition } = useReactFlow();

  const { activeProjectId, entities, relationships, addEntity, addRelationship } = useStoryStore();
  const {
    positions, setPositions, loadPositions, savePositions, clearPositions,
    layoutDirection, showAllEdges, selectNode, selectEdge,
    addToast, selectedNodeId, selectedEdgeId,
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

  // Track initial dagre layout
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

    const projEntities = entities.filter(e => e.projectId === activeProjectId);
    const projRelationships = relationships.filter(r => r.projectId === activeProjectId);

    const targetPos = layoutDirection === 'TB' ? Position.Top : Position.Left;
    const sourcePos = layoutDirection === 'TB' ? Position.Bottom : Position.Right;

    // Build RF nodes from entities
    let rfNodes: Node[] = projEntities.map(entity => {
      const savedPos = positions[entity.id];
      const isSelected = entity.id === selectedNodeId;
      const desc = ((entity.data as Record<string, unknown>)?.notes || (entity.data as Record<string, unknown>)?.description || '') as string;
      return {
        id: entity.id,
        type: 'masterEntity',
        position: savedPos ?? { x: 100, y: 100 },
        targetPosition: targetPos,
        sourcePosition: sourcePos,
        selected: isSelected,
        data: {
          entityId: entity.id,
          name: entity.name,
          description: desc,
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
        const isSelected = r.id === selectedEdgeId;
        const color = getRelationshipColor(r.type);
        const isHierarchy = r.type.toUpperCase().includes('HIERARCHY') ||
                            r.type.toUpperCase().includes('INHERITS')  ||
                            r.type.toUpperCase().includes('DESCENDED');
        return {
          id: r.id,
          source: r.fromEntityId,
          target: r.toEntityId,
          type: 'masterRelation',
          selected: isSelected,
          style: { stroke: color },
          data: {
            relationshipId: r.id,
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
      const newPositions: Record<string, { x: number; y: number }> = {};
      rfNodes.forEach(n => { newPositions[n.id] = n.position; });
      setPositions(newPositions);
      savePositions(activeProjectId, newPositions);
    } else {
      rfNodes = rfNodes.map(n => ({
        ...n,
        position: positions[n.id] ?? n.position,
        targetPosition: targetPos,
        sourcePosition: sourcePos,
      }));
      hasInitialLayout.current = true;
    }

    setNodes(rfNodes);
    setEdges(visibleEdges);
  }, [
    activeProjectId,
    entities,
    relationships,
    showAllEdges,
    layoutDirection,
    selectedNodeId,
    selectedEdgeId,
    onEntitySelect,
    positions,
    savePositions,
    setPositions,
  ]);

  // ── Node/Edge change handlers ───────────────────────────────────────────────
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes(nds => {
      const updated = applyNodeChanges(changes, nds);
      const posChanges = changes.filter(c => c.type === 'position' && c.position);
      if (posChanges.length > 0 && activeProjectId) {
        const newPositions = { ...positions };
        posChanges.forEach(c => {
          if (c.type === 'position' && c.position) {
            newPositions[c.id] = c.position;
          }
        });
        savePositions(activeProjectId, newPositions);
        setPositions(newPositions);
      }
      return updated;
    });
  }, [activeProjectId, positions, savePositions, setPositions]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges(eds => applyEdgeChanges(changes, eds));
  }, []);

  // Drag handle to connect edge creation
  const onConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target || connection.source === connection.target || !activeProjectId) return;
    
    const newRelId = crypto.randomUUID();
    addRelationship({
      id: newRelId,
      projectId: activeProjectId,
      fromEntityId: connection.source,
      toEntityId: connection.target,
      type: 'CONNECTED_TO',
      directed: true,
      metadata: {},
    });

    addToast('Created new relationship link', 'success');
    selectEdge(newRelId);
  }, [activeProjectId, addRelationship, addToast, selectEdge]);

  // Node & Edge selection click handlers
  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    selectNode(node.id);
  }, [selectNode]);

  const handleEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    selectEdge(edge.id);
  }, [selectEdge]);

  const handlePaneClick = useCallback(() => {
    selectNode(null);
    setMenu(null);
  }, [selectNode]);

  // Double click canvas to add node
  const handlePaneDoubleClick = useCallback((e: React.MouseEvent) => {
    if (!activeProjectId) return;
    const flowPos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    const newId = crypto.randomUUID();

    addEntity({
      id: newId,
      projectId: activeProjectId,
      name: 'New Process Spec',
      type: 'CHARACTER',
      entityClass: 'INSTANCE',
      categorySlug: 'characters',
      data: { notes: 'Technical spec notes...' },
      hasAIRule: false,
    });

    const newPositions = { ...positions, [newId]: flowPos };
    setPositions(newPositions);
    savePositions(activeProjectId, newPositions);

    addToast('Created new node', 'success');
    selectNode(newId);
  }, [activeProjectId, screenToFlowPosition, addEntity, positions, setPositions, savePositions, addToast, selectNode]);

  // ── Context Menu handlers ──────────────────────────────────────────────────
  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const flowPos = screenToFlowPosition({ x: e.clientX, y: e.clientY });

    setMenu({
      left: x < rect.width - 220 ? x : undefined,
      right: x >= rect.width - 220 ? rect.width - x : undefined,
      top: y < rect.height - 240 ? y : undefined,
      bottom: y >= rect.height - 240 ? rect.height - y : undefined,
      flowPosition: flowPos,
    });
  }, [screenToFlowPosition]);

  const handleAddEntityFromMenu = useCallback((entityType: string) => {
    if (!activeProjectId) return;
    const pos = menu?.flowPosition ?? { x: 200, y: 200 };
    
    if (onRequestAddEntity) {
      onRequestAddEntity(entityType);
    } else {
      const cfg = getEntityTypeConfig(entityType);
      const newId = crypto.randomUUID();
      addEntity({
        id: newId,
        projectId: activeProjectId,
        name: `New ${cfg.label}`,
        type: entityType,
        entityClass: 'INSTANCE',
        categorySlug: `${entityType.toLowerCase()}s`,
        data: {},
        hasAIRule: false,
      });
      const newPositions = { ...positions, [newId]: pos };
      setPositions(newPositions);
      savePositions(activeProjectId, newPositions);
      addToast(`Added ${cfg.label} node`, 'success');
      selectNode(newId);
    }
  }, [activeProjectId, menu, onRequestAddEntity, addEntity, positions, setPositions, savePositions, addToast, selectNode]);

  // Auto-arrange whole canvas using Dagre
  const handleAutoArrange = useCallback(() => {
    if (nodes.length === 0) return;
    const arranged = autoLayout(nodes, edges, layoutDirection);
    setNodes(arranged);

    if (activeProjectId) {
      const newPositions: Record<string, { x: number; y: number }> = {};
      arranged.forEach(n => { newPositions[n.id] = n.position; });
      setPositions(newPositions);
      savePositions(activeProjectId, newPositions);
    }
    setTimeout(() => fitView({ padding: 0.2, duration: 300 }), 50);
    addToast('Auto-arranged blueprint layout', 'info');
  }, [nodes, edges, layoutDirection, activeProjectId, setPositions, savePositions, fitView, addToast]);

  const handleClearLayout = useCallback(() => {
    if (!activeProjectId) return;
    clearPositions(activeProjectId);
    handleAutoArrange();
    addToast('Reset node positions', 'info');
  }, [activeProjectId, clearPositions, handleAutoArrange, addToast]);

  return (
    <div ref={canvasRef} className="master-flow-canvas-wrapper" onContextMenu={onContextMenu}>
      {/* Floating Blueprint Toolbar */}
      <MasterFlowToolbar onAddNode={handleAddEntityFromMenu} />

      {/* Main ReactFlow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        onDoubleClick={handlePaneDoubleClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        selectionMode={SelectionMode.Partial}
        panOnScroll={false}
        panOnDrag={true}
        deleteKeyCode={['Backspace', 'Delete']}
        minZoom={0.15}
        maxZoom={2.5}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.2} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(n) => {
            const data = n.data as MasterFlowNodeData | undefined;
            return getEntityTypeConfig(data?.entityType || '').color;
          }}
          maskColor="rgba(10, 17, 32, 0.75)"
        />
      </ReactFlow>

      {/* Blueprint Empty State when project has no nodes */}
      {nodes.length === 0 && (
        <div className="flowcraft-empty-state">
          <h2>Blueprint Canvas Empty</h2>
          <p className="mb-4">Double-click canvas or use <kbd>+ Add Node</kbd> to draft your process diagram</p>
          <button className="btn btn-primary pointer-events-auto" onClick={() => handleAddEntityFromMenu('CHARACTER')}>
            + Add Initial Node
          </button>
        </div>
      )}

      {/* Context Menu */}
      {menu && (
        <MasterFlowContextMenu
          {...menu}
          onAddEntity={handleAddEntityFromMenu}
          onAutoArrange={handleAutoArrange}
          onFitView={() => fitView({ padding: 0.2, duration: 300 })}
          onClearLayout={handleClearLayout}
          onClose={() => setMenu(null)}
        />
      )}

      {/* Sliding Inspector Panel */}
      <MasterFlowInspector onEntitySelect={onEntitySelect} />

      {/* Export Modal */}
      <MasterFlowExportModal />

      {/* Keyboard Shortcuts Cheatsheet */}
      <MasterFlowShortcuts />

      {/* Notification Toast Banners */}
      <MasterFlowToasts />
    </div>
  );
};

// ─── Exported outer wrapper ───────────────────────────────────────────────────

export function MasterFlowCanvas(props: MasterFlowCanvasProps) {
  return <MasterFlowCanvasInner {...props} />;
}

export default MasterFlowCanvas;
