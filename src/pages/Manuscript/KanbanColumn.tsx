import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanColumn as ColumnType, Scene } from '@/types';
import { KanbanCard } from './KanbanCard';
import { Plus, MoreHorizontal, Trash2, Edit2 } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useStoryStore } from '@/stores/storyStore';

interface KanbanColumnProps {
  column: ColumnType;
  scenes: Scene[];
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

export function KanbanColumn({ column, scenes, onRename, onDelete }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const { activeProjectId, addScene } = useStoryStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.name);
  
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && title !== column.name) {
      onRename(column.id, title.trim());
    } else {
      setTitle(column.name);
    }
    setIsEditing(false);
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim() || !activeProjectId) return;

    const newScene: Scene = {
      id: crypto.randomUUID(),
      projectId: activeProjectId,
      chapterId: null, // Unassigned chapter by default
      title: newCardTitle.trim(),
      content: '',
      wordCount: 0,
      order: scenes.length,
      kanbanColumn: column.id,
      planning: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await addScene(newScene);
    setNewCardTitle('');
    setIsAddingCard(false);
  };

  return (
    <div 
      className="flex flex-col w-[300px] shrink-0 h-full bg-transparent"
    >
      {/* Column Header */}
      <div className="p-3 mb-2 flex items-center justify-between group">
        {isEditing ? (
          <form onSubmit={handleRenameSubmit} className="flex-1 mr-2">
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleRenameSubmit}
              className="w-full bg-transparent text-primary text-sm font-bold outline-none border-b border-terracotta py-0.5"
            />
          </form>
        ) : (
          <h3 className="text-xs font-bold text-terracotta tracking-widest uppercase truncate pr-2">
            {column.name} <span className="text-terracotta/70 font-normal ml-1">({scenes.length})</span>
          </h3>
        )}

        {!isEditing && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="opacity-0 group-hover:opacity-100 text-ghost hover:text-primary p-1 rounded transition-opacity shrink-0">
                <MoreHorizontal size={16} />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content 
                align="end"
                className="min-w-[140px] bg-elevated border border-subtle rounded-md p-1 shadow-lg z-50 text-sm font-sans"
              >
                <DropdownMenu.Item 
                  className="flex items-center gap-2 px-2 py-1.5 outline-none cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 text-secondary hover:text-primary rounded"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 size={14} /> Rename
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px bg-subtle my-1" />
                <DropdownMenu.Item 
                  className="flex items-center gap-2 px-2 py-1.5 outline-none cursor-pointer hover:bg-destructive/10 text-destructive rounded"
                  onClick={() => onDelete(column.id)}
                >
                  <Trash2 size={14} /> Delete Column
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}
      </div>

      {/* Column Body - Droppable Area */}
      <div 
        ref={setNodeRef}
        className={`flex-1 p-2 overflow-y-auto scrollbar-hide flex flex-col gap-3 rounded-xl transition-colors ${
          isOver ? 'bg-terracotta/5' : ''
        }`}
      >
        <SortableContext items={scenes.map(s => s.id)} strategy={verticalListSortingStrategy}>
          {scenes.map(scene => (
            <KanbanCard key={scene.id} scene={scene} />
          ))}
        </SortableContext>
        
        {/* Empty state placeholder for dropping */}
        {scenes.length === 0 && (
          <div className="h-20 w-full border-2 border-dashed border-subtle rounded-lg flex items-center justify-center text-xs text-ghost italic opacity-50">
            Drop cards here
          </div>
        )}
      </div>

      {/* Column Footer - Add Card */}
      <div className="p-2 mt-2">
        {isAddingCard ? (
          <form onSubmit={handleAddCard} className="bg-canvas border border-terracotta/30 rounded-xl p-2 shadow-soft">
            <input
              autoFocus
              type="text"
              placeholder="Scene title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              className="w-full bg-transparent text-primary text-sm outline-none mb-2 placeholder:text-ghost"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingCard(false)}
                className="text-xs text-ghost hover:text-primary px-2 py-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-xs bg-terracotta/10 text-terracotta hover:bg-terracotta/20 px-3 py-1 rounded-full font-medium transition-colors"
              >
                Add
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setIsAddingCard(true)}
            className="w-full flex items-center gap-2 text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded transition-colors text-sm font-medium"
          >
            <Plus size={16} /> Add Card
          </button>
        )}
      </div>
    </div>
  );
}
