import { createContext, useEffect, useState, useCallback } from 'react';
import { apiClient } from '../integrations/api/client';

interface ThemeSettings {
  id: string;
  theme: 'light' | 'dark' | 'auto';
  primary_color: string;
  accent_color: string;
  astro_blue: string;
  astro_gold: string;
  astro_white: string;
  astro_accent: string;
  created_at: string;
  updated_at: string;
}

interface ThemeContextType {
  theme: 'light' | 'dark' | 'auto';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  themeSettings: ThemeSettings | null;
  loading: boolean;
  refreshThemeSettings: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [themeSettings, setThemeSettings] = useState<ThemeSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshThemeSettings = useCallback(async () => {
    try {
      const settings = await apiClient.getThemeSettings();
      setThemeSettings(settings);
      setTheme(settings.theme);
      applyThemeColors(settings);
    } catch (error) {
      console.error('Error refreshing theme settings:', error);
    }
  }, []);

  useEffect(() => {
    const fetchThemeSettings = async () => {
      await refreshThemeSettings();
      setLoading(false);
    };
    fetchThemeSettings();
  }, [refreshThemeSettings]);

  const applyThemeColors = (settings: ThemeSettings) => {
    const root = document.documentElement;
    
    // Apply Astro Forge brand colors
    root.style.setProperty('--astro-blue', settings.astro_blue);
    root.style.setProperty('--astro-gold', settings.astro_gold);
    root.style.setProperty('--astro-white', settings.astro_white);
    root.style.setProperty('--astro-accent', settings.astro_accent);
    
    // Apply general theme colors
    root.style.setProperty('--primary-color', settings.primary_color);
    root.style.setProperty('--accent-color', settings.accent_color);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
    
    // Update theme mode in database
    if (themeSettings) {
      apiClient.updateThemeSettings({ theme: newTheme }).then((updatedSettings) => {
        setThemeSettings(updatedSettings);
        applyThemeColors(updatedSettings);
      }).catch(console.error);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme: handleThemeChange, 
      themeSettings, 
      loading,
      refreshThemeSettings
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Export the context for use in the hook
export { ThemeContext };
