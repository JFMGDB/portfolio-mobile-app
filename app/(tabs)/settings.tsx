import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { List, RadioButton, Switch, Text, useTheme } from 'react-native-paper';

export default function SettingsScreen() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = React.useState(colorScheme === 'dark');
  const [themeMode, setThemeMode] = React.useState<'light' | 'dark' | 'system'>('system');

  /**
   * Sincroniza isDarkMode com themeMode e colorScheme
   */
  useEffect(() => {
    if (themeMode === 'system') {
      setIsDarkMode(colorScheme === 'dark');
    }
  }, [themeMode, colorScheme]);

  /**
   * Manipula a mudança do modo de tema (light/dark/system)
   * Aceita string para compatibilidade com RadioButton.Group e valida internamente
   */
  const handleThemeModeChange = useCallback((value: string) => {
    const validValue = value as 'light' | 'dark' | 'system';
    if (validValue === 'light' || validValue === 'dark' || validValue === 'system') {
      setThemeMode(validValue);
      if (validValue !== 'system') {
        setIsDarkMode(validValue === 'dark');
      }
    }
  }, []);

  /**
   * Manipula o toggle do modo escuro
   */
  const handleDarkModeToggle = useCallback((value: boolean) => {
    setIsDarkMode(value);
    setThemeMode(value ? 'dark' : 'light');
  }, []);

  const containerStyle = useMemo(
    () => [styles.container, { backgroundColor: theme.colors.background }],
    [theme.colors.background]
  );

  return (
    <ScrollView style={containerStyle}>
      <List.Section>
        <List.Subheader>Aparência</List.Subheader>

        <List.Item
          title="Modo Escuro"
          description="Controlado manualmente"
          left={() => <List.Icon icon="theme-light-dark" />}
          right={() => (
            <Switch value={isDarkMode} onValueChange={handleDarkModeToggle} disabled={themeMode === 'system'} />
          )}
        />

        <View style={styles.radioContainer}>
          <Text variant="labelLarge" style={styles.radioTitle}>
            Preferência de Tema
          </Text>
          <RadioButton.Group onValueChange={handleThemeModeChange} value={themeMode}>
            <RadioButton.Item label="Claro (Light)" value="light" />
            <RadioButton.Item label="Escuro (Dark)" value="dark" />
            <RadioButton.Item label="Padrão do Sistema" value="system" />
          </RadioButton.Group>
        </View>
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  radioContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  radioTitle: {
    marginBottom: 8,
  },
});

