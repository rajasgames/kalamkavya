import { describe, it, expect, beforeEach } from 'vitest';
import { useStoryStore } from './storyStore';
import { db } from '@/lib/db';
import { Project, Chapter, Scene } from '@/types';

describe('storyStore', () => {
  const store = useStoryStore.getState();

  beforeEach(() => {
    // Reset store state
    useStoryStore.setState({
      activeProjectId: null,
      activeProject: null,
      activeChapterId: null,
      activeSceneId: null,
      entities: [],
      chapters: [],
      scenes: [],
    });
  });

  it('should cascade delete scenes when a chapter is deleted', async () => {
    const project: Project = { id: 'p1', title: 'Test Project', genre: 'Fantasy', premise: '', targetWordCount: 0, createdAt: Date.now(), updatedAt: Date.now(), kanbanColumns: [] };
    const chapter: Chapter = { id: 'c1', projectId: 'p1', title: 'Chapter 1', order: 0, createdAt: 0, updatedAt: 0 };
    const scene: Scene = { id: 's1', projectId: 'p1', chapterId: 'c1', title: 'Scene 1', order: 0, content: '', kanbanColumn: 'setup', wordCount: 0, planning: {}, createdAt: 0, updatedAt: 0 };

    await db.projects.put(project);
    await store.setActiveProject('p1');

    await store.addChapter(chapter);
    await store.addScene(scene);

    const currentState = useStoryStore.getState();
    expect(currentState.chapters).toHaveLength(1);
    expect(currentState.scenes).toHaveLength(1);

    await currentState.deleteChapter('c1');

    const stateAfterDelete = useStoryStore.getState();
    expect(stateAfterDelete.chapters).toHaveLength(0);
    expect(stateAfterDelete.scenes).toHaveLength(0);

    // Verify Dexie DB is also empty
    const dbScenes = await db.scenes.toArray();
    expect(dbScenes).toHaveLength(0);
  });
});
