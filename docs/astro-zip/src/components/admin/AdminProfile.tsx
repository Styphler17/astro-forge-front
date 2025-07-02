import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Save, User, Lock, Camera, Eye, EyeOff } from 'lucide-react';
import { apiClient } from '../../integrations/api/client';
import { useAuth } from '../../hooks/useAuth';
import { toast } from '../ui/use-toast';

interface AdminData {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
  bio?: string;
  phone?: string;
  timezone?: string;
  language?: string;
  role: 'admin' | 'editor' | 'viewer';
  is_active: boolean | number;
}

const AdminProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AdminData>({
    id: '',
    name: '',
    email: '',
    created_at: '',
    updated_at: '',
    image_url: '',
    bio: '',
    phone: '',
    timezone: '',
    language: '',
    role: 'admin',
    is_active: true
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch admin profile data
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        setInitialLoading(true);
        if (user?.id) {
          // Fetch admin profile from API
          const adminData = await apiClient.getAdminProfile(user.id);
          if (adminData) {
            setProfile(adminData);
          }
        }
      } catch (error) {
        console.error('Error fetching admin profile:', error);
        // Keep default values if API fails
      } finally {
        setInitialLoading(false);
      }
    };

    fetchAdminProfile();
  }, [user?.id]);

  const handleSaveProfile = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated. Please log in again.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      // Update admin profile via API
      await apiClient.updateAdminProfile(user.id, {
        name: profile.name,
        email: profile.email,
        image_url: profile.image_url,
        bio: profile.bio,
        phone: profile.phone,
        timezone: profile.timezone,
        language: profile.language
      });
      toast({
        title: "Success",
        description: "Profile updated successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (security.newPassword !== security.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match!",
        variant: "destructive",
      });
      return;
    }
    if (security.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long!",
        variant: "destructive",
      });
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
      toast({
        title: "Success",
        description: "Password changed successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Error",
        description: "Failed to change password. Please check your current password and try again.",
        variant: "destructive",
      });
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

  // Handle file upload and preview
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('profilePhoto', file);

      // Upload file to backend
      const response = await fetch('http://localhost:3001/api/upload/profile-photo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      if (result.success) {
        // Set the image URL from the backend response
        setProfile(prev => ({ ...prev, image_url: result.imageUrl }));
        // Show preview
        setImagePreview(result.imageUrl);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    }
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : profile.image_url ? (
                <img
                  src={profile.image_url}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <img
                  src="/placeholder.svg"
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
            </div>
            <Button
              variant="outline"
              className="flex items-center space-x-2 w-full sm:w-auto"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-4 w-4" />
              <span>Change Photo</span>
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              title="Upload profile photo"
              placeholder="Choose a profile photo"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={profile.timezone || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
                placeholder="UTC-5 (Eastern Time)"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="language">Preferred Language</Label>
            <Input
              id="language"
              value={profile.language || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, language: e.target.value }))}
              placeholder="English"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>

          {/* Account Information (Read-only) */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Account Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-gray-500 dark:text-gray-400">Role</Label>
                <div className="text-gray-900 dark:text-white font-medium capitalize">{profile.role}</div>
              </div>
              <div>
                <Label className="text-gray-500 dark:text-gray-400">Status</Label>
                <div className="text-gray-900 dark:text-white font-medium">
                  {profile.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div>
                <Label className="text-gray-500 dark:text-gray-400">Member Since</Label>
                <div className="text-gray-900 dark:text-white font-medium">
                  {new Date(profile.created_at).toLocaleDateString()}
                </div>
              </div>
              <div>
                <Label className="text-gray-500 dark:text-gray-400">Last Updated</Label>
                <div className="text-gray-900 dark:text-white font-medium">
                  {new Date(profile.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveProfile}
              disabled={loading}
              className="bg-astro-blue text-white hover:bg-blue-700 flex items-center space-x-2 w-full sm:w-auto"
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
          <form onSubmit={(e) => {
            e.preventDefault();
            handleChangePassword();
          }}>
            {/* Hidden username field for accessibility */}
            <input
              type="text"
              name="username"
              autoComplete="username"
              value={profile.email || ''}
              readOnly
              className="sr-only"
              aria-hidden="true"
            />
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={passwordVisibility.current ? "text" : "password"}
                  value={security.currentPassword}
                  onChange={(e) => setSecurity(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="pr-10"
                  required
                  autoComplete="current-password"
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={passwordVisibility.new ? "text" : "password"}
                    value={security.newPassword}
                    onChange={(e) => setSecurity(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="pr-10"
                    required
                    minLength={6}
                    autoComplete="new-password"
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
                    name="confirmPassword"
                    type={passwordVisibility.confirm ? "text" : "password"}
                    value={security.confirmPassword}
                    onChange={(e) => setSecurity(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pr-10"
                    required
                    autoComplete="new-password"
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
                type="submit"
                disabled={loading || !security.currentPassword || !security.newPassword}
                variant="outline"
                className="flex items-center space-x-2 w-full sm:w-auto"
              >
                <Lock className="h-4 w-4" />
                <span>{loading ? 'Updating...' : 'Change Password'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
            </div>
            <input 
              type="checkbox" 
              id="emailNotifications"
              name="emailNotifications"
              title="Enable email notifications"
              defaultChecked 
              className="h-4 w-4 flex-shrink-0" 
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">Weekly Reports</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get weekly analytics reports</p>
            </div>
            <input 
              type="checkbox" 
              id="weeklyReports"
              name="weeklyReports"
              title="Enable weekly reports"
              defaultChecked 
              className="h-4 w-4 flex-shrink-0" 
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">Security Alerts</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get notified of security events</p>
            </div>
            <input 
              type="checkbox" 
              id="securityAlerts"
              name="securityAlerts"
              title="Enable security alerts"
              defaultChecked 
              className="h-4 w-4 flex-shrink-0" 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile;
