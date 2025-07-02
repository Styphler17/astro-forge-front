import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Save, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import RefreshButton from '../ui/refresh-button';
import { useTheme } from '../../hooks/useTheme';
import { apiClient } from '../../integrations/api/client';

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

const ThemeSettings = () => {
  const { refreshThemeSettings } = useTheme();
  const [settings, setSettings] = useState<ThemeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchThemeSettings();
  }, []);

  const fetchThemeSettings = async () => {
    try {
      setError(null);
      const themeSettings = await apiClient.getThemeSettings();
      // Backend now properly handles JSON values, so we can use them directly
      setSettings(themeSettings);
    } catch (error) {
      console.error('Error fetching theme settings:', error);
      setError('Failed to load theme settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      
      // Add a small delay to make the spinning animation visible
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await refreshThemeSettings();
    } catch (error) {
      console.error('Error refreshing theme settings:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const validateColorValue = (value: string): string => {
    // Ensure it's a valid hex color
    const cleanValue = value?.trim() || '#0066cc';
    if (/^#[0-9A-Fa-f]{6}$/.test(cleanValue)) {
      return cleanValue;
    }
    // If invalid, return a default
    return '#0066cc';
  };

  const updateThemeSettings = async (newSettings: Partial<ThemeSettings>) => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Clean up color values before sending to API
      const cleanedSettings = { ...newSettings };
      
      if (cleanedSettings.primary_color) {
        cleanedSettings.primary_color = validateColorValue(cleanedSettings.primary_color);
      }
      if (cleanedSettings.accent_color) {
        cleanedSettings.accent_color = validateColorValue(cleanedSettings.accent_color);
      }
      if (cleanedSettings.astro_blue) {
        cleanedSettings.astro_blue = validateColorValue(cleanedSettings.astro_blue);
      }
      if (cleanedSettings.astro_gold) {
        cleanedSettings.astro_gold = validateColorValue(cleanedSettings.astro_gold);
      }
      if (cleanedSettings.astro_white) {
        cleanedSettings.astro_white = validateColorValue(cleanedSettings.astro_white);
      }
      if (cleanedSettings.astro_accent) {
        cleanedSettings.astro_accent = validateColorValue(cleanedSettings.astro_accent);
      }

      const updatedSettings = await apiClient.updateThemeSettings(cleanedSettings);
      setSettings(updatedSettings);
      
      // Refresh the global theme context to apply changes immediately
      await refreshThemeSettings();
      
      setSuccess('Theme settings updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating theme settings:', error);
      setError('Failed to update theme settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-5 w-5" />
          <span>{success}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Theme Settings</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Manage your site theme and appearance
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <RefreshButton 
                onClick={handleRefresh}
                refreshing={refreshing}
                title="Refresh theme settings"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Mode */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Theme Mode</label>
            <div className="flex space-x-2">
              {(['light', 'dark', 'auto'] as const).map((theme) => (
                <Button
                  key={theme}
                  variant={settings?.theme === theme ? 'default' : 'outline'}
                  onClick={() => updateThemeSettings({ theme })}
                  disabled={saving}
                >
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Astro Forge Brand Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Astro Forge Brand Colors</h3>
            
            {/* Astro Blue */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Astro Blue</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings?.astro_blue || '#0066cc'}
                  onChange={(e) => updateThemeSettings({ astro_blue: e.target.value })}
                  className="w-12 h-10 rounded border"
                  disabled={saving}
                  aria-label="Astro blue color picker"
                  title="Select Astro blue color"
                />
                <input
                  type="text"
                  value={settings?.astro_blue || '#0066cc'}
                  onChange={(e) => updateThemeSettings({ astro_blue: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  placeholder="#0066cc"
                  disabled={saving}
                  aria-label="Astro blue hex value"
                />
              </div>
            </div>

            {/* Astro Gold */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Astro Gold</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings?.astro_gold || '#f0a500'}
                  onChange={(e) => updateThemeSettings({ astro_gold: e.target.value })}
                  className="w-12 h-10 rounded border"
                  disabled={saving}
                  aria-label="Astro gold color picker"
                  title="Select Astro gold color"
                />
                <input
                  type="text"
                  value={settings?.astro_gold || '#f0a500'}
                  onChange={(e) => updateThemeSettings({ astro_gold: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  placeholder="#f0a500"
                  disabled={saving}
                  aria-label="Astro gold hex value"
                />
              </div>
            </div>

            {/* Astro White */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Astro White</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings?.astro_white || '#ffffff'}
                  onChange={(e) => updateThemeSettings({ astro_white: e.target.value })}
                  className="w-12 h-10 rounded border"
                  disabled={saving}
                  aria-label="Astro white color picker"
                  title="Select Astro white color"
                />
                <input
                  type="text"
                  value={settings?.astro_white || '#ffffff'}
                  onChange={(e) => updateThemeSettings({ astro_white: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  placeholder="#ffffff"
                  disabled={saving}
                  aria-label="Astro white hex value"
                />
              </div>
            </div>

            {/* Astro Accent */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Astro Accent</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings?.astro_accent || '#007bff'}
                  onChange={(e) => updateThemeSettings({ astro_accent: e.target.value })}
                  className="w-12 h-10 rounded border"
                  disabled={saving}
                  aria-label="Astro accent color picker"
                  title="Select Astro accent color"
                />
                <input
                  type="text"
                  value={settings?.astro_accent || '#007bff'}
                  onChange={(e) => updateThemeSettings({ astro_accent: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  placeholder="#007bff"
                  disabled={saving}
                  aria-label="Astro accent hex value"
                />
              </div>
            </div>
          </div>

          {/* General Theme Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">General Theme Colors</h3>
            
            {/* Primary Color */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings?.primary_color || '#3B82F6'}
                  onChange={(e) => updateThemeSettings({ primary_color: e.target.value })}
                  className="w-12 h-10 rounded border"
                  disabled={saving}
                  aria-label="Primary color picker"
                  title="Select primary color"
                />
                <input
                  type="text"
                  value={settings?.primary_color || '#3B82F6'}
                  onChange={(e) => updateThemeSettings({ primary_color: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  placeholder="#3B82F6"
                  disabled={saving}
                  aria-label="Primary color hex value"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Accent Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings?.accent_color || '#F59E0B'}
                  onChange={(e) => updateThemeSettings({ accent_color: e.target.value })}
                  className="w-12 h-10 rounded border"
                  disabled={saving}
                  aria-label="Accent color picker"
                  title="Select accent color"
                />
                <input
                  type="text"
                  value={settings?.accent_color || '#F59E0B'}
                  onChange={(e) => updateThemeSettings({ accent_color: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  placeholder="#F59E0B"
                  disabled={saving}
                  aria-label="Accent color hex value"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={() => {
              // Save current settings - no need to pass empty object
              // The settings are already saved when individual fields are updated
              setSaving(true);
              setTimeout(() => setSaving(false), 1000); // Show saving state briefly
            }} 
            disabled={saving}
            className="w-full flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Settings Saved Automatically'}</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeSettings;
