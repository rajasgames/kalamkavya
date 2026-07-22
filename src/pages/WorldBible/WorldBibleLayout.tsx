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
    () => categoryIdToEntityType(currentView, genreModules),
    [currentView, genreModules],
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
      <div className="hidden md:flex w-56 border-r border-subtle bg-surface flex-col h-full shrink-0 z-10">
        <div className="p-3 border-b border-subtle shrink-0">
          <Button 
            onClick={() => openCreationForTab()} 
            className="w-full gap-2 justify-center bg-amber-from text-black font-semibold hover:bg-amber-from/90 transition-colors rounded-md py-1.5 text-xs"
          >
            <Plus size={15} className="shrink-0" /> New Entry
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {categoryGroups.map(group => (
            <div key={group.group}>
              <h3 className="text-[11px] font-semibold text-ghost uppercase tracking-wider mb-2 px-2">
                {group.group}
              </h3>
              <div className="flex flex-col gap-0.5">
                {group.categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleTabClick(category.id)}
                    className={`text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                      currentView === category.id
                        ? 'bg-amber-from/10 text-amber-from font-medium'
                        : 'text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>{category.label}</span>
                    {currentView === category.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-from shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Category Tab Selector Bar */}
      <div className="md:hidden shrink-0 bg-surface border-b border-subtle px-3 py-2 flex gap-1 overflow-x-auto scrollbar-hide z-10 flex items-center">
        {allCategories.map(category => (
          <button
            key={category.id}
            onClick={() => handleTabClick(category.id)}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium transition-colors shrink-0 ${
              currentView === category.id
                ? 'bg-amber-from/10 text-amber-from'
                : 'text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {category.label}
          </button>
        ))}
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
                        className={`p-2 rounded-md transition-colors ${atlasViewMode === 'grid' ? 'bg-elevated text-primary' : 'text-ghost hover:text-primary'}`}
                        title="Grid View"
                      >
                        <Grid size={16} />
                      </button>
                      <button
                        onClick={() => setAtlasViewMode('map')}
                        className={`p-2 rounded-md transition-colors ${atlasViewMode === 'map' ? 'bg-elevated text-primary' : 'text-ghost hover:text-primary'}`}
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
                <WorldMap />
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
        <EntityDetailPanel entityId={activeEntityId} onClose={() => setActiveEntityId(null)} />
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
