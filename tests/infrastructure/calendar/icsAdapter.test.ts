import { parseIcsText } from '../../../src/infrastructure/calendar/icsAdapter';

const BASIC_ICS = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//Test//EN
BEGIN:VEVENT
UID:event-001@test.com
SUMMARY:Team standup
DTSTART;TZID=America/New_York:20260901T090000
DTEND;TZID=America/New_York:20260901T093000
LOCATION:Zoom
END:VEVENT
END:VCALENDAR`;

const ALL_DAY_ICS = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//Test//EN
BEGIN:VEVENT
UID:allday-001@test.com
SUMMARY:Company Holiday
DTSTART;VALUE=DATE:20260904
DTEND;VALUE=DATE:20260905
END:VEVENT
END:VCALENDAR`;

const RECURRING_ICS = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//Test//EN
BEGIN:VEVENT
UID:recurring-001@test.com
SUMMARY:Weekly sync
DTSTART;TZID=America/Chicago:20260902T100000
DTEND;TZID=America/Chicago:20260902T110000
RRULE:FREQ=WEEKLY;BYDAY=TU
END:VEVENT
END:VCALENDAR`;

const MULTI_EVENT_ICS = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//Test//EN
BEGIN:VEVENT
UID:event-a@test.com
SUMMARY:First event
DTSTART:20260901T140000Z
DTEND:20260901T150000Z
END:VEVENT
BEGIN:VEVENT
UID:event-b@test.com
SUMMARY:Second event
DTSTART:20260902T140000Z
DTEND:20260902T150000Z
LOCATION:Conference Room B
END:VEVENT
END:VCALENDAR`;

const MALFORMED_EVENT_ICS = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//Test//EN
BEGIN:VEVENT
SUMMARY:No UID event
DTSTART:20260901T140000Z
DTEND:20260901T150000Z
END:VEVENT
BEGIN:VEVENT
UID:valid-after-malformed@test.com
SUMMARY:Valid event after broken one
DTSTART:20260903T140000Z
DTEND:20260903T150000Z
END:VEVENT
END:VCALENDAR`;

describe('parseIcsText', () => {
  describe('basic event', () => {
    it('parses title and uid', () => {
      const events = parseIcsText(BASIC_ICS);
      expect(events).toHaveLength(1);
      expect(events[0]!.title).toBe('Team standup');
      expect(events[0]!.externalUid).toBe('event-001@test.com');
    });

    it('parses location', () => {
      const events = parseIcsText(BASIC_ICS);
      expect(events[0]!.location).toBe('Zoom');
    });

    it('parses start and end as Date objects', () => {
      const events = parseIcsText(BASIC_ICS);
      expect(events[0]!.startAt).toBeInstanceOf(Date);
      expect(events[0]!.endAt).toBeInstanceOf(Date);
      expect(events[0]!.endAt.getTime()).toBeGreaterThan(events[0]!.startAt.getTime());
    });

    it('marks timed event as not all-day', () => {
      const events = parseIcsText(BASIC_ICS);
      expect(events[0]!.allDay).toBe(false);
    });

    it('produces a stable sourceHash', () => {
      const e1 = parseIcsText(BASIC_ICS);
      const e2 = parseIcsText(BASIC_ICS);
      expect(e1[0]!.sourceHash).toBe(e2[0]!.sourceHash);
    });
  });

  describe('all-day event', () => {
    it('marks all-day correctly', () => {
      const events = parseIcsText(ALL_DAY_ICS);
      expect(events[0]!.allDay).toBe(true);
    });

    it('has null timezone for all-day event', () => {
      const events = parseIcsText(ALL_DAY_ICS);
      expect(events[0]!.timeZone).toBeNull();
    });
  });

  describe('recurring event', () => {
    it('captures the RRULE string', () => {
      const events = parseIcsText(RECURRING_ICS);
      expect(events[0]!.recurrenceRule).toContain('FREQ=WEEKLY');
    });
  });

  describe('multiple events', () => {
    it('parses all events', () => {
      const events = parseIcsText(MULTI_EVENT_ICS);
      expect(events).toHaveLength(2);
    });

    it('preserves location on second event', () => {
      const events = parseIcsText(MULTI_EVENT_ICS);
      const second = events.find((e) => e.externalUid === 'event-b@test.com');
      expect(second?.location).toBe('Conference Room B');
    });

    it('produces different hashes for different events', () => {
      const events = parseIcsText(MULTI_EVENT_ICS);
      expect(events[0]!.sourceHash).not.toBe(events[1]!.sourceHash);
    });
  });

  describe('resilience', () => {
    it('skips events without a UID and parses the rest', () => {
      const events = parseIcsText(MALFORMED_EVENT_ICS);
      expect(events.length).toBeGreaterThanOrEqual(1);
      expect(events.some((e) => e.externalUid === 'valid-after-malformed@test.com')).toBe(true);
    });

    it('throws on completely invalid ICS text', () => {
      expect(() => parseIcsText('this is not ics')).toThrow(/parse error/i);
    });
  });
});
