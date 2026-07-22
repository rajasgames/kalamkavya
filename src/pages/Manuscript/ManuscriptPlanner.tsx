import { useEffect, useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import { KanbanColumn as ColumnType, Scene } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { SceneDetailPanel } from './PlannerCards/SceneDetailPanel';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanCard } from './KanbanCard';
import { Plus } from 'lucide-react';

const DEFAULT_KANBAN_COLUMNS: ColumnType[] = [
  { id: 'setup', name: 'Setup', order: 0 },
  { id: 'inciting_incident', name: 'Inciting Incident', order: 1 },
  { id: 'rising_action', name: 'Rising Action', order: 2 },
  { id: 'midpoint', name: 'Midpoint', order: 3 },
  { id: 'complications', name: 'Complications', order: 4 },
  { id: 'climax', name: 'Climax', order: 5 },
  { id: 'falling_action', name: 'Falling Action', order: 6 },
  { id: 'resolution', name: 'Resolution', order: 7 },
];

export function ManuscriptPlanner() {
  const { activeProject, updateProject, scenes, reorderScenes, activeSceneId } = useStoryStore();
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [localScenes, setLocalScenes] = useState<Scene[]>([]);
  const [activeScene, setActiveScene] = useState<Scene | null>(null);

  // Initialize columns and local scenes
  useEffect(() => {
    if (activeProject) {
      if (!activeProject.kanbanColumns || activeProject.kanbanColumns.length === 0) {
        // Initialize default columns
        const projectWithCols = { ...activeProject, kanbanColumns: DEFAULT_KANBAN_COLUMNS };
        updateProject(projectWithCols);
        setColumns(DEFAULT_KANBAN_COLUMNS);
      } else {
        setColumns(activeProject.kanbanColumns.sort((a, b) => a.order - b.order));
      }
    }
  }, [activeProject, updateProject]);

  useEffect(() => {
    setLocalScenes(scenes);
  }, [scenes]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleRenameColumn = async (id: string, newName: string) => {
    if (!activeProject) return;
    const newCols = columns.map(c => c.id === id ? { ...c, name: newName } : c);
    setColumns(newCols);
    await updateProject({ ...activeProject, kanbanColumns: newCols });
  };

  const handleDeleteColumn = async (id: string) => {
    if (!activeProject) return;
    // Map scenes in this column to the first available column, or 'uncategorized'
    const newCols = columns.filter(c => c.id !== id);
    if (newCols.length === 0) return; // Prevent deleting last column for now

    const fallbackColId = newCols[0].id;
    const affectedScenes = localScenes.filter(s => s.kanbanColumn === id);
    
    if (affectedScenes.length > 0) {
      const updatedScenes = affectedScenes.map(s => ({ ...s, kanbanColumn: fallbackColId }));
      await reorderScenes(updatedScenes); // bulk put
    }

    setColumns(newCols);
    await updateProject({ ...activeProject, kanbanColumns: newCols });
  };

  const handleAddColumn = async () => {
    if (!activeProject) return;
    const newCol: ColumnType = {
      id: crypto.randomUUID(),
      name: 'New Column',
      order: columns.length,
    };
    const newCols = [...columns, newCol];
    setColumns(newCols);
    await updateProject({ ...activeProject, kanbanColumns: newCols });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const scene = localScenes.find(s => s.id === active.id);
    if (scene) setActiveScene(scene);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveScene = active.data.current?.sortable;
    const isOverScene = over.data.current?.sortable;
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveScene) return;

    setLocalScenes((prev) => {
      const activeIndex = prev.findIndex(s => s.id === activeId);
      const activeSceneItem = prev[activeIndex];
      let overIndex = prev.findIndex(s => s.id === overId);
      let overColumnId = activeSceneItem.kanbanColumn;

      if (isOverScene) {
        overColumnId = prev[overIndex].kanbanColumn;
      } else if (isOverColumn) {
        overColumnId = String(overId);
        overIndex = prev.length; // move to end of new array
      }

      if (activeSceneItem.kanbanColumn !== overColumnId) {
        // Moving to a different column
        const newScene = { ...activeSceneItem, kanbanColumn: overColumnId };
        const newArray = [...prev];
        newArray.splice(activeIndex, 1);
        
        // Find insert position
        let insertIndex = newArray.length;
        
        if (isOverScene && overIndex >= 0) {
          // Calculate relative position within the new column
          const overSceneId = prev[overIndex].id;
          insertIndex = newArray.findIndex(s => s.id === overSceneId);
          // adjust for items being shifted
          if (insertIndex === -1) insertIndex = newArray.length;
        }

        newArray.splice(insertIndex, 0, newScene);
        return newArray;
      }

      return prev;
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveScene(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeIndex = localScenes.findIndex(s => s.id === activeId);
    let overIndex = localScenes.findIndex(s => s.id === overId);

    // If dropped over a column directly (empty area), handle index
    if (over.data.current?.type === 'Column') {
       const columnId = over.id;
       const colScenes = localScenes.filter(s => s.kanbanColumn === columnId);
       if (colScenes.length > 0) {
           overIndex = localScenes.findIndex(s => s.id === colScenes[colScenes.length-1].id);
       }
    }

    if (activeIndex !== overIndex) {
      const newArray = arrayMove(localScenes, activeIndex, overIndex);
      setLocalScenes(newArray);

      // We only need to persist the reordered scenes. We'll update the order of all scenes in affected columns.
      // Easiest is to update 'order' property for ALL scenes in the db based on newArray index.
      const updatedScenes = newArray.map((s, index) => ({ ...s, order: index }));
      await reorderScenes(updatedScenes);
    } else {
      // If it didn't move index-wise, it might have changed columns (which was handled by dragOver)
      // So we still need to persist the whole array just in case kanbanColumn changed.
      const updatedScenes = localScenes.map((s, index) => ({ ...s, order: index }));
      await reorderScenes(updatedScenes);
    }
  };

  if (!activeProject) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-ghost">
        Select or create a project to view the planner.
      </div>
    );
  }

  return (
    <div className="h-full flex bg-base overflow-hidden relative">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-8 py-6 shrink-0 border-b border-subtle bg-surface">
          <h1 className="text-3xl font-serif text-primary">Plot Board</h1>
          <p className="text-secondary mt-1 text-sm">Visualize and restructure your scenes.</p>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 scrollbar-hide">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 h-full items-start w-max">
              {columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  scenes={localScenes.filter(s => s.kanbanColumn === column.id).sort((a,b) => a.order - b.order)}
                  onRename={handleRenameColumn}
                  onDelete={handleDeleteColumn}
                />
              ))}
              
              {/* Add Column Button */}
              <button
                onClick={handleAddColumn}
                className="shrink-0 w-[300px] h-[60px] border-2 border-dashed border-subtle rounded-xl flex items-center justify-center text-ghost hover:text-primary hover:border-amber-from/50 hover:bg-amber-from/5 transition-colors font-medium text-sm gap-2"
              >
                <Plus size={18} /> Add Column
              </button>
            </div>

            <DragOverlay>
              {activeScene ? <KanbanCard scene={activeScene} /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
      {activeSceneId && <SceneDetailPanel />}
    </div>
  );
}
