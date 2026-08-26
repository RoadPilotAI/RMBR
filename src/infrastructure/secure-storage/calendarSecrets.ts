import * as SecureStore from 'expo-secure-store';

const KEY_PREFIX = 'rmbr_cal_';

export async function storeCalendarUrl(sourceId: string, url: string): Promise<void> {
  await SecureStore.setItemAsync(KEY_PREFIX + sourceId, url);
}

export async function retrieveCalendarUrl(sourceId: string): Promise<string | null> {
  return SecureStore.getItemAsync(KEY_PREFIX + sourceId);
}

export async function deleteCalendarUrl(sourceId: string): Promise<void> {
  await SecureStore.deleteItemAsync(KEY_PREFIX + sourceId);
}
