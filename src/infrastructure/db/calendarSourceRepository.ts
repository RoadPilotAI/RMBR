import { getDatabase } from './database';
import { CalendarSource } from '../../domain/calendar/types';
import { generateId, nowIso } from '../../shared/ids';

interface CalendarSourceRow {
  id: string;
  name: string;
  context_id: string;
  source_type: string;
  secure_storage_key: string;
  last_successful_sync_at: string | null;
  sync_error: string | null;
  created_at: string;
  updated_at: string;
}

function rowToSource(row: CalendarSourceRow): CalendarSource {
  return {
    id: row.id,
    name: row.name,
    contextId: row.context_id,
    sourceType: 'ics',
    secureStorageKey: row.secure_storage_key,
    lastSuccessfulSyncAt: row.last_successful_sync_at,
    syncError: row.sync_error,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createCalendarSource(params: {
  name: string;
  contextId: string;
  secureStorageKey: string;
}): Promise<CalendarSource> {
  const db = await getDatabase();
  const id = generateId();
  const now = nowIso();

  await db.runAsync(
    `INSERT INTO calendar_sources
     (id, name, context_id, source_type, secure_storage_key, created_at, updated_at)
     VALUES (?, ?, ?, 'ics', ?, ?, ?)`,
    [id, params.name, params.contextId, params.secureStorageKey, now, now]
  );

  return {
    id,
    name: params.name,
    contextId: params.contextId,
    sourceType: 'ics',
    secureStorageKey: params.secureStorageKey,
    lastSuccessfulSyncAt: null,
    syncError: null,
    createdAt: now,
    updatedAt: now,
  };
}

export async function listCalendarSources(): Promise<CalendarSource[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<CalendarSourceRow>(
    'SELECT * FROM calendar_sources ORDER BY created_at ASC'
  );
  return rows.map(rowToSource);
}

export async function getCalendarSource(id: string): Promise<CalendarSource | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<CalendarSourceRow>(
    'SELECT * FROM calendar_sources WHERE id = ?',
    [id]
  );
  return row ? rowToSource(row) : null;
}

export async function updateCalendarSourceSyncResult(
  id: string,
  result: { success: boolean; error?: string }
): Promise<void> {
  const db = await getDatabase();
  const now = nowIso();
  if (result.success) {
    await db.runAsync(
      'UPDATE calendar_sources SET last_successful_sync_at = ?, sync_error = NULL, updated_at = ? WHERE id = ?',
      [now, now, id]
    );
  } else {
    await db.runAsync(
      'UPDATE calendar_sources SET sync_error = ?, updated_at = ? WHERE id = ?',
      [result.error ?? 'Unknown error', now, id]
    );
  }
}

export async function deleteCalendarSource(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM calendar_sources WHERE id = ?', [id]);
}
