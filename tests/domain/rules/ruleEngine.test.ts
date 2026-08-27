import { evaluateRules, groupEventsByDay, localDateKey } from '../../../src/domain/rules/ruleEngine';
import { CalendarRule } from '../../../src/domain/rules/types';
import { CalendarEvent } from '../../../src/domain/calendar/types';

function makeEvent(overrides: Partial<CalendarEvent> & { startAt: string; endAt: string }): CalendarEvent {
  return {
    id: 'evt-1',
    calendarSourceId: 'src-1',
    externalUid: 'uid-1',
    title: 'Shift',
    description: null,
    timeZone: null,
    location: null,
    allDay: false,
    recurrenceRule: null,
    lastSeenAt: '2026-08-26T00:00:00.000Z',
    sourceHash: 'abc',
    createdAt: '2026-08-26T00:00:00.000Z',
    updatedAt: '2026-08-26T00:00:00.000Z',
    ...overrides,
  };
}

function makeRule(overrides: Partial<CalendarRule>): CalendarRule {
  return {
    id: 'rule-1',
    calendarSourceId: 'src-1',
    triggerType: 'first_event_of_day',
    offsetMinutes: 0,
    message: 'Test message',
    active: true,
    createdAt: '2026-08-26T00:00:00.000Z',
    updatedAt: '2026-08-26T00:00:00.000Z',
    ...overrides,
  };
}

const DAY = '2026-09-01';
const SHIFT_START = `${DAY}T09:00:00.000Z`;
const SHIFT_END = `${DAY}T17:00:00.000Z`;
const NOW = new Date('2026-08-26T00:00:00.000Z');

describe('localDateKey', () => {
  it('formats a date as YYYY-MM-DD in local time', () => {
    const d = new Date(2026, 7, 26); // Aug 26 local
    expect(localDateKey(d)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('groupEventsByDay', () => {
  it('groups events by local date of startAt', () => {
    const e1 = makeEvent({ id: 'e1', startAt: SHIFT_START, endAt: SHIFT_END });
    const e2 = makeEvent({ id: 'e2', startAt: '2026-09-02T09:00:00.000Z', endAt: '2026-09-02T17:00:00.000Z' });
    const map = groupEventsByDay([e1, e2]);
    expect(map.size).toBe(2);
  });

  it('returns empty map for no events', () => {
    expect(groupEventsByDay([])).toEqual(new Map());
  });
});

describe('evaluateRules', () => {
  const event = makeEvent({ startAt: SHIFT_START, endAt: SHIFT_END });
  const eventsByDay = groupEventsByDay([event]);

  it('returns empty when no active rules', () => {
    const rule = makeRule({ active: false });
    expect(evaluateRules([rule], eventsByDay, NOW)).toHaveLength(0);
  });

  it('returns empty when no events', () => {
    const rule = makeRule({});
    expect(evaluateRules([rule], new Map(), NOW)).toHaveLength(0);
  });

  it('first_event_of_day fires at shift start', () => {
    const rule = makeRule({ triggerType: 'first_event_of_day', offsetMinutes: 0 });
    const results = evaluateRules([rule], eventsByDay, NOW);
    expect(results).toHaveLength(1);
    expect(results[0]!.fireAt).toEqual(new Date(SHIFT_START));
  });

  it('first_event_of_day applies negative offset', () => {
    const rule = makeRule({ triggerType: 'first_event_of_day', offsetMinutes: -5 });
    const results = evaluateRules([rule], eventsByDay, NOW);
    const expected = new Date(new Date(SHIFT_START).getTime() - 5 * 60 * 1000);
    expect(results[0]!.fireAt).toEqual(expected);
  });

  it('last_event_of_day fires at shift end', () => {
    const rule = makeRule({ triggerType: 'last_event_of_day', offsetMinutes: 0 });
    const results = evaluateRules([rule], eventsByDay, NOW);
    expect(results[0]!.fireAt).toEqual(new Date(SHIFT_END));
  });

  it('workday_midpoint fires at midpoint between first start and last end', () => {
    const rule = makeRule({ triggerType: 'workday_midpoint', offsetMinutes: 0 });
    const results = evaluateRules([rule], eventsByDay, NOW);
    const start = new Date(SHIFT_START).getTime();
    const end = new Date(SHIFT_END).getTime();
    expect(results[0]!.fireAt).toEqual(new Date((start + end) / 2));
  });

  it('workday_midpoint with offset schedules lunch return', () => {
    const rule = makeRule({ triggerType: 'workday_midpoint', offsetMinutes: 30 });
    const results = evaluateRules([rule], eventsByDay, NOW);
    const start = new Date(SHIFT_START).getTime();
    const end = new Date(SHIFT_END).getTime();
    const midpoint = (start + end) / 2;
    expect(results[0]!.fireAt).toEqual(new Date(midpoint + 30 * 60 * 1000));
  });

  it('event_start fires once per event', () => {
    const e2 = makeEvent({ id: 'e2', startAt: '2026-09-01T13:00:00.000Z', endAt: '2026-09-01T14:00:00.000Z' });
    const map = groupEventsByDay([event, e2]);
    const rule = makeRule({ triggerType: 'event_start', offsetMinutes: 0 });
    const results = evaluateRules([rule], map, NOW);
    expect(results).toHaveLength(2);
  });

  it('event_end fires once per event', () => {
    const e2 = makeEvent({ id: 'e2', startAt: '2026-09-01T13:00:00.000Z', endAt: '2026-09-01T14:00:00.000Z' });
    const map = groupEventsByDay([event, e2]);
    const rule = makeRule({ triggerType: 'event_end', offsetMinutes: 0 });
    const results = evaluateRules([rule], map, NOW);
    expect(results).toHaveLength(2);
  });

  it('excludes fire times in the past', () => {
    const pastEvent = makeEvent({
      startAt: '2026-08-25T09:00:00.000Z',
      endAt: '2026-08-25T17:00:00.000Z',
    });
    const map = groupEventsByDay([pastEvent]);
    const rule = makeRule({ triggerType: 'first_event_of_day' });
    // NOW is 2026-08-26, pastEvent is 2026-08-25 — fire time is in the past
    expect(evaluateRules([rule], map, NOW)).toHaveLength(0);
  });

  it('sets calendarEventId to null for workday_midpoint', () => {
    const rule = makeRule({ triggerType: 'workday_midpoint' });
    const results = evaluateRules([rule], eventsByDay, NOW);
    expect(results[0]!.calendarEventId).toBeNull();
  });

  it('sets calendarEventId for first_event_of_day', () => {
    const rule = makeRule({ triggerType: 'first_event_of_day' });
    const results = evaluateRules([rule], eventsByDay, NOW);
    expect(results[0]!.calendarEventId).toBe(event.id);
  });
});
