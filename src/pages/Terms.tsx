import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { apiClient } from '../integrations/api/client';

interface TermsOfService {
  id: number;
  title: string;
  content: string;
  last_updated: string;
  created_at: string;
}

const Terms = () => {
  const [termsData, setTermsData] = useState<TermsOfService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTermsOfService = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getTermsOfService();
        setTermsData(data);
      } catch (err) {
        console.error('Failed to fetch terms of service:', err);
        setError('Failed to load terms of service. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTermsOfService();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="pt-20 pb-16 bg-gradient-to-br from-astro-blue to-blue-800 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="mt-4 text-white">Loading terms of service...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !termsData) {
    return (
      <Layout>
        <div className="pt-20 pb-16 bg-gradient-to-br from-astro-blue to-blue-800 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
                <p>{error || 'Terms of service not available'}</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-20 pb-16 bg-gradient-to-br from-astro-blue to-blue-800 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center fade-in-scroll">
            <h1 className="text-5xl md:text-6xl font-bold font-poppins text-white mb-6">
              {termsData.title}
            </h1>
            <p className="text-sm text-blue-100">
              Last updated: {new Date(termsData.last_updated).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div 
              className="prose prose-lg max-w-none prose-slate dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: termsData.content }}
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms; 