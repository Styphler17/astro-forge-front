import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ContactForm from '../components/ContactForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { apiClient } from '../integrations/api/client';

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

interface SiteSetting {
  setting_key: string;
  setting_value: string;
}

interface ContactSettings {
  [key: string]: string;
}

const Contact = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all site settings
        const settings = await apiClient.getSiteSettings();
        
        // Extract contact information from settings
        const contactSettings = settings.reduce((acc: ContactSettings, setting: SiteSetting) => {
          if (setting.setting_key.startsWith('contact_')) {
            acc[setting.setting_key] = JSON.parse(setting.setting_value);
          }
          return acc;
        }, {});
        
        // Map settings to contact info
        const contactData: ContactInfo = {
          address: contactSettings.contact_address || 'Address not available',
          phone: contactSettings.contact_phone || 'Phone not available',
          email: contactSettings.contact_email || 'Email not available',
          hours: contactSettings.contact_hours || 'Hours not available'
        };
        
        setContactInfo(contactData);
      } catch (err) {
        console.error('Failed to fetch contact information:', err);
        setError('Failed to load contact information. Please try again later.');
        
        // Fallback to default values if API fails
        setContactInfo({
          address: "123 Business Plaza, Innovation District, Tech City, TC 12345",
          phone: "+1 (555) 123-4567",
          email: "info@astroforge.com",
          hours: "Monday - Friday: 9:00 AM - 6:00 PM"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  return (
    <Layout>
      <div className="pt-20 pb-16 bg-gradient-to-br from-astro-blue to-blue-800 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center fade-in-scroll">
            <h1 className="text-5xl md:text-6xl font-bold font-poppins text-white mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Get in touch with our team to discuss how we can help bring your vision to life.
            </p>
          </div>
        </div>
      </div>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="slide-in-left">
              <h2 className="text-3xl font-bold font-poppins text-astro-blue dark:text-white mb-8">
                Get In Touch
              </h2>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              {loading ? (
                <div className="animate-pulse space-y-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <div className="bg-gray-300 w-12 h-12 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="bg-gray-300 h-4 w-20 rounded"></div>
                        <div className="bg-gray-300 h-4 w-40 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : contactInfo ? (
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-astro-blue text-white p-3 rounded-full">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Address</h3>
                      <p className="text-gray-600 dark:text-gray-300">{contactInfo.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-astro-gold text-astro-blue p-3 rounded-full">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Phone</h3>
                      <p className="text-gray-600 dark:text-gray-300">{contactInfo.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-astro-accent text-white p-3 rounded-full">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Email</h3>
                      <p className="text-gray-600 dark:text-gray-300">{contactInfo.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-600 text-white p-3 rounded-full">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Business Hours</h3>
                      <p className="text-gray-600 dark:text-gray-300">{contactInfo.hours}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Google Map */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-astro-blue dark:text-white mb-4">Find Us</h3>
                <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1879!2d-74.0059728!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjEiTiA3NMKwMDAnMjEuNSJX!5e0!3m2!1sen!2sus!4v1635784234567!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    className="border-0"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Astro Forge Holdings Location"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="slide-in-right">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
