import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight, Sprout, Mountain, Home, Users, GraduationCap, Building2 } from 'lucide-react';
import { apiClient } from '../integrations/api/client';

interface Service {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  icon?: string;
  image_url?: string;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Icon mapping
const iconMap = {
  Sprout,
  Mountain,
  Home,
  Users,
  GraduationCap,
  Building2,
};

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await apiClient.getServices(true); // Get only published services
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName as keyof typeof iconMap] || Building2;
    return Icon;
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-700 rounded-lg h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive solutions across multiple sectors, delivering excellence and innovation in every project we undertake.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = getIcon(service.icon || 'Building2');
            return (
              <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="text-astro-blue mb-6">
                    <IconComponent className="h-12 w-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {service.description || 'No description available'}
                  </p>
                  <Button 
                    variant="ghost" 
                    className="text-astro-blue hover:text-astro-blue/80 p-0 h-auto font-semibold group-hover:translate-x-2 transition-transform duration-300"
                    onClick={() => window.location.href = `/services/${service.slug}`}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
