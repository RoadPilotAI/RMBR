import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { getDatabase } from '../src/infrastructure/db/database';
import {
  registerNotificationCategories,
  requestNotificationPermissions,
} from '../src/infrastructure/notifications/notificationService';
import { registerBackgroundSync } from '../src/infrastructure/background/backgroundSync';

// Import backgroundSync at module load to register the TaskManager task definition.
import '../src/infrastructure/background/backgroundSync';

export default function RootLayout() {
  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    // Handle notification actions while app is foregrounded.
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const actionId = response.actionIdentifier;
      const data = response.notification.request.content.data as Record<string, unknown>;
      handleNotificationAction(actionId, data);
    });
    return () => subscription.remove();
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-source"
          options={{ presentation: 'modal', title: 'Add Calendar', headerShown: true }}
        />
      </Stack>
    </>
  );
}

async function initializeApp(): Promise<void> {
  try {
    await getDatabase();
    await registerNotificationCategories();
    await requestNotificationPermissions();
    await registerBackgroundSync();
  } catch (err) {
    console.error('[RMBR] App init error:', err);
  }
}

function handleNotificationAction(
  actionId: string,
  data: Record<string, unknown>
): void {
  // Phase 1: log actions. Phase 3 will route to plan-repair flows.
  if (data.calendarEventId) {
    console.log(`[RMBR] Calendar notification action: ${actionId} for event ${data.calendarEventId}`);
  } else if (data.taskId) {
    console.log(`[RMBR] Task notification action: ${actionId} for task ${data.taskId}`);
  }
}
