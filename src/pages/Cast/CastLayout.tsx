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
      <div className="shrink-0 bg-surface border-b border-subtle px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-serif text-primary">Cast & Characters</h1>

          <div className="flex bg-base border border-subtle p-0.5 rounded-lg gap-0.5">
            <button
              onClick={() => navigate('/cast/characters')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeSubView === 'characters'
                  ? 'bg-amber-from/10 text-amber-from'
                  : 'text-ghost hover:text-primary'
              }`}
            >
              <User size={14} className="shrink-0" /> Characters
            </button>
            <button
              onClick={() => navigate('/cast/art')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeSubView === 'art'
                  ? 'bg-amber-from/10 text-amber-from'
                  : 'text-ghost hover:text-primary'
              }`}
            >
              <Image size={14} className="shrink-0" /> Art Direction
            </button>
          </div>
        </div>

        <Button onClick={handleCreateNew} className="gap-2 text-xs font-medium self-stretch sm:self-auto">
          <Plus size={15} className="shrink-0" /> {activeSubView === 'art' ? 'New Art Concept' : 'New Character'}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          {activeSubView === 'art' ? (
            <div className="flex-1 flex flex-col gap-6">
              <div className="bg-surface border border-subtle p-5 rounded-lg flex flex-col gap-2">
                <div className="flex items-center gap-2 text-amber-from font-serif text-base font-semibold">
                  <Sparkles size={18} /> Visual Art & Character Moodboards
                </div>
                <p className="text-secondary text-xs leading-relaxed">
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
              <p className="text-secondary text-xs mb-4">
                Manage your world's inhabitants. Click any character to view details.
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
