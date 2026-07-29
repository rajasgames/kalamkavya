import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AIAssistant } from '@/components/toolkit/AIAssistant';
import { ConceptsLab } from '@/components/toolkit/ConceptsLab';
import { Analytics } from '@/components/toolkit/Analytics';
import { ExportImport } from '@/components/toolkit/ExportImport';
import { Sparkles, Lightbulb, BarChart3, Database } from 'lucide-react';

const CATEGORIES = [
  { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, desc: 'Configure and interact with your AI writing assistant.' },
  { id: 'ideas', label: 'Concepts Lab', icon: Lightbulb, desc: 'A freeform scratchpad for ideas, lore, and visual brainstorming.' },
  { id: 'insights', label: 'Insights', icon: BarChart3, desc: 'Analytics and writing metrics for your current project.' },
  { id: 'data', label: 'Data Management', icon: Database, desc: 'Safely export your project or import external ones.' },
];

export function ToolkitLayout() {
  const { view } = useParams();
  const navigate = useNavigate();
  const currentView = view || 'ai-assistant';
  
  const [displayView, setDisplayView] = useState(currentView);

  useEffect(() => {
    setDisplayView(currentView);
  }, [currentView]);

  const handleTabClick = (id: string) => {
    navigate(`/toolkit/${id}`);
  };

  const activeCategory = CATEGORIES.find(c => c.id === displayView) || CATEGORIES[0];

  return (
    <div className="h-full flex flex-col bg-base relative overflow-hidden font-sans">
      {/* Tab Navigation Header */}
      <div className="shrink-0 menu-bar-graded px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between z-10 border-b border-subtle shadow-sm">
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide py-0.5 max-w-full items-center">
          {CATEGORIES.map(category => {
            const Icon = category.icon;
            const isActive = currentView === category.id;
            return (
              <button
                key={category.id}
                onClick={() => handleTabClick(category.id)}
                className={`relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-primary font-bold shadow-sm'
                    : 'text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="toolkitActiveTab"
                    className="absolute inset-0 bg-terracotta/15 border border-terracotta/30 rounded-xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={15} className={`relative z-10 shrink-0 ${isActive ? 'text-terracotta' : 'text-ghost'}`} />
                <span className="relative z-10">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto flex flex-col h-full">
          <div className="mb-4 sm:mb-6 shrink-0">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-terracotta/10 text-terracotta">
                <activeCategory.icon size={20} />
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-serif text-primary capitalize font-bold">
                {activeCategory.label}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-secondary mt-1 max-w-2xl leading-relaxed">
              {activeCategory.desc}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory.id}
              initial={{ opacity: 0, transform: 'translateY(8px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              exit={{ opacity: 0, transform: 'translateY(-8px)' }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex-1 flex flex-col min-h-0"
            >
              {activeCategory.id === 'ai-assistant' && (
                <div className="flex-1 min-h-0">
                  <AIAssistant />
                </div>
              )}
              {activeCategory.id === 'ideas' && (
                <div className="flex-1 min-h-[500px]">
                  <ConceptsLab />
                </div>
              )}
              {activeCategory.id === 'insights' && (
                <div className="flex-1 min-h-[500px]">
                  <Analytics />
                </div>
              )}
              {activeCategory.id === 'data' && (
                <div className="flex-1 min-h-[400px]">
                  <ExportImport />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
