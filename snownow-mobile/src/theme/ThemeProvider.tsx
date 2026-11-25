import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import Storage from 'expo-sqlite/kv-store';
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { ColorScheme, Palette, palettes } from './palettes';

// "system" segueix el mode de l'iPhone; "light" i "dark" el forcen
export type ThemePreference = 'system' | ColorScheme;

interface ThemeValue {
  colors: Palette;
  scheme: ColorScheme; // el mode que es veu ara mateix
  preference: ThemePreference; // el que ha triat l'usuari amb el botó
  setPreference: (preference: ThemePreference) => void;
}

const STORAGE_KEY = 'snownow.themePreference';

// Lectura síncrona: així l'app arrenca directament amb el mode guardat, sense flaix
function readSavedPreference(): ThemePreference {
  try {
    const saved = Storage.getItemSync(STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : 'system';
  } catch {
    return 'system';
  }
}

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(readSavedPreference);

  const scheme: ColorScheme =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;
  const colors = palettes[scheme];

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    try {
      Storage.setItemSync(STORAGE_KEY, next);
    } catch {
      // Si no es pot guardar, el canvi funciona igualment fins que es tanqui l'app
    }
  }, []);

  // Tema per a Expo Router: pinta capçaleres, barra de pestanyes i fons de navegació
  const navigationTheme = useMemo(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.card,
        text: colors.text,
        border: colors.border,
      },
    };
  }, [scheme, colors]);

  const value = useMemo(
    () => ({ colors, scheme, preference, setPreference }),
    [colors, scheme, preference, setPreference]
  );

  return (
    <ThemeContext.Provider value={value}>
      <NavigationThemeProvider value={navigationTheme}>{children}</NavigationThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeValue {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme s’ha de fer servir dins de <ThemeProvider>');
  return theme;
}
