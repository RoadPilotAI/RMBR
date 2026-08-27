import * as Notifications from 'expo-notifications';
import { listCalendarSources } from '../infrastructure/db/calendarSourceRepository';
import { listRulesBySource } from '../infrastructure/db/calendarRuleRepository';
import { listUpcomingEventsBySource } from '../infrastructure/db/calendarEventRepository';
import {
  cancelAndListBySource,
  upsertRuleNotification,
} from '../infrastructure/db/ruleNotificationRepository';
import { evaluateRules, groupEventsByDay } from '../domain/rules/ruleEngine';

const HORIZON_DAYS = 14;

export async function scheduleRulesForSource(calendarSourceId: string): Promise<void> {
  const rules = await listRulesBySource(calendarSourceId);
  if (rules.length === 0) return;

  // Cancel all currently scheduled rule notifications for this source.
  const stale = await cancelAndListBySource(calendarSourceId);
  await Promise.allSettled(
    stale
      .filter((r) => r.platformNotificationId !== null)
      .map((r) => Notifications.cancelScheduledNotificationAsync(r.platformNotificationId!))
  );

  const now = new Date();
  const toDate = new Date(now.getTime() + HORIZON_DAYS * 24 * 60 * 60 * 1000);
  const events = await listUpcomingEventsBySource(calendarSourceId, now, toDate);
  const eventsByDay = groupEventsByDay(events);
  const items = evaluateRules(rules, eventsByDay, now);

  for (const item of items) {
    const platformId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'RMBR',
        body: item.message,
        data: { ruleId: item.ruleId, dateKey: item.dateKey, type: 'rule' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: item.fireAt,
      },
    });

    await upsertRuleNotification({
      ruleId: item.ruleId,
      calendarSourceId: item.calendarSourceId,
      dateKey: item.dateKey,
      fireAt: item.fireAt.toISOString(),
      platformNotificationId: platformId,
    });
  }
}

export async function scheduleRulesForAllSources(): Promise<void> {
  const sources = await listCalendarSources();
  await Promise.allSettled(sources.map((s) => scheduleRulesForSource(s.id)));
}
