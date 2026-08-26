import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { router } from 'expo-router';
import { CalendarSource, CalendarEvent } from '../../src/domain/calendar/types';
import {
  listCalendarSources,
  deleteCalendarSource,
} from '../../src/infrastructure/db/calendarSourceRepository';
import { deleteCalendarUrl } from '../../src/infrastructure/secure-storage/calendarSecrets';
import { listUpcomingEvents } from '../../src/infrastructure/db/calendarEventRepository';
import { syncCalendarSource } from '../../src/application/calendarSyncService';
import { scheduleCalendarTransitionReminder } from '../../src/infrastructure/notifications/notificationService';

export default function CalendarScreen() {
  const [sources, setSources] = useState<CalendarSource[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, e] = await Promise.all([listCalendarSources(), listUpcomingEvents({ limit: 20 })]);
      setSources(s);
      setEvents(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function handleSync(sourceId: string) {
    setSyncing(sourceId);
    try {
      await syncCalendarSource(sourceId);
      await load();
    } catch (err) {
      Alert.alert('Sync failed', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSyncing(null);
    }
  }

  async function handleDelete(source: CalendarSource) {
    Alert.alert(
      'Remove calendar',
      `Remove "${source.name}"? All synced events will be deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await deleteCalendarUrl(source.secureStorageKey);
            await deleteCalendarSource(source.id);
            await load();
          },
        },
      ]
    );
  }

  async function handleScheduleTestReminder(event: CalendarEvent) {
    const startAt = new Date(event.startAt);
    try {
      await scheduleCalendarTransitionReminder({
        calendarEventId: event.id,
        eventTitle: event.title,
        minutesBefore: 30,
        eventStartAt: startAt,
      });
      Alert.alert('Reminder set', `You'll be notified 30 min before "${event.title}".`);
    } catch (err) {
      Alert.alert('Could not schedule', err instanceof Error ? err.message : 'Unknown error');
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sources header */}
      <View style={styles.sourcesHeader}>
        <Text style={styles.sectionTitle}>Calendars</Text>
        <TouchableOpacity onPress={() => router.push('/add-source')} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {sources.length === 0 && (
        <View style={styles.emptySourceBox}>
          <Text style={styles.emptySourceText}>No calendars yet.</Text>
          <Text style={styles.emptySourceSub}>Tap + Add to connect a .ics feed.</Text>
        </View>
      )}

      {sources.map((source) => (
        <View key={source.id} style={styles.sourceRow}>
          <View style={styles.sourceInfo}>
            <Text style={styles.sourceName}>{source.name}</Text>
            <Text style={styles.sourceContext}>{source.contextId === 'ctx-work' ? 'Work' : 'Personal'}</Text>
            {source.lastSuccessfulSyncAt && (
              <Text style={styles.syncTime}>
                Synced {formatRelative(source.lastSuccessfulSyncAt)}
              </Text>
            )}
            {source.syncError && (
              <Text style={styles.syncError}>Sync error</Text>
            )}
          </View>
          <View style={styles.sourceActions}>
            <TouchableOpacity
              style={styles.syncButton}
              onPress={() => handleSync(source.id)}
              disabled={syncing === source.id}
            >
              {syncing === source.id
                ? <ActivityIndicator size="small" color="#007AFF" />
                : <Text style={styles.syncButtonText}>Sync</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(source)}>
              <Text style={styles.deleteText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Upcoming events */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Upcoming</Text>

      <FlatList
        data={events}
        keyExtractor={(e) => e.id}
        refreshControl={<RefreshControl refreshing={false} onRefresh={load} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No upcoming events. Add a calendar and sync.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventCard}
            onLongPress={() => handleScheduleTestReminder(item)}
          >
            <View style={styles.eventLeft}>
              <Text style={styles.eventDate}>{formatEventDate(item.startAt)}</Text>
              <Text style={styles.eventTime}>
                {item.allDay ? 'All day' : formatEventTime(item.startAt, item.endAt)}
              </Text>
            </View>
            <View style={styles.eventRight}>
              <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
              {item.location && (
                <Text style={styles.eventLocation} numberOfLines={1}>{item.location}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
      {events.length > 0 && (
        <Text style={styles.hint}>Long-press an event to schedule a 30-min reminder.</Text>
      )}
    </View>
  );
}

function formatRelative(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatEventDate(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatEventTime(startIso: string, endIso: string): string {
  const fmt = (d: Date) =>
    d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${fmt(new Date(startIso))} – ${fmt(new Date(endIso))}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sourcesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  addButton: { backgroundColor: '#007AFF', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  emptySourceBox: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 16, marginBottom: 8, alignItems: 'center' },
  emptySourceText: { fontSize: 15, color: '#444', fontWeight: '600' },
  emptySourceSub: { fontSize: 13, color: '#888', marginTop: 4 },
  sourceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee' },
  sourceInfo: { flex: 1 },
  sourceName: { fontSize: 15, fontWeight: '600', color: '#111' },
  sourceContext: { fontSize: 12, color: '#888', marginTop: 2 },
  syncTime: { fontSize: 11, color: '#aaa', marginTop: 2 },
  syncError: { fontSize: 11, color: '#ff3b30', marginTop: 2 },
  sourceActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  syncButton: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#007AFF', borderRadius: 6, minWidth: 50, alignItems: 'center' },
  syncButtonText: { color: '#007AFF', fontSize: 13, fontWeight: '600' },
  deleteText: { color: '#ff3b30', fontSize: 13 },
  eventCard: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee' },
  eventLeft: { width: 72, marginRight: 12 },
  eventDate: { fontSize: 11, color: '#888', fontWeight: '500' },
  eventTime: { fontSize: 11, color: '#555', marginTop: 2 },
  eventRight: { flex: 1 },
  eventTitle: { fontSize: 15, fontWeight: '600', color: '#111' },
  eventLocation: { fontSize: 12, color: '#888', marginTop: 2 },
  emptyText: { color: '#aaa', fontSize: 14, textAlign: 'center', marginTop: 24 },
  hint: { fontSize: 11, color: '#bbb', textAlign: 'center', marginTop: 8 },
});
