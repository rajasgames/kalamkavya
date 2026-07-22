import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { GlobalSearch } from './GlobalSearch';
import { useUIStore } from '@/stores/uiStore';
import { useSearchStore } from '@/stores/searchStore';
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
  const { isSidebarExpanded, isSprintWidgetOpen, setSprintWidgetOpen } = useUIStore();
  const { toggleSearch } = useSearchStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSearch]);

  return (
    <div 
      id="main-content" 
      className={`flex flex-col h-screen overflow-hidden bg-canvas text-primary transition-colors duration-300 ${window.__TAURI__ ? 'pt-8' : ''}`}
    >
      {/* Header Bar */}
      <header className="h-[56px] shrink-0 border-b border-subtle flex items-center px-6 justify-between bg-surface/50 z-30">
        <div className="flex items-center gap-6">
          <div className="font-serif font-medium text-xl">Inkwell</div>
          {/* Simple Workspace Switcher (Placeholder for now) */}
          <button className="text-sm text-secondary hover:text-primary transition-colors font-sans">
            My Workspace ▼
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-ghost font-mono">24,512 words</div>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div 
          className="hidden md:flex flex-col border-r border-subtle bg-surface relative z-20" 
          style={{
            width: isSidebarExpanded ? '250px' : '68px',
            transition: 'width 0.3s ease-out'
          }}
        >
          <Sidebar />
        </div>
        
        {/* Mobile Floating Bottom Bar */}
        <div className="md:hidden fixed bottom-4 left-3 right-3 z-40 h-[64px] rounded-full shadow-soft overflow-hidden bg-surface border border-subtle">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-hidden relative transition-all duration-300 ease-out bg-canvas p-0 md:p-6 pb-[84px] md:pb-6 flex flex-col">
          <div className="flex-1 overflow-y-auto w-full h-full">
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
