import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_SQL, SCHEMA_VERSION } from './schema';
import { nowIso } from '../../shared/ids';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('rmbr.db');
  await initializeSchema(db);
  return db;
}

async function initializeSchema(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync('PRAGMA journal_mode = WAL;');
  await database.execAsync('PRAGMA foreign_keys = ON;');

  const statements = CREATE_TABLES_SQL.split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const sql of statements) {
    await database.execAsync(sql + ';');
  }

  const row = await database.getFirstAsync<{ version: number }>(
    'SELECT version FROM schema_version LIMIT 1'
  );

  if (!row) {
    await database.runAsync('INSERT INTO schema_version (version) VALUES (?)', [SCHEMA_VERSION]);
  }

  await seedDefaultContexts(database);
}

async function seedDefaultContexts(database: SQLite.SQLiteDatabase): Promise<void> {
  const existing = await database.getFirstAsync<{ id: string }>(
    'SELECT id FROM contexts LIMIT 1'
  );
  if (existing) return;

  const now = nowIso();
  await database.runAsync(
    'INSERT INTO contexts (id, name, type, created_at) VALUES (?, ?, ?, ?)',
    ['ctx-work', 'Work', 'work', now]
  );
  await database.runAsync(
    'INSERT INTO contexts (id, name, type, created_at) VALUES (?, ?, ?, ?)',
    ['ctx-personal', 'Personal', 'personal', now]
  );
}

export function closeDatabase(): void {
  db = null;
}
