import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Home, FileText, Users, FolderOpen, Newspaper, Cog, Settings, Handshake, Info, Mail, Shield, Briefcase, HelpCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AdminTopBar from './AdminTopBar';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Messages', href: '/admin/messages', icon: Mail },
    { name: 'Hero Settings', href: '/admin/hero', icon: Settings },
    { name: 'About Settings', href: '/admin/about', icon: Info },
    { name: 'Blog Posts', href: '/admin/blog', icon: Newspaper },
    { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
    { name: 'Services', href: '/admin/services', icon: FileText },
    { name: 'Team', href: '/admin/team', icon: Users },
    { name: 'Sponsors', href: '/admin/sponsors', icon: Handshake },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Privacy & Terms', href: '/admin/privacy-terms', icon: Shield },
    { name: 'Careers', href: '/admin/careers', icon: Briefcase },
    { name: 'FAQ', href: '/admin/faq', icon: HelpCircle },
    { name: 'Settings', href: '/admin/settings', icon: Cog },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Bar */}
      <AdminTopBar />

      {/* Main Content */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 w-64 h-full bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 z-30">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-astro-blue text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Page Content */}
        <main className="flex-1 ml-64 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
