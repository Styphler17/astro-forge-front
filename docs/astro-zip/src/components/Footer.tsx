import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Instagram as InstagramIcon } from 'lucide-react';
import { apiClient, getCompanyInfo } from '../integrations/api/client';

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_type: string;
  setting_value: string;
  updated_at: string;
}

interface Service {
  id: string;
  title: string;
  slug: string;
  description?: string;
  is_published: boolean;
  display_order: number;
}

interface SettingsMap {
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  footer_text?: string;
  site_description?: string;
  social_links?: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  } | string;
}

interface FooterData {
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  footerText: string;
  siteDescription?: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  services: Service[];
  logoUrl: string;
}

interface CompanyInfo {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  address: string;
  phone: string;
  email: string;
  // Add more fields if your table has them
}

const Footer = () => {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setLoading(true);
        console.log('Fetching footer data...');
        
        // Fetch company info
        let company = null;
        try {
          company = await getCompanyInfo();
          console.log('Company info:', company);
        } catch (err) {
          console.error('Failed to fetch company info:', err);
        }
        setCompanyInfo(company);
        
        // Fetch site settings and services in parallel
        let settings: SiteSetting[] = [];
        let services: Service[] = [];
        
        try {
          settings = await apiClient.getSiteSettings();
          console.log('Settings:', settings);
        } catch (err) {
          console.error('Failed to fetch site settings:', err);
        }
        
        try {
          services = await apiClient.getServices(true); // Only published services
          console.log('Services:', services);
        } catch (err) {
          console.error('Failed to fetch services:', err);
        }

        // Parse settings into a more usable format
        const settingsMap = settings.reduce((acc: SettingsMap, setting: SiteSetting) => {
          try {
            // Try to parse as JSON first, fallback to string
            let value;
            if (setting.setting_type === 'json') {
              value = JSON.parse(setting.setting_value);
            } else if (setting.setting_type === 'string') {
              // Parse string values that are stored as JSON strings
              try {
                value = JSON.parse(setting.setting_value);
              } catch (e) {
                // If parsing fails, use the raw string value
                value = setting.setting_value;
              }
            } else {
              value = setting.setting_value;
            }
            acc[setting.setting_key as keyof SettingsMap] = value;
          } catch (error) {
            // If JSON parsing fails, use the raw string value
            acc[setting.setting_key as keyof SettingsMap] = setting.setting_value;
          }
          return acc;
        }, {});

        console.log('Settings map:', settingsMap);

        // Get logo URL from header settings
        const headerSettings = settings.filter(s => s.setting_key.startsWith('header_'));
        const logoUrl = headerSettings.find(s => s.setting_key === 'header_logo_url');
        const parsedLogoUrl = logoUrl ? (() => {
          try {
            return JSON.parse(logoUrl.setting_value);
          } catch (e) {
            return logoUrl.setting_value;
          }
        })() : '/astroforge-uploads/AstroForgeHoldings-Logo.png';

        const data: FooterData = {
          contactEmail: settingsMap.contact_email || 'info@astroforge.com',
          contactPhone: settingsMap.contact_phone || '+1 (555) 123-4567',
          contactAddress: settingsMap.contact_address || '123 Corporate Drive, Business District',
          footerText: settingsMap.footer_text || '© 2024 Astro Forge Holdings. All rights reserved.',
          siteDescription: settingsMap.site_description,
          socialLinks: typeof settingsMap.social_links === 'string' 
            ? JSON.parse(settingsMap.social_links) 
            : (settingsMap.social_links as { facebook: string; twitter: string; linkedin: string; instagram: string }) || {
                facebook: '',
                twitter: '',
                linkedin: '',
                instagram: ''
              },
          services: services || [],
          logoUrl: parsedLogoUrl
        };

        console.log('Footer data:', data);
        setFooterData(data);
        
        // Store site description separately for easy access
        const siteDescription = settingsMap.site_description;
        console.log('Site description from settings:', siteDescription);
        
      } catch (err) {
        console.error('Failed to fetch footer data:', err);
        
        // Fallback to default values
        setFooterData({
          contactEmail: 'info@astroforge.com',
          contactPhone: '+1 (555) 123-4567',
          contactAddress: '123 Corporate Drive, Business District',
          footerText: '© 2024 Astro Forge Holdings. All rights reserved.',
          siteDescription: "Building tomorrow's infrastructure through innovation, sustainability, and strategic investment across multiple sectors.",
          socialLinks: {
            facebook: '',
            twitter: '',
            linkedin: '',
            instagram: ''
          },
          services: [],
          logoUrl: '/astroforge-uploads/AstroForgeHoldings-Logo.png'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  if (loading) {
    return (
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-6 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (!footerData) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <img 
                  src={footerData.logoUrl} 
                  alt={companyInfo?.name || "Astro Forge Holdings"} 
                  className="h-10 w-auto"
                  onError={(e) => {
                    console.error('Failed to load footer logo:', footerData.logoUrl);
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log('Footer logo loaded successfully:', footerData.logoUrl);
                  }}
                />
              </div>
            </div>
            <p className="text-gray-300 font-roboto leading-relaxed mb-6">
              {footerData.siteDescription || companyInfo?.description || "Building tomorrow's infrastructure through innovation, sustainability, and strategic investment across multiple sectors."}
            </p>
            <div className="flex space-x-4">
              {footerData.socialLinks.facebook && (
                <a href={footerData.socialLinks.facebook} className="text-gray-300 hover:text-astro-gold transition-colors duration-300" aria-label="Facebook">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {footerData.socialLinks.twitter && (
                <a href={footerData.socialLinks.twitter} className="text-gray-300 hover:text-astro-gold transition-colors duration-300" aria-label="Twitter">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
              {footerData.socialLinks.linkedin && (
                <a href={footerData.socialLinks.linkedin} className="text-gray-300 hover:text-astro-gold transition-colors duration-300" aria-label="LinkedIn">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
              {footerData.socialLinks.instagram && (
                <a href={footerData.socialLinks.instagram} className="text-gray-300 hover:text-astro-gold transition-colors duration-300" aria-label="Instagram">
                  <InstagramIcon className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold font-poppins text-astro-white mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-300 hover:text-astro-gold transition-colors duration-300 font-roboto">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-astro-gold transition-colors duration-300 font-roboto">
                  About Us
                </a>
              </li>
              <li>
                <a href="/pages" className="text-gray-300 hover:text-astro-gold transition-colors duration-300 font-roboto">
                  Pages
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-astro-gold transition-colors duration-300 font-roboto">
                  Contact
                </a>
              </li>
              <li>
                <a href="/careers" className="text-gray-300 hover:text-astro-gold transition-colors duration-300 font-roboto">
                  Careers
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-300 hover:text-astro-gold transition-colors duration-300 font-roboto">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold font-poppins text-astro-white mb-6">
              Our Services
            </h4>
            <ul className="space-y-3">
              {footerData.services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <a 
                    href={`/services/${service.slug}`} 
                    className="text-gray-300 hover:text-astro-gold transition-colors duration-300 font-roboto"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
              {footerData.services.length === 0 && (
                <li className="text-gray-400 font-roboto">No services available</li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold font-poppins text-astro-white mb-6">
              Contact Info
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center">
                <MapPin className="h-5 w-5 text-astro-gold mr-3" />
                <span className="text-gray-300 font-roboto">
                  {companyInfo?.address || footerData?.contactAddress}
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-astro-gold mr-3" />
                <span className="text-gray-300 font-roboto">
                  {companyInfo?.phone || footerData?.contactPhone}
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-astro-gold mr-3" />
                <span className="text-gray-300 font-roboto">
                  {companyInfo?.email || footerData?.contactEmail}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-300 font-roboto">
            {footerData.footerText}
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-sm">
            <a href="/privacy" className="text-gray-400 hover:text-astro-gold transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-astro-gold transition-colors duration-300">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
