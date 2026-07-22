import { कalam काvyaDatabase } from './database';

/**
 * Apply database migrations and define the schema versions.
 * 
 * In Dexie, the .stores() method defines the tables and their indexes.
 * The primary key is always the first specified property.
 * We do not define every column here, only the properties that need to be indexed.
 */
export function applyMigrations(db: कalam काvyaDatabase) {
  db.version(1).stores({
    projects: 'id, title',
    entities: 'id, projectId, type, entityClass, [projectId+type], [projectId+entityClass], name, hasAIRule',
    relationships: 'id, projectId, fromEntityId, toEntityId',
    chapters: 'id, projectId',
    scenes: 'id, projectId, chapterId, order',
    aiSettings: 'id'
  });
  // Version 2: Added notes table for Concepts Lab
  db.version(2).stores({
    notes: 'id, projectId, createdAt'
  });
  // Version 3: Added analytics tables
  db.version(3).stores({
    dailyProgress: 'id, projectId, date',
    generationLogs: 'id, projectId, timestamp'
  });
}
