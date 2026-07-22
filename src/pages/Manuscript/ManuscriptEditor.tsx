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
  const { scenes, activeSceneId, updateScene } = useStoryStore();
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
    return (
      <div className="h-full flex items-center justify-center p-8 bg-surface">
        <div className="max-w-md w-full p-8 text-center flex flex-col items-center">
          <div className="text-amber-from/20 mb-6 drop-shadow-sm">
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
    <div className={isFocusMode ? "fixed inset-0 z-[100] bg-base flex flex-col overflow-hidden transition-colors duration-500" : "flex flex-col h-full bg-base relative overflow-hidden"}>
      
      {/* Top Breadcrumb & Actions */}
      {!isFocusMode && (
        <div className="h-12 px-6 flex items-center justify-between shrink-0 sticky top-0 z-10 bg-surface border-b border-subtle">
          <div className="flex items-center gap-2 text-xs font-medium text-ghost min-w-0">
            <span className="shrink-0">Manuscript</span>
            <ChevronRight size={13} className="opacity-40 shrink-0" />
            <span className="text-primary truncate font-semibold">{activeScene.title}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button 
              onClick={() => setIsFocusMode(true)} 
              className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded text-ghost hover:text-primary transition-colors"
              title="Focus Mode"
            >
              <Maximize size={15} />
            </button>
            <button 
              onClick={() => useUIStore.getState().setSprintWidgetOpen(true)} 
              className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded text-ghost hover:text-primary transition-colors"
              title="Word Sprint"
            >
              <Timer size={15} />
            </button>
            <div className="w-[1px] h-3.5 bg-subtle mx-1" />
            <button
              onClick={() => useUIStore.getState().setOpenModal('ghostwriter')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-from/10 text-amber-from hover:bg-amber-from/20 transition-colors text-xs font-semibold"
            >
              <Feather size={13} />
              <span className="hidden sm:inline">Ghostwriter</span>
            </button>
          </div>
        </div>
      )}

      {/* Editor Container */}
      <div className={`flex-1 overflow-y-auto px-6 sm:px-12 ${isFocusMode ? 'py-20' : 'py-12'}`}>
        <div className="max-w-3xl mx-auto h-full relative">
          
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-8 outline-none">
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

      {/* Word Count Pill */}
      {!isFocusMode && (
        <div className="fixed bottom-4 right-6 bg-surface border border-subtle px-3 py-1 rounded-full flex items-center gap-2.5 text-xs text-secondary z-20">
          <span className="flex items-center gap-1.5 font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-from" />
            {wordCount} words
          </span>
          <span className="w-[1px] h-3 bg-subtle" />
          <span>{charCount} chars</span>
        </div>
      )}

      {/* Focus Mode Overlay Controls */}
      {isFocusMode && (
        <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 opacity-0 hover:opacity-100 transition-opacity bg-surface border-b border-subtle z-50">
          <div className="flex items-center gap-3 text-ghost text-xs font-medium">
            <span className="font-mono bg-base border border-subtle px-2.5 py-1 rounded flex items-center gap-1.5">
              <Timer size={13} className="text-amber-from" />
              {formatTime(focusTime)}
            </span>
            <span>•</span>
            <span>{wordCount} words</span>
          </div>
          <button 
            onClick={() => setIsFocusMode(false)} 
            className="px-3 py-1 text-xs text-secondary hover:text-primary bg-base border border-subtle rounded transition-colors flex items-center gap-1.5"
          >
            <Minimize size={14} />
            <span>Exit Focus</span>
          </button>
        </div>
      )}

      <GhostwriterDrawer />
    </div>
  );
}
