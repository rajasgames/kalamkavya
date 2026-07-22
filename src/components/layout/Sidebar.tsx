import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, PenTool, BookOpen, Users, Wrench, PanelLeftClose, PanelLeftOpen, Search, LucideIcon, Sparkles, Settings, HelpCircle, Sliders } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useSearchStore } from '@/stores/searchStore';
import { Pillar } from '@/types';
import { ThemeToggle } from '@/components/ui';

type SubView = { label: string; href: string; id: string };

type PillarDef = {
  id: Pillar;
  label: string;
  icon: LucideIcon;
  defaultHref: string;
  subViews: SubView[];
};

const PILLARS: PillarDef[] = [
  { id: 'home', label: 'Home', icon: Home, defaultHref: '/', subViews: [] },
  { 
    id: 'manuscript', label: 'Manuscript', icon: PenTool, defaultHref: '/manuscript/editor',
    subViews: [
      { id: 'editor', label: 'Editor', href: '/manuscript/editor' },
      { id: 'planner', label: 'Planner', href: '/manuscript/planner' },
      { id: 'outline', label: 'Outline', href: '/manuscript/outline' }
    ]
  },
  {
    id: 'project', label: 'Project Setup', icon: Sliders, defaultHref: '/project/core',
    subViews: [
      { id: 'core', label: 'Project Core', href: '/project/core' },
      { id: 'templates', label: 'Templates & Schemas', href: '/project/templates' }
    ]
  },
  { 
    id: 'worldbible', label: 'World Bible', icon: BookOpen, defaultHref: '/world-bible',
    subViews: []
  },
  { 
    id: 'cast', label: 'Cast', icon: Users, defaultHref: '/cast/characters',
    subViews: [
      { id: 'characters', label: 'Characters', href: '/cast/characters' },
      { id: 'art', label: 'Art Direction', href: '/cast/art' }
    ]
  },
  { 
    id: 'toolkit', label: 'Toolkit', icon: Wrench, defaultHref: '/toolkit/ai',
    subViews: [
      { id: 'ai', label: 'AI Assistant', href: '/toolkit/ai' },
      { id: 'ideas', label: 'Ideas', href: '/toolkit/ideas' },
      { id: 'insights', label: 'Insights', href: '/toolkit/insights' },
      { id: 'search', label: 'Search', href: '/toolkit/search' }
    ]
  }
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activePillar, setActivePillar, isSidebarExpanded, setSidebarExpanded, setAIDrawerOpen, activeSubView, setActiveSubView, setAISettingsOpen, setOnboardingOpen } = useUIStore();
  const { openSearch } = useSearchStore();

  // Sync route changes to store
  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/' || path === '/ui-testing') {
      setActivePillar('home');
      setActiveSubView('');
      return;
    }

    const segments = path.split('/').filter(Boolean);
    if (segments.length > 0) {
      const pillarKey = segments[0];
      const subViewKey = segments[1] || '';
      
      const mappedPillar = PILLARS.find(p => p.defaultHref.startsWith(`/${pillarKey}`));
      if (mappedPillar) {
        setActivePillar(mappedPillar.id);
        setActiveSubView(subViewKey);
      }
    }
  }, [location.pathname, setActivePillar, setActiveSubView]);

  const handlePillarClick = (pillar: PillarDef) => {
    if (activePillar === pillar.id) {
      // Toggle expansion if already active
      setSidebarExpanded(!isSidebarExpanded);
    } else {
      // Navigate and auto-expand if switching pillars
      setActivePillar(pillar.id);
      setSidebarExpanded(true);
      navigate(pillar.defaultHref);
    }
  };

  const currentPillarDef = PILLARS.find(p => p.id === activePillar);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col h-full w-full bg-surface overflow-hidden font-sans">
        <div className="flex-1 flex overflow-hidden">
          {/* Icons Column */}
          <div className="w-[56px] flex-shrink-0 flex flex-col items-center py-3 justify-between border-r border-subtle relative z-10">
            {/* Top Navigation Group */}
            <div className="flex flex-col items-center gap-2 w-full">
              {PILLARS.map(pillar => {
                const isActive = activePillar === pillar.id;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => handlePillarClick(pillar)}
                    title={isSidebarExpanded ? undefined : pillar.label}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors relative group ${
                      isActive 
                        ? 'text-amber-from bg-amber-from/10 font-semibold' 
                        : 'text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <pillar.icon size={18} className="shrink-0" />
                    
                    {/* Tooltip on hover (when collapsed) */}
                    {!isSidebarExpanded && (
                      <div className="absolute left-14 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-surface border border-subtle text-primary text-xs py-1 px-2 rounded whitespace-nowrap pointer-events-none z-50 shadow-md font-medium">
                        {pillar.label}
                      </div>
                    )}
                  </button>
                );
              })}

              <div className="w-5 h-[1px] bg-subtle my-1" />

              {/* AI Assistant Quick Icon */}
              <button
                onClick={() => setAIDrawerOpen(true)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-amber-from hover:bg-amber-from/10 transition-colors relative group"
                title={isSidebarExpanded ? undefined : "Ask AI"}
              >
                <Sparkles size={18} className="shrink-0" />
                {!isSidebarExpanded && (
                  <div className="absolute left-14 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-surface border border-subtle text-primary text-xs py-1 px-2 rounded whitespace-nowrap pointer-events-none z-50 shadow-md font-medium">
                    Ask AI Assistant
                  </div>
                )}
              </button>

              {/* AI Settings Quick Icon */}
              <button
                onClick={() => setAISettingsOpen(true)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative group"
                title={isSidebarExpanded ? undefined : "AI Settings"}
              >
                <Settings size={18} className="shrink-0" />
                {!isSidebarExpanded && (
                  <div className="absolute left-14 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-surface border border-subtle text-primary text-xs py-1 px-2 rounded whitespace-nowrap pointer-events-none z-50 shadow-md font-medium">
                    AI Settings
                  </div>
                )}
              </button>

              {/* User Guide Icon */}
              <button
                onClick={() => setOnboardingOpen(true)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-ghost hover:text-amber-from hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative group"
                title={isSidebarExpanded ? undefined : "User Guide & Tour"}
              >
                <HelpCircle size={18} className="shrink-0" />
                {!isSidebarExpanded && (
                  <div className="absolute left-14 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-surface border border-subtle text-primary text-xs py-1 px-2 rounded whitespace-nowrap pointer-events-none z-50 shadow-md font-medium">
                    User Guide & Tour
                  </div>
                )}
              </button>
            </div>

            {/* Bottom Actions Group */}
            <div className="flex flex-col items-center gap-2 w-full">
              {/* Global Search */}
              <button 
                onClick={openSearch}
                className="w-9 h-9 flex items-center justify-center text-ghost hover:text-primary transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/5 relative group"
                title={isSidebarExpanded ? undefined : "Global Search (Cmd/Ctrl + K)"}
              >
                <Search size={17} className="shrink-0" />
                {!isSidebarExpanded && (
                  <div className="absolute left-14 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-surface border border-subtle text-primary text-xs py-1 px-2 rounded whitespace-nowrap pointer-events-none z-50 shadow-md font-medium">
                    Search (Cmd + K)
                  </div>
                )}
              </button>

              {/* Theme Toggle Icon Slot */}
              <div className="w-9 h-9 flex items-center justify-center relative group">
                <ThemeToggle />
              </div>

              {/* Collapse/Expand Toggle */}
              <button 
                onClick={() => setSidebarExpanded(!isSidebarExpanded)}
                className="w-9 h-9 flex items-center justify-center text-ghost hover:text-primary transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/5 relative group"
                title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
              >
                {isSidebarExpanded ? <PanelLeftClose size={17} className="shrink-0" /> : <PanelLeftOpen size={17} className="shrink-0" />}
              </button>
            </div>
          </div>

          {/* Sub-views Drawer */}
          <div 
            className="flex-1 flex flex-col transition-all duration-200 ease-in-out overflow-hidden"
            style={{ 
              opacity: isSidebarExpanded ? 1 : 0,
              transform: isSidebarExpanded ? 'translateX(0)' : 'translateX(-8px)',
              pointerEvents: isSidebarExpanded ? 'auto' : 'none'
            }}
          >
            {currentPillarDef && currentPillarDef.subViews.length > 0 ? (
              <div className="p-3 flex-1 overflow-y-auto">
                <h3 className="text-[11px] font-semibold text-ghost uppercase tracking-wider mb-3 px-2">
                  {currentPillarDef.label}
                </h3>
                <nav className="flex flex-col gap-1">
                  {currentPillarDef.subViews.map(sub => {
                    const isSubActive = activeSubView === sub.id;
                    return (
                      <Link
                        key={sub.id}
                        to={sub.href}
                        className={`px-2.5 py-1.5 text-xs rounded-md transition-colors flex items-center gap-2 ${
                          isSubActive
                            ? 'bg-amber-from/10 text-amber-from font-medium'
                            : 'text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        {isSubActive && <div className="w-1.5 h-1.5 rounded-full bg-amber-from shrink-0" />}
                        <span>{sub.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ) : (
              <div className="p-3 flex-1 flex flex-col justify-center items-center text-center opacity-60">
                {currentPillarDef && (
                  <h2 className="text-sm font-medium text-secondary">{currentPillarDef.label}</h2>
                )}
              </div>
            )}
            
            {/* Drawer Bottom Actions */}
            <div className="border-t border-subtle p-2 flex flex-col gap-1 bg-surface">
              <button 
                onClick={() => setAIDrawerOpen(true)}
                className="w-full flex items-center h-8 px-2 rounded text-amber-from hover:bg-amber-from/10 font-medium text-xs transition-colors"
              >
                <Sparkles size={15} className="shrink-0 mr-2" />
                <span className="truncate">Ask AI</span>
              </button>
              <button
                onClick={() => setAISettingsOpen(true)}
                className="w-full flex items-center h-8 px-2 rounded text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 text-xs transition-colors"
              >
                <Settings size={15} className="shrink-0 mr-2" />
                <span className="truncate">AI Settings</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Floating Bottom Bar */}
      <nav className="md:hidden flex items-center justify-around h-full w-full bg-transparent px-1 font-sans relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-from/5 via-transparent to-amber-from/5 pointer-events-none rounded-full" />
        
        {PILLARS.map(pillar => {
          const isActive = activePillar === pillar.id;
          return (
            <button
              key={pillar.id}
              onClick={() => {
                setActivePillar(pillar.id);
                navigate(pillar.defaultHref);
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 transition-all duration-300 relative z-10 rounded-2xl ${
                isActive 
                  ? 'text-amber-from font-bold bg-amber-from/15 border border-amber-from/25 shadow-[0_0_12px_rgba(212,153,90,0.2)] scale-105' 
                  : 'text-ghost hover:text-primary active:scale-95'
              }`}
            >
              {isActive && (
                <div className="absolute -top-1 w-6 h-1 rounded-full bg-amber-from shadow-[0_0_8px_rgba(212,153,90,0.8)]" />
              )}
              <pillar.icon size={18} className={`shrink-0 ${isActive ? 'drop-shadow-[0_0_6px_rgba(212,153,90,0.5)]' : ''}`} />
              <span className="text-[10px] font-medium tracking-tight mt-0.5 truncate max-w-full">{pillar.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
