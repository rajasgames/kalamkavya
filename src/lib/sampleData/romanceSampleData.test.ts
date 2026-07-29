import { loadRomanceSampleData } from './romanceSampleData';
import { db } from '@/lib/db/database';
import { useStoryStore } from '@/stores/storyStore';
import { describe, it, expect, beforeEach } from 'vitest';

describe('romanceSampleData', () => {
  beforeEach(async () => {
    await db.projects.clear();
    await db.entities.clear();
    await db.relationships.clear();
    await db.chapters.clear();
    await db.scenes.clear();
    await db.notes.clear();
    useStoryStore.setState({
      activeProject: null,
      entities: [],
      relationships: [],
      chapters: [],
      scenes: [],
      notes: [],
    });
  });

  it('should seed Romance sample project, characters, chapters, and relationships into Dexie', async () => {
    const projectId = await loadRomanceSampleData();
    expect(projectId).toBeTruthy();

    const project = await db.projects.get(projectId);
    expect(project).toBeDefined();
    expect(project?.title).toBe('Echoes of the Heart');
    expect(project?.genre).toBe('romance');
    expect(project?.subGenre).toBe('love_triangle');

    const entities = await db.entities.where({ projectId }).toArray();
    // 3 locations + 2 factions + 6 characters = 11 entities
    expect(entities.length).toBe(11);

    const elara = entities.find(e => e.name === 'Elara Vance');
    expect(elara).toBeDefined();
    expect(elara?.type).toBe('character');
    expect((elara?.data as Record<string, any>)?.personality?.mbti).toBe('INFP');

    const relationships = await db.relationships.where({ projectId }).toArray();
    expect(relationships.length).toBe(10);
    
    // Check specific love triangle dynamic
    const romanticTension = relationships.find(r => r.type === 'romantic_tension');
    expect(romanticTension).toBeDefined();
    expect(romanticTension?.metadata?.tension).toBe(80);

    const chapters = await db.chapters.where({ projectId }).toArray();
    expect(chapters.length).toBe(10);

    const scenes = await db.scenes.where({ projectId }).toArray();
    expect(scenes.length).toBe(20);
    
    // Check ScenePlanning
    const firstScene = scenes.find(s => s.order === 0 && chapters.find(c => c.id === s.chapterId)?.order === 0);
    expect(firstScene).toBeDefined();
    expect(firstScene?.planning.goal).toContain('approved');
    expect(firstScene?.planning.conflictEntries?.length).toBeGreaterThan(0);

    const notes = await db.notes.where({ projectId }).toArray();
    expect(notes.length).toBe(2);
  });
});
