import { View, Text, StyleSheet } from 'react-native';

export default function AttentionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Needs Attention</Text>
      <Text style={styles.subheading}>Nobody should have to ask you about these.</Text>
      <Text style={styles.placeholder}>Nothing flagged right now.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  heading: { fontSize: 28, fontWeight: '700', marginBottom: 4 },
  subheading: { fontSize: 14, color: '#555', marginBottom: 16 },
  placeholder: { color: '#888' },
});
