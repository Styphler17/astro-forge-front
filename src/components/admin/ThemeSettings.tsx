import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Save, Palette, Type, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { apiClient } from '../../integrations/api/client';

interface ThemeSettings {
  id: string;
  theme: 'light' | 'dark' | 'auto';
  primary_color: string;
  accent_color: string;
  created_at: string;
  updated_at: string;
}

const ThemeSettings = () => {
  const [settings, setSettings] = useState<ThemeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchThemeSettings();
  }, []);

  const fetchThemeSettings = async () => {
    try {
      // For now, we'll use default settings since theme settings might not be implemented in the backend yet
      setSettings({
        id: '1',
        theme: 'auto',
        primary_color: '#f97316',
        accent_color: '#ea580c',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching theme settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateThemeSettings = async (newSettings: Partial<ThemeSettings>) => {
    setSaving(true);
    try {
      // For now, we'll just update the local state
      // TODO: Implement theme settings API in the backend
      setSettings(prev => prev ? { ...prev, ...newSettings, updated_at: new Date().toISOString() } : null);
      console.log('Theme settings updated:', newSettings);
    } catch (error) {
      console.error('Error updating theme settings:', error);
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
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Primary Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={settings?.primary_color || '#f97316'}
                onChange={(e) => updateThemeSettings({ primary_color: e.target.value })}
                className="w-12 h-10 rounded border"
                disabled={saving}
                aria-label="Primary color picker"
                title="Select primary color"
              />
              <input
                type="text"
                value={settings?.primary_color || '#f97316'}
                onChange={(e) => updateThemeSettings({ primary_color: e.target.value })}
                className="flex-1 px-3 py-2 border rounded"
                placeholder="#f97316"
                disabled={saving}
                aria-label="Primary color hex value"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Accent Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={settings?.accent_color || '#ea580c'}
                onChange={(e) => updateThemeSettings({ accent_color: e.target.value })}
                className="w-12 h-10 rounded border"
                disabled={saving}
                aria-label="Accent color picker"
                title="Select accent color"
              />
              <input
                type="text"
                value={settings?.accent_color || '#ea580c'}
                onChange={(e) => updateThemeSettings({ accent_color: e.target.value })}
                className="flex-1 px-3 py-2 border rounded"
                placeholder="#ea580c"
                disabled={saving}
                aria-label="Accent color hex value"
              />
            </div>
          </div>

          <Button 
            onClick={() => updateThemeSettings({})} 
            disabled={saving}
            className="w-full"
          >
            {saving ? 'Saving...' : 'Save Theme Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeSettings;
