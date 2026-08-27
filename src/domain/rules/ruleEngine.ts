import { CalendarRule } from './types';
import { CalendarEvent } from '../calendar/types';

export interface ScheduledRuleItem {
  ruleId: string;
  calendarSourceId: string;
  calendarEventId: string | null;
  dateKey: string;
  fireAt: Date;
  message: string;
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function localDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function groupEventsByDay(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const key = localDateKey(new Date(event.startAt));
    const bucket = map.get(key) ?? [];
    bucket.push(event);
    map.set(key, bucket);
  }
  return map;
}

export function evaluateRules(
  rules: CalendarRule[],
  eventsByDay: Map<string, CalendarEvent[]>,
  now: Date
): ScheduledRuleItem[] {
  const activeRules = rules.filter((r) => r.active);
  if (activeRules.length === 0 || eventsByDay.size === 0) return [];

  const results: ScheduledRuleItem[] = [];

  for (const [dateKey, dayEvents] of eventsByDay) {
    if (dayEvents.length === 0) continue;

    const sorted = [...dayEvents].sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    );

    const firstEvent = sorted[0]!;
    const lastEvent = sorted[sorted.length - 1]!;
    const firstStart = new Date(firstEvent.startAt);
    const lastEnd = new Date(lastEvent.endAt);
    const midpoint = new Date((firstStart.getTime() + lastEnd.getTime()) / 2);

    for (const rule of activeRules) {
      switch (rule.triggerType) {
        case 'first_event_of_day': {
          const fireAt = addMinutes(firstStart, rule.offsetMinutes);
          if (fireAt > now) {
            results.push({
              ruleId: rule.id,
              calendarSourceId: rule.calendarSourceId,
              calendarEventId: firstEvent.id,
              dateKey,
              fireAt,
              message: rule.message,
            });
          }
          break;
        }
        case 'last_event_of_day': {
          const fireAt = addMinutes(lastEnd, rule.offsetMinutes);
          if (fireAt > now) {
            results.push({
              ruleId: rule.id,
              calendarSourceId: rule.calendarSourceId,
              calendarEventId: lastEvent.id,
              dateKey,
              fireAt,
              message: rule.message,
            });
          }
          break;
        }
        case 'workday_midpoint': {
          const fireAt = addMinutes(midpoint, rule.offsetMinutes);
          if (fireAt > now) {
            results.push({
              ruleId: rule.id,
              calendarSourceId: rule.calendarSourceId,
              calendarEventId: null,
              dateKey,
              fireAt,
              message: rule.message,
            });
          }
          break;
        }
        case 'event_start': {
          for (const event of sorted) {
            const fireAt = addMinutes(new Date(event.startAt), rule.offsetMinutes);
            if (fireAt > now) {
              results.push({
                ruleId: rule.id,
                calendarSourceId: rule.calendarSourceId,
                calendarEventId: event.id,
                dateKey,
                fireAt,
                message: rule.message,
              });
            }
          }
          break;
        }
        case 'event_end': {
          for (const event of sorted) {
            const fireAt = addMinutes(new Date(event.endAt), rule.offsetMinutes);
            if (fireAt > now) {
              results.push({
                ruleId: rule.id,
                calendarSourceId: rule.calendarSourceId,
                calendarEventId: event.id,
                dateKey,
                fireAt,
                message: rule.message,
              });
            }
          }
          break;
        }
      }
    }
  }

  return results;
}
