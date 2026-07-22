import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, PenTool, BookOpen, Users, Wrench, PanelLeftClose, PanelLeftOpen, Search, LucideIcon, Sparkles, Settings } from 'lucide-react';
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
  const { activePillar, setActivePillar, isSidebarExpanded, setSidebarExpanded, setAIDrawerOpen, activeSubView, setActiveSubView, setAISettingsOpen } = useUIStore();
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
      {/* Desktop Sidebar (Inside floating container) */}
      <aside className="hidden md:flex flex-col h-full w-full bg-transparent overflow-hidden font-sans">
        <div className="flex-1 flex overflow-hidden">
          {/* Icons Column (52px wide) */}
          <div className="w-[52px] flex-shrink-0 flex flex-col items-center py-4 justify-between border-r border-subtle relative z-10">
            {/* Top Navigation Group */}
            <div className="flex flex-col items-center gap-3 w-full">
              {PILLARS.map(pillar => {
                const isActive = activePillar === pillar.id;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => handlePillarClick(pillar)}
                    title={isSidebarExpanded ? undefined : pillar.label}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative group ${
                      isActive 
                        ? 'text-amber-from bg-amber-from/15 shadow-[0_0_15px_rgba(212,153,90,0.25)] scale-105 font-bold' 
                        : 'text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-from/20 to-transparent opacity-50 blur-sm pointer-events-none" />
                    )}
                    <pillar.icon size={20} className="relative z-10 shrink-0" />
                    
                    {/* Tooltip on hover (when collapsed) */}
                    {!isSidebarExpanded && (
                      <div className="absolute left-14 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-surface border border-subtle text-primary text-xs py-1 px-2.5 rounded-lg whitespace-nowrap pointer-events-none z-50 shadow-xl font-medium">
                        {pillar.label}
                      </div>
                    )}
                  </button>
                );
              })}

              <div className="w-6 h-[1px] bg-subtle my-1" />

              {/* AI Assistant Quick Icon */}
              <button
                onClick={() => setAIDrawerOpen(true)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-from hover:bg-amber-from/15 hover:scale-105 active:scale-95 transition-all duration-200 relative group"
                title={isSidebarExpanded ? undefined : "Ask AI"}
              >
                <Sparkles size={20} className="shrink-0" />
                {!isSidebarExpanded && (
                  <div className="absolute left-14 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-surface border border-subtle text-primary text-xs py-1 px-2.5 rounded-lg whitespace-nowrap pointer-events-none z-50 shadow-xl font-medium">
                    Ask AI Assistant
                  </div>
                )}
              </button>

              {/* AI Settings Quick Icon */}
              <button
                onClick={() => setAISettingsOpen(true)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 hover:scale-105 active:scale-95 transition-all duration-200 relative group"
                title={isSidebarExpanded ? undefined : "AI Settings"}
              >
                <Settings size={20} className="shrink-0" />
                {!isSidebarExpanded && (
                  <div className="absolute left-14 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-surface border border-subtle text-primary text-xs py-1 px-2.5 rounded-lg whitespace-nowrap pointer-events-none z-50 shadow-xl font-medium">
                    AI Settings
                  </div>
                )}
              </button>
            </div>

            {/* Bottom Actions Group */}
            <div className="flex flex-col items-center gap-3 w-full">
              {/* Global Search */}
              <button 
                onClick={openSearch}
                className="w-10 h-10 flex items-center justify-center text-ghost hover:text-primary transition-all duration-200 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 relative group"
                title={isSidebarExpanded ? undefined : "Global Search (Cmd/Ctrl + K)"}
              >
                <Search size={18} className="shrink-0" />
                {!isSidebarExpanded && (
                  <div className="absolute left-14 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-surface border border-subtle text-primary text-xs py-1 px-2.5 rounded-lg whitespace-nowrap pointer-events-none z-50 shadow-xl font-medium">
                    Search (Cmd + K)
                  </div>
                )}
              </button>

              {/* Theme Toggle Icon Slot */}
              <div className="w-10 h-10 flex items-center justify-center relative group">
                <ThemeToggle />
                {!isSidebarExpanded && (
                  <div className="absolute left-14 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-surface border border-subtle text-primary text-xs py-1 px-2.5 rounded-lg whitespace-nowrap pointer-events-none z-50 shadow-xl font-medium">
                    Toggle Theme
                  </div>
                )}
              </div>

              {/* Collapse/Expand Toggle */}
              <button 
                onClick={() => setSidebarExpanded(!isSidebarExpanded)}
                className="w-10 h-10 flex items-center justify-center text-ghost hover:text-primary transition-all duration-200 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 relative group"
                title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
              >
                {isSidebarExpanded ? <PanelLeftClose size={18} className="shrink-0" /> : <PanelLeftOpen size={18} className="shrink-0" />}
                {!isSidebarExpanded && (
                  <div className="absolute left-14 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-surface border border-subtle text-primary text-xs py-1 px-2.5 rounded-lg whitespace-nowrap pointer-events-none z-50 shadow-xl font-medium">
                    Expand Sidebar
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Sub-views & Labels Drawer */}
          <div 
            className="flex-1 flex flex-col transition-all duration-300 ease-out overflow-hidden"
            style={{ 
              opacity: isSidebarExpanded ? 1 : 0,
              transform: isSidebarExpanded ? 'translateX(0)' : 'translateX(-10px)',
              pointerEvents: isSidebarExpanded ? 'auto' : 'none'
            }}
          >
            {currentPillarDef && currentPillarDef.subViews.length > 0 ? (
              <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
                <h3 className="text-[10px] font-bold tracking-widest text-ghost/80 uppercase mb-4 px-2">
                  {currentPillarDef.label}
                </h3>
                <nav className="flex flex-col gap-1.5">
                  {currentPillarDef.subViews.map(sub => {
                    const isSubActive = activeSubView === sub.id;
                    return (
                      <Link
                        key={sub.id}
                        to={sub.href}
                        className={`px-3 py-2 text-sm rounded-xl transition-all duration-200 border border-transparent flex items-center gap-2 group ${
                          isSubActive
                            ? 'bg-amber-from/10 text-amber-from border-amber-from/20 shadow-sm font-semibold'
                            : 'text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        {isSubActive && <div className="w-1.5 h-1.5 rounded-full bg-amber-from shadow-[0_0_6px_rgba(212,153,90,0.8)] shrink-0" />}
                        <span className={isSubActive ? 'translate-x-0 transition-transform' : 'group-hover:translate-x-1 transition-transform'}>{sub.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ) : (
              <div className="p-4 flex-1 flex flex-col justify-center items-center text-center opacity-60">
                {currentPillarDef && (
                  <h2 className="text-base font-serif text-secondary font-medium">{currentPillarDef.label}</h2>
                )}
              </div>
            )}
            
            {/* Drawer Bottom Action Text Labels */}
            <div className="border-t border-subtle p-3 flex flex-col gap-1.5 bg-surface/40">
              <button 
                onClick={() => setAIDrawerOpen(true)}
                className="w-full flex items-center h-10 px-3 rounded-lg text-amber-from hover:bg-amber-from/10 font-medium text-xs transition-colors group"
              >
                <Sparkles size={16} className="shrink-0 mr-2.5" />
                <span className="truncate">Ask AI Assistant</span>
              </button>
              <button
                onClick={() => setAISettingsOpen(true)}
                className="w-full flex items-center h-10 px-3 rounded-lg text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 font-medium text-xs transition-colors group"
              >
                <Settings size={16} className="shrink-0 mr-2.5" />
                <span className="truncate">AI Provider Settings</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Floating Bottom Bar */}
      <nav className="md:hidden flex items-center justify-around h-full w-full bg-transparent px-2 font-sans relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-full" />
        
        {PILLARS.map(pillar => {
          const isActive = activePillar === pillar.id;
          return (
            <button
              key={pillar.id}
              onClick={() => {
                setActivePillar(pillar.id);
                navigate(pillar.defaultHref);
              }}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-300 relative z-10 ${
                isActive ? 'text-amber-from scale-105 font-bold' : 'text-ghost hover:text-primary'
              }`}
            >
              {isActive && (
                <div className="absolute -top-2 w-8 h-1 rounded-full bg-amber-from shadow-[0_0_8px_rgba(212,153,90,0.8)]" />
              )}
              <pillar.icon size={20} className={isActive ? 'drop-shadow-[0_0_5px_rgba(212,153,90,0.5)]' : ''} />
              <span className="text-[9px] font-medium tracking-wide">{pillar.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
