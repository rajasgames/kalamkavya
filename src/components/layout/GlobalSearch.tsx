import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, FileText, BookOpen, Lightbulb, X } from 'lucide-react';
import { useSearchStore } from '@/stores/searchStore';
import { useStoryStore } from '@/stores/storyStore';
import { useUIStore } from '@/stores/uiStore';

type SearchResultType = 'character' | 'entity' | 'scene' | 'note';

interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  excerpt: string;
  categorySlug?: string;
}

const RECENT_SEARCHES_KEY = 'kalam-kavya-recent-searches';

export function GlobalSearch() {
  const { isOpen, closeSearch } = useSearchStore();
  const { activeProjectId, entities, scenes, notes } = useStoryStore();
  const { setActivePillar, setActiveSubView } = useUIStore();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize recent searches
  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) {
          setRecentSearches(JSON.parse(stored));
        }
      } catch (e) {
        console.error(e);
      }
      setQuery('');
      setDebouncedQuery('');
      setActiveIndex(-1);
      // Focus after a tick to allow render
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setActiveIndex(0); // Reset selection on new search
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Execute Search
  const searchResults = useMemo(() => {
    if (debouncedQuery.length < 2 || !activeProjectId) {
      return { characters: [], entities: [], scenes: [], notes: [] };
    }

    const lowerQ = debouncedQuery.toLowerCase();

    const getExcerpt = (text: string): string => {
      if (!text) return '';
      const idx = text.toLowerCase().indexOf(lowerQ);
      if (idx === -1) return text.substring(0, 60) + '...';
      const start = Math.max(0, idx - 30);
      const end = Math.min(text.length, idx + lowerQ.length + 30);
      return (start > 0 ? '...' : '') + text.substring(start, end) + (end < text.length ? '...' : '');
    };

    const cMatches = entities
      .filter(e => e.type === 'character' && e.name.toLowerCase().includes(lowerQ))
      .slice(0, 5)
      .map(e => ({ id: e.id, type: 'character' as const, title: e.name, excerpt: '' }));

    const eMatches = entities
      .filter(e => e.type === 'world-bible' && e.name.toLowerCase().includes(lowerQ))
      .slice(0, 5)
      .map(e => ({ id: e.id, type: 'entity' as const, title: e.name, excerpt: '', categorySlug: e.categorySlug }));

    const sMatches = scenes
      .filter(s => s.title.toLowerCase().includes(lowerQ) || s.content.toLowerCase().includes(lowerQ))
      .slice(0, 5)
      .map(s => ({ id: s.id, type: 'scene' as const, title: s.title, excerpt: getExcerpt(s.content) }));

    const nMatches = notes
      .filter(n => n.title.toLowerCase().includes(lowerQ) || n.body.toLowerCase().includes(lowerQ))
      .slice(0, 5)
      .map(n => ({ id: n.id, type: 'note' as const, title: n.title, excerpt: getExcerpt(n.body) }));

    return { characters: cMatches, entities: eMatches, scenes: sMatches, notes: nMatches };
  }, [debouncedQuery, entities, scenes, notes, activeProjectId]);

  // Flattened array for keyboard nav
  const flattendResults = useMemo(() => {
    if (debouncedQuery.length < 2) {
      return recentSearches;
    }
    return [
      ...searchResults.characters,
      ...searchResults.entities,
      ...searchResults.scenes,
      ...searchResults.notes
    ];
  }, [debouncedQuery, searchResults, recentSearches]);

  const handleSelect = (item: SearchResult) => {
    // Add to recents
    const newRecents = [item, ...recentSearches.filter(r => r.id !== item.id)].slice(0, 5);
    setRecentSearches(newRecents);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newRecents));

    closeSearch();

    // Navigate
    switch (item.type) {
      case 'character':
        setActivePillar('cast');
        setActiveSubView('characters');
        navigate('/cast/characters');
        // Ideally we'd set active character, but we just navigate to characters view
        break;
      case 'entity':
        setActivePillar('worldbible');
        setActiveSubView(item.categorySlug || 'atlas');
        navigate(`/world-bible/${item.categorySlug || 'atlas'}`);
        break;
      case 'scene':
        setActivePillar('manuscript');
        setActiveSubView('editor');
        useStoryStore.setState({ activeSceneId: item.id });
        navigate('/manuscript/editor');
        break;
      case 'note':
        setActivePillar('toolkit');
        setActiveSubView('ideas');
        navigate('/toolkit/ideas');
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSearch();
      return;
    }

    if (flattendResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1 >= flattendResults.length ? 0 : prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev <= 0 ? flattendResults.length - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < flattendResults.length) {
        handleSelect(flattendResults[activeIndex]);
      }
    }
  };

  if (!isOpen) return null;

  const renderHighlightedText = (text: string) => {
    if (!debouncedQuery || debouncedQuery.length < 2) return text;
    const parts = text.split(new RegExp(`(${debouncedQuery})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === debouncedQuery.toLowerCase() ? (
        <span key={i} className="text-amber-from bg-amber-from/10 px-0.5 rounded">{part}</span>
      ) : (
        part
      )
    );
  };

  const getIconForType = (type: SearchResultType) => {
    switch (type) {
      case 'character': return <User size={14} className="text-primary" />;
      case 'entity': return <BookOpen size={14} className="text-sage" />;
      case 'scene': return <FileText size={14} className="text-amber-from" />;
      case 'note': return <Lightbulb size={14} className="text-destructive" />;
    }
  };

  const getLabelForType = (type: SearchResultType) => {
    switch (type) {
      case 'character': return 'Character';
      case 'entity': return 'World Bible';
      case 'scene': return 'Scene';
      case 'note': return 'Idea';
    }
  };

  const renderResultItem = (item: SearchResult, globalIndex: number) => {
    const isActive = activeIndex === globalIndex;
    return (
      <div 
        key={item.id}
        className={`flex flex-col p-3 rounded-lg cursor-pointer transition-colors ${
          isActive ? 'bg-surface border-l-2 border-amber-from' : 'hover:bg-black/5 dark:hover:bg-white/5 border-l-2 border-transparent'
        }`}
        onClick={() => handleSelect(item)}
        onMouseEnter={() => setActiveIndex(globalIndex)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-elevated border border-subtle flex items-center justify-center shrink-0 shadow-sm">
              {getIconForType(item.type)}
            </div>
            <span className={`font-sans font-medium text-[15px] ${isActive ? 'text-primary' : 'text-secondary'}`}>
              {renderHighlightedText(item.title)}
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-ghost bg-elevated px-1.5 py-0.5 rounded border border-subtle">
            {getLabelForType(item.type)}
          </span>
        </div>
        {item.excerpt && (
          <div className="mt-1.5 pl-8">
            <p className="text-xs text-secondary font-sans leading-relaxed line-clamp-1 italic">
              {renderHighlightedText(item.excerpt)}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] bg-black/40 backdrop-blur-sm p-4 font-sans" onClick={closeSearch}>
      <div 
        className="w-full max-w-2xl bg-base rounded-2xl shadow-2xl border border-subtle overflow-hidden flex flex-col max-h-[70vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-subtle bg-surface">
          <Search className="text-ghost mr-3 shrink-0" size={20} />
          <input 
            ref={inputRef}
            className="flex-1 bg-transparent border-none outline-none text-lg text-primary placeholder-ghost"
            placeholder="Search characters, scenes, notes..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {query.length > 0 && (
            <button onClick={() => setQuery('')} className="p-1 text-ghost hover:text-primary rounded-md hover:bg-black/5 mr-2">
              <X size={16} />
            </button>
          )}
          <div className="text-[10px] font-mono text-ghost flex items-center gap-1 border border-subtle px-1.5 py-0.5 rounded bg-elevated shrink-0">
            ESC
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {debouncedQuery.length < 2 ? (
            <div className="p-4">
              <h3 className="text-xs font-semibold text-ghost uppercase tracking-wider mb-2 px-2">Frequently Visited</h3>
              {recentSearches.length === 0 ? (
                <p className="text-sm text-secondary px-2">No recent searches.</p>
              ) : (
                <div className="flex flex-col gap-1">
                  {recentSearches.map((item, idx) => renderResultItem(item, idx))}
                </div>
              )}
            </div>
          ) : flattendResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Search className="text-ghost mb-4 opacity-50" size={32} />
              <p className="text-primary font-medium mb-1">No results for "{debouncedQuery}"</p>
              <p className="text-sm text-secondary mb-4">Try checking your spelling or using fewer words.</p>
              <button 
                onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                className="text-sm px-4 py-2 rounded-lg bg-surface border border-subtle text-primary hover:bg-elevated transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 p-2">
              {/* Group Rendering */}
              {(() => {
                let globalOffset = 0;
                return (
                  <>
                    {searchResults.characters.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold text-ghost uppercase tracking-wider mb-2 px-2 flex items-center justify-between">
                          Characters
                          <span className="text-[10px] opacity-70 font-normal normal-case">Top 5</span>
                        </h3>
                        <div className="flex flex-col gap-1">
                          {searchResults.characters.map((item) => renderResultItem(item, globalOffset++))}
                        </div>
                      </div>
                    )}
                    {searchResults.entities.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold text-ghost uppercase tracking-wider mt-4 mb-2 px-2 flex items-center justify-between">
                          World Bible
                          <span className="text-[10px] opacity-70 font-normal normal-case">Top 5</span>
                        </h3>
                        <div className="flex flex-col gap-1">
                          {searchResults.entities.map((item) => renderResultItem(item, globalOffset++))}
                        </div>
                      </div>
                    )}
                    {searchResults.scenes.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold text-ghost uppercase tracking-wider mt-4 mb-2 px-2 flex items-center justify-between">
                          Scenes
                          <span className="text-[10px] opacity-70 font-normal normal-case">Top 5</span>
                        </h3>
                        <div className="flex flex-col gap-1">
                          {searchResults.scenes.map((item) => renderResultItem(item, globalOffset++))}
                        </div>
                      </div>
                    )}
                    {searchResults.notes.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold text-ghost uppercase tracking-wider mt-4 mb-2 px-2 flex items-center justify-between">
                          Ideas & Notes
                          <span className="text-[10px] opacity-70 font-normal normal-case">Top 5</span>
                        </h3>
                        <div className="flex flex-col gap-1">
                          {searchResults.notes.map((item) => renderResultItem(item, globalOffset++))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-subtle bg-surface px-4 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 text-[10px] text-ghost font-mono">
            <span className="flex items-center gap-1">
              <span className="border border-subtle px-1 rounded bg-elevated">↑</span>
              <span className="border border-subtle px-1 rounded bg-elevated">↓</span>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <span className="border border-subtle px-1 rounded bg-elevated">↵</span>
              Open
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
