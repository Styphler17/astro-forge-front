import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  // Static header settings
  const headerSettings = {
    company_name: 'AstroForge Holdings',
    logo_url: '/astroforge-uploads/AstroForgeHoldings-Logo.png',
    show_services_dropdown: true,
    navigation_links: [
      { id: '1', label: 'Home', url: '/', order: 1, is_active: true },
      { id: '2', label: 'About', url: '/about', order: 2, is_active: true },
      { id: '4', label: 'Projects', url: '/projects', order: 4, is_active: true },
      { id: '5', label: 'Pages', url: '/pages', order: 5, is_active: true },
      { id: '6', label: 'Blog', url: '/blog', order: 6, is_active: true },
      { id: '7', label: 'Careers', url: '/careers', order: 7, is_active: true },
      { id: '8', label: 'Contact', url: '/contact', order: 8, is_active: true }
    ]
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Fetch services for dropdown
  const [services, setServices] = useState<Array<{ id: string; title: string; slug: string }>>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        setServices(data.filter((service: { is_published: boolean }) => service.is_published));
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
      }
    };

    if (headerSettings.show_services_dropdown) {
      fetchServices();
    }
  }, [headerSettings.show_services_dropdown]);

  // Sort navigation links by order
  const sortedNavigationLinks = headerSettings.navigation_links
    .filter(link => link.is_active)
    .sort((a, b) => a.order - b.order);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 transition-all duration-300 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Company Name */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-white dark:bg-white rounded-lg p-2 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <img
                  src={headerSettings.logo_url}
                  alt={headerSettings.company_name}
                  className="h-8 w-auto"
                  onError={(e) => {
                    e.currentTarget.src = '/astroforge-uploads/AstroForgeHoldings-Logo.png';
                  }}
                />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {headerSettings.company_name}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {sortedNavigationLinks.map((link) => (
              <React.Fragment key={link.id}>
                <Link
                  to={link.url}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                
                {/* Insert Services dropdown after About link */}
                {link.label === 'About' && headerSettings.show_services_dropdown && (
                  <div className="relative">
                    <button
                      onClick={() => setIsServicesOpen(!isServicesOpen)}
                      className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium relative group"
                    >
                      <span>Services</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                    
                    {isServicesOpen && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                        {services.map((service) => (
                          <Link
                            key={service.id}
                            to={`/services/${service.slug}`}
                            className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Theme Toggle and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="space-y-2">
              {sortedNavigationLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.url}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {headerSettings.show_services_dropdown && (
                <div className="px-4 py-2">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Services</div>
                  {services.map((service) => (
                    <Link
                      key={service.id}
                      to={`/services/${service.slug}`}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
