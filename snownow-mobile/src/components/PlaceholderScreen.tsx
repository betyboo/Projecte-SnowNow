import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

// Pantalla provisional per als mòduls que encara no tenen backend
export function PlaceholderScreen({ title, description }: { title: string; description: string }) {
  return (
    <View style={styles.container}>
      <Ionicons name="construct-outline" size={48} color={colors.textMuted} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  title: { fontSize: 20, fontWeight: '600', color: colors.text, marginTop: 12 },
  description: { fontSize: 15, color: colors.textMuted, textAlign: 'center', marginTop: 8 },
});
