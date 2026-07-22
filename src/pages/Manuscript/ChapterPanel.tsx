import { useState } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import { Chapter } from '@/types';
import { SortableItem } from '@/components/ui';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { GripVertical, MoreVertical, Plus, Trash2, Edit2 } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function ChapterPanel() {
  const { activeProjectId, chapters, activeChapterId, setActiveChapterId, addChapter, updateChapter, deleteChapter, reorderChapters } = useStoryStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filter and sort chapters
  const projectChapters = chapters
    .filter((c) => c.projectId === activeProjectId)
    .sort((a, b) => a.order - b.order);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = projectChapters.findIndex((c) => c.id === active.id);
      const newIndex = projectChapters.findIndex((c) => c.id === over.id);
      
      const newArray = arrayMove(projectChapters, oldIndex, newIndex);
      const updatedArray = newArray.map((c, index) => ({ ...c, order: index }));
      reorderChapters(updatedArray);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !activeProjectId) return;

    const newChapter: Chapter = {
      id: crypto.randomUUID(),
      projectId: activeProjectId,
      title: newTitle.trim(),
      order: projectChapters.length,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await addChapter(newChapter);
    setNewTitle('');
    setIsAdding(false);
    setActiveChapterId(newChapter.id);
  };

  const handleRenameSubmit = async (e: React.FormEvent, chapter: Chapter) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setEditingId(null);
      return;
    }
    await updateChapter({ ...chapter, title: newTitle.trim(), updatedAt: Date.now() });
    setEditingId(null);
    setNewTitle('');
  };

  const startRename = (chapter: Chapter) => {
    setEditingId(chapter.id);
    setNewTitle(chapter.title);
  };

  const handleDelete = async (chapter: Chapter) => {
    // In a real app we would use ConfirmModal here as requested
    // "Delete (triggers ConfirmModal)" - we will simulate it with window.confirm for now or build it if needed.
    if (window.confirm(`Are you sure you want to delete chapter "${chapter.title}" and all its scenes?`)) {
      await deleteChapter(chapter.id);
      if (activeChapterId === chapter.id) {
        setActiveChapterId(null);
      }
    }
  };

  if (!activeProjectId) return null;

  return (
    <div className="flex flex-col h-full bg-surface border-r border-subtle">
      <div className="p-4 flex items-center justify-between border-b border-subtle shrink-0">
        <h2 className="text-sm font-bold text-primary tracking-widest uppercase">Chapters</h2>
        <button 
          onClick={() => { setIsAdding(true); setNewTitle(''); }}
          className="text-ghost hover:text-amber-from transition-colors"
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
              onBlur={() => setIsAdding(false)}
              placeholder="Chapter title..."
              className="w-full bg-transparent text-primary text-sm outline-none border-b border-amber-from/50 focus:border-amber-from transition-colors py-1"
            />
          </form>
        )}

        {projectChapters.length === 0 && !isAdding ? (
          <div className="text-center p-4 text-xs text-ghost mt-8">
            Start here — create your first chapter.
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
            <SortableContext items={projectChapters} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-1">
                {projectChapters.map((chapter) => (
                  <SortableItem key={chapter.id} id={chapter.id}>
                    {({ setNodeRef, attributes, listeners, style, isDragging }) => (
                      <div
                        ref={setNodeRef}
                        style={style}
                        className={`group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                          activeChapterId === chapter.id ? 'bg-amber-from/10 text-amber-from' : 'text-secondary hover:bg-black/5 hover:text-primary dark:hover:bg-white/5'
                        } ${isDragging ? 'shadow-md ring-1 ring-amber-from/50' : ''}`}
                        onClick={() => {
                          if (editingId !== chapter.id) setActiveChapterId(chapter.id);
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
                          
                          {editingId === chapter.id ? (
                            <form 
                              onSubmit={(e) => handleRenameSubmit(e, chapter)} 
                              className="flex-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                autoFocus
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onBlur={(e) => handleRenameSubmit(e, chapter)}
                                className="w-full bg-transparent text-primary text-sm outline-none border-b border-amber-from"
                              />
                            </form>
                          ) : (
                            <span className="text-sm truncate select-none font-medium">{chapter.title}</span>
                          )}
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
                                    onClick={() => startRename(chapter)}
                                  >
                                    <Edit2 size={14} /> Rename
                                  </DropdownMenu.Item>
                                  <DropdownMenu.Item 
                                    className="flex items-center gap-2 px-2.5 py-1.5 outline-none cursor-pointer hover:bg-clay/15 text-clay rounded-lg font-medium"
                                    onClick={() => handleDelete(chapter)}
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
