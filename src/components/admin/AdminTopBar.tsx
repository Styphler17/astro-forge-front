import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut, Globe, ChevronDown, Users as UsersIcon, Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminTopBar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
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
    setDropdownOpen(false);
    navigate(path);
  };

  return (
    <header className="fixed top-0 right-0 left-64 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16">
      <div className="flex items-center justify-between h-full px-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        
        <div className="flex items-center space-x-4">
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
          
          <button 
            onClick={() => navigate('/admin/notifications')}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          {/* Custom Admin Pages Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-1 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Admin Pages"
            >
              <span>Admin Pages</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-[9999]">
                <div className="py-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleNavigation('/admin/profile');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User className="h-4 w-4 mr-2" /> Profile Settings
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleNavigation('/admin/users');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <UsersIcon className="h-4 w-4 mr-2" /> Users
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleNavigation('/admin/team');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <UsersIcon className="h-4 w-4 mr-2" /> Team
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleNavigation('/admin/settings');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <SettingsIcon className="h-4 w-4 mr-2" /> Settings
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate('/admin/profile')}
              className="flex items-center space-x-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Profile"
            >
              <User className="h-5 w-5" />
              <span className="text-sm">Admin</span>
            </button>
            
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Log out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
