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
import { GripVertical } from 'lucide-react';
import { Chapter, Scene } from '@/types';

function SortableChapterItem({ chapter, scenes }: { chapter: Chapter; scenes: Scene[] }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-surface border border-subtle rounded-xl p-4 mb-4">
      <div className="flex items-center gap-3 mb-2">
        <button {...attributes} {...listeners} className="text-ghost hover:text-primary cursor-grab">
          <GripVertical size={18} />
        </button>
        <h3 className="font-serif text-xl text-primary">{chapter.title || 'Untitled Chapter'}</h3>
      </div>
      <p className="text-secondary text-sm mb-4 pl-8"></p>
      
      <div className="pl-8 space-y-2">
        {scenes.sort((a,b) => a.order - b.order).map(scene => (
          <div key={scene.id} className="bg-base border border-subtle rounded-lg p-3 text-sm text-secondary flex items-center justify-between">
            <span>{scene.title || 'Untitled Scene'}</span>
            <span className="text-xs text-ghost">{scene.wordCount} words</span>
          </div>
        ))}
        {scenes.length === 0 && <div className="text-xs text-ghost italic">No scenes in this chapter.</div>}
      </div>
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
    <div className="h-full flex bg-base overflow-hidden relative">
      <div className="flex-1 flex flex-col min-w-0 max-w-4xl mx-auto w-full">
        <div className="px-8 py-6 shrink-0 bg-base">
          <h1 className="text-3xl font-serif text-primary">Manuscript Outline</h1>
          <p className="text-secondary mt-1 text-sm">Drag and drop to reorganize your chapters.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
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
            <div className="text-center text-ghost p-12 border-2 border-dashed border-subtle rounded-xl">
              No chapters yet. Add chapters in the Editor or Planner to see them here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
