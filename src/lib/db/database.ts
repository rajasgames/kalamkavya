import Dexie, { Table } from 'dexie';
import { Entity, Relationship, AiSettings, Project, Chapter, Scene } from '@/types';
import { applyMigrations } from './migrations';

export class InkwellDatabase extends Dexie {
  projects!: Table<Project, string>;
  entities!: Table<Entity, string>;
  relationships!: Table<Relationship, string>;
  chapters!: Table<Chapter, string>;
  scenes!: Table<Scene, string>;
  aiSettings!: Table<AiSettings, string>;
  notes!: Table<import('@/types/story.types').Note, string>;
  dailyProgress!: Table<import('@/types/story.types').DailyProgress, string>;
  generationLogs!: Table<import('@/types/story.types').GenerationLog, string>;

  constructor() {
    super('inkwell-db');
    
    // Apply schema versions and migrations
    applyMigrations(this);
  }
}

// Export singleton instance
export const db = new InkwellDatabase();
