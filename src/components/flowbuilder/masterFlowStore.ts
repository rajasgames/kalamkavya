import { create } from 'zustand';
import { temporal } from 'zundo';

export type Position = { x: number; y: number };
export type LayoutDirection = 'TB' | 'LR';

export interface ToastItem {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'error';
}

export interface MasterFlowState {
  /** Saved canvas positions keyed by entity ID */
  positions: Record<string, Position>;
  /** Dagre layout direction */
  layoutDirection: LayoutDirection;
  /** Whether to show all edges or hierarchy-only */
  showAllEdges: boolean;
  /** Whether marching-ants edge animation is active */
  enableMarchingAnts: boolean;
  /** Currently selected node ID for Inspector */
  selectedNodeId: string | null;
  /** Currently selected edge ID for Inspector */
  selectedEdgeId: string | null;
  /** Inspector panel open state */
  isInspectorOpen: boolean;
  /** Export modal open state */
  isExportModalOpen: boolean;
  /** Keyboard shortcuts popover open state */
  isShortcutsOpen: boolean;
  /** Active UI Theme */
  theme: 'dark' | 'light';
  /** Notification toasts */
  toasts: ToastItem[];

  // Actions
  setPosition: (id: string, pos: Position) => void;
  setPositions: (positions: Record<string, Position>) => void;
  setLayoutDirection: (dir: LayoutDirection) => void;
  toggleEdgeFilter: () => void;
  toggleMarchingAnts: () => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  setInspectorOpen: (open: boolean) => void;
  setExportModalOpen: (open: boolean) => void;
  setShortcutsOpen: (open: boolean) => void;
  toggleShortcuts: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;

  // Toast actions
  addToast: (message: string, type?: 'info' | 'success' | 'error') => void;
  removeToast: (id: string) => void;

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
      enableMarchingAnts: true,
      selectedNodeId: null,
      selectedEdgeId: null,
      isInspectorOpen: false,
      isExportModalOpen: false,
      isShortcutsOpen: false,
      theme: 'dark',
      toasts: [],

      setPosition: (id, pos) => {
        const positions = { ...get().positions, [id]: pos };
        set({ positions });
      },

      setPositions: (positions) => {
        set({ positions });
      },

      setLayoutDirection: (dir) => set({ layoutDirection: dir }),

      toggleEdgeFilter: () => set((s) => ({ showAllEdges: !s.showAllEdges })),

      toggleMarchingAnts: () => set((s) => ({ enableMarchingAnts: !s.enableMarchingAnts })),

      selectNode: (id) => set({
        selectedNodeId: id,
        selectedEdgeId: null,
        isInspectorOpen: id !== null,
      }),

      selectEdge: (id) => set({
        selectedEdgeId: id,
        selectedNodeId: null,
        isInspectorOpen: id !== null,
      }),

      setInspectorOpen: (open) => set({
        isInspectorOpen: open,
        ...(open ? {} : { selectedNodeId: null, selectedEdgeId: null }),
      }),

      setExportModalOpen: (open) => set({ isExportModalOpen: open }),

      setShortcutsOpen: (open) => set({ isShortcutsOpen: open }),

      toggleShortcuts: () => set((s) => ({ isShortcutsOpen: !s.isShortcutsOpen })),

      setTheme: (theme) => set({ theme }),

      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      addToast: (message, type = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
        setTimeout(() => {
          get().removeToast(id);
        }, 3500);
      },

      removeToast: (id) => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
      },

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
      partialize: (state) => ({ positions: state.positions }),
      limit: 50,
    }
  )
);

export default useMasterFlowStore;
