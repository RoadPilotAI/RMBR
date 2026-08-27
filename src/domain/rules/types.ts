export type RuleTriggerType =
  | 'first_event_of_day'
  | 'last_event_of_day'
  | 'workday_midpoint'
  | 'event_start'
  | 'event_end';

export interface CalendarRule {
  id: string;
  calendarSourceId: string;
  triggerType: RuleTriggerType;
  offsetMinutes: number;
  message: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RuleNotificationRecord {
  id: string;
  ruleId: string;
  calendarSourceId: string;
  dateKey: string;
  fireAt: string;
  platformNotificationId: string | null;
  state: 'scheduled' | 'cancelled';
  createdAt: string;
}
