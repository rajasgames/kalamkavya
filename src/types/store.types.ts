import { Project, Entity, Chapter, Scene, Relationship } from './index';

export interface StoryState {
  activeProjectId: string | null;
  activeProject: Project | null;
  entities: Entity[];
  chapters: Chapter[];
  scenes: Scene[];
  relationships: Relationship[];
  notes: import('./story.types').Note[];
  dailyProgress: import('./story.types').DailyProgress[];
  generationLogs: import('./story.types').GenerationLog[];

  activeChapterId: string | null;
  activeSceneId: string | null;

  setActiveProject: (projectId: string | null) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setActiveChapterId: (chapterId: string | null) => void;
  setActiveSceneId: (sceneId: string | null) => void;

  addChapter: (chapter: Chapter) => Promise<void>;
  updateChapter: (chapter: Chapter) => Promise<void>;
  deleteChapter: (id: string) => Promise<void>;
  reorderChapters: (chapters: Chapter[]) => Promise<void>;

  addEntity: (entity: Entity) => Promise<void>;
  updateEntity: (entity: Entity) => Promise<void>;
  deleteEntity: (id: string) => Promise<void>;

  addRelationship: (rel: Relationship) => Promise<void>;
  deleteRelationship: (id: string) => Promise<void>;

  addScene: (scene: Scene) => Promise<void>;
  updateScene: (scene: Scene) => Promise<void>;
  deleteScene: (id: string) => Promise<void>;
  reorderScenes: (scenes: Scene[]) => Promise<void>;

  addNote: (note: import('./story.types').Note) => Promise<void>;
  updateNote: (note: import('./story.types').Note) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;

  addGenerationLog: (log: import('./story.types').GenerationLog) => Promise<void>;
}

export type Pillar = 'home' | 'manuscript' | 'project' | 'worldbible' | 'cast' | 'toolkit';
export type Theme = 'light' | 'dark';

export interface UIState {
  activePillar: Pillar;
  activeSubView: string;
  isSidebarExpanded: boolean;
  theme: Theme;
  openModal: string | null;
  isSprintWidgetOpen: boolean;
  isAIDrawerOpen: boolean;
  isAISettingsOpen: boolean;
  isOnboardingOpen: boolean;
  isSplashOpen: boolean;
  isFocusMode: boolean;
  isTourActive: boolean;
  tourStep: number;

  setActivePillar: (pillar: Pillar) => void;
  setActiveSubView: (view: string) => void;
  setSidebarExpanded: (expanded: boolean) => void;
  setTheme: (theme: Theme) => void;
  setOpenModal: (modal: string | null) => void;
  setSprintWidgetOpen: (open: boolean) => void;
  setAIDrawerOpen: (open: boolean) => void;
  setAISettingsOpen: (open: boolean) => void;
  setOnboardingOpen: (open: boolean) => void;
  setSplashOpen: (open: boolean) => void;
  setFocusMode: (open: boolean) => void;
  setTourActive: (active: boolean) => void;
  setTourStep: (step: number) => void;
}

export interface AIProviderSettings {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIState {
  isStreaming: boolean;
  activeProvider: string;
  providers: Record<string, AIProviderSettings>;
  profile: {
    tone: string;
    pov: string;
    proseStyle: string;
  };
  abortController: AbortController | null;
  streamedText: string;

  setProvider: (provider: string) => void;
  updateProviderSettings: (provider: string, settings: Partial<AIProviderSettings>) => void;
  hydrateSettings: (settings: { activeProvider: string; providers: Record<string, AIProviderSettings>; profile: { tone: string; pov: string; proseStyle: string; } }) => void;
  updateProfile: (profile: Partial<{ tone: string; pov: string; proseStyle: string; }>) => void;
  startStream: (controller: AbortController) => void;
  cancelStream: () => void;
  appendChunk: (text: string) => void;
  clearStream: () => void;
}
