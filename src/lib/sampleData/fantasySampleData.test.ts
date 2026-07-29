import { describe, beforeEach, it, expect } from 'vitest';
import { loadFantasySampleData } from './fantasySampleData';
import { db } from '@/lib/db/database';
import { useStoryStore } from '@/stores/storyStore';

describe('fantasySampleData', () => {
  beforeEach(async () => {
    await db.projects.clear();
    await db.entities.clear();
    await db.relationships.clear();
    useStoryStore.setState({
      activeProject: null,
      entities: [],
      relationships: [],
    });
  });

  it('should seed Fantasy sample project and entities into Dexie and store', async () => {
    const projectId = await loadFantasySampleData();
    expect(projectId).toBeTruthy();

    const project = await db.projects.get(projectId);
    expect(project).toBeDefined();
    expect(project?.title).toContain('Aethelgard');
    expect(project?.genre).toBe('fantasy');

    const entities = await db.entities.where({ projectId }).toArray();
    expect(entities.length).toBeGreaterThan(5);

    const character = entities.find(e => e.name === 'Arch-Mage Valerius Vance');
    expect(character).toBeDefined();
    expect(character?.type).toBe('character');
  });
});
