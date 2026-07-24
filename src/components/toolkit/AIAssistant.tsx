import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '@/stores/storyStore';
import { useAIStore } from '@/stores/aiStore';
import { buildAssistantPrompt } from '@/lib/ai/promptEngine';
import { streamAI } from '@/lib/ai/streamAI';
import { Entity } from '@/types';
import { Send, Loader2, Save, X, User, Sparkles, Search, Paperclip, Check } from 'lucide-react';
import { Button, Textarea, Input, Label, Select } from '@/components/ui';
import { getEntityTypesForGenre } from '@/lib/genres/genreRegistry';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export function AIAssistant() {
  const { activeProjectId, activeProject, entities, addEntity, addGenerationLog } = useStoryStore();
  const { activeProvider, providers, isStreaming, streamedText, clearStream, cancelStream } = useAIStore();
  
  const [selectedEntityIds, setSelectedEntityIds] = useState<Set<string>>(new Set());
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [entityToSave, setEntityToSave] = useState<{name: string, type: string, content: string}>({ name: '', type: 'Lore', content: '' });
  const [isBuildingContext, setIsBuildingContext] = useState(false);
  const [contextSearch, setContextSearch] = useState('');
  const [showMobileContext, setShowMobileContext] = useState(false);

  const dynamicEntityTypes = useMemo(() => getEntityTypesForGenre(activeProject?.genreModules), [activeProject?.genreModules]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const activeSettings = providers[activeProvider];
  const modelName = activeSettings?.model || 'Unknown Model';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamedText]);

  const toggleEntity = (id: string) => {
    setSelectedEntityIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleGenerate = async () => {
    if (!input.trim() || !activeProjectId || isStreaming) return;
    
    const userMsgContent = input.trim();
    setInput('');
    
    const newMessages = [...messages, { id: crypto.randomUUID(), role: 'user' as const, content: userMsgContent }];
    setMessages(newMessages);

    setIsBuildingContext(true);
    
    const forcedEntities = entities.filter(e => selectedEntityIds.has(e.id));
    
    try {
      const { systemPrompt } = await buildAssistantPrompt({
        projectId: activeProjectId,
        forcedEntities
      });

      const historyContext = newMessages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n');
      const payload = `Chat History:\n${historyContext}\n\nUser: ${userMsgContent}`;

      clearStream();
      setIsBuildingContext(false);
      
      addGenerationLog({
        id: crypto.randomUUID(),
        projectId: activeProjectId,
        timestamp: Date.now(),
        entityCount: forcedEntities.length
      });
      
      await streamAI({
        systemPrompt,
        userMessage: payload,
        onChunk: () => {},
        onDone: () => {
          const finalOutput = useAIStore.getState().streamedText;
          setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: finalOutput }]);
          clearStream();
        },
        onError: (code) => {
          console.error(`AI Assistant Stream Error: ${code}`);
          const errorMsg = `[Connection Error: ${code}]`;
          setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: errorMsg }]);
          clearStream();
        }
      });
    } catch (e) {
      console.error(e);
      setIsBuildingContext(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const openSaveModal = (content: string) => {
    setEntityToSave({
      name: '',
      type: 'Lore',
      content
    });
    setSaveModalOpen(true);
  };

  const handleSaveToWorldBible = () => {
    if (!activeProjectId || !entityToSave.name.trim()) return;
    
    const newEntity: Entity = {
      id: crypto.randomUUID(),
      projectId: activeProjectId,
      name: entityToSave.name.trim(),
      type: entityToSave.type,
      categorySlug: entityToSave.type.toLowerCase(),
      data: {
        description: entityToSave.content
      },
      hasAIRule: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    addEntity(newEntity);
    setSaveModalOpen(false);
  };

  const filteredEntities = entities.filter(e => e.projectId === activeProjectId);
  const searchedEntities = filteredEntities.filter(e => e.name.toLowerCase().includes(contextSearch.toLowerCase()));
  const groupedEntities = searchedEntities.reduce((acc, entity) => {
    if (!acc[entity.type]) acc[entity.type] = [];
    acc[entity.type].push(entity);
    return acc;
  }, {} as Record<string, Entity[]>);

  const contextSelectorContent = (
    <div className="flex flex-col h-full bg-surface">
      <div className="p-3.5 sm:p-4 border-b border-subtle flex items-center justify-between shrink-0">
        <div>
          <h3 className="font-serif font-bold text-sm sm:text-base text-primary">Context Attachments</h3>
          <p className="text-[11px] text-secondary mt-0.5">Select entities to include in prompt context</p>
        </div>
        <button 
          onClick={() => setShowMobileContext(false)}
          className="md:hidden p-1.5 rounded-lg text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5"
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-2.5 sm:p-3 border-b border-subtle shrink-0">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ghost" />
          <Input 
            placeholder="Search entities..." 
            value={contextSearch} 
            onChange={e => setContextSearch(e.target.value)} 
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        {filteredEntities.length === 0 ? (
          <p className="text-xs text-ghost italic text-center py-4">No entities in current project.</p>
        ) : searchedEntities.length === 0 ? (
          <p className="text-xs text-ghost italic text-center py-4">No entities match your search.</p>
        ) : (
          Object.entries(groupedEntities).sort(([a], [b]) => a.localeCompare(b)).map(([type, typeEntities]) => (
            <div key={type} className="space-y-1">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-terracotta px-2 mb-1">{type.replace(/_/g, ' ')}</h4>
              {typeEntities.map(entity => {
                const isSelected = selectedEntityIds.has(entity.id);
                return (
                  <label 
                    key={entity.id} 
                    onClick={() => toggleEntity(entity.id)}
                    className={`flex items-center gap-2.5 p-2 rounded-lg transition-all duration-150 cursor-pointer text-xs ${
                      isSelected ? 'bg-terracotta/10 text-terracotta font-medium border border-terracotta/20' : 'hover:bg-black/5 dark:hover:bg-white/5 text-primary border border-transparent'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${
                      isSelected ? 'bg-terracotta border-terracotta text-white' : 'border-subtle bg-base'
                    }`}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className="truncate flex-1">{entity.name}</span>
                  </label>
                );
              })}
            </div>
          ))
        )}
      </div>
      {selectedEntityIds.size > 0 && (
        <div className="p-3 border-t border-subtle bg-base/50 shrink-0 flex items-center justify-between">
          <span className="text-xs text-secondary font-medium">{selectedEntityIds.size} attached</span>
          <button 
            onClick={() => setSelectedEntityIds(new Set())}
            className="text-[11px] text-terracotta hover:underline font-medium"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-220px)] min-h-[500px] max-h-[850px] border border-subtle rounded-2xl overflow-hidden bg-base shadow-lg relative font-sans">
      
      {/* Desktop Context Column */}
      <div className="hidden md:flex w-[260px] lg:w-[280px] border-r border-subtle shrink-0 h-full flex-col">
        {contextSelectorContent}
      </div>

      {/* Mobile Context Overlay Drawer */}
      <AnimatePresence>
        {showMobileContext && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileContext(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed inset-y-0 left-0 w-[85%] max-w-xs bg-surface z-50 shadow-2xl border-r border-subtle flex flex-col"
            >
              {contextSelectorContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        
        {/* Header */}
        <div className="px-3 sm:px-5 py-3 border-b border-subtle flex items-center justify-between shrink-0 bg-surface/80 backdrop-blur-md">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-terracotta/15 text-terracotta flex items-center justify-center shrink-0">
              <Sparkles size={16} />
            </div>
            <div className="min-w-0">
              <h2 className="font-serif font-bold text-sm sm:text-base text-primary truncate">Lore Generator & AI Assistant</h2>
              <p className="text-[10px] text-ghost truncate hidden sm:block">Ask questions or expand world lore in real-time</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => setShowMobileContext(true)} 
              className="md:hidden flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl bg-terracotta/10 border border-terracotta/30 text-terracotta font-semibold hover:bg-terracotta/20 transition-all active:scale-95"
            >
              <Paperclip size={13} /> Context ({selectedEntityIds.size})
            </button>
            <div className="px-2.5 py-1 bg-black/5 dark:bg-white/5 rounded-full border border-subtle font-mono text-[9px] sm:text-[10px] text-secondary tracking-wider truncate max-w-[140px] sm:max-w-xs">
              <span className="text-terracotta uppercase font-bold">{activeProvider}</span> / {modelName}
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
          {messages.length === 0 && !isStreaming && !isBuildingContext && (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center mb-3">
                <Sparkles size={24} />
              </div>
              <h3 className="font-serif font-bold text-base text-primary mb-1">Your AI Co-Author is Ready</h3>
              <p className="text-xs sm:text-sm text-ghost max-w-sm leading-relaxed">
                Select entity attachments from the sidebar, then type a question or instruction to brainstorm world-building details.
              </p>
            </div>
          )}
          
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex items-start gap-2.5 sm:gap-3 max-w-[92%] sm:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center mt-0.5 shadow-xs ${
                  msg.role === 'user' ? 'bg-primary text-base' : 'bg-terracotta text-white font-bold'
                }`}>
                  {msg.role === 'user' ? <User size={15} /> : <Sparkles size={15} />}
                </div>
                <div 
                  className={`rounded-2xl p-3 sm:p-4 shadow-sm whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-terracotta/15 border border-terracotta/25 text-primary font-sans text-xs sm:text-sm rounded-tr-xs'
                      : 'bg-surface border border-subtle text-primary font-serif text-xs sm:text-[15px] leading-relaxed rounded-tl-xs'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
              {msg.role === 'assistant' && (
                <div className="mt-1.5 ml-9 sm:ml-11">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => openSaveModal(msg.content)}
                    className="text-[11px] text-ghost hover:text-terracotta py-0.5 px-2 h-auto flex items-center gap-1.5 rounded-lg hover:bg-terracotta/10"
                  >
                    <Save size={13} /> Save to World Bible
                  </Button>
                </div>
              )}
            </div>
          ))}

          {/* Active Stream */}
          {(isStreaming || isBuildingContext) && (
            <div className="flex flex-col items-start">
              <div className="flex items-start gap-2.5 sm:gap-3 max-w-[92%] sm:max-w-[85%] flex-row">
                <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center mt-0.5 bg-terracotta text-white font-bold shadow-xs">
                  <Sparkles size={15} />
                </div>
                <div className="rounded-2xl p-3 sm:p-4 shadow-sm bg-surface border border-subtle text-primary font-serif text-xs sm:text-[15px] leading-relaxed whitespace-pre-wrap rounded-tl-xs">
                  {isBuildingContext ? (
                    <span className="flex items-center gap-2 text-ghost italic text-xs sm:text-sm font-sans">
                      <Loader2 size={14} className="animate-spin text-terracotta" /> Gathering context...
                    </span>
                  ) : streamedText ? (
                    streamedText
                  ) : (
                    <span className="flex items-center gap-2 text-ghost italic text-xs sm:text-sm font-sans">
                      <Loader2 size={14} className="animate-spin text-terracotta" /> Composing response...
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-2.5 sm:p-4 bg-surface/90 border-t border-subtle shrink-0">
          <div className="flex gap-2 sm:gap-3 items-end">
            <Textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question or request lore generation... (Shift+Enter for newline)"
              className="flex-1 min-h-[48px] max-h-[160px] text-xs sm:text-sm py-2.5 px-3.5 rounded-xl bg-base border border-subtle focus:border-terracotta/50 focus:ring-1 focus:ring-terracotta/50 resize-none"
            />
            <div className="flex shrink-0">
              {isStreaming ? (
                <Button variant="destructive" onClick={cancelStream} className="h-11 sm:h-12 px-4 rounded-xl text-xs sm:text-sm">
                  Stop
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={handleGenerate} 
                  disabled={!input.trim() || !activeProjectId || isBuildingContext} 
                  className="h-11 sm:h-12 px-4 sm:px-6 rounded-xl bg-terracotta text-white hover:bg-terracotta/90 disabled:opacity-40 shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Send size={16} />
                  <span className="hidden sm:inline text-xs sm:text-sm font-semibold">Send</span>
                </Button>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Save Modal */}
      <AnimatePresence>
        {saveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-elevated border border-subtle rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-subtle bg-surface">
                <h3 className="font-serif font-bold text-base sm:text-lg text-primary">Save to World Bible</h3>
                <button onClick={() => setSaveModalOpen(false)} className="p-1 rounded-lg text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5">
                  <X size={18} />
                </button>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Entity Name</Label>
                  <Input 
                    value={entityToSave.name}
                    onChange={e => setEntityToSave(prev => ({...prev, name: e.target.value}))}
                    placeholder="e.g. The Sapphire Throne"
                    autoFocus
                    className="h-9 text-xs sm:text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Category</Label>
                  <Select
                    value={entityToSave.type}
                    onValueChange={val => setEntityToSave(prev => ({...prev, type: val}))}
                    options={dynamicEntityTypes}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Generated Content (Preview)</Label>
                  <div className="text-xs sm:text-sm text-secondary bg-surface border border-subtle rounded-xl p-3 max-h-40 overflow-y-auto font-serif leading-relaxed">
                    {entityToSave.content}
                  </div>
                </div>
              </div>
              <div className="p-3 sm:p-4 border-t border-subtle flex items-center justify-end gap-2 bg-surface">
                <Button variant="ghost" size="sm" onClick={() => setSaveModalOpen(false)} className="text-xs">Cancel</Button>
                <Button variant="primary" size="sm" className="bg-terracotta text-white hover:bg-terracotta/90 text-xs" onClick={handleSaveToWorldBible} disabled={!entityToSave.name.trim()}>
                  <Save size={14} className="mr-1.5" /> Save Entity
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
