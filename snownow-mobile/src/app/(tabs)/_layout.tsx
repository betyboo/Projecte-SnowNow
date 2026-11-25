import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useTheme } from '../../theme';

type IconName = keyof typeof Ionicons.glyphMap;

// Una pestanya per a cada mòdul funcional del MVP
const tabs: { name: string; title: string; icon: IconName }[] = [
  { name: 'index', title: 'Pistes', icon: 'snow' },
  { name: 'estacions', title: 'Estacions', icon: 'search' },
  { name: 'ranking', title: 'Rànquing', icon: 'trophy' },
  { name: 'lloguer', title: 'Lloguer', icon: 'pricetag' },
];

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        // Glacera: la capçalera és del mateix color que el fons, sense línia de separació
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTitleStyle: { color: colors.text },
        headerRight: () => <ThemeToggle />,
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => <Ionicons name={tab.icon} size={size} color={typeof color === 'string' ? color : undefined} />,
          }}
        />
      ))}
    </Tabs>
  );
}
