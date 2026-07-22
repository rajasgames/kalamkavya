import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { db } from '@/lib/db';
import { StoryState, Entity } from '@/types';

export const useStoryStore = create<StoryState>()(
  devtools(
    persist(
      (set, get) => ({
        activeProjectId: null,
        activeProject: null,
        activeChapterId: null,
        activeSceneId: null,
        entities: [],
        chapters: [],
        scenes: [],
        relationships: [],
        notes: [],
        dailyProgress: [],
        generationLogs: [],

        setActiveProject: async (projectId: string | null) => {
          if (!projectId) {
            set({
              activeProjectId: null,
              activeProject: null,
              activeChapterId: null,
              activeSceneId: null,
              entities: [],
              chapters: [],
              scenes: [],
              relationships: [],
              notes: [],
              dailyProgress: [],
              generationLogs: [],
            });
            return;
          }

          // Fetch full project data from Dexie
          const project = await db.projects.get(projectId);
          if (!project) return;

          // Fetch related data
          const [rawEntities, chapters, scenes, relationships, notes, dailyProgress, generationLogs] = await Promise.all([
            db.entities.where('projectId').equals(projectId).toArray(),
            db.chapters.where('projectId').equals(projectId).toArray(),
            db.scenes.where('projectId').equals(projectId).toArray(),
            db.relationships.where('projectId').equals(projectId).toArray(),
            db.notes.where('projectId').equals(projectId).toArray(),
            db.dailyProgress.where('projectId').equals(projectId).toArray(),
            db.generationLogs.where('projectId').equals(projectId).toArray(),
          ]);

          // Migration for entityClass
          const entitiesToUpdate: Entity[] = [];
          const entities = rawEntities.map(e => {
            if (!e.entityClass) {
              const updated = { ...e, entityClass: 'INSTANCE' as const };
              entitiesToUpdate.push(updated);
              return updated;
            }
            return e;
          });

          if (entitiesToUpdate.length > 0) {
            await db.entities.bulkPut(entitiesToUpdate);
          }

          set({
            activeProjectId: projectId,
            activeProject: project,
            entities,
            chapters,
            scenes,
            relationships,
            notes,
            dailyProgress,
            generationLogs,
          });
        },

        updateProject: async (project) => {
          await db.projects.put(project);
          set({ activeProject: project });
        },

        deleteProject: async (id: string) => {
          await db.projects.delete(id);
          // Delete all associated data
          await Promise.all([
            db.entities.where('projectId').equals(id).delete(),
            db.chapters.where('projectId').equals(id).delete(),
            db.scenes.where('projectId').equals(id).delete(),
            db.relationships.where('projectId').equals(id).delete(),
            db.notes.where('projectId').equals(id).delete(),
            db.dailyProgress.where('projectId').equals(id).delete(),
            db.generationLogs.where('projectId').equals(id).delete(),
          ]);
          
          if (get().activeProjectId === id) {
            get().setActiveProject(null);
          }
        },

        setActiveChapterId: (chapterId: string | null) => set({ activeChapterId: chapterId }),
        setActiveSceneId: (sceneId: string | null) => set({ activeSceneId: sceneId }),

        addChapter: async (chapter) => {
          await db.chapters.put(chapter);
          set((state) => ({ chapters: [...state.chapters, chapter] }));
        },
        updateChapter: async (chapter) => {
          await db.chapters.put(chapter);
          set((state) => ({ chapters: state.chapters.map((c) => (c.id === chapter.id ? chapter : c)) }));
        },
        deleteChapter: async (id) => {
          await db.chapters.delete(id);
          // Delete all scenes belonging to this chapter (cascade)
          const scenesToDelete = await db.scenes.where('chapterId').equals(id).toArray();
          const sceneIds = scenesToDelete.map(s => s.id);
          await db.scenes.bulkDelete(sceneIds);
          set((state) => ({ 
            chapters: state.chapters.filter((c) => c.id !== id),
            scenes: state.scenes.filter((s) => s.chapterId !== id)
          }));
        },
        reorderChapters: async (chapters) => {
          await db.transaction('rw', db.chapters, async () => {
            await db.chapters.bulkPut(chapters);
          });
          set({ chapters });
        },

        addEntity: async (entity) => {
          const now = Date.now();
          const newEntity = { ...entity, createdAt: entity.createdAt || now, updatedAt: entity.updatedAt || now };
          await db.entities.put(newEntity);
          set((state) => ({ entities: [...state.entities, newEntity] }));
        },
        updateEntity: async (entity) => {
          const updatedEntity = { ...entity, updatedAt: Date.now() };
          await db.entities.put(updatedEntity);
          set((state) => ({
            entities: state.entities.map((e) => (e.id === updatedEntity.id ? updatedEntity : e)),
          }));
        },
        deleteEntity: async (id) => {
          await db.entities.delete(id);
          set((state) => ({
            entities: state.entities.filter((e) => e.id !== id),
          }));
        },

        addRelationship: async (rel) => {
          await db.relationships.put(rel);
          set((state) => ({ relationships: [...state.relationships, rel] }));
        },
        deleteRelationship: async (id) => {
          await db.relationships.delete(id);
          set((state) => ({ relationships: state.relationships.filter((r) => r.id !== id) }));
        },

        addScene: async (scene) => {
          await db.scenes.put(scene);
          
          let newDailyProgress = get().dailyProgress;
          if (scene.wordCount > 0) {
            const today = new Date().toISOString().split('T')[0];
            const dpId = `${scene.projectId}-${today}`;
            const existing = newDailyProgress.find(dp => dp.id === dpId);
            const dpRecord = existing 
              ? { ...existing, wordsWritten: existing.wordsWritten + scene.wordCount }
              : { id: dpId, projectId: scene.projectId, date: today, wordsWritten: scene.wordCount };
            await db.dailyProgress.put(dpRecord);
            newDailyProgress = existing 
              ? newDailyProgress.map(dp => dp.id === dpId ? dpRecord : dp)
              : [...newDailyProgress, dpRecord];
          }

          set((state) => ({ 
            scenes: [...state.scenes, scene],
            dailyProgress: newDailyProgress
          }));
        },
        updateScene: async (scene) => {
          const state = get();
          const oldScene = state.scenes.find(s => s.id === scene.id);
          const delta = oldScene ? scene.wordCount - oldScene.wordCount : 0;
          
          await db.scenes.put(scene);
          
          let newDailyProgress = state.dailyProgress;
          if (delta !== 0) {
            const today = new Date().toISOString().split('T')[0];
            const dpId = `${scene.projectId}-${today}`;
            const existing = newDailyProgress.find(dp => dp.id === dpId);
            const dpRecord = existing 
              ? { ...existing, wordsWritten: Math.max(0, existing.wordsWritten + delta) }
              : { id: dpId, projectId: scene.projectId, date: today, wordsWritten: Math.max(0, delta) };
            await db.dailyProgress.put(dpRecord);
            newDailyProgress = existing 
              ? newDailyProgress.map(dp => dp.id === dpId ? dpRecord : dp)
              : [...newDailyProgress, dpRecord];
          }

          set((state) => ({
            scenes: state.scenes.map((s) => (s.id === scene.id ? scene : s)),
            dailyProgress: newDailyProgress
          }));
        },
        deleteScene: async (id) => {
          await db.scenes.delete(id);
          set((state) => ({
            scenes: state.scenes.filter((s) => s.id !== id),
          }));
        },
        reorderScenes: async (scenes) => {
          await db.transaction('rw', db.scenes, async () => {
            await db.scenes.bulkPut(scenes);
          });
          set((state) => {
            // merge reordered scenes with existing scenes (that belong to other chapters)
            const sceneMap = new Map(scenes.map(s => [s.id, s]));
            return {
              scenes: state.scenes.map(s => sceneMap.get(s.id) || s)
            };
          });
        },

        addNote: async (note) => {
          const now = Date.now();
          const newNote = { ...note, createdAt: note.createdAt || now, updatedAt: note.updatedAt || now };
          await db.notes.put(newNote);
          set((state) => ({ notes: [...state.notes, newNote] }));
        },
        updateNote: async (note) => {
          const updatedNote = { ...note, updatedAt: Date.now() };
          await db.notes.put(updatedNote);
          set((state) => ({
            notes: state.notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)),
          }));
        },
        deleteNote: async (id) => {
          await db.notes.delete(id);
          set((state) => ({
            notes: state.notes.filter((n) => n.id !== id),
          }));
        },

        addGenerationLog: async (log) => {
          await db.generationLogs.put(log);
          set((state) => ({ generationLogs: [...state.generationLogs, log] }));
        },
      }),
      {
        name: 'inkwell-story-storage',
        // Only persist the activeProjectId to localStorage
        partialize: (state) => ({ activeProjectId: state.activeProjectId }),
        onRehydrateStorage: () => (state) => {
          if (state?.activeProjectId) {
            // Rehydrate full data from Dexie after storage is loaded
            state.setActiveProject(state.activeProjectId);
          }
        },
      }
    ),
    { enabled: import.meta.env.DEV }
  )
);
