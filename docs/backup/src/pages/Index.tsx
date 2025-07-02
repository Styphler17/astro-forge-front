import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import ServicesSection from '../components/ServicesSection';
import TeamMemberCard from '../components/TeamMemberCard';
import SponsorsCarousel from '../components/SponsorsCarousel';
import BackToTop from '../components/BackToTop';
import { apiClient, TeamMember } from '../integrations/api/client';

const Index = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getTeamMembers();
        // Filter to show only active team members and sort by display order
        const activeMembers = data
          .filter((member: TeamMember) => member.is_active)
          .sort((a: TeamMember, b: TeamMember) => a.display_order - b.display_order);
        setTeamMembers(activeMembers);
      } catch (err) {
        console.error('Failed to fetch team members:', err);
        setError('Failed to load team members');
        // Fallback to empty array if API fails
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  return (
    <Layout>
      <Hero />
      <ServicesSection />
      
      {/* Team Section */}
      <section id="team" className="py-20 bg-white dark:bg-gray-900">
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
              {[...Array(3)].map((_, index) => (
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
                  bio={member.bio || ''}
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

      {/* Sponsors Section */}
      <section id="sponsors" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Partners & Sponsors
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're proud to work alongside industry leaders who share our vision for sustainable development and innovation.
            </p>
          </div>
          <SponsorsCarousel />
        </div>
      </section>

      <BackToTop />
    </Layout>
  );
};

export default Index;
