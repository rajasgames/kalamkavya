import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, Brain, Cpu, MessageSquare, Square } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useAIStore } from '@/stores/aiStore';
import { streamAI } from '@/lib/ai/streamAI';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIDrawer() {
  const { isAIDrawerOpen, setAIDrawerOpen } = useUIStore();
  const { activeProvider, isStreaming, streamedText, clearStream, cancelStream } = useAIStore();
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your Kalam Kavya AI assistant. How can I help you with your world-building or manuscript today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamedText]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    
    const userMsgContent = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMsgContent }]);
    
    try {
      clearStream();
      
      const historyContext = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n');
      const payload = `Chat History:\n${historyContext}\n\nUser: ${userMsgContent}`;

      await streamAI({
        systemPrompt: "You are a helpful AI assistant for the Kalam Kavya world-building and writing tool. Be concise, creative, and extremely helpful.",
        userMessage: payload,
        onChunk: () => {},
        onDone: () => {
          const finalOutput = useAIStore.getState().streamedText;
          setMessages(prev => [...prev, { role: 'assistant', content: finalOutput }]);
          clearStream();
        },
        onError: (code) => {
          const errorMsg = `[Connection Error: ${code}]. Please check your AI settings and connection.`;
          setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
          clearStream();
        }
      });
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', content: "[An unexpected error occurred]" }]);
      clearStream();
    }
  };

  return (
    <AnimatePresence>
      {isAIDrawerOpen && (
        <>
          {/* Mobile Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAIDrawerOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 md:hidden"
          />

          <motion.div
            initial={{ transform: 'translateX(100%)' }}
            animate={{ transform: 'translateX(0%)' }}
            exit={{ transform: 'translateX(100%)' }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[400px] max-w-full bg-surface/95 backdrop-blur-2xl border-l border-subtle shadow-2xl z-50 flex flex-col font-sans"
          >
            <div className="flex items-center justify-between p-4 border-b border-subtle">
              <div className="flex items-center gap-2.5">
                <div className="bg-surface p-2 rounded-xl text-primary border border-subtle shadow-xs">
                  <Sparkles size={18} className="shrink-0" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-base sm:text-lg text-primary leading-none">AI Assistant</h2>
                  <span className="text-[10px] text-ghost font-medium">Kalam Kavya Intelligence</span>
                </div>
              </div>
              <button 
                onClick={() => setAIDrawerOpen(false)}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-ghost hover:text-primary transition-all flex items-center justify-center active:scale-95"
              >
                <X size={18} className="shrink-0" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-primary text-base border border-subtle' : 'bg-ink text-canvas font-bold shadow-xs'
                  }`}>
                    {msg.role === 'user' ? <MessageSquare size={14} className="shrink-0" /> : <Brain size={14} className="shrink-0" />}
                  </div>
                  <div className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-deep/50 border border-subtle text-primary rounded-tr-xs' 
                      : 'bg-black/5 dark:bg-white/5 border border-subtle text-primary rounded-tl-xs shadow-xs font-serif'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isStreaming && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-ink text-canvas font-bold shadow-xs">
                    <Brain size={14} className="shrink-0" />
                  </div>
                  <div className="max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm bg-deep/50 border border-subtle text-primary rounded-tl-xs whitespace-pre-wrap flex items-center gap-2 min-h-[44px]">
                    {streamedText ? (
                      streamedText
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                      </>
                    )}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-subtle bg-base/60">
              <div className="flex items-center gap-2 mb-2 text-[11px] text-ghost">
                <Cpu size={12} className="shrink-0" /> Provider: <span className="uppercase font-bold tracking-wider text-primary">{activeProvider}</span>
              </div>
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask about your world or manuscript..."
                  className="w-full bg-surface border border-subtle rounded-xl py-3 pl-4 pr-12 text-xs sm:text-sm text-primary placeholder:text-ghost focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none min-h-[48px] max-h-[120px]"
                  rows={1}
                  disabled={isStreaming}
                />
                {isStreaming ? (
                  <button 
                    onClick={cancelStream}
                    className="absolute right-2 top-2 p-2 bg-red-500/15 text-red-500 rounded-lg hover:bg-red-500/25 transition-all"
                  >
                    <Square size={16} fill="currentColor" className="shrink-0" />
                  </button>
                ) : (
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="absolute right-2 top-2 p-2 bg-ink text-canvas rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ink/90 transition-all shadow-xs active:scale-95"
                  >
                    <Send size={16} className="shrink-0" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
