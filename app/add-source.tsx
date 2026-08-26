import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { createCalendarSource } from '../src/infrastructure/db/calendarSourceRepository';
import { storeCalendarUrl } from '../src/infrastructure/secure-storage/calendarSecrets';
import { syncCalendarSource } from '../src/application/calendarSyncService';
import { generateId } from '../src/shared/ids';

const CONTEXTS = [
  { id: 'ctx-work', label: 'Work' },
  { id: 'ctx-personal', label: 'Personal' },
];

export default function AddSourceScreen() {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [contextId, setContextId] = useState('ctx-work');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();

    if (!trimmedName) {
      Alert.alert('Name required', 'Give this calendar a name.');
      return;
    }
    if (!trimmedUrl.startsWith('http')) {
      Alert.alert('URL required', 'Enter the full .ics subscription URL.');
      return;
    }

    setSaving(true);
    try {
      const secureStorageKey = `cal_${generateId()}`;
      await storeCalendarUrl(secureStorageKey, trimmedUrl);
      const source = await createCalendarSource({
        name: trimmedName,
        contextId,
        secureStorageKey,
      });
      await syncCalendarSource(source.id);
      router.back();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred.';
      Alert.alert('Sync failed', `Calendar was saved but sync failed:\n\n${message}`);
      router.back();
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Calendar name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Work Schedule"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <Text style={styles.label}>Subscription URL (.ics)</Text>
        <TextInput
          style={[styles.input, styles.urlInput]}
          placeholder="https://…"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="done"
          multiline
        />
        <Text style={styles.hint}>
          The URL is stored securely on this device and never shared.
        </Text>

        <Text style={styles.label}>Context</Text>
        <View style={styles.contextRow}>
          {CONTEXTS.map((ctx) => (
            <TouchableOpacity
              key={ctx.id}
              style={[styles.contextChip, contextId === ctx.id && styles.contextChipActive]}
              onPress={() => setContextId(ctx.id)}
            >
              <Text
                style={[styles.contextChipText, contextId === ctx.id && styles.contextChipTextActive]}
              >
                {ctx.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save & Sync</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, paddingBottom: 60 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginTop: 20, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fafafa' },
  urlInput: { minHeight: 80, textAlignVertical: 'top' },
  hint: { fontSize: 12, color: '#888', marginTop: 6 },
  contextRow: { flexDirection: 'row', gap: 10 },
  contextChip: { borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  contextChipActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  contextChipText: { fontSize: 15, color: '#333' },
  contextChipTextActive: { color: '#fff', fontWeight: '600' },
  saveButton: { marginTop: 32, backgroundColor: '#007AFF', borderRadius: 10, padding: 16, alignItems: 'center' },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
