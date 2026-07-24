import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    useUIStore.setState({
      activePillar: 'home',
      activeSubView: '',
      isSidebarExpanded: true,
      theme: 'light',
      openModal: null,
      isSprintWidgetOpen: false,
      isAIDrawerOpen: false,
      isAISettingsOpen: false,
      isOnboardingOpen: false,
      isSplashOpen: false,
      isFocusMode: false,
      isTourActive: false,
      tourStep: 1,
    });
  });

  it('should set active pillar and subview', () => {
    useUIStore.getState().setActivePillar('worldbible');
    useUIStore.getState().setActiveSubView('flowcraft');

    expect(useUIStore.getState().activePillar).toBe('worldbible');
    expect(useUIStore.getState().activeSubView).toBe('flowcraft');
  });

  it('should toggle sidebar and focus mode', () => {
    useUIStore.getState().setSidebarExpanded(false);
    expect(useUIStore.getState().isSidebarExpanded).toBe(false);

    useUIStore.getState().setFocusMode(true);
    expect(useUIStore.getState().isFocusMode).toBe(true);
  });

  it('should toggle modal and drawer states', () => {
    useUIStore.getState().setAIDrawerOpen(true);
    useUIStore.getState().setSprintWidgetOpen(true);
    useUIStore.getState().setOpenModal('export');

    expect(useUIStore.getState().isAIDrawerOpen).toBe(true);
    expect(useUIStore.getState().isSprintWidgetOpen).toBe(true);
    expect(useUIStore.getState().openModal).toBe('export');
  });

  it('should control guided tour step navigation', () => {
    useUIStore.getState().setTourActive(true);
    useUIStore.getState().setTourStep(3);

    expect(useUIStore.getState().isTourActive).toBe(true);
    expect(useUIStore.getState().tourStep).toBe(3);
  });
});
