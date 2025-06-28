import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';
import { apiClient } from '../integrations/api/client';

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
  social_links?: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
}

interface FooterData {
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  footerText: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  services: Service[];
}

const Footer = () => {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch site settings and services in parallel
        const [settings, services] = await Promise.all([
          apiClient.getSiteSettings(),
          apiClient.getServices(true) // Only published services
        ]);

        // Parse settings into a more usable format
        const settingsMap = settings.reduce((acc: SettingsMap, setting: SiteSetting) => {
          acc[setting.setting_key as keyof SettingsMap] = JSON.parse(setting.setting_value);
          return acc;
        }, {});

        const data: FooterData = {
          contactEmail: settingsMap.contact_email || 'info@astroforge.com',
          contactPhone: settingsMap.contact_phone || '+1 (555) 123-4567',
          contactAddress: settingsMap.contact_address || '123 Corporate Drive, Business District',
          footerText: settingsMap.footer_text || '© 2024 Astro Forge Holdings. All rights reserved.',
          socialLinks: settingsMap.social_links || {
            facebook: '',
            twitter: '',
            linkedin: '',
            instagram: ''
          },
          services: services || []
        };

        setFooterData(data);
      } catch (err) {
        console.error('Failed to fetch footer data:', err);
        setError('Failed to load footer data');
        
        // Fallback to default values
        setFooterData({
          contactEmail: 'info@astroforge.com',
          contactPhone: '+1 (555) 123-4567',
          contactAddress: '123 Corporate Drive, Business District',
          footerText: '© 2024 Astro Forge Holdings. All rights reserved.',
          socialLinks: {
            facebook: '',
            twitter: '',
            linkedin: '',
            instagram: ''
          },
          services: []
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
                  src="/astroforge-uploads/AstroForgeHoldings-Logo.png" 
                  alt="Astro Forge Holdings" 
                  className="h-10 w-auto"
                />
              </div>
            </div>
            <p className="text-gray-300 font-roboto leading-relaxed mb-6">
              Building tomorrow's infrastructure through innovation, sustainability, and strategic investment across multiple sectors.
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
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
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
                  {footerData.contactAddress}
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-astro-gold mr-3" />
                <span className="text-gray-300 font-roboto">
                  {footerData.contactPhone}
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-astro-gold mr-3" />
                <span className="text-gray-300 font-roboto">
                  {footerData.contactEmail}
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
