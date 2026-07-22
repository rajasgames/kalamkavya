import { useState, useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useAIStore } from '@/stores/aiStore';
import { useStoryStore } from '@/stores/storyStore';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { AI_ACTIONS, AIAction } from '@/lib/ai/actions';
import { streamAI } from '@/lib/ai/streamAI';
import { buildPrompt } from '@/lib/ai/promptEngine';
import { useManuscriptEditor } from '@/hooks/useManuscriptEditor';
import { Check, Loader2, Sparkles, Send } from 'lucide-react';

export function GhostwriterDrawer() {
  const { openModal, setOpenModal } = useUIStore();
  const { isStreaming, streamedText, cancelStream, clearStream } = useAIStore();
  const { activeProjectId } = useStoryStore();
  const { editor } = useManuscriptEditor();
  const { showToast } = useToast();
  
  const [instructions, setInstructions] = useState('');
  const [hasCompleted, setHasCompleted] = useState(false);
  const [activeAction, setActiveAction] = useState<AIAction | null>(null);

  const isOpen = openModal === 'ghostwriter';
  
  useEffect(() => {
    if (isOpen && editor && activeProjectId) {
      buildPrompt({
        editorInstance: editor,
        projectId: activeProjectId,
        actionType: 'Continue'
      }).catch(console.error);
    }
  }, [isOpen, editor, activeProjectId]);

  const handleClose = () => {
    if (isStreaming) {
      cancelStream();
      showToast('Generation Stopped. Text up to this point is saved.', 'warning');
    }
    setOpenModal(null);
  };

  const handleAction = async (action: AIAction) => {
    if (!editor || !activeProjectId) return;
    
    setActiveAction(action);
    setHasCompleted(false);
    clearStream();
    
    try {
      const { systemPrompt } = await buildPrompt({
        editorInstance: editor,
        projectId: activeProjectId,
        actionType: action,
        userInstruction: instructions
      });
      
      await streamAI({
        systemPrompt,
        userMessage: instructions || 'Please proceed.',
        onChunk: () => {},
        onDone: () => {},
        onError: (code) => showToast(`Generation failed: ${code}`, 'error')
      });
      
      const currentState = useAIStore.getState();
      if (currentState.streamedText.length > 0 && !currentState.isStreaming) {
        setHasCompleted(true);
      }
    } catch (e) {
      showToast('Failed to build AI context', 'error');
    }
  };

  const handleInsert = () => {
    if (!editor || !streamedText) return;
    editor.chain().focus().insertContentAt(editor.state.selection.anchor, streamedText).run();
    setOpenModal(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="AI Ghostwriter" size="lg">
      <div className="flex flex-col gap-6 mt-4">
        
        {/* Command Input Area */}
        <div className="relative flex items-center bg-transparent border border-subtle focus-within:border-amber-from/50 focus-within:ring-1 focus-within:ring-amber-from/20 rounded-xl overflow-hidden transition-all shadow-sm">
          <div className="pl-4 text-amber-from">
            <Sparkles size={18} />
          </div>
          <input
            autoFocus
            type="text"
            placeholder="Tell AI what to write, or pick an action below..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            disabled={isStreaming}
            className="flex-1 bg-transparent border-none outline-none py-3 px-3 text-primary text-sm font-sans placeholder-ghost"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isStreaming) {
                handleAction('Continue');
              }
            }}
          />
          <button 
            disabled={isStreaming}
            onClick={() => handleAction('Continue')}
            className="pr-4 pl-2 text-ghost hover:text-amber-from transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>

        {/* AI Actions */}
        {!streamedText && !isStreaming && (
          <div className="flex flex-wrap gap-2 justify-center">
            {AI_ACTIONS.map((action) => (
              <button
                key={action}
                onClick={() => handleAction(action)}
                disabled={isStreaming}
                className="px-3 py-1.5 rounded-full border border-subtle text-xs font-medium text-secondary hover:text-primary hover:border-amber-from/50 hover:bg-amber-from/5 transition-all bg-surface shadow-sm"
              >
                {action}
              </button>
            ))}
          </div>
        )}

        {/* Output Stream Area */}
        {(streamedText || isStreaming) && (
          <div className="flex-1 flex flex-col min-h-[240px] max-h-[400px] border border-amber-from/20 bg-amber-from/5 rounded-xl p-6 relative shadow-inner overflow-hidden">
            <div className="flex-1 overflow-y-auto font-serif text-[18px] leading-relaxed text-primary pr-2 scrollbar-hide">
              {streamedText}
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-amber-from ml-1 align-middle animate-pulse" />
              )}
            </div>
            
            {/* Status indicator */}
            <div className="absolute top-4 right-4 text-ghost bg-surface/80 p-1.5 rounded-full backdrop-blur-sm border border-subtle">
              {isStreaming ? (
                <Loader2 size={14} className="animate-spin text-amber-from" />
              ) : hasCompleted ? (
                <Check size={14} className="text-sage" />
              ) : null}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {hasCompleted && !isStreaming && (
          <div className="flex justify-end gap-3 pt-2">
            <Button 
              variant="ghost" 
              onClick={() => activeAction && handleAction(activeAction)}
              className="text-sm px-4"
            >
              Regenerate
            </Button>
            <Button 
              variant="primary" 
              onClick={handleInsert}
              className="bg-gradient-to-r from-amber-from to-amber-to text-sm font-medium shadow-md shadow-amber-from/20 px-6"
            >
              Insert at Cursor
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
