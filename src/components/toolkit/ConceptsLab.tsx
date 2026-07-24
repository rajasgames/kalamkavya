import React, { useState, useEffect, useRef } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import { useAIStore } from '@/stores/aiStore';
import { Note, NoteTint } from '@/types/story.types';
import { Plus, Sparkles, Trash2, X, Send, Palette } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { streamAI } from '@/lib/ai/streamAI';

const TINT_COLORS: { id: NoteTint; name: string; classes: string; dot: string }[] = [
  { id: 'neutral', name: 'Neutral', classes: 'bg-[#FEFDF9] dark:bg-[#2C2820]', dot: 'bg-[#FEFDF9] border border-subtle' },
  { id: 'amber', name: 'Amber', classes: 'bg-[#FDF3E1] dark:bg-[#3D2E1A]', dot: 'bg-[#FDF3E1]' },
  { id: 'sage', name: 'Sage', classes: 'bg-[#EAF0E9] dark:bg-[#1E2E20]', dot: 'bg-[#EAF0E9]' },
  { id: 'destructive', name: 'Clay', classes: 'bg-[#F5E6E3] dark:bg-[#3B221E]', dot: 'bg-[#F5E6E3]' },
  { id: 'blue-grey', name: 'Blue-Grey', classes: 'bg-[#E8EDF2] dark:bg-[#1A2633]', dot: 'bg-[#E8EDF2]' },
];

export function ConceptsLab() {
  const { activeProjectId, notes, addNote, updateNote, deleteNote } = useStoryStore();
  const [isAdding, setIsAdding] = useState(false);
  
  if (!activeProjectId) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-secondary">Please select a project to use the Concepts Lab.</p>
      </div>
    );
  }

  const projectNotes = notes.filter(n => n.projectId === activeProjectId).sort((a, b) => b.updatedAt - a.updatedAt);

  const handleAddNew = () => {
    setIsAdding(true);
  };

  const handleCreateNote = async (title: string, body: string, color: NoteTint) => {
    if (!title.trim() && !body.trim()) {
      setIsAdding(false);
      return;
    }
    
    await addNote({
      id: crypto.randomUUID(),
      projectId: activeProjectId,
      title: title.trim() || 'Untitled Idea',
      body: body.trim(),
      color,
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col h-full bg-base">
      <div className="p-6 shrink-0 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-primary">Concepts Lab</h2>
          <p className="text-sm text-secondary">A freeform scratchpad for ideas and brainstorming.</p>
        </div>
        <Button variant="primary" onClick={handleAddNew} className="bg-amber-from text-black border-amber-to hover:opacity-90">
          <Plus size={16} className="mr-2" /> New Idea
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pt-0">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {isAdding && (
            <div className="break-inside-avoid mb-6">
              <NoteCard 
                isNew
                onSave={(t, b, c) => handleCreateNote(t, b, c)}
                onCancel={() => setIsAdding(false)}
              />
            </div>
          )}
          
          {projectNotes.map(note => (
            <div key={note.id} className="break-inside-avoid mb-6">
              <NoteCard 
                note={note} 
                onUpdate={(updated) => updateNote(updated)}
                onDelete={() => deleteNote(note.id)}
              />
            </div>
          ))}

          {projectNotes.length === 0 && !isAdding && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-ghost border-2 border-dashed border-subtle rounded-xl">
              <p className="font-hand text-2xl mb-2">It's pretty quiet in here...</p>
              <Button variant="ghost" onClick={handleAddNew}>Write down your first idea</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NoteCard({ 
  note, 
  isNew = false, 
  onSave, 
  onUpdate, 
  onDelete, 
  onCancel 
}: { 
  note?: Note, 
  isNew?: boolean,
  onSave?: (title: string, body: string, color: NoteTint) => void,
  onUpdate?: (note: Note) => void,
  onDelete?: () => void,
  onCancel?: () => void
}) {
  const [title, setTitle] = useState(note?.title || '');
  const [body, setBody] = useState(note?.body || '');
  const [color, setColor] = useState<NoteTint>(note?.color || 'neutral');
  const [tags] = useState<string[]>(note?.tags || []);
  
  const [isEditing, setIsEditing] = useState(isNew);
  const [showPalette, setShowPalette] = useState(false);
  const [showBrainstorm, setShowBrainstorm] = useState(false);
  const [brainstormInput, setBrainstormInput] = useState('');
  
  const { isStreaming, streamedText, cancelStream, clearStream, activeProvider, providers } = useAIStore();
  const { activeProjectId, addGenerationLog } = useStoryStore();
  const [localChat, setLocalChat] = useState<{role: string, content: string}[]>([]);
  const [isGenerating, setIsGenerating] = useState(false); // local flag to match this specific card

  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const tintStyle = TINT_COLORS.find(t => t.id === color)?.classes || TINT_COLORS[0].classes;

  useEffect(() => {
    if (isEditing && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (isNew && onSave) {
      onSave(title, body, color);
    } else if (note && onUpdate) {
      onUpdate({ ...note, title, body, color, tags, updatedAt: Date.now() });
      setIsEditing(false);
    }
  };

  const handleBrainstormSubmit = async () => {
    if (!brainstormInput.trim() || isStreaming) return;

    const userQuery = brainstormInput.trim();
    setBrainstormInput('');
    setLocalChat(prev => [...prev, { role: 'user', content: userQuery }]);
    setIsGenerating(true);

    const activeSettings = providers[activeProvider];
    if (!activeSettings) {
      setIsGenerating(false);
      return;
    }

    const systemPrompt = `You are a creative brainstorming assistant. The user is writing ideas in a digital notebook.
Note Title: ${title || 'Untitled'}
Note Content: ${body || 'Empty'}

Please help them expand on their ideas, suggest alternatives, or answer their question. Keep responses relatively concise and highly creative.`;

    const chatHistory = localChat.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n');
    const payload = `Chat History:\n${chatHistory}\n\nUser: ${userQuery}`;

    clearStream();
    
    if (activeProjectId) {
      addGenerationLog({
        id: crypto.randomUUID(),
        projectId: activeProjectId,
        timestamp: Date.now(),
        entityCount: 0 // Context not explicit in freeform notes
      });
    }
    
    try {
      await streamAI({
        systemPrompt,
        userMessage: payload,
        onChunk: () => {},
        onDone: () => {
          const finalOutput = useAIStore.getState().streamedText;
          setLocalChat(prev => [...prev, { role: 'assistant', content: finalOutput }]);
          clearStream();
          setIsGenerating(false);
        },
        onError: (code) => {
          setLocalChat(prev => [...prev, { role: 'assistant', content: `[Error: ${code}]` }]);
          clearStream();
          setIsGenerating(false);
        }
      });
    } catch (e) {
      setIsGenerating(false);
    }
  };

  const appendToNote = (content: string) => {
    setBody(prev => prev ? `${prev}\n\n${content}` : content);
    if (!isEditing) setIsEditing(true);
  };

  const handleColorChange = (newColor: NoteTint) => {
    setColor(newColor);
    setShowPalette(false);
    if (!isNew && note && onUpdate) {
      onUpdate({ ...note, color: newColor, updatedAt: Date.now() });
    }
  };

  const autoResizeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
    setBody(e.target.value);
  };

  return (
    <div className={`relative flex flex-col rounded-xl shadow-sm border border-subtle transition-colors duration-200 ${tintStyle} overflow-hidden group`}>
      
      {/* Top Actions */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <div className="relative">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-ghost hover:text-primary hover:bg-black/5" onClick={() => setShowPalette(!showPalette)}>
            <Palette size={14} />
          </Button>
          {showPalette && (
            <div className="absolute top-full right-0 mt-1 p-2 bg-elevated border border-subtle rounded-lg shadow-lg flex gap-2 z-10">
              {TINT_COLORS.map(t => (
                <button 
                  key={t.id} 
                  className={`w-5 h-5 rounded-full ${t.dot} hover:ring-2 hover:ring-amber-from/50 transition-all`}
                  onClick={() => handleColorChange(t.id)}
                  title={t.name}
                />
              ))}
            </div>
          )}
        </div>
        
        {!isNew && (
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-ghost hover:text-amber-from hover:bg-amber-from/10" onClick={() => setShowBrainstorm(!showBrainstorm)}>
            <Sparkles size={14} />
          </Button>
        )}
        
        {!isNew && (
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-ghost hover:text-destructive hover:bg-destructive/10" onClick={onDelete}>
            <Trash2 size={14} />
          </Button>
        )}
        
        {isNew && (
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-ghost hover:text-destructive hover:bg-destructive/10" onClick={onCancel}>
            <X size={14} />
          </Button>
        )}
      </div>

      {/* Note Content */}
      <div className="p-5 flex flex-col gap-2 relative z-0" onClick={() => { if(!isEditing && !showBrainstorm) setIsEditing(true); }}>
        {isEditing ? (
          <input 
            ref={titleRef}
            className="w-full bg-transparent border-none outline-none font-hand font-bold text-[22px] text-primary placeholder-ghost placeholder:font-normal leading-tight"
            placeholder="Title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        ) : (
          <h3 className="font-hand font-bold text-[22px] text-primary leading-tight pr-24 min-h-[28px]">
            {title || 'Untitled Idea'}
          </h3>
        )}

        {isEditing ? (
          <textarea 
            ref={bodyRef}
            className="w-full bg-transparent border-none outline-none font-hand text-[18px] text-primary placeholder-ghost resize-none overflow-hidden leading-relaxed min-h-[100px]"
            placeholder="Jot down some thoughts..."
            value={body}
            onChange={autoResizeTextarea}
            onFocus={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
        ) : (
          <div className="font-hand text-[18px] text-primary whitespace-pre-wrap leading-relaxed min-h-[100px]">
            {body || <span className="text-ghost italic">Empty note</span>}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-black/5 dark:bg-white/5 rounded text-secondary font-sans text-[10px] uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Edit mode save button */}
        {isEditing && (
          <div className="flex justify-end mt-2">
            <Button variant="primary" size="sm" className="h-7 text-xs bg-black/10 dark:bg-white/10 hover:bg-black/20 text-primary border-none" onClick={handleSave}>
              {isNew ? 'Create' : 'Done'}
            </Button>
          </div>
        )}
      </div>

      {/* Brainstorm Mini-Chat */}
      {showBrainstorm && (
        <div className="border-t border-subtle bg-base/50 backdrop-blur-sm p-4 flex flex-col gap-3 max-h-[300px]">
          <div className="flex items-center justify-between">
            <h4 className="font-sans text-xs font-semibold text-secondary flex items-center gap-1 uppercase tracking-wider">
              <Sparkles size={12} className="text-amber-from" /> Brainstorm
            </h4>
            <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-ghost hover:text-primary" onClick={() => setShowBrainstorm(false)}>
              <X size={12} />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-sm font-sans">
            {localChat.length === 0 && !isGenerating && (
              <p className="text-ghost text-xs italic">Ask the AI to expand on this note, suggest variations, or draft a scene.</p>
            )}
            
            {localChat.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-2 rounded-lg max-w-[90%] whitespace-pre-wrap ${msg.role === 'user' ? 'bg-black/5 dark:bg-white/5 text-primary' : 'text-secondary'}`}>
                  {msg.content}
                </div>
                {msg.role === 'assistant' && (
                  <Button variant="ghost" size="sm" className="h-6 mt-1 text-[10px] text-amber-from hover:bg-amber-from/10" onClick={() => appendToNote(msg.content)}>
                    <Plus size={10} className="mr-1" /> Append to Note
                  </Button>
                )}
              </div>
            ))}
            
            {isGenerating && (
              <div className="flex flex-col items-start">
                <div className="p-2 rounded-lg max-w-[90%] whitespace-pre-wrap text-secondary">
                  {streamedText || <span className="italic">Thinking...</span>}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Input 
              value={brainstormInput} 
              onChange={e => setBrainstormInput(e.target.value)}
              placeholder="Ask AI..."
              className="h-8 text-xs font-sans"
              onKeyDown={e => e.key === 'Enter' && handleBrainstormSubmit()}
              disabled={isGenerating}
            />
            {isGenerating ? (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={cancelStream}>
                <X size={14} />
              </Button>
            ) : (
              <Button variant="primary" size="sm" className="h-8 w-8 p-0 bg-amber-from text-black border-amber-to" onClick={handleBrainstormSubmit} disabled={!brainstormInput.trim()}>
                <Send size={12} />
              </Button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
