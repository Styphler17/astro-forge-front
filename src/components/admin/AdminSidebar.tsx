import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Users, FolderOpen, Newspaper, Cog, Settings, Handshake, Info, Mail, Shield, Briefcase, HelpCircle, BarChart3, Bell, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    content: true,
    communication: true,
    settings: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const navigation = [
    // Overview Section
    { name: 'Dashboard', href: '/admin', icon: Home, category: 'overview' },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, category: 'overview' },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell, category: 'overview' },
    
    // Content Management Section
    { name: 'Pages', href: '/admin/pages', icon: FileText, category: 'content' },
    { name: 'Blog Posts', href: '/admin/blog', icon: Newspaper, category: 'content' },
    { name: 'Projects', href: '/admin/projects', icon: FolderOpen, category: 'content' },
    { name: 'Services', href: '/admin/services', icon: Briefcase, category: 'content' },
    { name: 'Team Members', href: '/admin/team', icon: Users, category: 'content' },
    { name: 'Partners & Sponsors', href: '/admin/sponsors', icon: Handshake, category: 'content' },
    { name: 'FAQ', href: '/admin/faq', icon: HelpCircle, category: 'content' },
    { name: 'Careers', href: '/admin/careers', icon: Briefcase, category: 'content' },
    
    // Communication Section
    { name: 'Messages', href: '/admin/messages', icon: Mail, category: 'communication' },
    
    // Settings Section
    { name: 'Hero Settings', href: '/admin/hero', icon: Settings, category: 'settings' },
    { name: 'About Settings', href: '/admin/about', icon: Info, category: 'settings' },
    { name: 'Theme Settings', href: '/admin/theme', icon: Cog, category: 'settings' },
    { name: 'General Settings', href: '/admin/settings', icon: Settings, category: 'settings' },
    { name: 'Privacy & Terms', href: '/admin/privacy-terms', icon: Shield, category: 'settings' },
    { name: 'User Management', href: '/admin/users', icon: Users, category: 'settings' }
  ];

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'overview':
        return 'Overview';
      case 'content':
        return 'Content Management';
      case 'communication':
        return 'Communication';
      case 'settings':
        return 'Settings';
      default:
        return category;
    }
  };

  const groupedNavigation = navigation.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof navigation>);

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-6 flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          {Object.entries(groupedNavigation).map(([category, items]) => {
            const isExpanded = expandedSections[category];
            const hasActiveItem = items.some(item => location.pathname === item.href);
            
            return (
              <div key={category} className="mb-4">
                <button
                  onClick={() => toggleSection(category)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    hasActiveItem
                      ? 'bg-astro-blue text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {getCategoryTitle(category)}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                
                <div className={`mt-1 space-y-1 transition-all duration-200 ease-in-out ${
                  isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                  {items.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={onClose}
                        className={`flex items-center px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-astro-blue text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar; 