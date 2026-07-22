import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { GlobalSearch } from './GlobalSearch';
import { useUIStore } from '@/stores/uiStore';
import { useSearchStore } from '@/stores/searchStore';
import { ProjectCreationModal } from '@/components/ui';
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
      className={`flex h-screen overflow-hidden bg-gradient-to-br from-base to-surface text-primary transition-colors duration-500 ${window.__TAURI__ ? 'pt-8' : ''}`}
    >
      {/* Floating Desktop Sidebar Container */}
      <div 
        className="hidden md:block h-full p-4 pr-0 relative z-20" 
        style={{
          width: isSidebarExpanded ? '250px' : '68px',
          transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="h-full rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden bg-surface/75 backdrop-blur-2xl border border-subtle flex flex-col">
          <Sidebar />
        </div>
      </div>
      
      {/* Mobile Floating Bottom Bar */}
      <div className="md:hidden fixed bottom-4 left-3 right-3 z-40 h-[64px] rounded-full shadow-2xl shadow-black/20 dark:shadow-black/60 overflow-hidden bg-surface/90 backdrop-blur-2xl border border-subtle/80">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-hidden relative transition-all duration-300 ease-out bg-transparent p-0 md:p-4 pb-[84px] md:pb-4 flex flex-col">
        <div className="flex-1 rounded-none md:rounded-2xl bg-surface/40 backdrop-blur-md border-0 md:border border-subtle shadow-sm overflow-y-auto w-full h-full">
          <Outlet />
        </div>
      </main>
      <GlobalSearch />
      <ProjectCreationModal />
      {isSprintWidgetOpen && <SprintWidget onClose={() => setSprintWidgetOpen(false)} />}
      <AIDrawer />
      <AISettingsModal />
      <OnboardingModal />
    </div>
  );
};
