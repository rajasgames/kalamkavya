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
      className={`flex h-screen overflow-hidden bg-base text-primary transition-colors duration-200 ${window.__TAURI__ ? 'pt-8' : ''}`}
    >
      {/* Desktop Sidebar Container */}
      <div 
        className="hidden md:block h-full border-r border-subtle bg-surface relative z-20" 
        style={{
          width: isSidebarExpanded ? '230px' : '56px',
          transition: 'width 0.2s ease-in-out'
        }}
      >
        <Sidebar />
      </div>
      
      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-[56px] bg-surface border-t border-subtle">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto relative bg-base p-0 pb-[56px] md:pb-0 flex flex-col">
        <Outlet />
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
