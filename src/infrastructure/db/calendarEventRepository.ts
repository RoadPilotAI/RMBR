import { getDatabase } from './database';
import { CalendarEvent, ParsedCalendarEvent } from '../../domain/calendar/types';
import { generateId, nowIso } from '../../shared/ids';

interface CalendarEventRow {
  id: string;
  calendar_source_id: string;
  external_uid: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string;
  time_zone: string | null;
  location: string | null;
  all_day: number;
  recurrence_rule: string | null;
  last_seen_at: string;
  source_hash: string;
  created_at: string;
  updated_at: string;
}

function rowToEvent(row: CalendarEventRow): CalendarEvent {
  return {
    id: row.id,
    calendarSourceId: row.calendar_source_id,
    externalUid: row.external_uid,
    title: row.title,
    description: row.description,
    startAt: row.start_at,
    endAt: row.end_at,
    timeZone: row.time_zone,
    location: row.location,
    allDay: row.all_day === 1,
    recurrenceRule: row.recurrence_rule,
    lastSeenAt: row.last_seen_at,
    sourceHash: row.source_hash,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function upsertCalendarEvents(
  calendarSourceId: string,
  events: ParsedCalendarEvent[]
): Promise<void> {
  const db = await getDatabase();
  const now = nowIso();

  for (const event of events) {
    const existing = await db.getFirstAsync<{ id: string; source_hash: string }>(
      'SELECT id, source_hash FROM calendar_events WHERE calendar_source_id = ? AND external_uid = ?',
      [calendarSourceId, event.externalUid]
    );

    if (!existing) {
      await db.runAsync(
        `INSERT INTO calendar_events
         (id, calendar_source_id, external_uid, title, description, start_at, end_at,
          time_zone, location, all_day, recurrence_rule, last_seen_at, source_hash, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          generateId(),
          calendarSourceId,
          event.externalUid,
          event.title,
          event.description,
          event.startAt.toISOString(),
          event.endAt.toISOString(),
          event.timeZone,
          event.location,
          event.allDay ? 1 : 0,
          event.recurrenceRule,
          now,
          event.sourceHash,
          now,
          now,
        ]
      );
    } else if (existing.source_hash !== event.sourceHash) {
      await db.runAsync(
        `UPDATE calendar_events
         SET title = ?, description = ?, start_at = ?, end_at = ?, time_zone = ?, location = ?,
             all_day = ?, recurrence_rule = ?, last_seen_at = ?, source_hash = ?, updated_at = ?
         WHERE id = ?`,
        [
          event.title,
          event.description,
          event.startAt.toISOString(),
          event.endAt.toISOString(),
          event.timeZone,
          event.location,
          event.allDay ? 1 : 0,
          event.recurrenceRule,
          now,
          event.sourceHash,
          now,
          existing.id,
        ]
      );
    } else {
      await db.runAsync(
        'UPDATE calendar_events SET last_seen_at = ? WHERE id = ?',
        [now, existing.id]
      );
    }
  }
}

export async function listUpcomingEvents(
  options: { limit?: number; fromDate?: Date } = {}
): Promise<CalendarEvent[]> {
  const db = await getDatabase();
  const from = (options.fromDate ?? new Date()).toISOString();
  const limit = options.limit ?? 20;

  const rows = await db.getAllAsync<CalendarEventRow>(
    `SELECT * FROM calendar_events
     WHERE start_at >= ?
     ORDER BY start_at ASC
     LIMIT ?`,
    [from, limit]
  );
  return rows.map(rowToEvent);
}

export async function listEventsBySource(calendarSourceId: string): Promise<CalendarEvent[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<CalendarEventRow>(
    'SELECT * FROM calendar_events WHERE calendar_source_id = ? ORDER BY start_at ASC',
    [calendarSourceId]
  );
  return rows.map(rowToEvent);
}
