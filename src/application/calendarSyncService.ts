import { IcsAdapter } from '../infrastructure/calendar/icsAdapter';
import { retrieveCalendarUrl } from '../infrastructure/secure-storage/calendarSecrets';
import {
  getCalendarSource,
  listCalendarSources,
  updateCalendarSourceSyncResult,
} from '../infrastructure/db/calendarSourceRepository';
import { upsertCalendarEvents } from '../infrastructure/db/calendarEventRepository';
import { scheduleRulesForSource } from './ruleSchedulingService';

const adapter = new IcsAdapter();

export async function syncCalendarSource(sourceId: string): Promise<void> {
  const source = await getCalendarSource(sourceId);
  if (!source) throw new Error(`Calendar source ${sourceId} not found`);
  const url = await retrieveCalendarUrl(source.secureStorageKey);
  if (!url) throw new Error(`No URL stored for source ${sourceId}`);

  try {
    const events = await adapter.fetchAndParse(url);
    await upsertCalendarEvents(sourceId, events);
    await updateCalendarSourceSyncResult(sourceId, { success: true });
    await scheduleRulesForSource(sourceId);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await updateCalendarSourceSyncResult(sourceId, { success: false, error: message });
    throw err;
  }
}

export async function syncAllCalendarSources(): Promise<void> {
  const sources = await listCalendarSources();
  await Promise.allSettled(sources.map((s) => syncCalendarSource(s.id)));
}
