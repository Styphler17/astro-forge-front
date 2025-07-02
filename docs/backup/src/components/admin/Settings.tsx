import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Save, Globe, Mail } from 'lucide-react';
import { apiClient } from '../../integrations/api/client';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Astro Forge Holdings',
    siteDescription: 'Leading provider of innovative solutions across multiple industries',
    siteUrl: 'https://astroforgeholdings.com',
    contactEmail: 'contact@astroforge.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Plaza, Innovation District, Tech City, TC 12345',
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    },
    seo: {
      metaTitle: 'Astro Forge Holdings - Professional Services',
      metaDescription: 'Leading provider of professional services with expertise and dedication',
      keywords: 'professional services, business, consulting'
    }
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const siteSettings = await apiClient.getSiteSettings();
      
      // Map database settings to local state
      const mappedSettings = {
        siteName: '',
        siteDescription: '',
        siteUrl: 'https://astroforge.com',
        contactEmail: '',
        phone: '',
        address: '',
        socialMedia: {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: ''
        },
        seo: {
          metaTitle: 'Astro Forge Holdings - Professional Services',
          metaDescription: 'Leading provider of professional services with expertise and dedication',
          keywords: 'professional services, business, consulting'
        }
      };

      siteSettings.forEach((setting: { setting_key: string; setting_value: string }) => {
        const value = JSON.parse(setting.setting_value);
        
        switch (setting.setting_key) {
          case 'site_title':
            mappedSettings.siteName = value;
            break;
          case 'site_description':
            mappedSettings.siteDescription = value;
            break;
          case 'contact_email':
            mappedSettings.contactEmail = value;
            break;
          case 'contact_phone':
            mappedSettings.phone = value;
            break;
          case 'contact_address':
            mappedSettings.address = value;
            break;
          case 'social_links':
            mappedSettings.socialMedia = value;
            break;
        }
      });

      setSettings(mappedSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update site settings
      await apiClient.updateSiteSetting('site_title', settings.siteName, 'string');
      await apiClient.updateSiteSetting('site_description', settings.siteDescription, 'string');
      await apiClient.updateSiteSetting('contact_email', settings.contactEmail, 'string');
      await apiClient.updateSiteSetting('contact_phone', settings.phone, 'string');
      await apiClient.updateSiteSetting('contact_address', settings.address, 'string');
      await apiClient.updateSiteSetting('social_links', settings.socialMedia, 'json');
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={`settings-skeleton-${i}`} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">General Settings</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your general site settings
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          {/* Place your action buttons here, e.g. Save, Reset */}
        </div>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>General Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="siteUrl">Site URL</Label>
              <Input
                id="siteUrl"
                value={settings.siteUrl}
                onChange={(e) => setSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="siteDescription">Site Description</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Contact Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={settings.address}
              onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={settings.socialMedia.facebook}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={settings.socialMedia.twitter}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={settings.socialMedia.linkedin}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, linkedin: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={settings.socialMedia.instagram}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              value={settings.seo.metaTitle}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                seo: { ...prev.seo, metaTitle: e.target.value }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={settings.seo.metaDescription}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                seo: { ...prev.seo, metaDescription: e.target.value }
              }))}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              value={settings.seo.keywords}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                seo: { ...prev.seo, keywords: e.target.value }
              }))}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-astro-blue text-white hover:bg-astro-blue/80 flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>{loading ? 'Saving...' : 'Save Settings'}</span>
        </Button>
      </div>
    </div>
  );
};

export default Settings;
