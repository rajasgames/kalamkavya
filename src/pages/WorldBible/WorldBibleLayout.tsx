import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Map, Grid } from 'lucide-react';
import { Entity } from '@/types';
import { EntityGrid } from '@/components/shared';
import { Button } from '@/components/ui';
import { EntityDetailPanel } from './EntityDetailPanel';
import { 
  InteractiveMap, 
  AzgaarImporter, 
  RarityTierManager, 
  CatalogView, 
  MasterEntityCreationModal 
} from '@/components/world-bible';
import { WorldMap } from './WorldMap';
import { useStoryStore } from '@/stores/storyStore';
import { getCategoriesForGenre, categoryIdToEntityType } from '@/lib/genres/genreRegistry';

export function WorldBibleLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = searchParams.get('view') || 'catalog';
  const { activeProject } = useStoryStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState('character');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayView, setDisplayView] = useState(currentView);
  const [activeEntityId, setActiveEntityId] = useState<string | null>(null);
  const [atlasViewMode, setAtlasViewMode] = useState<'grid' | 'map'>('grid');

  /**
   * Resolve genre modules for the active project.
   * Legacy projects without genreModules default to ['vedic'] for full backward compat.
   */
  const genreModules = useMemo(
    () => activeProject?.genreModules ?? ['vedic'],
    [activeProject],
  );

  /** Full ordered list of category groups for the sidebar */
  const categoryGroups = useMemo(
    () => getCategoriesForGenre(genreModules, activeProject?.subGenre),
    [genreModules, activeProject?.subGenre],
  );

  /** Flat list of all categories for lookup */
  const allCategories = useMemo(
    () => categoryGroups.flatMap(g => g.categories),
    [categoryGroups],
  );

  // Handle Tab Change with Fade Animation
  useEffect(() => {
    if (currentView !== displayView) {
      setIsTransitioning(true);
      const fadeOutTimer = setTimeout(() => {
        setDisplayView(currentView);
        setIsTransitioning(false);
      }, 100);
      return () => clearTimeout(fadeOutTimer);
    }
  }, [currentView, displayView]);

  const handleTabClick = (id: string) => {
    setSearchParams({ view: id }, { replace: true });
    setActiveEntityId(null);
  };

  const handleCatalogEntityClick = (entity: Entity) => {
    const category = allCategories.find(c => c.types.includes(entity.type));
    if (category) {
      setSearchParams({ view: category.id }, { replace: true });
    }
    setActiveEntityId(entity.id);
  };

  const activeCategory = allCategories.find(c => c.id === displayView) ?? allCategories[0];

  /** For the CreationModal: map the current sidebar category to a default entity type */
  const defaultEntityType = useMemo(
    () => categoryIdToEntityType(currentView),
    [currentView],
  );

  const getTabCreateLabel = (category: typeof activeCategory, view: string) => {
    if (view === 'catalog') return 'Master New Entry';
    if (view === 'relationships') return 'New Flow Node';
    if (view === 'geography') return 'New Location';
    if (view === 'rarity-tiers') return 'New Rarity Tier';
    
    if (!category) return 'New Entry';
    const label = category.label;
    if (label.endsWith('ies')) return `New ${label.slice(0, -3)}y`;
    if (label.endsWith('s')) return `New ${label.slice(0, -1)}`;
    return `New ${label}`;
  };

  const openCreationForTab = (typeOverride?: string) => {
    setModalDefaultType(typeOverride || defaultEntityType);
    setIsModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-base relative overflow-hidden">
      
      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:flex w-64 border-r border-subtle bg-surface flex-col h-full shrink-0 z-10 shadow-sm">
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
          {categoryGroups.map(group => (
            <div key={group.group}>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-ghost/80 mb-2 px-2">
                {group.group}
              </h3>
              <div className="flex flex-col gap-1">
                {group.categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleTabClick(category.id)}
                    className={`text-left px-3 py-2 rounded-xl text-sm transition-all duration-200 flex items-center justify-between ${
                      currentView === category.id
                        ? 'bg-terracotta/10 text-terracotta font-semibold'
                        : 'text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span>{category.label}</span>
                    {currentView === category.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Category Dropdown */}
      <div className="md:hidden shrink-0 bg-surface border-b border-subtle p-3 z-10 shadow-sm">
        <div className="relative">
          <select
            value={currentView}
            onChange={(e) => handleTabClick(e.target.value)}
            className="w-full appearance-none bg-elevated border border-subtle rounded-xl py-2 pl-4 pr-10 text-sm font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-terracotta/50"
          >
            {categoryGroups.map(group => (
              <optgroup key={group.group} label={group.group}>
                {group.categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-ghost">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Content Area */}
        <div
          className={`flex-1 overflow-y-auto p-4 sm:p-8 transition-opacity ${
            isTransitioning ? 'opacity-0 duration-100 ease-in' : 'opacity-100 duration-150 ease-out'
          }`}
        >
          <div className="max-w-6xl mx-auto flex flex-col h-full">
            <div className="mb-6 sm:mb-8 shrink-0">
              <div className="flex justify-between items-start sm:items-center gap-4 flex-col sm:flex-row">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif text-primary capitalize">
                    {activeCategory?.label ?? 'World Bible'}
                  </h1>
                  <p className="text-secondary text-xs sm:text-sm mt-1">
                    {displayView === 'catalog'
                      ? 'All entities across your world.'
                      : `Managing all ${activeCategory?.label?.toLowerCase() ?? ''} entries.`}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {displayView === 'geography' && (
                    <div className="bg-surface border border-subtle p-1 rounded-lg flex gap-1">
                      <button
                        onClick={() => setAtlasViewMode('grid')}
                        className={`p-2 rounded-md transition-colors ${atlasViewMode === 'grid' ? 'bg-elevated text-terracotta shadow-sm' : 'text-ghost hover:text-primary'}`}
                        title="Grid View"
                      >
                        <Grid size={16} />
                      </button>
                      <button
                        onClick={() => setAtlasViewMode('map')}
                        className={`p-2 rounded-md transition-colors ${atlasViewMode === 'map' ? 'bg-elevated text-terracotta shadow-sm' : 'text-ghost hover:text-primary'}`}
                        title="Map View"
                      >
                        <Map size={16} />
                      </button>
                    </div>
                  )}

                  <Button
                    onClick={() => openCreationForTab()}
                    className="gap-2 shadow-sm text-xs sm:text-sm"
                  >
                    <Plus size={16} /> {getTabCreateLabel(activeCategory, displayView)}
                  </Button>
                </div>
              </div>
            </div>

            {displayView === 'geography' && atlasViewMode === 'map' ? (
              <div className="flex-1 min-h-[600px] border border-subtle rounded-xl overflow-hidden flex flex-col mb-8">
                <InteractiveMap />
              </div>
            ) : displayView === 'rarity-tiers' ? (
              <div className="flex-1">
                <RarityTierManager />
              </div>
            ) : displayView === 'catalog' ? (
              <div className="flex-1">
                <CatalogView
                  onEntityClick={handleCatalogEntityClick}
                  onCreateNew={(type) => openCreationForTab(type)}
                />
              </div>
            ) : displayView === 'relationships' ? (
              <div className="flex-1 min-h-[600px] border border-subtle rounded-xl overflow-hidden flex flex-col mb-8">
                <WorldMap
                  onEntitySelect={setActiveEntityId}
                  onRequestAddEntity={(defaultType) => openCreationForTab(defaultType)}
                />
              </div>
            ) : (
              <div className="flex-1">
                <EntityGrid
                  typeFilters={activeCategory?.types ?? []}
                  onEntityClick={setActiveEntityId}
                />
              </div>
            )}

            {displayView === 'geography' && atlasViewMode === 'grid' && (
              <div className="mt-8 shrink-0">
                <AzgaarImporter onComplete={() => {}} />
              </div>
            )}
          </div>
        </div>
      </div>

      {activeEntityId && (
        <EntityDetailPanel entityId={activeEntityId} onClose={() => setActiveEntityId(null)} onEntitySelect={setActiveEntityId} />
      )}

      <MasterEntityCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultType={modalDefaultType}
        onCreated={(newId) => setActiveEntityId(newId)}
      />
    </div>
  );
}
