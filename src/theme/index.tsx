import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemePalette = {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primarySoft: string;
  danger: string;
  success: string;
};

const lightPalette: ThemePalette = {
  background: '#f3f6fb',
  surface: '#ffffff',
  surfaceAlt: '#eaf1fb',
  text: '#10223b',
  textMuted: '#5b6b82',
  border: '#d2deef',
  primary: '#0f6cbd',
  primarySoft: '#d8e9fb',
  danger: '#c0392b',
  success: '#1d8f5b',
};

const darkPalette: ThemePalette = {
  background: '#071423',
  surface: '#0f2238',
  surfaceAlt: '#17304e',
  text: '#e5eefb',
  textMuted: '#adc0db',
  border: '#274261',
  primary: '#5cb1ff',
  primarySoft: '#1b3a5c',
  danger: '#ff7b72',
  success: '#49d18d',
};

type ThemeContextValue = {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemePalette;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleMode: () => Promise<void>;
};

const STORAGE_KEY = '@osfacil:theme';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const osTheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    (async () => {
      try {
        const persisted = await AsyncStorage.getItem(STORAGE_KEY);
        if (persisted === 'light' || persisted === 'dark' || persisted === 'system') {
          setModeState(persisted);
        }
      } catch {
        
      }
    })();
  }, []);

  const isDark = mode === 'system' ? osTheme === 'dark' : mode === 'dark';

  const setMode = async (nextMode: ThemeMode) => {
    setModeState(nextMode);
    await AsyncStorage.setItem(STORAGE_KEY, nextMode);
  };

  const toggleMode = async () => {
    const nextMode: ThemeMode = isDark ? 'light' : 'dark';
    await setMode(nextMode);
  };

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      isDark,
      colors: isDark ? darkPalette : lightPalette,
      setMode,
      toggleMode,
    }),
    [mode, isDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme deve ser usado dentro de ThemeProvider');
  }
  return ctx;
}
