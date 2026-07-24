import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ChevronDown, Sparkles } from 'lucide-react';
import { Tooltip } from '@heroui/react';
import { Sidebar } from './Sidebar';
import { GlobalSearch } from './GlobalSearch';
import { useUIStore } from '@/stores/uiStore';
import { useSearchStore } from '@/stores/searchStore';
import { useStoryStore } from '@/stores/storyStore';
import { ProjectCreationModal, ThemeToggle, InkRipple } from '@/components/ui';
import { SprintWidget } from '@/components/toolkit/SprintWidget';
import { AIDrawer } from '@/components/toolkit/AIDrawer';
import { AISettingsModal, OnboardingModal } from '@/components/shared';

declare global {
  interface Window {
    __TAURI__?: boolean;
  }
}

export const Layout = () => {
  const navigate = useNavigate();
  const { isSidebarExpanded, isSprintWidgetOpen, setSprintWidgetOpen, isFocusMode, setFocusMode, setSplashOpen } = useUIStore();
  const { toggleSearch } = useSearchStore();
  const { scenes, activeProject } = useStoryStore();

  // Derive total word count from the active project's loaded scenes
  const totalWordCount = activeProject
    ? scenes.reduce((sum, s) => sum + (s.wordCount || 0), 0)
    : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setFocusMode(!useUIStore.getState().isFocusMode);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSearch, setFocusMode]);

  return (
    <div 
      id="main-content" 
      className={`flex flex-col h-screen overflow-hidden bg-canvas text-primary transition-colors duration-300 ${window.__TAURI__ ? 'pt-8' : ''}`}
    >
      {/* Interactive Ink Ring Ripple FX */}
      <InkRipple />

      {/* Header Bar */}
      <header className={`h-[56px] shrink-0 border-b border-subtle flex items-center px-4 sm:px-6 justify-between bg-surface/80 backdrop-blur-md z-30 transition-all duration-300 ${isFocusMode ? '-mt-[56px] opacity-0 pointer-events-none' : 'mt-0 opacity-100'}`}>
        <div className="flex items-center gap-4 sm:gap-6 shrink-0 whitespace-nowrap overflow-hidden">
          {/* Main Brand & Title - Strictly in ONE LINE */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 shrink-0 whitespace-nowrap select-none cursor-pointer group hover:opacity-90 transition-opacity"
            title="Kalam Kavya Engine — Return Home"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0">
              <div className="absolute inset-0 bg-terracotta/20 rounded-xl blur-sm group-hover:scale-125 transition-transform duration-300" />
              <img 
                src="/brand_logo.png" 
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0 relative z-10" 
                alt="Kalam Kavya Brand Logo" 
              />
            </div>

            <div className="font-serif font-extrabold text-base sm:text-xl tracking-tight text-primary whitespace-nowrap flex items-center gap-2 shrink-0">
              <span className="whitespace-nowrap">कalam काvya</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-terracotta/15 text-terracotta border border-terracotta/25 uppercase tracking-wider hidden sm:inline-block shadow-sm">
                Engine
              </span>
            </div>
          </div>

          <div className="h-4 w-[1px] bg-subtle hidden sm:block shrink-0" />

          {/* Workspace Switcher */}
          <button className="text-xs sm:text-sm text-secondary hover:text-primary transition-colors font-sans flex items-center gap-1 shrink-0 truncate max-w-[140px] sm:max-w-none">
            <span className="truncate">My Workspace</span>
            <ChevronDown size={13} className="opacity-60 shrink-0" />
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Replay Intro Splash Button */}
          <Tooltip
            content="Play Intro Splash Screen"
            placement="bottom"
            delay={200}
            classNames={{
              content: "bg-surface border border-subtle text-primary text-xs py-1 px-2.5 rounded-lg whitespace-nowrap shadow-soft font-medium"
            }}
          >
            <button
              onClick={() => setSplashOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-terracotta/10 hover:bg-terracotta/20 border border-terracotta/25 text-terracotta text-xs font-semibold transition-all duration-200 active:scale-95 shadow-sm shrink-0"
            >
              <Sparkles size={13} className="animate-spin text-terracotta shrink-0" />
              <span className="hidden md:inline">Intro Splash</span>
            </button>
          </Tooltip>

          <div className="text-xs text-ghost font-mono hidden sm:block">
            {totalWordCount !== null
              ? `${totalWordCount.toLocaleString()} words`
              : '—'}
          </div>

          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div 
          className={`hidden md:flex flex-col border-r border-subtle bg-surface relative z-20 overflow-hidden transition-all duration-200 ease-in-out ${isFocusMode ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'}`} 
          style={{
            width: isFocusMode ? '0px' : (isSidebarExpanded ? '240px' : '64px'),
          }}
        >
          <Sidebar />
        </div>
        
        {/* Mobile Floating Bottom Bar */}
        <div className={`md:hidden fixed bottom-4 left-3 right-3 z-40 h-[64px] rounded-2xl shadow-soft overflow-hidden bg-surface/90 backdrop-blur-xl border border-subtle transition-all duration-300 ${isFocusMode ? 'translate-y-[150%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-hidden relative transition-all duration-300 ease-out bg-canvas p-0 md:p-6 pb-24 md:pb-6 flex flex-col">
          <div className="flex-1 overflow-y-auto w-full h-full rounded-none md:rounded-2xl md:border md:border-subtle md:bg-surface md:shadow-soft">
            <Outlet />
          </div>
        </main>
      </div>

      <GlobalSearch />
      <ProjectCreationModal />
      {isSprintWidgetOpen && <SprintWidget onClose={() => setSprintWidgetOpen(false)} />}
      <AIDrawer />
      <AISettingsModal />
      <OnboardingModal />
    </div>
  );
};
