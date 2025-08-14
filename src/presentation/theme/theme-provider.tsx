import React, { createContext, useContext, useMemo, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface AppTheme {
  mode: ThemeMode;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    muted: string;
  };
  toggleTheme: () => void;
}

const light = {
  primary: '#e63946',
  background: '#FFFFFF',
  card: '#FFFFFF',
  text: '#111111',
  border: '#E0E0E0',
  muted: '#666666',
};

const dark = {
  primary: '#e63946',
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  border: '#2A2A2A',
  muted: '#AAAAAA',
};

const ThemeContext = createContext<AppTheme | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  const value = useMemo<AppTheme>(() => ({
    mode,
    colors: mode === 'dark' ? dark : light,
    toggleTheme: () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
  }), [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = (): AppTheme => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return ctx;
};

