import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Layout arrel: un Stack que conté les pestanyes. Les pantalles de detall
// (p. ex. detall d'una sessió o d'una estació) s'afegiran aquí per sobre.
export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
