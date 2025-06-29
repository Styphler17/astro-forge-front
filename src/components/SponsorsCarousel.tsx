import { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
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

const SponsorsCarousel = () => {
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
      <div className="w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (sponsors.length === 0) {
    return null; // Don't render anything if no sponsors
  }

  return (
    <Carousel className="w-full max-w-5xl mx-auto">
      <CarouselContent className="-ml-1">
        {sponsors.map((sponsor) => (
          <CarouselItem key={sponsor.id} className="pl-1 md:basis-1/3 lg:basis-1/4">
            <div className="p-6 bg-white/20 backdrop-blur-sm rounded-lg astro-forge-glass hover:bg-white/30 transition-all duration-300">
              <img
                src={sponsor.logo_url}
                alt={sponsor.name}
                className="h-16 w-auto mx-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default SponsorsCarousel;
