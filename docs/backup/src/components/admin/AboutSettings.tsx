import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { apiClient } from '../../integrations/api/client';
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import RefreshButton from '../ui/refresh-button';

interface AboutStats {
  icon: string;
  value: string;
  label: string;
}

interface JourneyItem {
  year: string;
  title: string;
  description: string;
}

interface AboutSettings {
  hero_title: string;
  hero_subtitle: string;
  hero_enabled: boolean;
  vision_title: string;
  vision_content: string;
  vision_enabled: boolean;
  stats_enabled: boolean;
  journey_title: string;
  journey_subtitle: string;
  journey_enabled: boolean;
  stats: AboutStats[];
  timeline: JourneyItem[];
}

const AboutSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AboutSettings>({
    hero_title: 'About Astro Forge Holdings',
    hero_subtitle: 'Building tomorrow\'s infrastructure through innovation, sustainability, and strategic investment across multiple sectors.',
    hero_enabled: true,
    vision_title: 'Our Vision',
    vision_content: 'At Astro Forge Holdings, we envision a future where innovation drives sustainable progress across all sectors of society. Our commitment to excellence and environmental responsibility shapes every decision we make, ensuring that our projects not only meet current needs but also create lasting value for future generations.',
    vision_enabled: true,
    stats_enabled: true,
    journey_title: 'Our Journey',
    journey_subtitle: 'From humble beginnings to global impact - the story of Astro Forge Holdings.',
    journey_enabled: true,
    stats: [
      { icon: 'Users', value: '500+', label: 'Team Members' },
      { icon: 'Target', value: '50+', label: 'Projects Completed' },
      { icon: 'Award', value: '15+', label: 'Years Experience' },
      { icon: 'Globe', value: '10+', label: 'Countries Served' },
      { icon: 'TrendingUp', value: '95%', label: 'Success Rate' },
      { icon: 'Heart', value: '100K+', label: 'Lives Impacted' }
    ],
    timeline: [
      {
        year: '2008',
        title: 'Foundation',
        description: 'Astro Forge Holdings was founded with a vision to revolutionize multiple industries through innovation.'
      },
      {
        year: '2012',
        title: 'First Major Expansion',
        description: 'Expanded into mining and real estate sectors, establishing our multi-industry approach.'
      },
      {
        year: '2016',
        title: 'Sustainability Initiative',
        description: 'Launched comprehensive sustainability programs across all divisions.'
      },
      {
        year: '2020',
        title: 'Digital Transformation',
        description: 'Integrated cutting-edge technology solutions across all operations.'
      },
      {
        year: '2023',
        title: 'Global Presence',
        description: 'Achieved international recognition and expanded operations globally.'
      }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchAboutSettings = useCallback(async () => {
    try {
      setRefreshing(true);
      
      // Add a small delay to make the spinning animation visible
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const allSettings = await apiClient.getSiteSettings();
      
      const aboutSettings: Partial<AboutSettings> = {};
      
      allSettings.forEach(setting => {
        if (setting.setting_key.startsWith('about_')) {
          const key = setting.setting_key.replace('about_', '') as keyof AboutSettings;
          if (key === 'stats' || key === 'timeline') {
            try {
              aboutSettings[key] = JSON.parse(setting.setting_value);
            } catch (e) {
              console.warn(`Failed to parse ${key}:`, e);
            }
          } else if (key === 'hero_enabled' || key === 'vision_enabled' || key === 'stats_enabled' || key === 'journey_enabled') {
            aboutSettings[key] = setting.setting_value === 'true';
          } else {
            aboutSettings[key] = setting.setting_value;
          }
        }
      });
      
      setSettings(prev => ({ ...prev, ...aboutSettings }));
    } catch (error) {
      console.error('Error fetching about settings:', error);
      toast({
        title: "Error",
        description: "Failed to load about settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAboutSettings();
  }, [fetchAboutSettings]);

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      const settingsToUpdate = [
        { key: 'about_hero_title', value: settings.hero_title, type: 'string' },
        { key: 'about_hero_subtitle', value: settings.hero_subtitle, type: 'string' },
        { key: 'about_hero_enabled', value: settings.hero_enabled.toString(), type: 'string' },
        { key: 'about_vision_title', value: settings.vision_title, type: 'string' },
        { key: 'about_vision_content', value: settings.vision_content, type: 'string' },
        { key: 'about_vision_enabled', value: settings.vision_enabled.toString(), type: 'string' },
        { key: 'about_stats_enabled', value: settings.stats_enabled.toString(), type: 'string' },
        { key: 'about_journey_title', value: settings.journey_title, type: 'string' },
        { key: 'about_journey_subtitle', value: settings.journey_subtitle, type: 'string' },
        { key: 'about_journey_enabled', value: settings.journey_enabled.toString(), type: 'string' },
        { key: 'about_stats', value: JSON.stringify(settings.stats), type: 'json' },
        { key: 'about_timeline', value: JSON.stringify(settings.timeline), type: 'json' }
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
        description: "About page settings saved successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error('Error saving about settings:', error);
      toast({
        title: "Error",
        description: "Failed to save about settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addStat = () => {
    setSettings(prev => ({
      ...prev,
      stats: [...prev.stats, { icon: 'Users', value: '', label: '' }]
    }));
  };

  const updateStat = (index: number, field: keyof AboutStats, value: string) => {
    setSettings(prev => ({
      ...prev,
      stats: prev.stats.map((stat, i) => 
        i === index ? { ...stat, [field]: value } : stat
      )
    }));
  };

  const removeStat = (index: number) => {
    setSettings(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    }));
  };

  const moveStat = (index: number, direction: 'up' | 'down') => {
    setSettings(prev => {
      const newStats = [...prev.stats];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [newStats[index], newStats[newIndex]] = [newStats[newIndex], newStats[index]];
      return { ...prev, stats: newStats };
    });
  };

  const updateTimelineItem = (index: number, field: keyof JourneyItem, value: string) => {
    setSettings(prev => ({
      ...prev,
      timeline: prev.timeline.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeTimelineItem = (index: number) => {
    setSettings(prev => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index)
    }));
  };

  const moveTimelineItem = (index: number, direction: 'up' | 'down') => {
    setSettings(prev => {
      const newTimeline = [...prev.timeline];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [newTimeline[index], newTimeline[newIndex]] = [newTimeline[newIndex], newTimeline[index]];
      return { ...prev, timeline: newTimeline };
    });
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">About Settings</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your about page content and settings
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <RefreshButton 
            onClick={fetchAboutSettings}
            refreshing={refreshing}
            title="Refresh about settings"
          />
          <Button 
            onClick={saveSettings}
            disabled={saving}
            className="bg-astro-blue text-white hover:bg-blue-700 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hero_title">Hero Title</Label>
              <Input
                id="hero_title"
                value={settings.hero_title}
                onChange={(e) => setSettings(prev => ({ ...prev, hero_title: e.target.value }))}
                placeholder="About Astro Forge Holdings"
              />
            </div>
            <div>
              <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
              <Textarea
                id="hero_subtitle"
                value={settings.hero_subtitle}
                onChange={(e) => setSettings(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                rows={3}
                placeholder="Building tomorrow's infrastructure..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Vision Section */}
        <Card>
          <CardHeader>
            <CardTitle>Vision Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="vision_title">Vision Title</Label>
              <Input
                id="vision_title"
                value={settings.vision_title}
                onChange={(e) => setSettings(prev => ({ ...prev, vision_title: e.target.value }))}
                placeholder="Our Vision"
              />
            </div>
            <div>
              <Label htmlFor="vision_content">Vision Content</Label>
              <Textarea
                id="vision_content"
                value={settings.vision_content}
                onChange={(e) => setSettings(prev => ({ ...prev, vision_content: e.target.value }))}
                rows={6}
                placeholder="At Astro Forge Holdings, we envision..."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Statistics Section</CardTitle>
            <Button onClick={addStat} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Stat
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {settings.stats.map((stat, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Icon</Label>
                    <Input
                      value={stat.icon}
                      onChange={(e) => updateStat(index, 'icon', e.target.value)}
                      placeholder="Users"
                    />
                  </div>
                  <div>
                    <Label>Value</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => updateStat(index, 'value', e.target.value)}
                      placeholder="500+"
                    />
                  </div>
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => updateStat(index, 'label', e.target.value)}
                      placeholder="Team Members"
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => moveStat(index, 'up')}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-1"
                    title="Move up"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => moveStat(index, 'down')}
                    disabled={index === settings.stats.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-1"
                    title="Move down"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => removeStat(index)}
                    className="text-red-600 hover:text-red-700 disabled:opacity-30 p-1"
                    title="Remove"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Journey Section */}
      <Card>
        <CardHeader>
          <CardTitle>Journey Section</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4">
            <div>
              <Label htmlFor="journey_title">Journey Title</Label>
              <Input
                id="journey_title"
                value={settings.journey_title}
                onChange={(e) => setSettings(prev => ({ ...prev, journey_title: e.target.value }))}
                placeholder="Our Journey"
              />
            </div>
            <div>
              <Label htmlFor="journey_subtitle">Journey Subtitle</Label>
              <Input
                id="journey_subtitle"
                value={settings.journey_subtitle}
                onChange={(e) => setSettings(prev => ({ ...prev, journey_subtitle: e.target.value }))}
                placeholder="From humble beginnings to global impact..."
              />
            </div>
          </div>
          
          <div className="space-y-4">
            {settings.timeline.map((item, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Year</Label>
                      <Input
                        value={item.year}
                        onChange={(e) => updateTimelineItem(index, 'year', e.target.value)}
                        placeholder="2008"
                      />
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => updateTimelineItem(index, 'title', e.target.value)}
                        placeholder="Foundation"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateTimelineItem(index, 'description', e.target.value)}
                      rows={3}
                      placeholder="Astro Forge Holdings was founded..."
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => moveTimelineItem(index, 'up')}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-1"
                    title="Move up"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => moveTimelineItem(index, 'down')}
                    disabled={index === settings.timeline.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-1"
                    title="Move down"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => removeTimelineItem(index)}
                    className="text-red-600 hover:text-red-700 disabled:opacity-30 p-1"
                    title="Remove"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutSettings; 
