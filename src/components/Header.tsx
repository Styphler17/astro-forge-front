import { useState } from 'react';
import { ChevronDown, Menu, X, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const services = [
    { name: 'Agriculture', href: '/services/agriculture' },
    { name: 'Mining', href: '/services/mining' },
    { name: 'Real Estate', href: '/services/real-estate' },
    { name: 'Community Services', href: '/services/community' },
    { name: 'Education', href: '/services/education' },
  ];

  return (
    <header className="bg-astro-blue dark:bg-gray-900 shadow-lg sticky top-0 z-50 transition-colors duration-300 backdrop-blur-sm p-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <img 
                  src="/astroforge-uploads/AstroForgeHoldings-Logo.png" 
                  alt="Astro Forge Holdings" 
                  className="h-12 w-auto"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-white hover:text-astro-gold transition-colors duration-300 font-roboto">
              Home
            </Link>
            
            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center text-white hover:text-astro-gold transition-colors duration-300 font-roboto"
              >
                Services
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 dark:bg-gray-800/95 rounded-md shadow-lg py-1 z-50 backdrop-blur-sm">
                  {services.map((service) => (
                    <Link
                      key={service.name}
                      to={service.href}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-astro-gold hover:text-white transition-colors duration-300"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/about" className="text-white hover:text-astro-gold transition-colors duration-300 font-roboto">
              About Us
            </Link>
            <Link to="/projects" className="text-white hover:text-astro-gold transition-colors duration-300 font-roboto">
              Projects
            </Link>
            <Link to="/careers" className="text-white hover:text-astro-gold transition-colors duration-300 font-roboto">
              Careers
            </Link>
            <Link to="/blog" className="text-white hover:text-astro-gold transition-colors duration-300 font-roboto">
              Blog
            </Link>
            <Link to="/contact" className="text-white hover:text-astro-gold transition-colors duration-300 font-roboto">
              Contact
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="text-white hover:text-astro-gold transition-colors duration-300 p-2"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="text-white hover:text-astro-gold transition-colors duration-300 p-2"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-astro-gold transition-colors duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-astro-blue/95 dark:bg-gray-900/95 backdrop-blur-sm">
              <Link to="/" className="block px-3 py-2 text-white hover:text-astro-gold transition-colors duration-300">
                Home
              </Link>
              
              {services.map((service) => (
                <Link
                  key={service.name}
                  to={service.href}
                  className="block px-3 py-2 text-white hover:text-astro-gold transition-colors duration-300"
                >
                  {service.name}
                </Link>
              ))}
              
              <Link to="/about" className="block px-3 py-2 text-white hover:text-astro-gold transition-colors duration-300">
                About Us
              </Link>
              <Link to="/projects" className="block px-3 py-2 text-white hover:text-astro-gold transition-colors duration-300">
                Projects
              </Link>
              <Link to="/careers" className="block px-3 py-2 text-white hover:text-astro-gold transition-colors duration-300">
                Careers
              </Link>
              <Link to="/blog" className="block px-3 py-2 text-white hover:text-astro-gold transition-colors duration-300">
                Blog
              </Link>
              <Link to="/contact" className="block px-3 py-2 text-white hover:text-astro-gold transition-colors duration-300">
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
