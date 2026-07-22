import 'fake-indexeddb/auto';
import { db } from '@/lib/db';
import { beforeEach } from 'vitest';

beforeEach(async () => {
  // Clear all tables before each test
  await Promise.all(db.tables.map(table => table.clear()));
});
