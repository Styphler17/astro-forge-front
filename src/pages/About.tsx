import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Users, Target, Award, Globe, TrendingUp, Heart, User } from 'lucide-react';
import { apiClient, TeamMember, SiteSetting } from '../integrations/api/client';
import TeamMemberCard from '../components/TeamMemberCard';

interface AboutStats {
  icon: string;
  value: string;
  label: string;
}

interface JourneyItem {
  year: string;
  title: string;
  description: string;
}

interface AboutSettings {
  hero_title: string;
  hero_subtitle: string;
  hero_enabled: boolean;
  vision_title: string;
  vision_content: string;
  vision_enabled: boolean;
  stats_enabled: boolean;
  journey_title: string;
  journey_subtitle: string;
  journey_enabled: boolean;
  stats: AboutStats[];
  timeline: JourneyItem[];
}

const About = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [aboutSettings, setAboutSettings] = useState<AboutSettings>({
    hero_title: 'About Astro Forge Holdings',
    hero_subtitle: 'Building tomorrow\'s infrastructure through innovation, sustainability, and strategic investment across multiple sectors.',
    hero_enabled: true,
    vision_title: 'Our Vision',
    vision_content: 'At Astro Forge Holdings, we envision a future where innovation drives sustainable progress across all sectors of society. Our commitment to excellence and environmental responsibility shapes every decision we make, ensuring that our projects not only meet current needs but also create lasting value for future generations.',
    vision_enabled: true,
    stats_enabled: true,
    journey_title: 'Our Journey',
    journey_subtitle: 'From humble beginnings to global impact - the story of Astro Forge Holdings.',
    journey_enabled: true,
    stats: [
      { icon: 'Users', value: '500+', label: 'Team Members' },
      { icon: 'Target', value: '50+', label: 'Projects Completed' },
      { icon: 'Award', value: '15+', label: 'Years Experience' },
      { icon: 'Globe', value: '10+', label: 'Countries Served' },
      { icon: 'TrendingUp', value: '95%', label: 'Success Rate' },
      { icon: 'Heart', value: '100K+', label: 'Lives Impacted' }
    ],
    timeline: [
      {
        year: '2008',
        title: 'Foundation',
        description: 'Astro Forge Holdings was founded with a vision to revolutionize multiple industries through innovation.'
      },
      {
        year: '2012',
        title: 'First Major Expansion',
        description: 'Expanded into mining and real estate sectors, establishing our multi-industry approach.'
      },
      {
        year: '2016',
        title: 'Sustainability Initiative',
        description: 'Launched comprehensive sustainability programs across all divisions.'
      },
      {
        year: '2020',
        title: 'Digital Transformation',
        description: 'Integrated cutting-edge technology solutions across all operations.'
      },
      {
        year: '2023',
        title: 'Global Presence',
        description: 'Achieved international recognition and expanded operations globally.'
      }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch team members and about settings in parallel
        const [teamData, settingsData] = await Promise.all([
          apiClient.getTeamMembers(),
          apiClient.getSiteSettings()
        ]);

        // Process team members
        const activeMembers = (teamData || [])
          .filter(member => member.is_active)
          .sort((a, b) => a.display_order - b.display_order);
        setTeamMembers(activeMembers);

        // Process about settings
        const aboutSettingsData: Partial<AboutSettings> = {};
        
        settingsData.forEach(setting => {
          if (setting.setting_key.startsWith('about_')) {
            const key = setting.setting_key.replace('about_', '') as keyof AboutSettings;
            if (key === 'stats' || key === 'timeline') {
              try {
                aboutSettingsData[key] = JSON.parse(setting.setting_value);
              } catch (e) {
                console.warn(`Failed to parse ${key}:`, e);
              }
            } else if (key === 'hero_enabled' || key === 'vision_enabled' || key === 'stats_enabled' || key === 'journey_enabled') {
              aboutSettingsData[key] = setting.setting_value === 'true';
            } else {
              aboutSettingsData[key] = setting.setting_value;
            }
          }
        });
        
        setAboutSettings(prev => ({ ...prev, ...aboutSettingsData }));
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load page data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Icon mapping for stats
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    Users,
    Target,
    Award,
    Globe,
    TrendingUp,
    Heart,
    User
  };

  if (loading) {
    return (
      <Layout>
        <div className="pt-20 pb-16 bg-gradient-to-br from-astro-blue to-blue-800 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white border-t-transparent mx-auto mb-4"></div>
              <p className="text-white">Loading...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      {aboutSettings.hero_enabled && (
        <div className="pt-20 pb-16 bg-gradient-to-br from-astro-blue to-blue-800 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold font-poppins text-white mb-6">
                {aboutSettings.hero_title}
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                {aboutSettings.hero_subtitle}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      {aboutSettings.stats_enabled && aboutSettings.stats.length > 0 && (
        <section className="py-16 bg-white/10 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {aboutSettings.stats.map((stat, index) => {
                const IconComponent = iconMap[stat.icon] || User;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-astro-gold rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-astro-blue" />
                    </div>
                    <div className="text-3xl font-bold text-astro-blue dark:text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Vision Section */}
      {aboutSettings.vision_enabled && (
        <section className="py-20 bg-white/10 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold font-poppins text-astro-blue dark:text-white mb-8">
                {aboutSettings.vision_title}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {aboutSettings.vision_content}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Timeline Section */}
      {aboutSettings.journey_enabled && aboutSettings.timeline.length > 0 && (
        <section className="py-20 bg-gray-50/10 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold font-poppins text-astro-blue dark:text-white mb-6">
                {aboutSettings.journey_title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {aboutSettings.journey_subtitle}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {aboutSettings.timeline.map((item, index) => (
                <div key={index} className="flex items-start space-x-8 mb-12">
                  <div className="flex-shrink-0">
                    <div className="bg-astro-gold text-astro-blue font-bold text-lg rounded-full w-16 h-16 flex items-center justify-center">
                      {item.year}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-astro-blue dark:text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Meet the dedicated professionals driving our mission forward with expertise, innovation, and unwavering commitment to excellence.
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 dark:bg-gray-700 rounded-lg h-80"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Unable to load team members at the moment. Please try again later.
              </p>
            </div>
          ) : teamMembers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <TeamMemberCard 
                  key={member.id}
                  name={member.name}
                  position={member.position}
                  bio={member.bio}
                  image={member.image_url || '/placeholder.svg'}
                  linkedin={member.linkedin_url}
                  email={member.email}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No team members available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default About;
