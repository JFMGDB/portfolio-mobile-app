import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
    Theme as NavigationTheme,
} from '@react-navigation/native';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
    MD3DarkTheme,
    MD3LightTheme,
    Provider as PaperProvider,
    adaptNavigationTheme,
} from 'react-native-paper';

import { useColorScheme } from '@/hooks/use-color-scheme';

const THEME_STORAGE_KEY = '@theme_preference_v1';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  themeMode: ThemeMode;
  isDarkMode: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  paperTheme: typeof MD3LightTheme;
  navigationTheme: NavigationTheme;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Temas do React Native Paper (podem ser customizados no futuro)
const LightTheme = MD3LightTheme;
const DarkTheme = MD3DarkTheme;

const { LightTheme: NavLightTheme, DarkTheme: NavDarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

interface AppThemeProviderProps {
  children: React.ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  // Obtém o esquema de cores do sistema operacional
  const systemScheme = useColorScheme() ?? 'light';
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  // Carrega a preferência de tema salva no AsyncStorage na inicialização
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = (await AsyncStorage.getItem(THEME_STORAGE_KEY)) as ThemeMode | null;
        if (savedTheme) {
          setThemeModeState(savedTheme);
        }
      } catch (error) {
        console.warn('Falha ao carregar tema do AsyncStorage:', error);
      }
    };
    loadTheme();
  }, []);

  // Determina o tema ativo: se for 'system', usa o esquema do sistema, caso contrário usa o modo selecionado
  const activeTheme = useMemo(() => {
    if (themeMode === 'system') {
      return systemScheme;
    }
    return themeMode;
  }, [themeMode, systemScheme]);

  const isDarkMode = activeTheme === 'dark';

  // Memoiza os temas do Paper e Navigation para evitar recriações desnecessárias
  const paperTheme = useMemo(() => (isDarkMode ? DarkTheme : LightTheme), [isDarkMode]);
  const navigationTheme = useMemo(
    () => (isDarkMode ? NavDarkTheme : NavLightTheme),
    [isDarkMode]
  );

  // Função para alterar e persistir o tema no AsyncStorage
  const handleSetThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Falha ao salvar tema no AsyncStorage:', error);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      themeMode,
      isDarkMode,
      setThemeMode: handleSetThemeMode,
      paperTheme,
      navigationTheme,
    }),
    [themeMode, isDarkMode, handleSetThemeMode, paperTheme, navigationTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <PaperProvider theme={paperTheme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};

