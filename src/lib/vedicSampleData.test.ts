import { describe, it, expect, beforeEach } from 'vitest';
import { loadVedicSampleData } from './vedicSampleData';
import { useStoryStore } from '@/stores/storyStore';
import { db } from './db/database';

describe('vedicSampleData', () => {
  beforeEach(async () => {
    useStoryStore.setState({
      activeProjectId: null,
      activeProject: null,
      entities: [],
      relationships: [],
      chapters: [],
      scenes: [],
    });
  });

  it('should seed Vedic sample project, entities, and relationships into Dexie and storyStore', async () => {
    await loadVedicSampleData(true);

    const state = useStoryStore.getState();
    expect(state.activeProject).not.toBeNull();
    expect(state.activeProject?.title).toContain('Vedic Cosmology');
    expect(state.entities.length).toBeGreaterThan(10);
    expect(state.relationships.length).toBeGreaterThan(5);

    const dbEntities = await db.entities.where('projectId').equals(state.activeProject!.id).toArray();
    expect(dbEntities.length).toBeGreaterThan(10);

    const dbRels = await db.relationships.where('projectId').equals(state.activeProject!.id).toArray();
    expect(dbRels.length).toBeGreaterThan(5);
  });
});
