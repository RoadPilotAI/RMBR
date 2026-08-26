// eslint-disable-next-line @typescript-eslint/no-require-imports
const ICAL = require('ical.js');

import { ParsedCalendarEvent } from '../../domain/calendar/types';

export interface ICalendarAdapter {
  fetchAndParse(url: string): Promise<ParsedCalendarEvent[]>;
}

export class IcsAdapter implements ICalendarAdapter {
  async fetchAndParse(url: string): Promise<ParsedCalendarEvent[]> {
    const icsText = await fetchIcsText(url);
    return parseIcsText(icsText);
  }
}

async function fetchIcsText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { Accept: 'text/calendar, application/ics' },
  });
  if (!response.ok) {
    throw new Error(`ICS fetch failed: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

export function parseIcsText(icsText: string): ParsedCalendarEvent[] {
  let jcal: unknown;
  try {
    jcal = ICAL.parse(icsText);
  } catch (err) {
    throw new Error(`ICS parse error: ${err instanceof Error ? err.message : String(err)}`);
  }

  const comp = new ICAL.Component(jcal);
  const vevents: unknown[] = comp.getAllSubcomponents('vevent');
  const results: ParsedCalendarEvent[] = [];

  for (const vevent of vevents) {
    try {
      const event = new ICAL.Event(vevent);
      const parsed = parseVEvent(event, vevent as ICALComponent);
      if (parsed) results.push(parsed);
    } catch {
      // Skip malformed individual events; don't abort the whole feed.
    }
  }

  return results;
}

function parseVEvent(
  event: {
    uid: string;
    summary: string;
    startDate: ICALTime;
    endDate: ICALTime;
    location: string | null;
    isRecurring(): boolean;
  },
  vevent: ICALComponent
): ParsedCalendarEvent | null {
  const uid = event.uid;
  if (!uid) return null;

  const title = event.summary ?? '(No title)';
  const startDate: ICALTime = event.startDate;
  const endDate: ICALTime = event.endDate;
  const allDay: boolean = startDate.isDate;

  const startJs = startDate.toJSDate();
  const endJs = endDate.toJSDate();

  const timeZone: string | null = allDay
    ? null
    : (startDate.timezone ?? null);

  const location: string | null = event.location ?? null;

  const descriptionRaw = vevent.getFirstPropertyValue('description');
  const description: string | null = descriptionRaw ? String(descriptionRaw).trim() : null;

  const rruleProp = vevent.getFirstPropertyValue('rrule');
  const recurrenceRule: string | null = rruleProp ? String(rruleProp) : null;

  const sourceHash = hashEvent(uid, title, startJs.toISOString(), endJs.toISOString(), description ?? '');

  return { externalUid: uid, title, description, startAt: startJs, endAt: endJs, timeZone, location, allDay, recurrenceRule, sourceHash };
}

interface ICALTime {
  toJSDate(): Date;
  isDate: boolean;
  timezone: string | null;
}

interface ICALComponent {
  getFirstPropertyValue(name: string): string | null;
}

function hashEvent(...parts: string[]): string {
  const str = parts.join('|');
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
