import { getDatabase } from './database';
import { RuleNotificationRecord } from '../../domain/rules/types';
import { generateId, nowIso } from '../../shared/ids';

interface RuleNotificationRow {
  id: string;
  rule_id: string;
  calendar_source_id: string;
  date_key: string;
  fire_at: string;
  platform_notification_id: string | null;
  state: string;
  created_at: string;
}

function rowToRecord(row: RuleNotificationRow): RuleNotificationRecord {
  return {
    id: row.id,
    ruleId: row.rule_id,
    calendarSourceId: row.calendar_source_id,
    dateKey: row.date_key,
    fireAt: row.fire_at,
    platformNotificationId: row.platform_notification_id,
    state: row.state as 'scheduled' | 'cancelled',
    createdAt: row.created_at,
  };
}

export async function upsertRuleNotification(params: {
  ruleId: string;
  calendarSourceId: string;
  dateKey: string;
  fireAt: string;
  platformNotificationId: string;
}): Promise<void> {
  const db = await getDatabase();
  const now = nowIso();

  const existing = await db.getFirstAsync<{ id: string }>(
    'SELECT id FROM rule_notifications WHERE rule_id = ? AND date_key = ?',
    [params.ruleId, params.dateKey]
  );

  if (existing) {
    await db.runAsync(
      `UPDATE rule_notifications
       SET fire_at = ?, platform_notification_id = ?, state = 'scheduled'
       WHERE id = ?`,
      [params.fireAt, params.platformNotificationId, existing.id]
    );
  } else {
    await db.runAsync(
      `INSERT INTO rule_notifications
       (id, rule_id, calendar_source_id, date_key, fire_at, platform_notification_id, state, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'scheduled', ?)`,
      [
        generateId(),
        params.ruleId,
        params.calendarSourceId,
        params.dateKey,
        params.fireAt,
        params.platformNotificationId,
        now,
      ]
    );
  }
}

export async function cancelAndListBySource(
  calendarSourceId: string
): Promise<RuleNotificationRecord[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<RuleNotificationRow>(
    `SELECT * FROM rule_notifications WHERE calendar_source_id = ? AND state = 'scheduled'`,
    [calendarSourceId]
  );
  if (rows.length > 0) {
    await db.runAsync(
      `UPDATE rule_notifications SET state = 'cancelled'
       WHERE calendar_source_id = ? AND state = 'scheduled'`,
      [calendarSourceId]
    );
  }
  return rows.map(rowToRecord);
}
