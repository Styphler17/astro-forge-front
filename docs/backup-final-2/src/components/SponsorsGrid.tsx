import { useState, useEffect } from 'react';
import { apiClient } from '../integrations/api/client';

interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  description?: string;
  is_active: number | boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const SponsorsGrid = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const data = await apiClient.getSponsors(true); // Get only active sponsors
      setSponsors(data || []);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white/10 backdrop-blur-sm astro-forge-glass dark:bg-gray-800/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (sponsors.length === 0) {
    return null; // Don't render anything if no sponsors
  }

  return (
    <section className="py-20 bg-white/10 backdrop-blur-sm astro-forge-glass dark:bg-gray-800/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-poppins text-astro-forge-blue dark:text-white mb-6">
            Our Partners & Sponsors
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="text-center">
              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl astro-forge-glass hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                <img
                  src={sponsor.logo_url}
                  alt={sponsor.name}
                  className="h-12 w-auto mx-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsGrid;
