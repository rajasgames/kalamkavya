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
      <div className="shrink-0 bg-surface border-b border-subtle px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-serif text-primary">Project Setup</h1>

          <div className="flex bg-base border border-subtle p-0.5 rounded-lg gap-0.5">
            <button
              onClick={() => navigate('/project/core')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeSubView === 'core'
                  ? 'bg-amber-from/10 text-amber-from'
                  : 'text-ghost hover:text-primary'
              }`}
            >
              <Settings size={14} className="shrink-0" /> Project Core
            </button>
            <button
              onClick={() => navigate('/project/templates')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeSubView === 'templates'
                  ? 'bg-amber-from/10 text-amber-from'
                  : 'text-ghost hover:text-primary'
              }`}
            >
              <Layers size={14} className="shrink-0" /> Templates & Schemas
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
