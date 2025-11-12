import { useContext } from 'react';
import { ThemeContext, ThemeContextType } from '@/context/ThemeContext';

/**
 * Hook customizado para acessar o contexto de tema da aplicação.
 * Deve ser usado dentro de um componente que esteja envolvido por AppThemeProvider.
 * 
 * @returns Contexto de tema com themeMode, isDarkMode, setThemeMode, paperTheme e navigationTheme
 * @throws {Error} Se usado fora do AppThemeProvider
 */
export const useAppTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme deve ser usado dentro de um AppThemeProvider');
  }
  return context;
};

