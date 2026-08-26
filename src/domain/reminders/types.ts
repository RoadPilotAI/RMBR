export type ReminderState = 'scheduled' | 'delivered' | 'actioned' | 'dismissed' | 'cancelled';
export type ReminderType = 'start' | 'escalation' | 'deadline' | 'transition' | 'follow_up';

export interface Reminder {
  id: string;
  taskId: string;
  scheduledAt: string;
  type: ReminderType;
  escalationLevel: number;
  platformNotificationId: string | null;
  state: ReminderState;
  createdAt: string;
  updatedAt: string;
}
