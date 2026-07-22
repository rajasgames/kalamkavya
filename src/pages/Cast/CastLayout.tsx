import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStoryStore } from '@/stores/storyStore';
import { EntityGrid } from '@/components/shared';
import { Button } from '@/components/ui';
import { Plus, User, Image, Sparkles } from 'lucide-react';
import { CharacterDetail } from '@/components/cast/CharacterDetail';
import { MasterEntityCreationModal } from '@/components/world-bible/MasterEntityCreationModal';

export function CastLayout() {
  const { view } = useParams();
  const navigate = useNavigate();
  const activeSubView = view || 'characters';

  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('character');
  const { entities } = useStoryStore();

  const selectedEntity = selectedEntityId ? entities.find(e => e.id === selectedEntityId) : null;

  if (selectedEntity) {
    return (
      <CharacterDetail 
        entity={selectedEntity} 
        onBack={() => setSelectedEntityId(null)} 
      />
    );
  }

  const handleCreateNew = () => {
    if (activeSubView === 'art') {
      setModalType('ARTIFACT');
    } else {
      setModalType('character');
    }
    setIsModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col bg-base overflow-hidden relative">
      {/* Header with Sub-view Tabs & Contextual Create Action */}
      <div className="shrink-0 menu-bar-graded px-4 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 z-10 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-serif text-primary">Cast & Characters</h1>

          <div className="flex bg-base/80 backdrop-blur-md border border-subtle p-1 rounded-xl gap-1">
            <button
              onClick={() => navigate('/cast/characters')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubView === 'characters'
                  ? 'bg-terracotta/10 text-terracotta'
                  : 'text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              <User size={15} className="shrink-0" /> Characters
            </button>
            <button
              onClick={() => navigate('/cast/art')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubView === 'art'
                  ? 'bg-terracotta/10 text-terracotta'
                  : 'text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              <Image size={15} className="shrink-0" /> Art Direction
            </button>
          </div>
        </div>

        <Button onClick={handleCreateNew} className="gap-2 shadow-sm font-semibold text-xs sm:text-sm self-stretch sm:self-auto bg-terracotta text-white hover:bg-terracotta/90">
          <Plus size={16} className="shrink-0" /> {activeSubView === 'art' ? 'New Art Concept' : 'New Character'}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          {activeSubView === 'art' ? (
            <div className="flex-1 flex flex-col gap-6">
              <div className="bg-surface border border-subtle p-6 rounded-2xl flex flex-col gap-3">
                <div className="flex items-center gap-2 text-terracotta font-serif text-lg font-bold">
                  <Sparkles size={20} /> Visual Art & Character Moodboards
                </div>
                <p className="text-secondary text-sm leading-relaxed">
                  Define art direction guidelines, character portraits, color palettes, and visual prompts for your story cast. Link visual assets to characters in the World Bible.
                </p>
              </div>

              <div className="flex-1">
                <EntityGrid
                  typeFilters={['ARTIFACT', 'object', 'CULTURE']}
                  onEntityClick={setSelectedEntityId}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <p className="text-secondary mb-6">
                Manage your world's inhabitants. Click any character to open their detailed Bento Grid.
              </p>
              
              <div className="flex-1">
                <EntityGrid typeFilters={['character', 'CHARACTER', 'GOD']} onEntityClick={setSelectedEntityId} />
              </div>
            </div>
          )}
        </div>
      </div>

      <MasterEntityCreationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultType={modalType}
        onCreated={(id) => setSelectedEntityId(id)}
      />
    </div>
  );
}
