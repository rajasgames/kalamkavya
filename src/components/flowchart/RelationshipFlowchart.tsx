import { useEffect, useCallback, useState, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  MarkerType,
  useNodesState,
  useEdgesState,
  Panel,
  Connection,
  ReactFlowInstance,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { useStoryStore } from '@/stores/storyStore';
import { CharacterNode, FactionNode, GeographyNode } from './CustomNodes';
import ContextMenu from './ContextMenu';
import { Entity, Relationship } from '@/types';

const nodeTypes = {
  character: CharacterNode,
  faction: FactionNode,
  geography: GeographyNode,
};

interface FlowchartProps {
  onNodeDoubleClick?: (entityId: string) => void;
}

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  dagreGraph.setGraph({ rankdir: direction, nodesep: 100, ranksep: 150, ranker: 'tight-tree' });

  nodes.forEach((node) => {
    const w = node.type === 'faction' ? 140 : 120;
    const h = node.type === 'geography' ? 40 : 40;
    dagreGraph.setNode(node.id, { width: w, height: h });
  });

  edges.forEach((edge) => {
    if (edge.data?.isHierarchy) {
      dagreGraph.setEdge(edge.source, edge.target);
    }
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const w = node.type === 'faction' ? 140 : 120;
    const h = node.type === 'geography' ? 40 : 40;
    
    node.position = {
      x: nodeWithPosition.x - w / 2,
      y: nodeWithPosition.y - h / 2,
    };
  });

  return { nodes, edges };
};

const getEdgeStyle = (type: string) => {
  const t = type.toUpperCase();
  if (t === 'ALLY') return 'var(--sage)';
  if (t === 'ENEMY') return 'var(--terracotta)';
  if (t === 'MEMBER_OF') return 'var(--text-secondary)';
  if (t === 'LOCATED_AT') return 'var(--text-ghost)';
  if (t === 'INHERITS_FROM' || t === 'BELONGS_TO_LINEAGE' || t === 'DESCENDED_FROM') return 'var(--text-secondary)';
  if (t === 'BLESSED_BY' || t === 'INCARNATION_OF') return 'var(--sage)';
  if (t === 'PRACTICES_PATH' || t === 'WIELDS_ASTRA') return 'var(--terracotta)';
  return 'var(--text-ghost)';
};

export function RelationshipFlowchart({ onNodeDoubleClick }: FlowchartProps) {
  const { activeProjectId, entities, relationships, addEntity, addRelationship } = useStoryStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [layoutDirection, setLayoutDirection] = useState<'TB' | 'LR'>('TB');
  const [showAllEdges, setShowAllEdges] = useState(true);

  const [menu, setMenu] = useState<any>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const hasLayoutedRef = useRef(false);

  const handleAddSubnode = useCallback((parentId: string, nodeType: string) => {
    if (!activeProjectId) return;
    const parentNode = nodes.find(n => n.id === parentId);
    if (!parentNode) return;

    const newId = crypto.randomUUID();
    const newEntity: Entity = {
      id: newId,
      projectId: activeProjectId,
      name: 'New Entity',
      type: nodeType === 'character' ? 'CHARACTER' : nodeType === 'faction' ? 'FACTION' : 'LOCATION',
      entityClass: 'INSTANCE',
      categorySlug: nodeType === 'character' ? 'characters' : nodeType === 'faction' ? 'factions' : 'locations',
      data: {},
      hasAIRule: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // Add entity to store
    addEntity(newEntity);

    // Create relationship
    const newRel: Relationship = {
      id: crypto.randomUUID(),
      projectId: activeProjectId,
      fromEntityId: parentId,
      toEntityId: newId,
      type: 'MEMBER_OF', // Default relationship
      directed: true,
      metadata: {}
    };
    addRelationship(newRel);

    // We manually add the node with position relative to parent to avoid waiting for useEffect and losing position intention
    const xOffset = layoutDirection === 'TB' ? 50 : 200;
    const yOffset = layoutDirection === 'TB' ? 180 : 50;
    
    const newNode: Node = {
      id: newId,
      type: nodeType,
      targetPosition: layoutDirection === 'TB' ? Position.Top : Position.Left,
      sourcePosition: layoutDirection === 'TB' ? Position.Bottom : Position.Right,
      position: { x: parentNode.position.x + xOffset, y: parentNode.position.y + yOffset },
      data: { label: 'New Entity', type: newEntity.type, entityClass: 'INSTANCE', direction: layoutDirection, onAddSubnode: handleAddSubnode }
    };
    setNodes(nds => [...nds, newNode]);
  }, [activeProjectId, nodes, layoutDirection, addEntity, addRelationship, setNodes]);

  useEffect(() => {
    if (!activeProjectId) return;

    const projRels = relationships.filter(r => r.projectId === activeProjectId);
    const projEntities = entities.filter(e => e.projectId === activeProjectId);
    
    const nodeMap = new Map();
    const existingNodeMap = new Map(nodes.map(n => [n.id, n]));

    projEntities.forEach(e => {
      let nType = 'faction';
      const t = e.type.toLowerCase();
      if (t === 'character') nType = 'character';
      else if (t === 'location' || t === 'region' || t === 'landmark' || t === 'geography') nType = 'geography';
      
      const existing = existingNodeMap.get(e.id);
      
      nodeMap.set(e.id, {
        id: e.id,
        type: nType,
        targetPosition: layoutDirection === 'TB' ? 'top' : 'left',
        sourcePosition: layoutDirection === 'TB' ? 'bottom' : 'right',
        data: { 
          label: e.name, 
          type: e.type, 
          entityClass: e.entityClass || 'INSTANCE', 
          direction: layoutDirection,
          onAddSubnode: handleAddSubnode
        },
        position: existing ? existing.position : { x: 0, y: 0 },
      });
    });

    const initialEdges: Edge[] = [];
    projRels.forEach(r => {
      if (nodeMap.has(r.fromEntityId) && nodeMap.has(r.toEntityId)) {
        const stroke = getEdgeStyle(r.type);
        const isHierarchy = r.type.toUpperCase() === 'HIERARCHY';
        initialEdges.push({
          id: r.id,
          source: r.fromEntityId,
          target: r.toEntityId,
          type: 'step',
          style: { stroke, strokeWidth: 1, strokeDasharray: isHierarchy ? undefined : '5,5' },
          markerEnd: { type: MarkerType.ArrowClosed, color: stroke },
          label: r.type.replace(/_/g, ' '),
          labelStyle: { fill: 'var(--text-secondary)', fontWeight: 400, fontSize: 10, fontFamily: 'var(--font-sans)' },
          labelBgStyle: { fill: 'var(--bg-surface)', fillOpacity: 0.8 },
          data: { isHierarchy }
        });
      }
    });

    let finalNodes = Array.from(nodeMap.values());
    let finalEdges = initialEdges;

    // Run dagre layout ONLY initially if we have no nodes, or if the user clicks a manual re-layout
    if (!hasLayoutedRef.current && finalNodes.length > 0) {
      const layouted = getLayoutedElements(finalNodes, finalEdges, layoutDirection);
      finalNodes = layouted.nodes;
      finalEdges = layouted.edges;
      hasLayoutedRef.current = true;
    }

    const visibleEdges = showAllEdges 
      ? finalEdges 
      : finalEdges.filter(e => e.data?.isHierarchy);

    setNodes(finalNodes);
    setEdges(visibleEdges);
  }, [activeProjectId, entities, relationships, layoutDirection, showAllEdges, handleAddSubnode]); // Exclude setNodes/setEdges to prevent loops

  const forceLayout = useCallback(() => {
    hasLayoutedRef.current = false;
    // Update local state to trigger a layout pass on next render
    setNodes(nds => [...nds]);
  }, [setNodes]);

  const onConnect = useCallback((connection: Connection) => {
    if (!activeProjectId || connection.source === connection.target) return;
    
    const newRel: Relationship = {
      id: crypto.randomUUID(),
      projectId: activeProjectId,
      fromEntityId: connection.source!,
      toEntityId: connection.target!,
      type: 'ALLY', // Default connection type
      directed: true,
      metadata: {}
    };
    addRelationship(newRel);
  }, [activeProjectId, addRelationship]);

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    if (!reactFlowWrapper.current || !reactFlowInstance) return;

    const pane = reactFlowWrapper.current.getBoundingClientRect();
    let top: number | undefined = event.clientY - pane.top;
    let left: number | undefined = event.clientX - pane.left;
    
    let right = left > pane.width - 200 ? pane.width - left : undefined;
    let bottom = top > pane.height - 200 ? pane.height - top : undefined;
    if (right !== undefined) left = undefined;
    if (bottom !== undefined) top = undefined;

    setMenu({
      top,
      left,
      right,
      bottom,
      position: reactFlowInstance.project({
        x: event.clientX - pane.left,
        y: event.clientY - pane.top,
      }) || { x: 0, y: 0 },
    });
  }, [reactFlowInstance]);

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  const handleAddEntity = (type: 'CHARACTER' | 'FACTION' | 'LOCATION') => {
    if (!activeProjectId || !menu) return;
    const newEntity: Entity = {
      id: crypto.randomUUID(),
      projectId: activeProjectId,
      name: `New ${type.charAt(0) + type.slice(1).toLowerCase()}`,
      type: type,
      entityClass: 'INSTANCE',
      categorySlug: type.toLowerCase() + 's',
      data: {},
      hasAIRule: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // Optimistic UI for position
    const newNode: Node = {
      id: newEntity.id,
      type: type.toLowerCase(),
      targetPosition: layoutDirection === 'TB' ? Position.Top : Position.Left,
      sourcePosition: layoutDirection === 'TB' ? Position.Bottom : Position.Right,
      position: menu.position || { x: 0, y: 0 },
      data: { label: newEntity.name, type: newEntity.type, entityClass: 'INSTANCE', direction: layoutDirection, onAddSubnode: handleAddSubnode }
    };
    setNodes(nds => [...nds, newNode]);
    
    addEntity(newEntity);
    setMenu(null);
  };

  const onNodeDoubleClickWrapper = useCallback((_event: React.MouseEvent, node: Node) => {
    if (onNodeDoubleClick) onNodeDoubleClick(node.id);
  }, [onNodeDoubleClick]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-surface" ref={reactFlowWrapper}>
      {entities.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-ghost z-10 pointer-events-none">
          <p>No relationships found for this project.</p>
          <p className="text-sm">Right click to add entities!</p>
        </div>
      ) : null}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPaneClick={onPaneClick}
          onPaneContextMenu={onPaneContextMenu}
          onNodeDoubleClick={onNodeDoubleClickWrapper}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls className="bg-surface border border-subtle" />
          <Panel position="top-right" className="m-4 flex flex-col gap-2">
            <button 
              onClick={() => {
                setLayoutDirection(prev => prev === 'TB' ? 'LR' : 'TB');
                forceLayout();
              }}
              className="bg-base/90 backdrop-blur text-primary px-4 py-2 rounded-lg text-sm border border-subtle shadow-lg hover:border-ghost transition-colors font-medium"
            >
              Toggle Layout ({layoutDirection === 'TB' ? 'Top-Down' : 'Left-Right'})
            </button>
            <button 
              onClick={() => setShowAllEdges(!showAllEdges)}
              className="bg-base/90 backdrop-blur text-primary px-4 py-2 rounded-lg text-sm border border-subtle shadow-lg hover:border-ghost transition-colors font-medium"
            >
              {showAllEdges ? 'Show Only Tree Hierarchy' : 'Show All Cross-Links'}
            </button>
            <button 
              onClick={forceLayout}
              className="bg-base/90 backdrop-blur text-primary px-4 py-2 rounded-lg text-sm border border-subtle shadow-lg hover:border-ghost transition-colors font-medium"
            >
              Re-Layout Graph
            </button>
          </Panel>
          <Panel position="bottom-right" className="bg-base/90 backdrop-blur border border-subtle p-4 rounded-xl shadow-lg pointer-events-none mb-6 mr-6">
            <h4 className="text-xs font-semibold uppercase text-ghost tracking-wider mb-3">Node Types</h4>
            <div className="flex flex-col gap-2 mb-4 text-sm text-secondary">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-surface border border-subtle" /> Character
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-surface rounded-sm border border-subtle" /> Faction
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-surface rounded-none border border-subtle" /> Geography
              </div>
            </div>
            
            <h4 className="text-xs font-semibold uppercase text-ghost tracking-wider mb-3">Edge Types</h4>
            <div className="flex flex-col gap-2 text-sm text-secondary">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-sage" /> Ally / Blessed / Incarnation
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-terracotta" /> Enemy / Practices / Wields
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-secondary" /> Member Of / Inherits / Descends
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-ghost" /> Located At (Default)
              </div>
            </div>
          </Panel>
        </ReactFlow>
      
      {menu && (
        <ContextMenu
          top={menu.top}
          left={menu.left}
          right={menu.right}
          bottom={menu.bottom}
          onClick={onPaneClick}
          onAddCharacter={() => handleAddEntity('CHARACTER')}
          onAddFaction={() => handleAddEntity('FACTION')}
          onAddGeography={() => handleAddEntity('LOCATION')}
        />
      )}
    </div>
  );
}
