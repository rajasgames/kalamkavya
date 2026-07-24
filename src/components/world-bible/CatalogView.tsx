import { useState, useMemo, useEffect } from 'react';
import { useStoryStore } from '@/stores/storyStore';
import { Entity } from '@/types';
import { 
  FileText, Map, Sparkles, Sword, Users, BookOpen, User, 
  Search, Sparkle, Edit2, Plus, Clock 
} from 'lucide-react';
import { Input, Select } from '@/components/ui';

interface CatalogViewProps {
  onEntityClick: (entity: Entity) => void;
  onCreateNew?: (type: string) => void;
}

const getTypeIcon = (type: string, size = 16) => {
  switch (type) {
    case 'location':
    case 'region':
    case 'landmark':
      return <Map size={size} className="text-sage" />;
    case 'MAGIC_SYSTEM':
      return <Sparkles size={size} className="text-amber-from" />;
    case 'WEAPON':
      return <Sword size={size} className="text-clay" />;
    case 'faction':
    case 'race':
      return <Users size={size} className="text-amber-from" />;
    case 'character':
      return <User size={size} className="text-amber-from" />;
    case 'myth':
    case 'CULTURE':
      return <BookOpen size={size} className="text-secondary" />;
    default:
      return <FileText size={size} className="text-ghost" />;
  }
};

const getCategoryLabel = (type: string) => {
  switch (type) {
    case 'location':
    case 'region':
    case 'landmark': return 'Geography';
    case 'MAGIC_SYSTEM': return 'System';
    case 'WEAPON': return 'Gear';
    case 'faction':
    case 'race': return 'Society';
    case 'character': return 'Character';
    case 'myth':
    case 'CULTURE': return 'Culture';
    default: return 'Lore';
  }
};

export function CatalogView({ onEntityClick, onCreateNew }: CatalogViewProps) {
  const { entities } = useStoryStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [sortBy, setSortBy] = useState('updated-desc');
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [aiRulesOnly, setAiRulesOnly] = useState(false);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Exclude RARITY_TIER config entities from general catalog view
  const catalogEntities = useMemo(() => entities.filter(e => e.type !== 'RARITY_TIER'), [entities]);

  // Filter & Sort
  const filteredAndSorted = useMemo(() => {
    let result = [...catalogEntities];

    // Search Filter
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(e => {
        const nameMatch = e.name.toLowerCase().includes(q);
        const dataDesc = (e.data?.description || e.data?.physicalDescription || '') as string;
        const descMatch = dataDesc.toLowerCase().includes(q);
        return nameMatch || descMatch;
      });
    }

    // AI Rules Filter
    if (aiRulesOnly) {
      result = result.filter(e => e.hasAIRule || e.data?.aiRuleEnabled);
    }

    // Type Filter (AND logic inside type categories if needed, but it's an OR between selected categories)
    // Wait, requirement says "Filters combine with AND logic". But usually multiple type filters are OR (e.g. show Geography OR Weapons).
    // I will implement OR for type filters, AND for type + search + aiRule.
    if (typeFilters.length > 0) {
      result = result.filter(e => {
        let cat = '';
        if (['location', 'region', 'landmark'].includes(e.type)) cat = 'GEOGRAPHY';
        if (e.type === 'MAGIC_SYSTEM') cat = 'SYSTEM';
        if (e.type === 'WEAPON') cat = 'GEAR';
        if (['faction', 'race'].includes(e.type)) cat = 'SOCIETY';
        if (['CULTURE', 'myth'].includes(e.type)) cat = 'CULTURE';
        if (e.type === 'character') cat = 'CHARACTER';
        
        return typeFilters.includes(cat);
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'updated-desc': return (b.updatedAt || 0) - (a.updatedAt || 0);
        case 'created-desc': return (b.createdAt || 0) - (a.createdAt || 0);
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'type': return getCategoryLabel(a.type).localeCompare(getCategoryLabel(b.type));
        default: return 0;
      }
    });

    return result;
  }, [catalogEntities, debouncedSearch, aiRulesOnly, typeFilters, sortBy]);

  const toggleTypeFilter = (cat: string) => {
    if (typeFilters.includes(cat)) {
      setTypeFilters(typeFilters.filter(t => t !== cat));
    } else {
      setTypeFilters([...typeFilters, cat]);
    }
  };

  // EMPTY STATE: Category Picker
  if (catalogEntities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] max-w-2xl mx-auto text-center">
        <BookOpen size={48} className="text-ghost mb-4 opacity-50" />
        <h2 className="font-serif text-2xl font-bold text-primary mb-2">Your World is Empty</h2>
        <p className="text-secondary mb-8">Begin building your universe by creating your first entry. Choose a category below to get started.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {[
            { id: 'atlas', label: 'Atlas (Geography)', icon: Map, color: 'text-sage' },
            { id: 'systems', label: 'Magic Systems', icon: Sparkles, color: 'text-amber-from' },
            { id: 'gear', label: 'Weapons & Gear', icon: Sword, color: 'text-clay' },
            { id: 'societies', label: 'Factions & Races', icon: Users, color: 'text-amber-from' },
            { id: 'culture', label: 'Cultures & Myths', icon: BookOpen, color: 'text-secondary' },
            { id: 'catalog', label: 'Characters', icon: User, color: 'text-primary' },
          ].map(c => (
            <button
              key={c.id}
              onClick={() => onCreateNew?.(c.id)}
              className="flex flex-col items-center justify-center p-6 bg-surface border border-subtle rounded-xl hover:border-terracotta/30 shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all group"
            >
              <c.icon size={24} className={`${c.color} mb-3 group-hover:scale-110 transition-transform`} />
              <span className="font-bold text-sm text-primary">{c.label}</span>
              <span className="text-xs text-ghost mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus size={12} /> Create New
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Search and Sort Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-4 bg-surface border border-subtle rounded-xl">
        <div className="relative w-full md:w-96 shrink-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ghost" />
          <Input 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search lore, descriptions, properties..."
            className="pl-9 w-full bg-base border-subtle"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Clock size={16} className="text-ghost shrink-0 hidden md:block" />
          <Select 
            value={sortBy}
            onValueChange={setSortBy}
            options={[
              { value: 'updated-desc', label: 'Sort: Last Modified' },
              { value: 'created-desc', label: 'Sort: Newest First' },
              { value: 'name-asc', label: 'Sort: Name (A-Z)' },
              { value: 'name-desc', label: 'Sort: Name (Z-A)' },
              { value: 'type', label: 'Sort: Entity Type' },
            ]}
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {[
          { id: 'GEOGRAPHY', label: 'Geography' },
          { id: 'SYSTEM', label: 'Systems' },
          { id: 'GEAR', label: 'Gear' },
          { id: 'SOCIETY', label: 'Societies' },
          { id: 'CULTURE', label: 'Culture' },
          { id: 'CHARACTER', label: 'Characters' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => toggleTypeFilter(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              typeFilters.includes(cat.id)
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-base text-ghost border-subtle hover:text-primary hover:border-primary/30'
            }`}
          >
            {cat.label}
          </button>
        ))}

        <div className="w-px h-6 bg-subtle mx-1 hidden sm:block"></div>

        <button
          onClick={() => setAiRulesOnly(!aiRulesOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            aiRulesOnly
              ? 'bg-clay/10 text-clay border-clay/30 shadow-sm'
              : 'bg-base text-ghost border-subtle hover:text-clay hover:border-clay/30'
          }`}
        >
          <Sparkle size={14} className={aiRulesOnly ? 'text-clay' : 'text-ghost'} />
          AI Rules Only
        </button>

        {(typeFilters.length > 0 || aiRulesOnly || searchQuery) && (
          <button 
            onClick={() => {
              setTypeFilters([]);
              setAiRulesOnly(false);
              setSearchQuery('');
            }}
            className="text-xs text-clay hover:underline ml-2"
          >
            Clear All
          </button>
        )}

        {onCreateNew && (
          <button
            onClick={() => onCreateNew('character')}
            className="w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold bg-terracotta text-white hover:bg-terracotta/90 transition-all shadow-sm mt-2 sm:mt-0"
          >
            <Plus size={14} /> Master New Entry
          </button>
        )}
      </div>

      {/* Grid */}
      {filteredAndSorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-ghost border-2 border-dashed border-subtle rounded-xl gap-3">
          <Search size={32} className="opacity-50" />
          <p className="text-sm">No entries found matching your criteria.</p>
          {onCreateNew && (
            <button
              onClick={() => onCreateNew('character')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-terracotta text-white hover:bg-terracotta/90 transition-all shadow-md mt-1"
            >
              <Plus size={14} /> Create Master Entry
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAndSorted.map(entity => (
            <div 
              key={entity.id}
              onClick={() => onEntityClick(entity)}
              className="group flex flex-col bg-surface border border-subtle p-3 rounded-xl cursor-pointer hover:border-terracotta/30 shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-surface flex items-center justify-center border border-subtle group-hover:bg-amber-from/10 group-hover:border-amber-from/30 transition-colors">
                      {getTypeIcon(entity.type, 14)}
                    </div>
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                      {getCategoryLabel(entity.type)}
                    </span>
                  </div>
                  {(entity.hasAIRule || Boolean(entity.data?.aiRuleEnabled)) && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-clay/10 text-clay border border-clay/20 uppercase tracking-wider">
                      #AI-Rule
                    </span>
                  )}
                </div>
                
                <h3 className="font-serif font-bold text-primary text-base leading-tight group-hover:text-amber-from transition-colors line-clamp-1">
                  {entity.name}
                </h3>
                
                <p className="text-xs text-ghost line-clamp-1">
                  {String(entity.data?.description || entity.data?.physicalDescription || entity.data?.howItWorks || 'No description provided.')}
                </p>

                <div className="flex justify-end mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-terracotta hover:text-terracotta/80 bg-terracotta/10 p-1.5 rounded-md">
                    <Edit2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
