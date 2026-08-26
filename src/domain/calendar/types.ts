export type CalendarSourceType = 'ics';

export interface CalendarSource {
  id: string;
  name: string;
  contextId: string;
  sourceType: CalendarSourceType;
  secureStorageKey: string;
  lastSuccessfulSyncAt: string | null;
  syncError: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  calendarSourceId: string;
  externalUid: string;
  title: string;
  startAt: string;
  endAt: string;
  timeZone: string | null;
  location: string | null;
  allDay: boolean;
  recurrenceRule: string | null;
  lastSeenAt: string;
  sourceHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedCalendarEvent {
  externalUid: string;
  title: string;
  startAt: Date;
  endAt: Date;
  timeZone: string | null;
  location: string | null;
  allDay: boolean;
  recurrenceRule: string | null;
  sourceHash: string;
}
