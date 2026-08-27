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
    // Fresh install — all tables already created above via CREATE TABLE IF NOT EXISTS.
    await database.runAsync('INSERT INTO schema_version (version) VALUES (?)', [SCHEMA_VERSION]);
  } else {
    await runMigrations(database, row.version);
  }

  await seedDefaultContexts(database);
}

async function runMigrations(database: SQLite.SQLiteDatabase, fromVersion: number): Promise<void> {
  if (fromVersion < 2) {
    await database.execAsync('ALTER TABLE calendar_events ADD COLUMN description TEXT;');
    await database.runAsync('UPDATE schema_version SET version = 2');
  }
  if (fromVersion < 3) {
    // calendar_rules and rule_notifications are created by CREATE TABLE IF NOT EXISTS above.
    await database.runAsync('UPDATE schema_version SET version = 3');
  }
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
