import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Save, User, Lock, Camera, Eye, EyeOff } from 'lucide-react';
import { apiClient } from '../../integrations/api/client';

interface AdminData {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  timezone?: string;
  language?: string;
  created_at: string;
  updated_at: string;
}

const AdminProfile = () => {
  const [profile, setProfile] = useState<AdminData>({
    id: '',
    name: 'Admin User',
    email: 'admin@astroforge.com',
    bio: 'System administrator and content manager',
    avatar: '',
    phone: '+1 (555) 123-4567',
    timezone: 'UTC-05:00 (Eastern Time)',
    language: 'English',
    created_at: '',
    updated_at: ''
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch admin profile data
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        setInitialLoading(true);
        // Fetch admin profile from API
        const adminData = await apiClient.getAdminProfile();
        if (adminData) {
          setProfile(adminData);
        }
      } catch (error) {
        console.error('Error fetching admin profile:', error);
        // Keep default values if API fails
      } finally {
        setInitialLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Update admin profile via API
      await apiClient.updateAdminProfile(profile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (security.newPassword !== security.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (security.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    
    setLoading(true);
    try {
      // Change password via API
      await apiClient.changeAdminPassword({
        currentPassword: security.currentPassword,
        newPassword: security.newPassword
      });
      setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please check your current password and try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-64 bg-gray-300 rounded"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Profile</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage your admin account settings and preferences
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar Section */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Camera className="h-4 w-4" />
              <span>Change Photo</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <select
                id="timezone"
                name="timezone"
                title="Select your timezone"
                value={profile.timezone || 'UTC-05:00 (Eastern Time)'}
                onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="UTC-05:00 (Eastern Time)">UTC-05:00 (Eastern Time)</option>
                <option value="UTC-06:00 (Central Time)">UTC-06:00 (Central Time)</option>
                <option value="UTC-07:00 (Mountain Time)">UTC-07:00 (Mountain Time)</option>
                <option value="UTC-08:00 (Pacific Time)">UTC-08:00 (Pacific Time)</option>
                <option value="UTC+00:00 (UTC)">UTC+00:00 (UTC)</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveProfile}
              disabled={loading}
              className="bg-astro-blue text-white hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Profile'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Security Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={passwordVisibility.current ? "text" : "password"}
                value={security.currentPassword}
                onChange={(e) => setSecurity(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                title={passwordVisibility.current ? "Hide password" : "Show password"}
              >
                {passwordVisibility.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={passwordVisibility.new ? "text" : "password"}
                  value={security.newPassword}
                  onChange={(e) => setSecurity(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  title={passwordVisibility.new ? "Hide password" : "Show password"}
                >
                  {passwordVisibility.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={passwordVisibility.confirm ? "text" : "password"}
                  value={security.confirmPassword}
                  onChange={(e) => setSecurity(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  title={passwordVisibility.confirm ? "Hide password" : "Show password"}
                >
                  {passwordVisibility.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleChangePassword}
              disabled={loading || !security.currentPassword || !security.newPassword}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Lock className="h-4 w-4" />
              <span>{loading ? 'Updating...' : 'Change Password'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
            </div>
            <input 
              type="checkbox" 
              id="emailNotifications"
              name="emailNotifications"
              title="Enable email notifications"
              defaultChecked 
              className="h-4 w-4" 
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Weekly Reports</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get weekly analytics reports</p>
            </div>
            <input 
              type="checkbox" 
              id="weeklyReports"
              name="weeklyReports"
              title="Enable weekly reports"
              defaultChecked 
              className="h-4 w-4" 
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Security Alerts</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get notified of security events</p>
            </div>
            <input 
              type="checkbox" 
              id="securityAlerts"
              name="securityAlerts"
              title="Enable security alerts"
              defaultChecked 
              className="h-4 w-4" 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile;
