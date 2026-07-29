import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Layers } from 'lucide-react';
import { ProjectCore } from './ProjectCore';
import { ProjectTemplates } from './ProjectTemplates';

export function ProjectLayout() {
  const { view } = useParams();
  const navigate = useNavigate();
  const activeSubView = view || 'core';

  return (
    <div className="h-full flex flex-col bg-base relative font-sans overflow-hidden">
      {/* Header with Sub-view Tabs */}
      <div className="shrink-0 menu-bar-graded px-3 sm:px-8 py-2.5 sm:py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4 z-10 border-b border-subtle shadow-sm">
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap w-full sm:w-auto justify-between sm:justify-start">
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-primary">Project Setup</h1>

          <div className="flex bg-base/80 backdrop-blur-md border border-subtle p-1 rounded-xl gap-1 max-w-full overflow-x-auto scrollbar-hide shrink-0">
            <button
              onClick={() => navigate('/project/core')}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeSubView === 'core'
                  ? 'text-primary font-bold shadow-sm'
                  : 'text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              {activeSubView === 'core' && (
                <motion.div
                  layoutId="projectActiveTab"
                  className="absolute inset-0 bg-terracotta/15 border border-terracotta/30 rounded-lg"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Settings size={15} className={`relative z-10 shrink-0 ${activeSubView === 'core' ? 'text-terracotta' : 'text-ghost'}`} />
              <span className="relative z-10">Project Core</span>
            </button>

            <button
              onClick={() => navigate('/project/templates')}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeSubView === 'templates'
                  ? 'text-primary font-bold shadow-sm'
                  : 'text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              {activeSubView === 'templates' && (
                <motion.div
                  layoutId="projectActiveTab"
                  className="absolute inset-0 bg-terracotta/15 border border-terracotta/30 rounded-lg"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Layers size={15} className={`relative z-10 shrink-0 ${activeSubView === 'templates' ? 'text-terracotta' : 'text-ghost'}`} />
              <span className="relative z-10">Templates & Schemas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area with Smooth Page Scroll */}
      <div className="flex-1 overflow-y-auto relative bg-base">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubView}
            initial={{ opacity: 0, transform: 'translateY(6px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            exit={{ opacity: 0, transform: 'translateY(-6px)' }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="min-h-full"
          >
            {activeSubView === 'core' ? <ProjectCore /> : <ProjectTemplates />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
