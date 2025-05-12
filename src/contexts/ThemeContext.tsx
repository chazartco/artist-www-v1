import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loadTheme, saveTheme } from '../utils/storage';

type ThemeContextType = {
  isDark: boolean;
  toggleDarkMode: () => void;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  updateColors: (newColors: { primary?: string; secondary?: string; accent?: string }) => void;
};

const defaultTheme = {
  isDark: true,
  colors: {
    primary: '#6366f1', // Indigo
    secondary: '#14b8a6', // Teal
    accent: '#f59e0b', // Amber
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = loadTheme();
      // Ensure we have a valid theme object with all required properties
      if (savedTheme && savedTheme.colors && 
          typeof savedTheme.colors.primary === 'string' &&
          typeof savedTheme.colors.secondary === 'string' &&
          typeof savedTheme.colors.accent === 'string') {
        return {
          isDark: savedTheme.isDark ?? defaultTheme.isDark,
          colors: {
            primary: savedTheme.colors.primary,
            secondary: savedTheme.colors.secondary,
            accent: savedTheme.colors.accent,
          },
        };
      }
      return defaultTheme;
    } catch (error) {
      console.error('Error loading theme:', error);
      return defaultTheme;
    }
  });

  useEffect(() => {
    try {
      // Apply dark mode class to body
      if (theme.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Apply custom colors
      const root = document.documentElement;
      root.style.setProperty('--color-primary', theme.colors.primary);
      root.style.setProperty('--color-secondary', theme.colors.secondary);
      root.style.setProperty('--color-accent', theme.colors.accent);

      // Save theme to storage
      saveTheme(theme).catch(error => {
        console.error('Error saving theme:', error);
      });
    } catch (error) {
      console.error('Error applying theme:', error);
      // If there's an error, reset to default theme
      setTheme(defaultTheme);
    }
  }, [theme]);

  const toggleDarkMode = () => {
    setTheme((prev) => ({ ...prev, isDark: !prev.isDark }));
  };

  const updateColors = (newColors: { primary?: string; secondary?: string; accent?: string }) => {
    setTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        ...newColors,
      },
    }));
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark: theme.isDark,
        toggleDarkMode,
        colors: theme.colors,
        updateColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};