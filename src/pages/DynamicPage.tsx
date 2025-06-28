import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { apiClient } from '../integrations/api/client';

interface Page {
  id: string;
  title: string;
  slug: string;
  content?: string;
  meta_description?: string;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface PageSection {
  type: 'text' | 'html' | 'image' | 'layout';
  title: string;
  content: string;
  order: number;
  is_active: boolean;
}

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    
    const fetchPage = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getPageBySlug(slug);
        
        if (!data || !data.is_published) {
          setError('Page not found or not published');
          return;
        }
        
        setPage(data);
        
        // Parse sections from content
        if (data.content) {
          try {
            const parsedSections = JSON.parse(data.content);
            if (Array.isArray(parsedSections)) {
              setSections(parsedSections.filter((section: PageSection) => section.is_active));
            }
          } catch (e) {
            // If content is not JSON, treat as single text section
            setSections([{
              type: 'text',
              title: 'Content',
              content: data.content,
              order: 1,
              is_active: true
            }]);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch page:', err);
        setError('Page not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  const renderSection = (section: PageSection) => {
    switch (section.type) {
      case 'text':
        return (
          <div key={section.order} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {section.title}
            </h2>
            <div 
              className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>
        );
      
      case 'html':
        return (
          <div key={section.order} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {section.title}
            </h2>
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>
        );
      
      case 'image':
        return (
          <div key={section.order} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {section.title}
            </h2>
            <img 
              src={section.content} 
              alt={section.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        );
      
      case 'layout':
        return (
          <div key={section.order} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {section.title}
            </h2>
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="pt-20 pb-16 bg-gradient-to-br from-astro-blue to-blue-800 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="mt-4 text-white">Loading page...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !page) {
    return (
      <Layout>
        <div className="pt-20 pb-16 bg-gradient-to-br from-astro-blue to-blue-800 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
              <p className="text-white mb-6">{error || 'The page you are looking for does not exist.'}</p>
              <button 
                onClick={() => navigate('/')}
                className="bg-white text-astro-blue px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Go Home
              </button>
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
              {page.title}
            </h1>
            {page.meta_description && (
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                {page.meta_description}
              </p>
            )}
          </div>
        </div>
      </div>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {sections.length > 0 ? (
              sections
                .sort((a, b) => a.order - b.order)
                .map(renderSection)
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  This page has no content yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DynamicPage; 