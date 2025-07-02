import { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut, Globe, ChevronDown, Menu } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { apiClient } from '../../integrations/api/client';

interface AdminTopBarProps {
  onMenuClick: () => void;
}

const AdminTopBar: React.FC<AdminTopBarProps> = ({ onMenuClick }) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { unreadCount } = useNotifications();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<{ name?: string; email?: string; avatar?: string; image_url?: string } | null>(null);

  // Function to get page title based on current route
  const getPageTitle = (pathname: string): string => {
    const path = pathname.toLowerCase();
    
    if (path === '/admin' || path === '/admin/dashboard') return 'Dashboard';
    if (path.includes('/admin/analytics')) return 'Analytics';
    if (path.includes('/admin/blog')) return 'Blog Management';
    if (path.includes('/admin/careers')) return 'Careers Management';
    if (path.includes('/admin/messages')) return 'Contact Messages';
    if (path.includes('/admin/users')) return 'User Management';
    if (path.includes('/admin/team')) return 'Team Management';
    if (path.includes('/admin/projects')) return 'Projects Management';
    if (path.includes('/admin/services')) return 'Services Management';
    if (path.includes('/admin/sponsors')) return 'Sponsors Management';
    if (path.includes('/admin/pages')) return 'Pages Management';
    if (path.includes('/admin/faq')) return 'FAQ Management';
    if (path.includes('/admin/privacy-terms')) return 'Privacy & Terms';
    if (path.includes('/admin/notifications')) return 'Notifications';
    if (path.includes('/admin/hero-settings')) return 'Hero Settings';
    if (path.includes('/admin/about-settings')) return 'About Settings';
    if (path.includes('/admin/theme-settings')) return 'Theme Settings';
    if (path.includes('/admin/profile')) return 'Profile Settings';
    if (path.includes('/admin/settings')) return 'Settings';
    
    return 'Admin Dashboard';
  };

  // Fetch the logged-in user's profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.id) {
          const data = await apiClient.getAdminProfile(user.id);
          setProfile(data);
        }
      } catch (error) {
        setProfile(null);
      }
    };
    fetchProfile();
  }, [user?.id]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleNavigation = (path: string) => {
    console.log('Navigating to:', path);
    setProfileDropdownOpen(false);
    navigate(path);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left side - Menu button and title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white truncate">
            {getPageTitle(location.pathname)}
          </h1>
        </div>
        
        {/* Right side - Actions */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Mobile: Show only essential buttons */}
          <div className="hidden sm:flex items-center space-x-2">
            <button
              onClick={() => window.open('/', '_blank')}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Visit Main Site"
            >
              <Globe className="h-5 w-5" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Toggle Theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
          
          <button 
            onClick={() => navigate('/admin/notifications')}
            className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-sm border border-white dark:border-gray-800">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          
          {/* User Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="User Profile"
            >
              {profile?.image_url ? (
                <img
                  src={profile.image_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {profile?.name || user?.name || 'Admin'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {profile?.email || user?.email || 'admin@example.com'}
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-[9999]">
                <div className="py-1">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      {profile?.image_url ? (
                        <img
                          src={profile.image_url}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {profile?.name || user?.name || 'Admin'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {profile?.email || user?.email || 'admin@example.com'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNavigation('/admin/profile');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User className="h-4 w-4 mr-3" /> Profile Settings
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleLogout();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4 mr-3" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
