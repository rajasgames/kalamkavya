import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { ActiveLine } from '@/components/editor/extensions/ActiveLine';
import { useStoryStore } from '@/stores/storyStore';
import { db } from '@/lib/db/database';
import { useManuscriptEditor } from '@/hooks/useManuscriptEditor';
import { 
  PenTool, Feather, Maximize, Minimize, Timer, 
  Bold, Italic, Strikethrough, Underline as UnderlineIcon,
  Heading1, Heading2, List, Quote, ChevronRight
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { GhostwriterDrawer } from '@/components/editor/GhostwriterDrawer';

export function ManuscriptEditor() {
  const { scenes, activeSceneId, updateScene } = useStoryStore();
  const { setEditor } = useManuscriptEditor();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusTime, setFocusTime] = useState(0);

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

  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount,
      ActiveLine,
      Underline,
      Placeholder.configure({
        placeholder: "Type '/' for commands or start writing...",
        emptyEditorClass: 'is-editor-empty',
      })
    ],
    content: activeScene ? activeScene.content : '',
    editorProps: {
      attributes: {
        class: 'inkwell-editor outline-none focus:outline-none min-h-[60vh] pb-32 text-lg font-serif leading-relaxed text-primary [&>p]:mb-4 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:mt-8 [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mb-4 [&>h2]:mt-6 [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>blockquote]:border-l-4 [&>blockquote]:border-amber-from/50 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-4',
      },
    },
    onUpdate: ({ editor }) => {
      if (!activeScene) return;

      const html = editor.getHTML();
      const wordCount = editor.storage.characterCount.words();

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      
      saveTimeoutRef.current = setTimeout(async () => {
        const updatedScene = {
          ...activeScene,
          content: html,
          wordCount,
          updatedAt: Date.now(),
        };
        await db.scenes.put(updatedScene);
        updateScene(updatedScene);
      }, 500);
    },
  });

  useEffect(() => {
    setEditor(editor);
    return () => setEditor(null);
  }, [editor, setEditor]);

  useEffect(() => {
    if (editor && activeScene) {
      const currentHtml = editor.getHTML();
      if (currentHtml !== activeScene.content) {
        editor.commands.setContent(activeScene.content);
      }
    }
  }, [editor, activeScene]);

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
        <div className="h-14 px-8 flex items-center justify-between shrink-0 sticky top-0 z-10 bg-base/80 backdrop-blur-md border-b border-subtle transition-colors">
          <div className="flex items-center gap-2 text-sm font-medium text-ghost">
            <span className="cursor-default">Manuscript</span>
            <ChevronRight size={14} className="opacity-50 shrink-0" />
            <span className="text-primary truncate max-w-[200px]">{activeScene.title}</span>
          </div>
          <div className="flex items-center gap-2">
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
            <div className="w-[1px] h-4 bg-subtle mx-1" />
            <button
              onClick={() => useUIStore.getState().setOpenModal('ghostwriter')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-from/15 hover:bg-amber-from/25 text-amber-from transition-all shadow-sm font-medium text-xs border border-amber-from/20"
            >
              <Feather size={14} className="shrink-0" />
              <span className="font-bold uppercase tracking-wider hidden lg:inline">Ghostwriter</span>
            </button>
          </div>
        </div>
      )}

      {/* Editor Container */}
      <div className={`flex-1 overflow-y-auto px-6 sm:px-12 scrollbar-hide ${isFocusMode ? 'py-32' : 'py-16'}`}>
        <div className="max-w-3xl mx-auto h-full relative">
          
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-primary mb-12 outline-none">
            {activeScene.title}
          </h1>

          {editor && (
            <>
              {/* Bubble Menu for Formatting */}
              <BubbleMenu 
                editor={editor} 
                tippyOptions={{ duration: 100 }}
                className="flex items-center bg-surface border border-subtle shadow-2xl rounded-xl overflow-hidden p-1.5 backdrop-blur-xl gap-0.5"
              >
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor.isActive('bold') ? 'text-amber-from bg-amber-from/15' : 'text-primary hover:bg-black/5 dark:hover:bg-white/10'}`}
                >
                  <Bold size={16} />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor.isActive('italic') ? 'text-amber-from bg-amber-from/15' : 'text-primary hover:bg-black/5 dark:hover:bg-white/10'}`}
                >
                  <Italic size={16} />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor.isActive('underline') ? 'text-amber-from bg-amber-from/15' : 'text-primary hover:bg-black/5 dark:hover:bg-white/10'}`}
                >
                  <UnderlineIcon size={16} />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor.isActive('strike') ? 'text-amber-from bg-amber-from/15' : 'text-primary hover:bg-black/5 dark:hover:bg-white/10'}`}
                >
                  <Strikethrough size={16} />
                </button>
                <div className="w-[1px] h-4 bg-subtle mx-1" />
                <button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor.isActive('heading', { level: 1 }) ? 'text-amber-from bg-amber-from/15' : 'text-primary hover:bg-black/5 dark:hover:bg-white/10'}`}
                >
                  <Heading1 size={16} />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'text-amber-from bg-amber-from/15' : 'text-primary hover:bg-black/5 dark:hover:bg-white/10'}`}
                >
                  <Heading2 size={16} />
                </button>
              </BubbleMenu>

              {/* Floating Menu for Blocks */}
              <FloatingMenu 
                editor={editor} 
                tippyOptions={{ duration: 100, placement: 'left' }}
                className="flex items-center flex-col gap-1 bg-surface/90 border border-subtle shadow-xl rounded-xl p-1.5 backdrop-blur-xl translate-y-[-50%] -ml-4"
              >
                <button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-ghost hover:text-primary transition-colors"
                  title="Heading 1"
                >
                  <Heading1 size={16} />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-ghost hover:text-primary transition-colors"
                  title="Bullet List"
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-ghost hover:text-primary transition-colors"
                  title="Quote"
                >
                  <Quote size={16} />
                </button>
              </FloatingMenu>
            </>
          )}

          <EditorContent editor={editor} className="h-full" />
        </div>
      </div>

      {/* Floating Word Count Pill */}
      {!isFocusMode && (
        <div className="fixed bottom-6 right-8 bg-surface/90 backdrop-blur-xl border border-subtle px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 text-xs font-semibold text-secondary z-20 transition-all hover:scale-105">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-from shadow-[0_0_6px_rgba(212,153,90,0.8)]" />
            {editor?.storage.characterCount.words() || 0} words
          </span>
          <span className="w-[1px] h-3 bg-subtle" />
          <span>{editor?.storage.characterCount.characters() || 0} chars</span>
        </div>
      )}

      {/* Focus Mode Overlay Controls */}
      {isFocusMode && (
        <div className="absolute top-0 left-0 right-0 h-24 flex items-center justify-between px-8 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-base/90 to-transparent z-50">
          <div className="flex items-center gap-4 text-ghost/80 text-sm font-medium">
            <span className="font-mono bg-surface border border-subtle shadow-sm px-3 py-1.5 rounded-md flex items-center gap-2">
              <Timer size={14} className="text-amber-from" />
              {formatTime(focusTime)}
            </span>
            <span>•</span>
            <span>{editor?.storage.characterCount.words() || 0} words</span>
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
