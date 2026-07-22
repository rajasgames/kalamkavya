export interface KanbanColumn {
  id: string;
  name: string;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  genre: string;
  /**
   * List of genre module IDs active for this project.
   * Defaults to ['universal'] for new projects.
   * Legacy projects without this field are treated as ['vedic'] for backward compat.
   */
  genreModules?: string[];
  premise: string;
  targetWordCount: number;
  kanbanColumns?: KanbanColumn[];
  createdAt: number;
  updatedAt: number;
}

export interface Chapter {
  id: string;
  projectId: string;
  title: string;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface ConflictEntry {
  id: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Resolved';
}

export interface ScenePlanning {
  goal?: string;
  conflict?: string;
  outcome?: string;
  characters?: string[];
  locationId?: string;
  pacingNote?: string;
  pacingType?: 'Action' | 'Dialogue' | 'Reflection' | 'Reveal' | 'Transition';
  conflictEntries?: ConflictEntry[];
}

export interface Scene {
  id: string;
  chapterId: string | null;
  projectId: string;
  title: string;
  content: string;
  wordCount: number;
  order: number;
  kanbanColumn: string;
  planning: ScenePlanning;
  createdAt: number;
  updatedAt: number;
}

export type NoteTint = 'neutral' | 'amber' | 'sage' | 'clay' | 'blue-grey';

export interface Note {
  id: string;
  projectId: string;
  title: string;
  body: string;
  color: NoteTint;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface DailyProgress {
  id: string; // `${projectId}-${YYYY-MM-DD}`
  projectId: string;
  date: string; // "YYYY-MM-DD"
  wordsWritten: number;
}

export interface GenerationLog {
  id: string;
  projectId: string;
  timestamp: number;
  entityCount: number;
}
