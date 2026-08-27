import { getDatabase } from './database';
import { CalendarRule, RuleTriggerType } from '../../domain/rules/types';
import { generateId, nowIso } from '../../shared/ids';

interface CalendarRuleRow {
  id: string;
  calendar_source_id: string;
  trigger_type: string;
  offset_minutes: number;
  message: string;
  active: number;
  created_at: string;
  updated_at: string;
}

function rowToRule(row: CalendarRuleRow): CalendarRule {
  return {
    id: row.id,
    calendarSourceId: row.calendar_source_id,
    triggerType: row.trigger_type as RuleTriggerType,
    offsetMinutes: row.offset_minutes,
    message: row.message,
    active: row.active === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createCalendarRule(params: {
  calendarSourceId: string;
  triggerType: RuleTriggerType;
  offsetMinutes: number;
  message: string;
}): Promise<CalendarRule> {
  const db = await getDatabase();
  const id = generateId();
  const now = nowIso();

  await db.runAsync(
    `INSERT INTO calendar_rules
     (id, calendar_source_id, trigger_type, offset_minutes, message, active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
    [id, params.calendarSourceId, params.triggerType, params.offsetMinutes, params.message, now, now]
  );

  return {
    id,
    calendarSourceId: params.calendarSourceId,
    triggerType: params.triggerType,
    offsetMinutes: params.offsetMinutes,
    message: params.message,
    active: true,
    createdAt: now,
    updatedAt: now,
  };
}

export async function listRulesBySource(calendarSourceId: string): Promise<CalendarRule[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<CalendarRuleRow>(
    'SELECT * FROM calendar_rules WHERE calendar_source_id = ? ORDER BY created_at ASC',
    [calendarSourceId]
  );
  return rows.map(rowToRule);
}

export async function listAllActiveRules(): Promise<CalendarRule[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<CalendarRuleRow>(
    'SELECT * FROM calendar_rules WHERE active = 1 ORDER BY created_at ASC'
  );
  return rows.map(rowToRule);
}

export async function deleteRulesBySource(calendarSourceId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM calendar_rules WHERE calendar_source_id = ?', [calendarSourceId]);
}
