import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient, SiteSetting } from '../integrations/api/client';

interface HeroData {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImages: string[];
  badgeText: string;
  statsProjects: string;
  statsCountries: string;
  statsYears: string;
}

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroData, setHeroData] = useState<HeroData>({
    title: 'ASTRO FORGE HOLDINGS',
    subtitle: 'Building Tomorrow\'s Infrastructure Through Innovation, Sustainability, and Strategic Investment',
    ctaText: 'Discover More',
    ctaLink: '/about',
    backgroundImages: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    badgeText: 'Innovation • Sustainability • Growth',
    statsProjects: '500+',
    statsCountries: '50+',
    statsYears: '25+'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const settings = await apiClient.getSiteSettings();
        
        // Extract hero settings from site settings
        const heroSettings = settings.reduce((acc: Record<string, string>, setting: SiteSetting) => {
          if (setting.setting_key.startsWith('hero_')) {
            acc[setting.setting_key] = setting.setting_value;
          }
          return acc;
        }, {});

        setHeroData({
          title: heroSettings.hero_title || 'ASTRO FORGE HOLDINGS',
          subtitle: heroSettings.hero_subtitle || 'Building Tomorrow\'s Infrastructure Through Innovation, Sustainability, and Strategic Investment',
          ctaText: heroSettings.hero_cta_text || 'Discover More',
          ctaLink: heroSettings.hero_cta_link || '/about',
          backgroundImages: heroSettings.hero_background_images ? JSON.parse(heroSettings.hero_background_images) : ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
          badgeText: heroSettings.hero_badge_text || 'Innovation • Sustainability • Growth',
          statsProjects: heroSettings.hero_stats_projects || '500+',
          statsCountries: heroSettings.hero_stats_countries || '50+',
          statsYears: heroSettings.hero_stats_years || '25+'
        });
      } catch (error) {
        console.error('Failed to fetch hero data:', error);
        // Keep default values if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroData.backgroundImages.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [heroData.backgroundImages.length]);

  if (loading) {
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-astro-blue to-blue-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white border-t-transparent"></div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Image Slider */}
      <div className="absolute inset-0">
        {heroData.backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-blue-900/50 to-slate-900/70"></div>
          </div>
        ))}
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-astro-blue/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-astro-gold/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-white/90 text-sm font-medium">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>{heroData.badgeText}</span>
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-poppins text-white leading-tight">
              <span className="bg-gradient-to-r from-white via-astro-gold to-blue-300 bg-clip-text text-transparent">
                ASTRO FORGE HOLDINGS
              </span>
            </h1>
          </div>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 font-roboto max-w-4xl mx-auto leading-relaxed font-light">
            {heroData.subtitle}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8">
            <Link to={heroData.ctaLink}>
              <button className="group bg-astro-gold hover:bg-yellow-400 text-slate-900 font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-3 text-lg">
                <span>{heroData.ctaText}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-astro-gold mb-2">{heroData.statsProjects}</div>
              <div className="text-white/70 text-sm uppercase tracking-wider">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-astro-gold mb-2">{heroData.statsCountries}</div>
              <div className="text-white/70 text-sm uppercase tracking-wider">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-astro-gold mb-2">{heroData.statsYears}</div>
              <div className="text-white/70 text-sm uppercase tracking-wider">Years Experience</div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {heroData.backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            title={`Go to slide ${index + 1}`}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-astro-gold shadow-lg scale-125' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center space-y-2 text-white/50">
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-white/50 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
