import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { apiClient } from '../../integrations/api/client';
import { Mountain, Sprout, Home, Users, GraduationCap, Building2, Shield, Recycle } from 'lucide-react';

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

const iconMap = {
  Sprout,
  Mountain,
  Home,
  Users,
  GraduationCap,
  Building2,
};

const ServiceDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    apiClient.getServiceBySlug(slug)
      .then((data) => {
        setService(data);
        setError(null);
      })
      .catch(() => {
        setError('Service not found');
        setService(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="py-32 text-center text-2xl text-gray-500">Loading service...</div>
      </Layout>
    );
  }

  if (error || !service) {
    return (
      <Layout>
        <div className="py-32 text-center text-2xl text-red-500">{error || 'Service not found'}</div>
        <div className="text-center mt-4">
          <button className="text-astro-blue underline" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </Layout>
    );
  }

  const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Building2;

  return (
    <Layout>
      <div className="pt-20 pb-16 bg-gradient-to-br from-orange-600 to-orange-800 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center fade-in-scroll">
            <IconComponent className="h-20 w-20 text-white mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold font-poppins text-white mb-6">
              {service.title}
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              {service.description}
            </p>
          </div>
        </div>
      </div>
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="slide-in-left">
              <h2 className="text-4xl font-bold font-poppins text-orange-600 dark:text-white mb-6">
                Excellence in {service.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {service.content || service.description}
              </p>
              {/* Example features, you can make this dynamic if you add features to the DB */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-orange-600" />
                  <span className="text-gray-700 dark:text-gray-300">Advanced safety protocols</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Recycle className="h-6 w-6 text-orange-600" />
                  <span className="text-gray-700 dark:text-gray-300">Environmental stewardship</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-orange-600" />
                  <span className="text-gray-700 dark:text-gray-300">Community engagement</span>
                </div>
              </div>
            </div>
            <div className="slide-in-right">
              {service.image_url ? (
                <img
                  src={service.image_url}
                  alt={service.title}
                  className="rounded-lg shadow-xl"
                />
              ) : (
                <div className="rounded-lg shadow-xl bg-gray-200 dark:bg-gray-800 h-64 flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetails; 