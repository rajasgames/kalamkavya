import { useMemo } from 'react';
import ReactFlow, { 
  MiniMap, 
  Controls,
  useNodesState, 
  useEdgesState,
  Node,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStoryStore } from '@/stores/storyStore';
import { useUIStore } from '@/stores/uiStore';

// Custom colors based on entity types
const getEntityColor = (type: string) => {
  switch (type) {
    case 'character': return '#3b82f6';
    case 'location': return '#10b981';
    case 'item': return '#f59e0b';
    case 'lore': return '#8b5cf6';
    default: return '#6b7280';
  }
};

export function WorldMap() {
  const { entities, relationships } = useStoryStore();
  const theme = useUIStore(state => state.theme);

  // Derive nodes from entities
  const initialNodes: Node[] = useMemo(() => {
    return entities.map((entity, i) => ({
      id: entity.id,
      position: { x: (i % 5) * 200, y: Math.floor(i / 5) * 150 }, // simple grid layout
      data: { label: entity.name },
      style: {
        background: 'var(--bg-canvas)',
        color: 'var(--text-primary)',
        border: `1px solid var(--border-subtle)`,
        borderRadius: '8px',
        padding: '10px',
        fontWeight: 'normal',
        fontFamily: 'var(--font-sans)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      },
    }));
  }, [entities, theme]);

  // Derive edges from relationships
  const initialEdges: Edge[] = useMemo(() => {
    return relationships.map(rel => ({
      id: rel.id,
      source: rel.fromEntityId,
      target: rel.toEntityId,
      label: rel.metadata?.label as string || rel.type,
      type: 'smoothstep',
      animated: true,
      style: { stroke: 'var(--border-subtle)', strokeWidth: 1 },
      labelStyle: { fill: 'var(--text-secondary)', fontWeight: 400, fontSize: 12, fontFamily: 'var(--font-sans)' },
      labelBgStyle: { fill: 'var(--bg-surface)', fillOpacity: 0.8 },
    }));
  }, [relationships, theme]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Auto-update when store data changes
  useMemo(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div className="h-full w-full bg-canvas rounded-2xl border border-subtle overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Controls className="bg-surface border border-subtle" />
        <MiniMap 
          nodeColor={(n) => {
            const entity = entities.find(e => e.id === n.id);
            return entity ? getEntityColor(entity.type) : '#eee';
          }}
          maskColor={'rgba(0, 0, 0, 0.1)'}
          className="bg-surface border border-subtle"
        />
      </ReactFlow>
    </div>
  );
}
