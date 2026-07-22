import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AIAssistant } from '@/components/toolkit/AIAssistant';
import { ConceptsLab } from '@/components/toolkit/ConceptsLab';
import { Analytics } from '@/components/toolkit/Analytics';
import { ExportImport } from '@/components/toolkit/ExportImport';

const CATEGORIES = [
  { id: 'insights', label: 'Insights' },
  { id: 'ideas', label: 'Concepts Lab' },
  { id: 'ai-assistant', label: 'AI Assistant' },
  { id: 'data', label: 'Data Management' },
];

export function ToolkitLayout() {
  const { view } = useParams();
  const navigate = useNavigate();
  const currentView = view || 'insights';
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayView, setDisplayView] = useState(currentView);

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
    navigate(`/toolkit/${id}`);
  };

  const activeCategory = CATEGORIES.find(c => c.id === displayView) || CATEGORIES[0];

  return (
    <div className="h-full flex bg-base relative overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="shrink-0 menu-bar-graded px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between z-10 shadow-sm">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-1 max-w-full">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => handleTabClick(category.id)}
                className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap shrink-0 ${
                  currentView === category.id
                    ? 'nav-pill-active font-bold shadow-md shadow-amber-from/20'
                    : 'text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div 
          className={`flex-1 overflow-y-auto p-4 sm:p-8 transition-opacity ${
            isTransitioning ? 'opacity-0 duration-100 ease-in' : 'opacity-100 duration-150 ease-out'
          }`}
        >
          <div className="max-w-4xl mx-auto flex flex-col h-full">
            <div className="mb-8 shrink-0">
              <h1 className="text-3xl font-serif text-primary capitalize">{activeCategory.label}</h1>
              <p className="text-secondary mt-1">
                {activeCategory.id === 'ideas' 
                  ? 'A freeform scratchpad for ideas and brainstorming.' 
                  : activeCategory.id === 'insights'
                  ? 'Analytics and writing metrics for your current project.'
                  : activeCategory.id === 'data'
                  ? 'Safely export your project or import external ones.'
                  : 'Configure your AI writing assistant and provider connections.'}
              </p>
            </div>
            {activeCategory.id === 'ai-assistant' && (
              <div className="flex-1">
                <AIAssistant />
              </div>
            )}
            {activeCategory.id === 'ideas' && (
              <div className="flex-1 h-full -mx-8 -mb-8">
                <ConceptsLab />
              </div>
            )}
            {activeCategory.id === 'insights' && (
              <div className="flex-1 h-full -mx-8 -mb-8">
                <Analytics />
              </div>
            )}
            {activeCategory.id === 'data' && (
              <div className="flex-1 h-full">
                <ExportImport />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
