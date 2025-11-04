import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, ColorScheme } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

interface ThemeContextValue {
  colors: ColorScheme;
  spacing: typeof spacing;
  typography: typeof typography;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const colorScheme = useColorScheme();

  const value = useMemo<ThemeContextValue>(() => ({
    colors: colorScheme === 'dark' ? darkColors : lightColors,
    spacing,
    typography
  }), [colorScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
