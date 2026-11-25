import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';
import { ThemePreference, useTheme } from '../theme';

// Cada toc passa al mode següent: Automàtic → Clar → Fosc → Automàtic
const options: Record<ThemePreference, { icon: keyof typeof Ionicons.glyphMap; label: string; next: ThemePreference }> = {
  system: { icon: 'phone-portrait-outline', label: 'Automàtic', next: 'light' },
  light: { icon: 'sunny-outline', label: 'Clar', next: 'dark' },
  dark: { icon: 'moon-outline', label: 'Fosc', next: 'system' },
};

export function ThemeToggle() {
  const { colors, preference, setPreference } = useTheme();
  const current = options[preference];

  return (
    <Pressable
      onPress={() => setPreference(current.next)}
      hitSlop={10}
      style={{ paddingHorizontal: 16 }}
      accessibilityRole="button"
      accessibilityLabel={`Tema: ${current.label}. Toca per canviar-lo.`}
    >
      <Ionicons name={current.icon} size={22} color={colors.primary} />
    </Pressable>
  );
}
