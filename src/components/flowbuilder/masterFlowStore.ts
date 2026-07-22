import { create } from 'zustand';
import { temporal } from 'zundo';

export type Position = { x: number; y: number };
export type LayoutDirection = 'TB' | 'LR';

export interface MasterFlowState {
  /** Saved canvas positions keyed by entity ID */
  positions: Record<string, Position>;
  /** Dagre layout direction */
  layoutDirection: LayoutDirection;
  /** Whether to show all edges or hierarchy-only */
  showAllEdges: boolean;

  // Actions
  setPosition: (id: string, pos: Position) => void;
  setPositions: (positions: Record<string, Position>) => void;
  setLayoutDirection: (dir: LayoutDirection) => void;
  toggleEdgeFilter: () => void;

  // Persistence
  loadPositions: (projectId: string) => void;
  savePositions: (projectId: string, positions: Record<string, Position>) => void;
  clearPositions: (projectId: string) => void;
}

const storageKey = (projectId: string) => `inkwell_masterflow_${projectId}`;

const useMasterFlowStore = create<MasterFlowState>()(
  temporal(
    (set, get) => ({
      positions: {},
      layoutDirection: 'TB',
      showAllEdges: true,

      setPosition: (id, pos) => {
        const positions = { ...get().positions, [id]: pos };
        set({ positions });
      },

      setPositions: (positions) => {
        set({ positions });
      },

      setLayoutDirection: (dir) => set({ layoutDirection: dir }),

      toggleEdgeFilter: () => set((s) => ({ showAllEdges: !s.showAllEdges })),

      loadPositions: (projectId) => {
        try {
          const raw = localStorage.getItem(storageKey(projectId));
          const positions: Record<string, Position> = raw ? JSON.parse(raw) : {};
          set({ positions });
        } catch {
          set({ positions: {} });
        }
      },

      savePositions: (projectId, positions) => {
        try {
          localStorage.setItem(storageKey(projectId), JSON.stringify(positions));
        } catch { /* quota or private browsing */ }
      },

      clearPositions: (projectId) => {
        set({ positions: {} });
        try { localStorage.removeItem(storageKey(projectId)); } catch { /* ignore */ }
      },
    }),
    {
      // Only track positions for undo/redo — direction/filter changes are not undo-able
      partialize: (state) => ({ positions: state.positions }),
      limit: 50,
    }
  )
);

export default useMasterFlowStore;
