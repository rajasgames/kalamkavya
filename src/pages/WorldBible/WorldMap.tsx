import { ReactFlowProvider } from '@xyflow/react';
import { MasterFlowCanvas } from '@/components/flowbuilder';

interface WorldMapProps {
  onEntitySelect?: (entityId: string) => void;
  onRequestAddEntity?: (defaultType?: string) => void;
}

/**
 * WorldMap — the "Relationships" view inside the World Bible.
 *
 * Previously a basic static grid (reactflow v11).
 * Now a full interactive Master Flowchart powered by @xyflow/react v12,
 * showing all World Bible entities as color-coded nodes connected by their
 * defined relationships, with drag-to-arrange, undo/redo, and auto-layout.
 */
export function WorldMap({ onEntitySelect, onRequestAddEntity }: WorldMapProps) {
  return (
    <ReactFlowProvider>
      <MasterFlowCanvas
        onEntitySelect={onEntitySelect}
        onRequestAddEntity={onRequestAddEntity}
      />
    </ReactFlowProvider>
  );
}
