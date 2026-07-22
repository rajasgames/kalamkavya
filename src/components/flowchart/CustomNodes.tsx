import { Handle, Position, NodeProps } from 'reactflow';
import { Plus } from 'lucide-react';

export interface EntityNodeData {
  label: string;
  type: string;
  entityClass: string;
  direction?: 'TB' | 'LR';
  onAddSubnode?: (nodeId: string, nodeType: string) => void;
}

export function CharacterNode({ id, data }: NodeProps<EntityNodeData>) {
  const targetPos = data.direction === 'LR' ? Position.Left : Position.Top;
  const sourcePos = data.direction === 'LR' ? Position.Right : Position.Bottom;
  return (
    <div className="relative flex items-center justify-center bg-surface border border-subtle text-primary font-bold text-sm px-6 py-3 min-w-[120px] rounded-[50px] shadow-soft group">
      <Handle type="target" position={targetPos} className="!bg-secondary !w-2 !h-2" />
      <div className="text-center w-full font-serif">{data.label}</div>
      <button 
        className="absolute -right-2 -top-2 bg-surface border border-subtle text-terracotta rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:scale-110 nodrag shadow-sm"
        onClick={(e) => {
          e.stopPropagation();
          if (data.onAddSubnode) data.onAddSubnode(id, 'character');
        }}
        title="Add Related Entity"
      >
        <Plus size={14} />
      </button>
      <Handle type="source" position={sourcePos} className="!bg-[#1A1814]" />
    </div>
  );
}

export function FactionNode({ id, data }: NodeProps<EntityNodeData>) {
  const targetPos = data.direction === 'LR' ? Position.Left : Position.Top;
  const sourcePos = data.direction === 'LR' ? Position.Right : Position.Bottom;
  return (
    <div className="relative flex items-center justify-center bg-surface border border-subtle text-primary font-bold text-sm px-4 py-3 min-w-[140px] rounded-lg shadow-soft group">
      <Handle type="target" position={targetPos} className="!bg-secondary !w-2 !h-2" />
      <div className="text-center w-full font-serif">{data.label}</div>
      <button 
        className="absolute -right-2 -top-2 bg-surface border border-subtle text-sage rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:scale-110 nodrag shadow-sm"
        onClick={(e) => {
          e.stopPropagation();
          if (data.onAddSubnode) data.onAddSubnode(id, 'faction');
        }}
        title="Add Related Entity"
      >
        <Plus size={14} />
      </button>
      <Handle type="source" position={sourcePos} className="!bg-[#1A1814]" />
    </div>
  );
}

export function GeographyNode({ id, data }: NodeProps<EntityNodeData>) {
  const targetPos = data.direction === 'LR' ? Position.Left : Position.Top;
  const sourcePos = data.direction === 'LR' ? Position.Right : Position.Bottom;
  return (
    <div className="relative flex items-center justify-center bg-surface border border-subtle text-primary font-bold text-sm px-4 py-3 min-w-[120px] rounded-sm shadow-soft group">
      <Handle type="target" position={targetPos} className="!bg-secondary !w-2 !h-2 z-10" />
      <div className="text-center w-full font-serif truncate">{data.label}</div>
      <button 
        className="absolute -right-2 -top-2 bg-surface border border-subtle text-clay rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:scale-110 nodrag shadow-sm"
        onClick={(e) => {
          e.stopPropagation();
          if (data.onAddSubnode) data.onAddSubnode(id, 'location');
        }}
        title="Add Related Entity"
      >
        <Plus size={14} />
      </button>
      <Handle type="source" position={sourcePos} className="!bg-secondary !w-2 !h-2 z-10" />
    </div>
  );
}
