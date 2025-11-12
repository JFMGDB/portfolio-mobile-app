import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppThemeProvider } from '@/context/ThemeContext';
import { useAppTheme } from '@/hooks/useAppTheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppLayout() {
  const { isDarkMode, navigationTheme } = useAppTheme();

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AppLayout />
    </AppThemeProvider>
  );
}
