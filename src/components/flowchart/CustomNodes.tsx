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
    <div className="relative flex items-center justify-center bg-[#D4995A] border-2 border-[#1A1814] text-[#1A1814] font-bold text-sm px-6 py-3 min-w-[120px] rounded-[50px] shadow-sm group">
      <Handle type="target" position={targetPos} className="!bg-[#1A1814]" />
      <div className="text-center w-full">{data.label}</div>
      <button 
        className="absolute -right-2 -top-2 bg-[#1A1814] text-[#D4995A] rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:scale-110 nodrag"
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
    <div className="relative flex items-center justify-center bg-[#8FA88A] border-2 border-[#1A1814] text-[#1A1814] font-bold text-sm px-4 py-3 min-w-[140px] rounded-sm shadow-sm group">
      <Handle type="target" position={targetPos} className="!bg-[#1A1814]" />
      <div className="text-center w-full">{data.label}</div>
      <button 
        className="absolute -right-2 -top-2 bg-[#1A1814] text-[#8FA88A] rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:scale-110 nodrag"
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
    <div className="relative flex items-center justify-center min-w-[120px] min-h-[80px] group">
      <Handle type="target" position={targetPos} className="!bg-[#1A1814] z-10" />
      {/* Inverted Triangle SVG */}
      <svg className="absolute inset-0 w-full h-full drop-shadow-sm" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points="0,0 100,0 50,100" fill="#C66B5E" stroke="#1A1814" strokeWidth="2" />
      </svg>
      <div className="relative z-10 text-[#1A1814] font-bold text-sm text-center px-4 pb-2 w-full truncate">
        {data.label}
      </div>
      <button 
        className="absolute right-0 top-0 bg-[#1A1814] text-[#C66B5E] rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:scale-110 nodrag"
        onClick={(e) => {
          e.stopPropagation();
          if (data.onAddSubnode) data.onAddSubnode(id, 'location');
        }}
        title="Add Related Entity"
      >
        <Plus size={14} />
      </button>
      <Handle type="source" position={sourcePos} className="!bg-[#1A1814] z-10" />
    </div>
  );
}
