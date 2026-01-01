'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light' | 'auto';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setThemeState(savedTheme);
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light-mode');
    } else if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light-mode');
    } else {
      // Auto - follow system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
        root.classList.remove('light-mode');
      } else {
        root.classList.remove('dark');
        root.classList.add('light-mode');
      }
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  const setThemeFromContext = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleThemeFromContext = () => {
    setThemeFromContext(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeFromContext, toggleTheme: toggleThemeFromContext }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}