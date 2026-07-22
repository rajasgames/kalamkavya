import { useState, useEffect } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import { Scene } from '@/types';
import { SortableItem } from '@/components/ui';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { GripVertical, MoreVertical, Plus, Trash2, Edit2 } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function ScenePanel() {
  const { activeProjectId, activeChapterId, scenes, activeSceneId, setActiveSceneId, addScene, updateScene, deleteScene, reorderScenes, chapters } = useStoryStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const activeChapter = chapters.find(c => c.id === activeChapterId);

  // Filter and sort scenes
  const chapterScenes = scenes
    .filter((s) => s.chapterId === activeChapterId)
    .sort((a, b) => a.order - b.order);

  // Auto-select first scene when chapter changes and no scene is selected for that chapter
  useEffect(() => {
    if (activeChapterId && chapterScenes.length > 0) {
      if (!activeSceneId || !chapterScenes.find(s => s.id === activeSceneId)) {
        setActiveSceneId(chapterScenes[0].id);
      }
    } else {
      setActiveSceneId(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChapterId]); // Intentionally not including chapterScenes to prevent jumpy auto-select while editing

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = chapterScenes.findIndex((s) => s.id === active.id);
      const newIndex = chapterScenes.findIndex((s) => s.id === over.id);
      
      const newArray = arrayMove(chapterScenes, oldIndex, newIndex);
      const updatedArray = newArray.map((s, index) => ({ ...s, order: index }));
      reorderScenes(updatedArray);
    }
  };

  const submitNewScene = async () => {
    if (!newTitle.trim() || !activeProjectId || !activeChapterId) {
      setIsAdding(false);
      return;
    }

    const newScene: Scene = {
      id: crypto.randomUUID(),
      projectId: activeProjectId,
      chapterId: activeChapterId,
      title: newTitle.trim(),
      content: '',
      wordCount: 0,
      order: chapterScenes.length,
      kanbanColumn: 'Todo',
      planning: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await addScene(newScene);
    setNewTitle('');
    setIsAdding(false);
    setActiveSceneId(newScene.id);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitNewScene();
  };

  const handleRenameSubmit = async (e: React.FormEvent, scene: Scene) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setEditingId(null);
      return;
    }
    await updateScene({ ...scene, title: newTitle.trim(), updatedAt: Date.now() });
    setEditingId(null);
    setNewTitle('');
  };

  const startRename = (scene: Scene) => {
    setEditingId(scene.id);
    setNewTitle(scene.title);
  };

  const handleDelete = async (scene: Scene) => {
    if (window.confirm(`Are you sure you want to delete scene "${scene.title}"?`)) {
      await deleteScene(scene.id);
      if (activeSceneId === scene.id) {
        setActiveSceneId(null);
      }
    }
  };

  if (!activeChapterId || !activeChapter) {
    return (
      <div className="flex flex-col h-full bg-base border-r border-subtle opacity-50">
        <div className="p-4 border-b border-subtle shrink-0">
          <h2 className="text-sm font-bold text-primary tracking-widest uppercase">Scenes</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-base border-r border-subtle">
      <div className="p-4 flex items-center justify-between border-b border-subtle shrink-0">
        <h2 className="text-sm font-bold text-primary tracking-widest uppercase truncate pr-2">
          {activeChapter.title}
        </h2>
        <button 
          onClick={() => { setIsAdding(true); setNewTitle(''); }}
          className="text-ghost hover:text-amber-from transition-colors shrink-0"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
        {isAdding && (
          <form onSubmit={handleAddSubmit} className="mb-2 px-2 py-1">
            <input
              autoFocus
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={() => submitNewScene()}
              placeholder="Scene title..."
              className="w-full bg-transparent text-primary text-sm outline-none border-b border-amber-from/50 focus:border-amber-from transition-colors py-1"
            />
          </form>
        )}

        {chapterScenes.length === 0 && !isAdding ? (
          <div className="text-center p-4 text-xs text-ghost mt-8 px-6 leading-relaxed">
            Add scenes to {activeChapter.title} to begin writing.
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
            <SortableContext items={chapterScenes} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-1">
                {chapterScenes.map((scene) => (
                  <SortableItem key={scene.id} id={scene.id}>
                    {({ setNodeRef, attributes, listeners, style, isDragging }) => (
                      <div
                        ref={setNodeRef}
                        style={style}
                        className={`group flex items-center justify-between px-2 py-2 rounded-md cursor-pointer transition-colors border ${
                          activeSceneId === scene.id 
                            ? 'bg-amber-from/5 border-amber-from/30' 
                            : 'border-transparent text-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary hover:border-subtle'
                        } ${isDragging ? 'shadow-md ring-1 ring-amber-from/50 bg-base' : ''}`}
                        onClick={() => {
                          if (editingId !== scene.id) setActiveSceneId(scene.id);
                        }}
                      >
                        <div className="flex items-center gap-2 overflow-hidden flex-1">
                          <button
                            className="text-ghost/40 hover:text-primary cursor-grab active:cursor-grabbing shrink-0 transition-colors p-0.5"
                            title="Drag to reorder"
                            {...attributes}
                            {...listeners}
                          >
                            <GripVertical size={14} />
                          </button>
                          
                          <div className="flex-1 overflow-hidden pr-2">
                            {editingId === scene.id ? (
                              <form 
                                onSubmit={(e) => handleRenameSubmit(e, scene)} 
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  autoFocus
                                  type="text"
                                  value={newTitle}
                                  onChange={(e) => setNewTitle(e.target.value)}
                                  onBlur={(e) => handleRenameSubmit(e, scene)}
                                  className="w-full bg-transparent text-primary text-sm outline-none border-b border-amber-from"
                                />
                              </form>
                            ) : (
                              <div className="flex flex-col">
                                <span className={`text-sm truncate select-none ${activeSceneId === scene.id ? 'text-amber-from font-semibold' : 'font-medium'}`}>{scene.title}</span>
                                <span className="text-[10px] text-ghost/80 mt-0.5 font-sans">{scene.wordCount.toLocaleString()} words</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {!editingId && (
                          <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                            <DropdownMenu.Root>
                              <DropdownMenu.Trigger asChild>
                                <button className="text-ghost/40 hover:text-primary p-1 rounded-md transition-colors">
                                  <MoreVertical size={14} />
                                </button>
                              </DropdownMenu.Trigger>
                              <DropdownMenu.Portal>
                                <DropdownMenu.Content 
                                  align="end"
                                  className="min-w-[130px] bg-elevated border border-subtle rounded-xl p-1.5 shadow-2xl z-50 text-sm font-sans"
                                >
                                  <DropdownMenu.Item 
                                    className="flex items-center gap-2 px-2.5 py-1.5 outline-none cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 text-secondary hover:text-primary rounded-lg font-medium"
                                    onClick={() => startRename(scene)}
                                  >
                                    <Edit2 size={14} /> Rename
                                  </DropdownMenu.Item>
                                  <DropdownMenu.Item 
                                    className="flex items-center gap-2 px-2.5 py-1.5 outline-none cursor-pointer hover:bg-clay/15 text-clay rounded-lg font-medium"
                                    onClick={() => handleDelete(scene)}
                                  >
                                    <Trash2 size={14} /> Delete
                                  </DropdownMenu.Item>
                                </DropdownMenu.Content>
                              </DropdownMenu.Portal>
                            </DropdownMenu.Root>
                          </div>
                        )}
                      </div>
                    )}
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
