import { useMemo } from 'react';
import ReactFlow, { 
  MiniMap, 
  Controls,
  Background,
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
        background: theme === 'dark' ? '#1f2937' : '#ffffff',
        color: theme === 'dark' ? '#f3f4f6' : '#111827',
        border: `2px solid ${getEntityColor(entity.type)}`,
        borderRadius: '8px',
        padding: '10px',
        fontWeight: 'bold',
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
      style: { stroke: theme === 'dark' ? '#4b5563' : '#9ca3af', strokeWidth: 2 },
      labelStyle: { fill: theme === 'dark' ? '#9ca3af' : '#4b5563', fontWeight: 500, fontSize: 12 },
      labelBgStyle: { fill: theme === 'dark' ? '#111827' : '#ffffff', fillOpacity: 0.8 },
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
    <div className="h-full w-full bg-base/50 rounded-2xl border border-white/5 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Controls className="bg-surface border border-white/10" />
        <MiniMap 
          nodeColor={(n) => {
            const entity = entities.find(e => e.id === n.id);
            return entity ? getEntityColor(entity.type) : '#eee';
          }}
          maskColor={theme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)'}
          className="bg-surface border border-white/10"
        />
        <Background color={theme === 'dark' ? '#4b5563' : '#e5e7eb'} gap={16} />
      </ReactFlow>
    </div>
  );
}
