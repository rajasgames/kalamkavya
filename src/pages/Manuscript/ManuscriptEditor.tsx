import { useEffect, useRef, useState, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useStoryStore } from '@/stores/storyStore';
import { db } from '@/lib/db/database';
import { useManuscriptEditor } from '@/hooks/useManuscriptEditor';
import { 
  PenTool, Feather, Maximize, Minimize, Timer, ChevronRight
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { GhostwriterDrawer } from '@/components/editor/GhostwriterDrawer';

export function ManuscriptEditor() {
  const { scenes, activeSceneId, updateScene, chapters } = useStoryStore();
  const { setEditor } = useManuscriptEditor();
  const quillRef = useRef<ReactQuill>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusTime, setFocusTime] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFocusMode) {
      interval = setInterval(() => {
        setFocusTime(prev => prev + 1);
      }, 1000);
    } else {
      setFocusTime(0);
    }
    return () => clearInterval(interval);
  }, [isFocusMode]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const activeScene = scenes.find((s) => s.id === activeSceneId);

  useEffect(() => {
    setEditor(quillRef.current);
    return () => setEditor(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quillRef.current, setEditor]);

  // Compute word and char counts based on current text
  const updateCounts = (text: string) => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const chars = text.length - 1; // subtract trailing newline quill adds
    setWordCount(words);
    setCharCount(Math.max(0, chars));
    return words;
  };

  useEffect(() => {
    if (quillRef.current && activeScene) {
      const quill = quillRef.current.getEditor();
      updateCounts(quill.getText());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScene?.id]);

  const handleEditorChange = (content: string, _delta: unknown, _source: string, editor: any) => {
    if (!activeScene) return;

    const text = editor.getText();
    const currentWordCount = updateCounts(text);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(async () => {
      const updatedScene = {
        ...activeScene,
        content: content,
        wordCount: currentWordCount,
        updatedAt: Date.now(),
      };
      await db.scenes.put(updatedScene);
      updateScene(updatedScene);
    }, 500);
  };

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['clean']
    ],
  }), []);

  if (!activeScene) {
    if (chapters.length === 0) {
      return <div className="h-full bg-canvas" />;
    }

    return (
      <div className="h-full flex items-center justify-center p-8 bg-canvas">
        <div className="max-w-md w-full p-8 text-center flex flex-col items-center">
          <div className="text-terracotta/20 mb-6 drop-shadow-sm">
            <PenTool size={64} strokeWidth={1} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-primary mb-2">No Scene Selected</h2>
          <p className="text-secondary">
            Select a scene from the manuscript outline on the left, or create a new one to begin writing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={isFocusMode ? "fixed inset-0 z-[100] bg-canvas flex flex-col overflow-hidden transition-colors duration-500" : "flex flex-col h-full bg-canvas relative overflow-hidden"}>
      
      {/* Top Breadcrumb & Actions */}
      {!isFocusMode && (
        <div className="h-14 px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-10 bg-surface border-b border-subtle shadow-soft transition-colors">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-ghost min-w-0">
            <span className="cursor-default shrink-0">Manuscript</span>
            <ChevronRight size={14} className="opacity-50 shrink-0" />
            <span className="text-primary truncate max-w-[120px] sm:max-w-[220px] font-semibold">{activeScene.title}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button 
              onClick={() => setIsFocusMode(true)} 
              className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-ghost hover:text-primary transition-colors flex items-center justify-center"
              title="Enter Focus Mode"
            >
              <Maximize size={16} className="shrink-0" />
            </button>
            <button 
              onClick={() => useUIStore.getState().setSprintWidgetOpen(true)} 
              className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-ghost hover:text-primary transition-colors flex items-center justify-center"
              title="Word Sprint"
            >
              <Timer size={16} className="shrink-0" />
            </button>
            <div className="w-[1px] h-4 bg-subtle mx-0.5 sm:mx-1" />
            <button
              onClick={() => useUIStore.getState().setOpenModal('ghostwriter')}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-terracotta bg-terracotta/10 hover:bg-terracotta/20 border border-terracotta/30 transition-all shadow-sm font-medium text-xs"
            >
              <Feather size={14} className="shrink-0" />
              <span className="font-bold uppercase tracking-wider hidden sm:inline">Ghostwriter</span>
            </button>
          </div>
        </div>
      )}

      {/* Editor Container */}
      <div className={`flex-1 overflow-y-auto px-6 sm:px-12 scrollbar-hide ${isFocusMode ? 'py-32' : 'py-16'}`}>
        <div className="max-w-[720px] mx-auto h-full relative">
          
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-primary mb-12 outline-none">
            {activeScene.title}
          </h1>

          <div className="inkwell-editor-container">
            <ReactQuill 
              ref={quillRef}
              theme="snow"
              value={activeScene.content}
              onChange={handleEditorChange}
              modules={modules}
              placeholder="Start writing..."
              className="min-h-[60vh] pb-32"
            />
          </div>
        </div>
      </div>

      {/* Floating Word Count Pill */}
      {!isFocusMode && (
        <div className="fixed bottom-6 right-8 bg-surface border border-subtle px-4 py-2 rounded-full shadow-soft flex items-center gap-3 text-xs font-medium text-secondary z-20 transition-all hover:shadow-hover hover:-translate-y-0.5">
          <span className="flex items-center gap-1.5 text-primary">
            <div className="w-2 h-2 rounded-full bg-terracotta" />
            {wordCount} words
          </span>
          <span className="w-[1px] h-3 bg-subtle" />
          <span>{charCount} chars</span>
        </div>
      )}

      {/* Focus Mode Overlay Controls */}
      {isFocusMode && (
        <div className="absolute top-0 left-0 right-0 h-24 flex items-center justify-between px-8 opacity-20 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-canvas/90 to-transparent z-50">
          <div className="flex items-center gap-4 text-ghost/80 text-sm font-medium">
            <span className="font-mono bg-surface border border-subtle shadow-sm px-3 py-1.5 rounded-md flex items-center gap-2">
              <Timer size={14} className="text-terracotta" />
              {formatTime(focusTime)}
            </span>
            <span>•</span>
            <span>{wordCount} words</span>
          </div>
          <button 
            onClick={() => setIsFocusMode(false)} 
            className="px-4 py-2 text-ghost hover:text-primary bg-surface/50 hover:bg-surface border border-subtle rounded-md transition-colors flex items-center gap-2 shadow-sm backdrop-blur-md"
          >
            <Minimize size={16} />
            <span className="text-sm font-medium">Exit Focus</span>
          </button>
        </div>
      )}

      <GhostwriterDrawer />
    </div>
  );
}
