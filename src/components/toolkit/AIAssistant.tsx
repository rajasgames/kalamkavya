import React, { useState, useRef, useEffect } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import { useAIStore } from '@/stores/aiStore';
import { buildAssistantPrompt } from '@/lib/ai/promptEngine';
import { streamAI } from '@/lib/ai/streamAI';
import { Entity } from '@/types';
import { Send, Loader2, Save, X } from 'lucide-react';
import { Button, Textarea, Input, Label, Select } from '@/components/ui';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const ENTITY_TYPES = [
  { value: 'Character', label: 'Character' },
  { value: 'Geography', label: 'Geography' },
  { value: 'Location', label: 'Location' },
  { value: 'Magic_System', label: 'Magic System' },
  { value: 'Lore', label: 'Lore' }
];

export function AIAssistant() {
  const { activeProjectId, entities, addEntity, addGenerationLog } = useStoryStore();
  const { activeProvider, providers, isStreaming, streamedText, clearStream, cancelStream } = useAIStore();
  
  const [selectedEntityIds, setSelectedEntityIds] = useState<Set<string>>(new Set());
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [entityToSave, setEntityToSave] = useState<{name: string, type: string, content: string}>({ name: '', type: 'Lore', content: '' });
  const [isBuildingContext, setIsBuildingContext] = useState(false);

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

  return (
    <div className="flex h-full border border-subtle rounded-xl overflow-hidden bg-base shadow-sm relative">
      
      {/* Left Panel: Context Selector */}
      <div className="w-[260px] bg-surface border-r border-subtle flex flex-col shrink-0 h-[600px] max-h-full">
        <div className="p-4 border-b border-subtle">
          <h3 className="font-serif text-lg text-primary">Context Attachments</h3>
          <p className="text-xs text-secondary mt-1">Force AI to reference these items</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredEntities.length === 0 ? (
            <p className="text-sm text-ghost italic">No entities in project yet.</p>
          ) : (
            filteredEntities.map(entity => (
              <label key={entity.id} className="flex items-center gap-3 p-2 rounded hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
                <input 
                  type="checkbox"
                  className="accent-amber-from w-4 h-4 cursor-pointer"
                  checked={selectedEntityIds.has(entity.id)}
                  onChange={() => toggleEntity(entity.id)}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-primary truncate">{entity.name}</span>
                  <span className="text-[10px] text-ghost uppercase tracking-wider">{entity.type}</span>
                </div>
              </label>
            ))
          )}
        </div>
      </div>

      {/* Right Panel: Chat Area */}
      <div className="flex-1 flex flex-col h-[600px] max-h-full relative">
        
        {/* Header */}
        <div className="p-4 border-b border-subtle flex items-center justify-between shrink-0 bg-base">
          <h2 className="font-serif text-xl text-primary">Lore Generator</h2>
          <div className="px-3 py-1 bg-surface rounded-full border border-subtle font-mono text-[10px] text-secondary tracking-wider">
            {activeProvider.toUpperCase()} / {modelName}
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
              <div 
                className={`max-w-[85%] rounded-xl p-4 shadow-sm whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-elevated border border-subtle text-primary font-sans text-sm'
                    : 'bg-surface border border-subtle text-primary font-serif text-[15px] leading-relaxed'
                }`}
              >
                {msg.content}
              </div>
              {msg.role === 'assistant' && (
                <div className="mt-2 ml-1">
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
              <div className="max-w-[85%] rounded-xl p-4 shadow-sm bg-surface border border-subtle text-primary font-serif text-[15px] leading-relaxed whitespace-pre-wrap">
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
              disabled={isStreaming || isBuildingContext}
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
                  options={ENTITY_TYPES}
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
