import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import { useAIStore } from '@/stores/aiStore';
import { buildAssistantPrompt } from '@/lib/ai/promptEngine';
import { streamAI } from '@/lib/ai/streamAI';
import { Entity } from '@/types';
import { Send, Loader2, Save, X, User, Sparkles, Search, Paperclip } from 'lucide-react';
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
    
    // Assemble context payload
    const forcedEntities = entities.filter(e => selectedEntityIds.has(e.id));
    
    try {
      const { systemPrompt } = await buildAssistantPrompt({
        projectId: activeProjectId,
        forcedEntities
      });

      // Construct user payload holding conversation history
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

  return (
    <div className="flex flex-col md:flex-row h-full min-h-[550px] border border-subtle rounded-xl overflow-hidden bg-base shadow-sm relative">
      
      {/* Left Panel: Context Selector */}
      <div className={`w-full md:w-[260px] bg-surface border-b md:border-b-0 md:border-r border-subtle flex flex-col shrink-0 h-[280px] md:h-full max-h-full ${showMobileContext ? 'flex' : 'hidden md:flex'}`}>
        <div className="p-4 border-b border-subtle flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base md:text-lg text-primary">Context Attachments</h3>
            <p className="text-xs text-secondary mt-0.5">Force AI to reference these items</p>
          </div>
          <button 
            onClick={() => setShowMobileContext(false)}
            className="md:hidden p-1 text-ghost hover:text-primary"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-3 border-b border-subtle">
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredEntities.length === 0 ? (
            <p className="text-sm text-ghost italic">No entities in project yet.</p>
          ) : searchedEntities.length === 0 ? (
            <p className="text-sm text-ghost italic">No entities match your search.</p>
          ) : (
            Object.entries(groupedEntities).sort(([a], [b]) => a.localeCompare(b)).map(([type, typeEntities]) => (
              <div key={type} className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-ghost/80 px-2">{type.replace(/_/g, ' ')}</h4>
                {typeEntities.map(entity => (
                  <label key={entity.id} className="flex items-center gap-3 p-2 rounded hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
                    <input 
                      type="checkbox"
                      className="accent-amber-from w-4 h-4 cursor-pointer"
                      checked={selectedEntityIds.has(entity.id)}
                      onChange={() => toggleEntity(entity.id)}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-primary truncate">{entity.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel: Chat Area */}
      <div className="flex-1 flex flex-col h-full min-h-[400px] relative">
        
        {/* Header */}
        <div className="p-4 border-b border-subtle flex items-center justify-between shrink-0 bg-base">
          <h2 className="font-serif text-lg sm:text-xl text-primary">Lore Generator</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowMobileContext(!showMobileContext)} 
              className="md:hidden flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-surface border border-subtle text-secondary font-medium hover:text-primary transition-colors"
            >
              <Paperclip size={14} /> Attachments ({selectedEntityIds.size})
            </button>
            <div className="px-2.5 sm:px-3 py-1 bg-surface rounded-full border border-subtle font-mono text-[9px] sm:text-[10px] text-secondary tracking-wider">
              {activeProvider.toUpperCase()} / {modelName}
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && !isStreaming && !isBuildingContext && (
            <div className="h-full flex items-center justify-center">
              <p className="text-ghost text-sm italic text-center max-w-sm">
                Attach context from the left, then ask a question or generate new lore.
              </p>
            </div>
          )}
          
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex items-start gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${msg.role === 'user' ? 'bg-primary text-base' : 'bg-amber-from text-black'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                </div>
                <div 
                  className={`rounded-xl p-4 shadow-sm whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-elevated border border-subtle text-primary font-sans text-sm'
                      : 'bg-surface border border-subtle text-primary font-serif text-[15px] leading-relaxed'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
              {msg.role === 'assistant' && (
                <div className="mt-2 ml-12">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => openSaveModal(msg.content)}
                    className="text-xs text-ghost hover:text-amber-from py-1 h-auto"
                  >
                    <Save size={14} className="mr-1 inline-block" /> Save to World Bible
                  </Button>
                </div>
              )}
            </div>
          ))}

          {/* Active Stream */}
          {(isStreaming || isBuildingContext) && (
            <div className="flex flex-col items-start">
              <div className="flex items-start gap-3 max-w-[85%] flex-row">
                <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 bg-amber-from text-black">
                  <Sparkles size={16} />
                </div>
                <div className="rounded-xl p-4 shadow-sm bg-surface border border-subtle text-primary font-serif text-[15px] leading-relaxed whitespace-pre-wrap">
                  {isBuildingContext ? (
                    <span className="flex items-center gap-2 text-ghost italic text-sm font-sans">
                      <Loader2 size={14} className="animate-spin" /> Building context...
                    </span>
                  ) : streamedText ? (
                    streamedText
                  ) : (
                    <span className="flex items-center gap-2 text-ghost italic text-sm font-sans">
                      <Loader2 size={14} className="animate-spin" /> Thinking...
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-surface border-t border-subtle shrink-0">
          <div className="flex gap-4">
            <Textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question or generate lore... (Shift+Enter for newline)"
              className="flex-1 min-h-[60px] max-h-[200px]"
            />
            <div className="flex flex-col justify-end">
              {isStreaming ? (
                <Button variant="destructive" onClick={cancelStream} className="h-full px-6">
                  Stop
                </Button>
              ) : (
                <Button variant="primary" onClick={handleGenerate} disabled={!input.trim() || !activeProjectId || isBuildingContext} className="h-full px-6 bg-amber-from text-black border-amber-to hover:opacity-90">
                  <Send size={18} />
                </Button>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Save Modal */}
      {saveModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-base/80 backdrop-blur-sm p-4">
          <div className="bg-elevated border border-subtle rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-full">
            <div className="flex items-center justify-between p-4 border-b border-subtle">
              <h3 className="font-serif text-lg text-primary">Save to World Bible</h3>
              <button onClick={() => setSaveModalOpen(false)} className="text-ghost hover:text-primary">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="space-y-2">
                <Label>Entity Name</Label>
                <Input 
                  value={entityToSave.name}
                  onChange={e => setEntityToSave(prev => ({...prev, name: e.target.value}))}
                  placeholder="e.g. The Sapphire Throne"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={entityToSave.type}
                  onValueChange={val => setEntityToSave(prev => ({...prev, type: val}))}
                  options={dynamicEntityTypes}
                />
              </div>
              <div className="space-y-2">
                <Label>Generated Content (Preview)</Label>
                <div className="text-sm text-secondary bg-surface border border-subtle rounded-md p-3 max-h-48 overflow-y-auto font-serif">
                  {entityToSave.content}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-subtle flex justify-end gap-3 bg-surface">
              <Button variant="ghost" onClick={() => setSaveModalOpen(false)}>Cancel</Button>
              <Button variant="primary" className="bg-amber-from text-black border-amber-to" onClick={handleSaveToWorldBible} disabled={!entityToSave.name.trim()}>
                <Save size={16} className="mr-2" /> Save Entity
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
