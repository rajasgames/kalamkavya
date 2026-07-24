import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, PenTool, BookOpen, Users, Wrench, PanelLeftClose, PanelLeftOpen, Search, LucideIcon, Sparkles, Settings, HelpCircle, PlusCircle, ArrowRight } from 'lucide-react';
import { Tooltip } from '@heroui/react';
import { useUIStore } from '@/stores/uiStore';
import { useSearchStore } from '@/stores/searchStore';
import { Pillar } from '@/types';

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
    id: 'project', label: 'Settings', icon: Settings, defaultHref: '/project/core',
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
    id: 'toolkit', label: 'Toolkit', icon: Wrench, defaultHref: '/toolkit/ai-assistant',
    subViews: [
      { id: 'ai-assistant', label: 'AI Assistant', href: '/toolkit/ai-assistant' },
      { id: 'ideas', label: 'Concepts Lab', href: '/toolkit/ideas' },
      { id: 'insights', label: 'Insights', href: '/toolkit/insights' },
      { id: 'data', label: 'Data Management', href: '/toolkit/data' }
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
      {/* Desktop Sidebar (Inside floating container) */}
      <aside className="hidden md:flex flex-col h-full w-full bg-transparent overflow-hidden font-sans">
        <div className="flex-1 flex overflow-hidden">
          {/* Icons Column (64px wide) */}
          <div className="w-[64px] flex-shrink-0 flex flex-col items-center py-4 justify-between border-r border-subtle relative z-10">
            {/* Top Navigation Group */}
            <div className="flex flex-col items-center gap-3 w-full">
              {PILLARS.map(pillar => {
                const isActive = activePillar === pillar.id;
                return (
                  <Tooltip
                    key={pillar.id}
                    content={pillar.label}
                    isDisabled={isSidebarExpanded}
                    placement="right"
                    delay={200}
                    closeDelay={0}
                    classNames={{
                      content: "bg-surface border border-subtle text-primary text-xs py-1 px-2.5 rounded-lg whitespace-nowrap shadow-soft font-medium"
                    }}
                  >
                    <button
                      data-tour-id={`pillar-${pillar.id}`}
                      onClick={() => handlePillarClick(pillar)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative group active:scale-[0.98] ${
                        isActive 
                          ? 'text-terracotta font-semibold bg-terracotta/10' 
                          : 'text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-md bg-terracotta pointer-events-none" />
                      )}
                      <pillar.icon size={20} className="relative z-10 shrink-0" />
                    </button>
                  </Tooltip>
                );
              })}

              <div className="w-6 h-[1px] bg-subtle my-1" />

              {/* AI Assistant Quick Icon */}
              <Tooltip
                content="Ask AI Assistant"
                isDisabled={isSidebarExpanded}
                placement="right"
                delay={200}
                classNames={{
                  content: "bg-surface border border-subtle text-primary text-xs py-1 px-2.5 rounded-lg whitespace-nowrap shadow-soft font-medium"
                }}
              >
                <button
                  data-tour-id="ai-assistant"
                  onClick={() => setAIDrawerOpen(true)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-terracotta hover:bg-terracotta/15 hover:scale-105 active:scale-95 transition-all duration-200 relative group"
                >
                  <Sparkles size={20} className="shrink-0" />
                </button>
              </Tooltip>

              {/* AI Settings Quick Icon */}
              <Tooltip
                content="AI Settings"
                isDisabled={isSidebarExpanded}
                placement="right"
                delay={200}
                classNames={{
                  content: "bg-surface border border-subtle text-primary text-xs py-1 px-2.5 rounded-lg whitespace-nowrap shadow-soft font-medium"
                }}
              >
                <button
                  data-tour-id="ai-settings"
                  onClick={() => setAISettingsOpen(true)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-ghost hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 hover:scale-105 active:scale-95 transition-all duration-200 relative group"
                >
                  <Settings size={20} className="shrink-0" />
                </button>
              </Tooltip>

              {/* User Guide & Onboarding Tour Icon */}
              <Tooltip
                content="User Guide & Tour"
                isDisabled={isSidebarExpanded}
                placement="right"
                delay={200}
                classNames={{
                  content: "bg-surface border border-subtle text-primary text-xs py-1 px-2.5 rounded-lg whitespace-nowrap shadow-soft font-medium"
                }}
              >
                <button
                  data-tour-id="user-guide"
                  onClick={() => setOnboardingOpen(true)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-ghost hover:text-terracotta hover:bg-black/5 dark:hover:bg-white/5 hover:scale-105 active:scale-95 transition-all duration-200 relative group"
                >
                  <HelpCircle size={20} className="shrink-0" />
                </button>
              </Tooltip>
            </div>

            {/* Bottom Actions Group */}
            <div className="flex flex-col items-center gap-3 w-full">
              {/* Global Search */}
              <Tooltip
                content="Search (Cmd/Ctrl + K)"
                isDisabled={isSidebarExpanded}
                placement="right"
                delay={200}
                classNames={{
                  content: "bg-surface border border-subtle text-primary text-xs py-1 px-2.5 rounded-lg whitespace-nowrap shadow-soft font-medium"
                }}
              >
                <button 
                  data-tour-id="global-search"
                  onClick={openSearch}
                  className="w-10 h-10 flex items-center justify-center text-ghost hover:text-primary transition-all duration-200 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 relative group"
                >
                  <Search size={18} className="shrink-0" />
                </button>
              </Tooltip>

              {/* Collapse/Expand Toggle */}
              <Tooltip
                content={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
                isDisabled={isSidebarExpanded}
                placement="right"
                delay={200}
                classNames={{
                  content: "bg-surface border border-subtle text-primary text-xs py-1 px-2.5 rounded-lg whitespace-nowrap shadow-soft font-medium"
                }}
              >
                <button 
                  onClick={() => setSidebarExpanded(!isSidebarExpanded)}
                  className="w-10 h-10 flex items-center justify-center text-ghost hover:text-primary transition-all duration-200 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 relative group"
                >
                  {isSidebarExpanded ? <PanelLeftClose size={18} className="shrink-0" /> : <PanelLeftOpen size={18} className="shrink-0" />}
                </button>
              </Tooltip>
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
                            ? 'bg-terracotta/10 text-terracotta border-terracotta/20 shadow-soft font-semibold'
                            : 'text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        {isSubActive && <div className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" />}
                        <span className={isSubActive ? 'translate-x-0 transition-transform' : 'group-hover:translate-x-1 transition-transform'}>{sub.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ) : (
              // Contextual quick-actions for pillars with no sub-views (Home, World Bible)
              <div className="p-4 flex-1 flex flex-col gap-1">
                <h3 className="text-[10px] font-bold tracking-widest text-ghost/80 uppercase mb-3 px-2">
                  {currentPillarDef?.label}
                </h3>
                {currentPillarDef?.id === 'home' && (
                  <>
                    <button
                      onClick={() => navigate('/') }
                      className="px-3 py-2 text-sm rounded-xl text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 flex items-center gap-2 group"
                    >
                      <PlusCircle size={14} className="shrink-0 text-terracotta" />
                      <span className="group-hover:translate-x-0.5 transition-transform">New Project</span>
                    </button>
                    <button
                      onClick={() => setOnboardingOpen(true)}
                      className="px-3 py-2 text-sm rounded-xl text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 flex items-center gap-2 group"
                    >
                      <ArrowRight size={14} className="shrink-0 text-terracotta" />
                      <span className="group-hover:translate-x-0.5 transition-transform">Explore Sample Worlds</span>
                    </button>
                  </>
                )}
                {currentPillarDef?.id === 'worldbible' && (
                  <>
                    <button
                      onClick={() => navigate('/world-bible')}
                      className="px-3 py-2 text-sm rounded-xl text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 flex items-center gap-2 group"
                    >
                      <BookOpen size={14} className="shrink-0 text-terracotta" />
                      <span className="group-hover:translate-x-0.5 transition-transform">Browse Entries</span>
                    </button>
                    <button
                      onClick={() => navigate('/world-bible')}
                      className="px-3 py-2 text-sm rounded-xl text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 flex items-center gap-2 group"
                    >
                      <PlusCircle size={14} className="shrink-0 text-terracotta" />
                      <span className="group-hover:translate-x-0.5 transition-transform">Add Lore Entry</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Floating Bottom Bar */}
      <nav className="md:hidden flex items-center justify-around h-full w-full bg-transparent px-1 font-sans relative">
        
        {PILLARS.map(pillar => {
          const isActive = activePillar === pillar.id;
          return (
            <button
              key={pillar.id}
              data-tour-id={`mobile-pillar-${pillar.id}`}
              onClick={() => {
                setActivePillar(pillar.id);
                navigate(pillar.defaultHref);
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 transition-all duration-300 relative z-10 rounded-2xl ${
                isActive 
                  ? 'text-terracotta font-bold' 
                  : 'text-ghost hover:text-primary active:scale-95'
              }`}
            >
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-terracotta" />
              )}
              <pillar.icon size={18} className={`shrink-0`} />
              <span className="text-[10px] font-medium tracking-tight mt-0.5 truncate max-w-full">{pillar.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
