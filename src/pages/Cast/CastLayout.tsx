import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStoryStore } from '@/stores/storyStore';
import { EntityGrid } from '@/components/shared';
import { Button } from '@/components/ui';
import { Plus, User, Image, Sparkles, Users } from 'lucide-react';
import { MasterEntityCreationModal } from '@/components/world-bible/MasterEntityCreationModal';
import { CharacterData } from '@/types';

export function CastLayout() {
  const { view } = useParams();
  const navigate = useNavigate();
  const activeSubView = view || 'characters';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('character');
  const { entities } = useStoryStore();

  const handleCreateNew = () => {
    if (activeSubView === 'art') {
      setModalType('ARTIFACT');
    } else {
      setModalType('character');
    }
    setIsModalOpen(true);
  };

  const handleCharacterClick = (id: string) => {
    navigate(`/world-bible?entityId=${id}`);
  };

  const characters = entities.filter(e => e.type === 'character' || e.type === 'CHARACTER' || e.type === 'GOD');
  
  const protagonists = characters.filter(c => (c.data as unknown as CharacterData).castType === 'Protagonist');
  const antagonists = characters.filter(c => (c.data as unknown as CharacterData).castType === 'Antagonist');
  const supporting = characters.filter(c => (c.data as unknown as CharacterData).castType === 'Supporting');
  const commoners = characters.filter(c => (c.data as unknown as CharacterData).castType === 'Commoner');
  const others = characters.filter(c => !['Protagonist', 'Antagonist', 'Supporting', 'Commoner'].includes((c.data as unknown as CharacterData).castType as string));

  const renderCharacterGroup = (title: string, group: typeof characters) => {
    if (group.length === 0) return null;
    return (
      <div className="flex flex-col gap-4 mb-8">
        <h3 className="text-lg font-serif font-bold text-primary border-b border-subtle pb-2">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {group.map((entity) => (
            <div 
              key={entity.id}
              onClick={() => handleCharacterClick(entity.id)}
              className="group flex flex-col bg-surface border border-subtle p-4 rounded-xl cursor-pointer glass-card-hover shadow-soft"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-subtle group-hover:bg-terracotta/10 group-hover:border-terracotta/30 transition-colors">
                  <User size={18} className="text-amber-from" />
                </div>
              </div>
              <h3 className="font-serif font-bold text-primary text-lg leading-tight group-hover:text-terracotta transition-colors line-clamp-2">
                {entity.name}
              </h3>
              <p className="text-xs text-ghost mt-1 uppercase tracking-wider font-bold truncate">
                {(entity.data as unknown as CharacterData).role || 'Unknown Role'}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-base overflow-hidden relative">
      {/* Header with Sub-view Tabs & Contextual Create Action */}
      <div className="shrink-0 menu-bar-graded px-4 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 z-10 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-serif text-primary">Cast & Characters</h1>

          <div className="flex bg-base/80 backdrop-blur-md border border-subtle p-1 rounded-xl gap-1 max-w-full overflow-x-auto scrollbar-hide shrink-0">
            <button
              onClick={() => navigate('/cast/characters')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeSubView === 'characters'
                  ? 'bg-terracotta/10 text-terracotta'
                  : 'text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              <Users size={15} className="shrink-0" /> Cast Roster
            </button>
            <button
              onClick={() => navigate('/cast/art')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
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
                  onEntityClick={handleCharacterClick}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="bg-surface border border-subtle p-6 rounded-2xl flex flex-col gap-3 mb-6">
                 <div className="flex items-center gap-2 text-terracotta font-serif text-lg font-bold">
                   <Users size={20} /> The Cast Roster
                 </div>
                 <p className="text-secondary text-sm leading-relaxed">
                   View and manage the actors in your story. Click any character to open their complete profile in the World Bible Character Creator.
                 </p>
               </div>
              
              <div className="flex-1">
                {characters.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-ghost border-2 border-dashed border-subtle rounded-xl">
                    <User size={32} className="mb-2 opacity-50" />
                    <p>No characters created yet.</p>
                  </div>
                ) : (
                  <>
                    {renderCharacterGroup('Protagonists', protagonists)}
                    {renderCharacterGroup('Antagonists', antagonists)}
                    {renderCharacterGroup('Supporting Cast', supporting)}
                    {renderCharacterGroup('Commoners & Extras', commoners)}
                    {renderCharacterGroup('Other Entities', others)}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <MasterEntityCreationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultType={modalType}
        onCreated={(id) => handleCharacterClick(id)}
      />
    </div>
  );
}
