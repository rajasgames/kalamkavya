import { useParams, useNavigate } from 'react-router-dom';
import { Settings, Layers } from 'lucide-react';
import { ProjectCore } from './ProjectCore';
import { ProjectTemplates } from './ProjectTemplates';

export function ProjectLayout() {
  const { view } = useParams();
  const navigate = useNavigate();
  const activeSubView = view || 'core';

  return (
    <div className="h-full flex flex-col bg-base overflow-hidden relative">
      {/* Header with Sub-view Tabs */}
      <div className="shrink-0 menu-bar-graded px-4 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 z-10 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-serif text-primary">Project Setup</h1>

          <div className="flex bg-base/80 backdrop-blur-md border border-subtle p-1 rounded-xl gap-1 max-w-full overflow-x-auto scrollbar-hide shrink-0">
            <button
              onClick={() => navigate('/project/core')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeSubView === 'core'
                  ? 'nav-pill-active'
                  : 'text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              <Settings size={15} className="shrink-0" /> Project Core
            </button>
            <button
              onClick={() => navigate('/project/templates')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeSubView === 'templates'
                  ? 'nav-pill-active'
                  : 'text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              <Layers size={15} className="shrink-0" /> Templates & Schemas
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative bg-base">
        {activeSubView === 'core' ? <ProjectCore /> : <ProjectTemplates />}
      </div>
    </div>
  );
}
