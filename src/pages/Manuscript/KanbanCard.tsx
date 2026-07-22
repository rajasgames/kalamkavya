import { Scene } from '@/types';
import { SortableItem } from '@/components/ui';
import { GripVertical } from 'lucide-react';
import { useStoryStore } from '@/stores/storyStore';

interface KanbanCardProps {
  scene: Scene;
}

export function KanbanCard({ scene }: KanbanCardProps) {
  const { entities, activeSceneId, setActiveSceneId } = useStoryStore();

  // Extract character initials from scene.planning.characters (array of entity IDs)
  const characterIds = (scene.planning?.characters as string[]) || [];
  const characters = characterIds
    .map((id) => entities.find((e) => e.id === id))
    .filter(Boolean);

  const pacingType = scene.planning?.pacingType;
  const openConflicts = scene.planning?.conflictEntries?.filter(c => c.status === 'Open').length || 0;

  return (
    <SortableItem id={scene.id}>
      {({ setNodeRef, attributes, listeners, style, isDragging }) => (
        <div
          ref={setNodeRef}
          style={style}
          onClick={() => setActiveSceneId(scene.id)}
          className={`group bg-elevated border rounded-lg p-3 cursor-pointer shadow-sm transition-colors ${
            activeSceneId === scene.id
              ? 'border-amber-from shadow-amber-from/20'
              : 'border-subtle hover:border-amber-from/50 hover:shadow-md'
          } ${isDragging ? 'shadow-lg ring-2 ring-amber-from opacity-90 scale-[1.02]' : ''}`}
        >
          <div className="flex items-start gap-2">
            <button
              className="mt-0.5 opacity-0 group-hover:opacity-100 text-ghost hover:text-primary cursor-grab active:cursor-grabbing transition-opacity shrink-0"
              {...attributes}
              {...listeners}
            >
              <GripVertical size={16} />
            </button>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-primary truncate leading-tight">
                {scene.title}
              </h4>
              <p className="text-xs text-ghost mt-1">
                {scene.wordCount.toLocaleString()} words
              </p>
              
              <div className="mt-3 flex items-center justify-between">
                {/* Character Initials */}
                <div className="flex -space-x-2">
                  {characters.slice(0, 3).map((char) => (
                    <div
                      key={char!.id}
                      title={char!.name}
                      className="w-6 h-6 rounded-full bg-amber-from/20 border border-amber-from/30 flex items-center justify-center text-[10px] font-bold text-amber-from"
                    >
                      {char!.name.substring(0, 2).toUpperCase()}
                    </div>
                  ))}
                  {characters.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-surface border border-subtle flex items-center justify-center text-[10px] font-bold text-ghost">
                      +{characters.length - 3}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Open Conflicts Badge */}
                  {openConflicts > 0 && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-clay/10 text-clay border border-clay/20" title={`${openConflicts} open conflicts`}>
                      {openConflicts}
                    </span>
                  )}
                  {/* Pacing Tag */}
                  {pacingType && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/5 dark:bg-white/5 text-secondary border border-subtle truncate max-w-[80px]">
                      {pacingType}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SortableItem>
  );
}
