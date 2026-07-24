import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { UIState, Pillar, Theme } from '@/types';

const getInitialTheme = (): Theme => {
  try {
    const stored = localStorage.getItem('kalam-kavya-theme');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch (e) {
    console.warn('Failed to read theme from localStorage', e);
  }
  return 'light';
};

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      activePillar: 'home',
      activeSubView: '',
      isSidebarExpanded: true,
      theme: getInitialTheme(),
      openModal: null,
      isSprintWidgetOpen: false,
      isAIDrawerOpen: false,
      isAISettingsOpen: false,
      isOnboardingOpen: typeof window !== 'undefined' ? localStorage.getItem('kalam-kavya_onboarding_completed') !== 'true' : false,
      isSplashOpen: false,
      isFocusMode: false,

      setActivePillar: (pillar: Pillar) => set({ activePillar: pillar }),
      setActiveSubView: (view: string) => set({ activeSubView: view }),
      setSidebarExpanded: (expanded: boolean) => set({ isSidebarExpanded: expanded }),
      setTheme: (theme: Theme) => {
        try {
          localStorage.setItem('kalam-kavya-theme', theme);
        } catch (e) {
          console.warn('Failed to read theme from localStorage', e);
        }
        document.documentElement.setAttribute('data-theme', theme);
        set({ theme });
      },
      setOpenModal: (modal: string | null) => set({ openModal: modal }),
      setSprintWidgetOpen: (open: boolean) => set({ isSprintWidgetOpen: open }),
      setAIDrawerOpen: (open: boolean) => set({ isAIDrawerOpen: open }),
      setAISettingsOpen: (open: boolean) => set({ isAISettingsOpen: open }),
      setOnboardingOpen: (open: boolean) => set({ isOnboardingOpen: open }),
      setSplashOpen: (open: boolean) => set({ isSplashOpen: open }),
      setFocusMode: (open: boolean) => set({ isFocusMode: open }),
    }),
    { enabled: import.meta.env.DEV }
  )
);
