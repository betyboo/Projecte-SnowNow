import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../theme';

// Layout arrel: un Stack que conté les pestanyes. Les pantalles de detall
// (p. ex. detall d'una sessió o d'una estació) s'afegiran aquí per sobre.
export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );
}

function RootStack() {
  const { scheme } = useTheme();
  return (
    <>
      {/* L'hora i la bateria en clar sobre fons fosc, i a l'inrevés */}
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
