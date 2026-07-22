import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { GlobalSearch } from './GlobalSearch';
import { useUIStore } from '@/stores/uiStore';
import { useSearchStore } from '@/stores/searchStore';
import { useStoryStore } from '@/stores/storyStore';
import { ProjectCreationModal, ThemeToggle } from '@/components/ui';
import { SprintWidget } from '@/components/toolkit/SprintWidget';
import { AIDrawer } from '@/components/toolkit/AIDrawer';
import { AISettingsModal, OnboardingModal } from '@/components/shared';

declare global {
  interface Window {
    __TAURI__?: boolean;
  }
}

export const Layout = () => {
  const { isSidebarExpanded, isSprintWidgetOpen, setSprintWidgetOpen, isFocusMode, setFocusMode } = useUIStore();
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
      {/* Header Bar */}
      <header className={`h-[56px] shrink-0 border-b border-subtle flex items-center px-6 justify-between bg-surface/80 backdrop-blur-md z-30 transition-all duration-300 ${isFocusMode ? '-mt-[56px] opacity-0 pointer-events-none' : 'mt-0 opacity-100'}`}>
        <div className="flex items-center gap-6">
          <div className="font-display font-medium text-xl tracking-tight">Inkwell</div>
          {/* Workspace Switcher — placeholder for multi-workspace support */}
          <button className="text-sm text-secondary hover:text-primary transition-colors font-sans flex items-center gap-1">
            My Workspace <ChevronDown size={13} className="opacity-60" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-ghost font-mono">
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
          className={`hidden md:flex flex-col border-r border-subtle bg-surface relative z-20 overflow-hidden transition-all duration-300 ease-in-out ${isFocusMode ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'}`} 
          style={{
            width: isFocusMode ? '0px' : (isSidebarExpanded ? '250px' : '68px'),
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
