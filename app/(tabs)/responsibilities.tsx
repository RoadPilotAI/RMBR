import { View, Text, StyleSheet } from 'react-native';

export default function ResponsibilitiesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Responsibilities</Text>
      <Text style={styles.placeholder}>Ongoing owned responsibilities — coming in Phase 2.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  heading: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
  placeholder: { color: '#888' },
});
