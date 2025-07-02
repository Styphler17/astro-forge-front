import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { apiClient } from '../../integrations/api/client';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import RefreshButton from '../ui/refresh-button';

interface HeroSettings {
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  hero_cta_link: string;
  hero_background_images: string[];
  hero_badge_text: string;
  hero_stats_projects: string;
  hero_stats_countries: string;
  hero_stats_years: string;
}

const HeroSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<HeroSettings>({
    hero_title: 'ASTRO FORGE HOLDINGS',
    hero_subtitle: 'Building Tomorrow\'s Infrastructure Through Innovation, Sustainability, and Strategic Investment',
    hero_cta_text: 'Discover More',
    hero_cta_link: '/about',
    hero_background_images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    hero_badge_text: 'Innovation • Sustainability • Growth',
    hero_stats_projects: '500+',
    hero_stats_countries: '50+',
    hero_stats_years: '25+'
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  const fetchHeroSettings = useCallback(async () => {
    try {
      setRefreshing(true);
      const allSettings = await apiClient.getSiteSettings();
      
      // Add a small delay to make the spinning animation visible
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const heroSettings: Partial<HeroSettings> = {};
      
      allSettings.forEach(setting => {
        if (setting.setting_key.startsWith('hero_')) {
          const key = setting.setting_key as keyof HeroSettings;
          if (key === 'hero_background_images') {
            try {
              heroSettings[key] = JSON.parse(setting.setting_value);
            } catch (e) {
              console.warn(`Failed to parse ${key}:`, e);
            }
          } else {
            heroSettings[key] = setting.setting_value;
          }
        }
      });
      
      setSettings(prev => ({ ...prev, ...heroSettings }));
    } catch (error) {
      console.error('Error fetching hero settings:', error);
      toast({
        title: "Error",
        description: "Failed to load hero settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchHeroSettings();
  }, [fetchHeroSettings]);

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      const settingsToUpdate = [
        { key: 'hero_title', value: settings.hero_title, type: 'string' },
        { key: 'hero_subtitle', value: settings.hero_subtitle, type: 'string' },
        { key: 'hero_cta_text', value: settings.hero_cta_text, type: 'string' },
        { key: 'hero_cta_link', value: settings.hero_cta_link, type: 'string' },
        { key: 'hero_background_images', value: JSON.stringify(settings.hero_background_images), type: 'json' },
        { key: 'hero_badge_text', value: settings.hero_badge_text, type: 'string' },
        { key: 'hero_stats_projects', value: settings.hero_stats_projects, type: 'string' },
        { key: 'hero_stats_countries', value: settings.hero_stats_countries, type: 'string' },
        { key: 'hero_stats_years', value: settings.hero_stats_years, type: 'string' }
      ];

      // Update each setting
      for (const setting of settingsToUpdate) {
        try {
          await apiClient.updateSiteSetting(setting.key, setting.value, setting.type);
        } catch (error) {
          // If setting doesn't exist, create it
          await apiClient.createSiteSetting(setting.key, setting.value, setting.type);
        }
      }

      toast({
        title: "Success",
        description: "Hero settings saved successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error('Error saving hero settings:', error);
      toast({
        title: "Error",
        description: "Failed to save hero settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addBackgroundImage = () => {
    if (newImageUrl.trim()) {
      setSettings(prev => ({
        ...prev,
        hero_background_images: [...prev.hero_background_images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const removeBackgroundImage = (index: number) => {
    setSettings(prev => ({
      ...prev,
      hero_background_images: prev.hero_background_images.filter((_, i) => i !== index)
    }));
  };

  const updateBackgroundImage = (index: number, newUrl: string) => {
    setSettings(prev => ({
      ...prev,
      hero_background_images: prev.hero_background_images.map((url, i) => 
        i === index ? newUrl : url
      )
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Hero Settings</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your homepage hero section
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <RefreshButton 
            onClick={fetchHeroSettings}
            refreshing={refreshing}
            title="Refresh hero settings"
          />
          <Button 
            onClick={saveSettings}
            disabled={saving}
            className="bg-astro-blue text-white hover:bg-astro-blue/80 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Main Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero_title">Hero Title</Label>
                <Input
                  id="hero_title"
                  value={settings.hero_title}
                  onChange={(e) => setSettings(prev => ({ ...prev, hero_title: e.target.value }))}
                  placeholder="ASTRO FORGE HOLDINGS"
                />
              </div>

              <div>
                <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                <Textarea
                  id="hero_subtitle"
                  value={settings.hero_subtitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                  placeholder="Building Tomorrow's Infrastructure Through Innovation, Sustainability, and Strategic Investment"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="hero_badge_text">Badge Text</Label>
                <Input
                  id="hero_badge_text"
                  value={settings.hero_badge_text}
                  onChange={(e) => setSettings(prev => ({ ...prev, hero_badge_text: e.target.value }))}
                  placeholder="Innovation • Sustainability • Growth"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Call to Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero_cta_text">Button Text</Label>
                <Input
                  id="hero_cta_text"
                  value={settings.hero_cta_text}
                  onChange={(e) => setSettings(prev => ({ ...prev, hero_cta_text: e.target.value }))}
                  placeholder="Discover More"
                />
              </div>

              <div>
                <Label htmlFor="hero_cta_link">Button Link</Label>
                <Input
                  id="hero_cta_link"
                  value={settings.hero_cta_link}
                  onChange={(e) => setSettings(prev => ({ ...prev, hero_cta_link: e.target.value }))}
                  placeholder="/about"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="hero_stats_projects">Projects</Label>
                  <Input
                    id="hero_stats_projects"
                    value={settings.hero_stats_projects}
                    onChange={(e) => setSettings(prev => ({ ...prev, hero_stats_projects: e.target.value }))}
                    placeholder="500+"
                  />
                </div>
                <div>
                  <Label htmlFor="hero_stats_countries">Countries</Label>
                  <Input
                    id="hero_stats_countries"
                    value={settings.hero_stats_countries}
                    onChange={(e) => setSettings(prev => ({ ...prev, hero_stats_countries: e.target.value }))}
                    placeholder="50+"
                  />
                </div>
                <div>
                  <Label htmlFor="hero_stats_years">Years</Label>
                  <Input
                    id="hero_stats_years"
                    value={settings.hero_stats_years}
                    onChange={(e) => setSettings(prev => ({ ...prev, hero_stats_years: e.target.value }))}
                    placeholder="25+"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Background Images */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Background Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1"
                />
                <Button onClick={addBackgroundImage} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {settings.hero_background_images.map((imageUrl, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={imageUrl} 
                        alt={`Background ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <Input
                      value={imageUrl}
                      onChange={(e) => updateBackgroundImage(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => removeBackgroundImage(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {settings.hero_background_images.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No background images added yet.</p>
                  <p className="text-sm">Add at least one image to display in the hero section.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-lg p-6 text-white">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/90 text-xs">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span>{settings.hero_badge_text}</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold">
                    <span className="bg-gradient-to-r from-white via-astro-gold to-blue-300 bg-clip-text text-transparent">
                      {settings.hero_title}
                    </span>
                  </h2>
                  
                  <p className="text-sm text-white/80 line-clamp-2">
                    {settings.hero_subtitle}
                  </p>
                  
                  <div className="flex justify-center space-x-4">
                    <button className="bg-astro-gold text-slate-900 px-4 py-2 rounded-full text-sm font-semibold">
                      {settings.hero_cta_text}
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HeroSettings; 