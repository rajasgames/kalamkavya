import { useState, useEffect } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Chapter, Scene } from '@/types';

function SortableChapterItem({ chapter, scenes }: { chapter: Chapter; scenes: Scene[] }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const {
    attributes, listeners, setNodeRef, transform, transition,
  } = useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="group flex flex-col w-full">
      <div className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group/row cursor-pointer">
        <button {...attributes} {...listeners} className="text-ghost opacity-0 group-hover/row:opacity-100 hover:text-primary cursor-grab transition-opacity shrink-0">
          <GripVertical size={16} />
        </button>
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-ghost hover:text-primary shrink-0 transition-colors">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        <h3 className="font-serif text-lg text-primary flex-1 font-semibold">{chapter.title || 'Untitled Chapter'}</h3>
        <button className="text-ghost hover:text-terracotta opacity-0 group-hover/row:opacity-100 transition-all">
          <Plus size={16} />
        </button>
      </div>
      
      {isExpanded && (
        <div className="ml-[34px] pl-4 border-l border-subtle/60 space-y-0.5 mt-1 mb-3 flex flex-col">
          {scenes.sort((a,b) => a.order - b.order).map(scene => (
            <div key={scene.id} className="group/scene py-1.5 px-3 rounded-lg flex items-center justify-between text-sm font-sans text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
              <span className="group-hover/scene:text-primary transition-colors">{scene.title || 'Untitled Scene'}</span>
              <span className="text-xs text-ghost">{scene.wordCount} words</span>
            </div>
          ))}
          {scenes.length === 0 && <div className="text-xs text-ghost italic py-1.5 px-3">No scenes in this chapter.</div>}
        </div>
      )}
    </div>
  );
}

export function ManuscriptOutline() {
  const { chapters, scenes, reorderChapters } = useStoryStore();
  const [localChapters, setLocalChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    setLocalChapters(chapters.sort((a,b) => a.order - b.order));
  }, [chapters]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalChapters((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        const reordered = arrayMove(items, oldIndex, newIndex);
        // update order prop
        const updated = reordered.map((c, idx) => ({ ...c, order: idx }));
        reorderChapters(updated);
        return updated;
      });
    }
  };

  return (
    <div className="h-full flex bg-canvas overflow-hidden relative">
      <div className="flex-1 flex flex-col min-w-0 max-w-4xl mx-auto w-full">
        <div className="px-4 sm:px-8 py-6 shrink-0 z-10">
          <h1 className="text-2xl sm:text-3xl font-serif text-primary">Manuscript Outline</h1>
          <p className="text-secondary mt-1 text-xs sm:text-sm">Structure your story hierarchically.</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-12 scrollbar-hide">
          <div className="bg-surface border border-subtle shadow-soft rounded-2xl p-4 sm:p-6">
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={localChapters.map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {localChapters.map(chapter => (
                  <SortableChapterItem 
                    key={chapter.id} 
                    chapter={chapter} 
                    scenes={scenes.filter(s => s.chapterId === chapter.id)} 
                  />
                ))}
              </SortableContext>
            </DndContext>
            
            {localChapters.length === 0 && (
              <div className="text-center text-ghost p-12 border border-dashed border-subtle rounded-xl">
                No chapters yet. Add chapters in the Editor or Planner to see them here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
