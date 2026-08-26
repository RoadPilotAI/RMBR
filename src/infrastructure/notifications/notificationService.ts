import * as Notifications from 'expo-notifications';

// Must be called at module load time (outside components).
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const CATEGORY_TASK_REMINDER = 'TASK_REMINDER';
export const CATEGORY_CALENDAR_TRANSITION = 'CALENDAR_TRANSITION';

export async function registerNotificationCategories(): Promise<void> {
  await Notifications.setNotificationCategoryAsync(CATEGORY_TASK_REMINDER, [
    { identifier: 'DO_NOW', buttonTitle: 'Do Now', options: { opensAppToForeground: true } },
    { identifier: 'RESCHEDULE', buttonTitle: 'Reschedule', options: { opensAppToForeground: true } },
    { identifier: 'WAITING', buttonTitle: 'Waiting on Someone', options: { opensAppToForeground: true } },
    { identifier: 'BLOCKED', buttonTitle: 'Blocked', options: { opensAppToForeground: true } },
    {
      identifier: 'CANCEL',
      buttonTitle: 'No Longer Needed',
      options: { opensAppToForeground: false, isDestructive: true },
    },
  ]);

  await Notifications.setNotificationCategoryAsync(CATEGORY_CALENDAR_TRANSITION, [
    { identifier: 'ACKNOWLEDGED', buttonTitle: 'Got It', options: { opensAppToForeground: false } },
    { identifier: 'SNOOZE_5', buttonTitle: 'Remind in 5 min', options: { opensAppToForeground: false } },
  ]);
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleTaskReminder(params: {
  notificationId?: string;
  taskId: string;
  title: string;
  body: string;
  triggerAt: Date;
}): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    identifier: params.notificationId,
    content: {
      title: params.title,
      body: params.body,
      data: { taskId: params.taskId },
      categoryIdentifier: CATEGORY_TASK_REMINDER,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: params.triggerAt,
    },
  });
}

export async function scheduleCalendarTransitionReminder(params: {
  calendarEventId: string;
  eventTitle: string;
  minutesBefore: number;
  eventStartAt: Date;
}): Promise<string> {
  const triggerAt = new Date(
    params.eventStartAt.getTime() - params.minutesBefore * 60 * 1000
  );

  if (triggerAt <= new Date()) {
    throw new Error('Trigger time is in the past — cannot schedule notification');
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: `Starting in ${params.minutesBefore} min`,
      body: params.eventTitle,
      data: { calendarEventId: params.calendarEventId, type: 'calendar_transition' },
      categoryIdentifier: CATEGORY_CALENDAR_TRANSITION,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerAt,
    },
  });
}

export async function cancelNotification(platformNotificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(platformNotificationId);
}
