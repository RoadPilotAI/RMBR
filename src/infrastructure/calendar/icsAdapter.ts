import { ParsedCalendarEvent } from '../../domain/calendar/types';

export interface ICalendarAdapter {
  fetchAndParse(url: string): Promise<ParsedCalendarEvent[]>;
}

// Placeholder — real implementation comes in Phase 1 (Issue 3).
// This adapter will evaluate and wrap an ICS parser library.
export class IcsAdapter implements ICalendarAdapter {
  async fetchAndParse(_url: string): Promise<ParsedCalendarEvent[]> {
    throw new Error('IcsAdapter not yet implemented — Phase 1');
  }
}
