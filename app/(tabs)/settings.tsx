import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { List, RadioButton, Switch, Text, useTheme } from 'react-native-paper';

import { useAppTheme } from '@/hooks/useAppTheme';
import { ThemeMode } from '@/context/ThemeContext';

export default function SettingsScreen() {
  const theme = useTheme();
  const { themeMode, isDarkMode, setThemeMode } = useAppTheme();

  // Manipula a mudança de modo de tema via RadioButton
  // O RadioButton.Group garante que o valor será um dos três modos válidos
  const handleThemeModeChange = useCallback(
    (value: string) => {
      setThemeMode(value as ThemeMode);
    },
    [setThemeMode]
  );

  // Manipula o toggle do modo escuro via Switch
  const handleDarkModeToggle = useCallback(
    (value: boolean) => {
      setThemeMode(value ? 'dark' : 'light');
    },
    [setThemeMode]
  );

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

