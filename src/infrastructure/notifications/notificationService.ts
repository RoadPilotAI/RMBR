import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NOTIFICATION_CATEGORY_TASK = 'TASK_REMINDER';

export async function registerNotificationCategories(): Promise<void> {
  await Notifications.setNotificationCategoryAsync(NOTIFICATION_CATEGORY_TASK, [
    { identifier: 'DO_NOW', buttonTitle: 'Do Now', options: { opensAppToForeground: true } },
    { identifier: 'RESCHEDULE', buttonTitle: 'Reschedule', options: { opensAppToForeground: true } },
    { identifier: 'WAITING', buttonTitle: 'Waiting', options: { opensAppToForeground: true } },
    { identifier: 'BLOCKED', buttonTitle: 'Blocked', options: { opensAppToForeground: true } },
    {
      identifier: 'CANCEL',
      buttonTitle: 'No Longer Needed',
      options: { opensAppToForeground: false, isDestructive: true },
    },
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
  const id = await Notifications.scheduleNotificationAsync({
    identifier: params.notificationId,
    content: {
      title: params.title,
      body: params.body,
      data: { taskId: params.taskId },
      categoryIdentifier: NOTIFICATION_CATEGORY_TASK,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: params.triggerAt,
    },
  });
  return id;
}

export async function cancelNotification(platformNotificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(platformNotificationId);
}
