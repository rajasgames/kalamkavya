import { describe, it, expect, beforeEach } from 'vitest';
import { useSearchStore } from './searchStore';

describe('searchStore', () => {
  beforeEach(() => {
    useSearchStore.setState({ isOpen: false });
  });

  it('should toggle search modal visibility', () => {
    expect(useSearchStore.getState().isOpen).toBe(false);

    useSearchStore.getState().openSearch();
    expect(useSearchStore.getState().isOpen).toBe(true);

    useSearchStore.getState().closeSearch();
    expect(useSearchStore.getState().isOpen).toBe(false);

    useSearchStore.getState().toggleSearch();
    expect(useSearchStore.getState().isOpen).toBe(true);
  });
});
