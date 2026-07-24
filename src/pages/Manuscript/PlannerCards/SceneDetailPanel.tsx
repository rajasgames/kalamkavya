import { useStoryStore } from '@/stores/storyStore';
import { X } from 'lucide-react';
import { SceneCard } from './SceneCard';
import { ConflictRegisterCard } from './ConflictRegisterCard';
import { PacingNoteCard } from './PacingNoteCard';

export function SceneDetailPanel() {
  const { activeSceneId, setActiveSceneId, scenes } = useStoryStore();

  const activeScene = scenes.find((s) => s.id === activeSceneId);

  if (!activeScene) return null;

  return (
    <div className="w-full md:w-[400px] fixed md:relative inset-y-0 right-0 z-40 md:z-auto shrink-0 border-l border-subtle bg-surface h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
      <div className="h-16 px-6 border-b border-subtle flex items-center justify-between shrink-0 bg-base">
        <h2 className="text-sm font-bold text-primary tracking-widest uppercase truncate pr-4">
          Scene Details
        </h2>
        <button
          onClick={() => setActiveSceneId(null)}
          className="text-ghost hover:text-primary transition-colors p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-hide">
        <SceneCard scene={activeScene} />
        <PacingNoteCard scene={activeScene} />
        <ConflictRegisterCard scene={activeScene} />
      </div>
    </div>
  );
}
