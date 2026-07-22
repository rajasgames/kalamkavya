import { useState, useRef, useEffect, useCallback } from 'react';
import { ChapterPanel } from './ChapterPanel';
import { ScenePanel } from './ScenePanel';
import { ManuscriptEditor } from './ManuscriptEditor';
import { BookOpen, Layers, PenTool } from 'lucide-react';
import { useStoryStore } from '@/stores/storyStore';

export function ManuscriptLayout() {
  const [panel1Width, setPanel1Width] = useState(180);
  const [panel2Width, setPanel2Width] = useState(220);
  const [mobileTab, setMobileTab] = useState<'chapters' | 'scenes' | 'editor'>('editor');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeSceneId } = useStoryStore();
  
  // Drag states for desktop grid
  const [isDraggingP1, setIsDraggingP1] = useState(false);
  const [isDraggingP2, setIsDraggingP2] = useState(false);

  // Auto switch to editor tab on mobile when a scene is selected
  useEffect(() => {
    if (activeSceneId) {
      setMobileTab('editor');
    }
  }, [activeSceneId]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    
    if (isDraggingP1) {
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;
      if (newWidth >= 120 && newWidth <= 380) {
        setPanel1Width(newWidth);
      }
    } else if (isDraggingP2) {
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - rect.left - panel1Width;
      if (newWidth >= 120 && newWidth <= 380) {
        setPanel2Width(newWidth);
      }
    }
  }, [isDraggingP1, isDraggingP2, panel1Width]);

  const handleMouseUp = useCallback(() => {
    setIsDraggingP1(false);
    setIsDraggingP2(false);
    document.body.style.cursor = 'default';
  }, []);

  useEffect(() => {
    if (isDraggingP1 || isDraggingP2) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingP1, isDraggingP2, handleMouseMove, handleMouseUp]);

  return (
    <div className="h-full w-full bg-base overflow-hidden relative flex flex-col">
      {/* Mobile View Switcher (Visible only on screens below md) */}
      <div className="md:hidden shrink-0 menu-bar-graded px-3 py-2 flex items-center justify-around z-20 shadow-sm">
        <button
          onClick={() => setMobileTab('chapters')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            mobileTab === 'chapters'
              ? 'nav-pill-active font-bold'
              : 'text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <BookOpen size={14} /> Chapters
        </button>
        <button
          onClick={() => setMobileTab('scenes')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            mobileTab === 'scenes'
              ? 'nav-pill-active font-bold'
              : 'text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Layers size={14} /> Scenes
        </button>
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            mobileTab === 'editor'
              ? 'nav-pill-active font-bold'
              : 'text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <PenTool size={14} /> Editor
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {/* Mobile View Render */}
        <div className="md:hidden h-full w-full">
          {mobileTab === 'chapters' && (
            <div className="h-full w-full">
              <ChapterPanel />
            </div>
          )}
          {mobileTab === 'scenes' && (
            <div className="h-full w-full">
              <ScenePanel />
            </div>
          )}
          {mobileTab === 'editor' && (
            <div className="h-full w-full select-text">
              <ManuscriptEditor />
            </div>
          )}
        </div>

        {/* Desktop View Render (3-Column Resizable Grid) */}
        <div 
          ref={containerRef}
          className="hidden md:grid h-full w-full bg-base overflow-hidden relative select-none"
          style={{
            gridTemplateColumns: `${panel1Width}px ${panel2Width}px 1fr`,
          }}
        >
          {/* Panel 1 */}
          <div className="relative h-full z-10">
            <ChapterPanel />
            <div 
              className="absolute top-0 -right-2 w-4 h-full cursor-col-resize flex justify-center z-20 group"
              onMouseDown={() => setIsDraggingP1(true)}
            >
              <div className="w-1 h-full group-hover:bg-amber-from/50 group-active:bg-amber-from transition-colors" />
            </div>
          </div>

          {/* Panel 2 */}
          <div className="relative h-full z-10">
            <ScenePanel />
            <div 
              className="absolute top-0 -right-2 w-4 h-full cursor-col-resize flex justify-center z-20 group"
              onMouseDown={() => setIsDraggingP2(true)}
            >
              <div className="w-1 h-full group-hover:bg-amber-from/50 group-active:bg-amber-from transition-colors" />
            </div>
          </div>

          {/* Panel 3 */}
          <div className="h-full relative z-0">
            <div className="h-full w-full select-text">
              <ManuscriptEditor />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
