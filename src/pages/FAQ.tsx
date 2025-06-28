import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { apiClient } from '../integrations/api/client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Badge } from '../components/ui/badge';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const FAQ = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getFaqs();
        setFaqs(data || []);
      } catch (err) {
        console.error('Failed to fetch FAQs:', err);
        setError('Failed to load FAQs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  const filteredFaqs = faqs.filter(faq => 
    selectedCategory === 'all' || faq.category === selectedCategory
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      'General': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Services': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Projects': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Contact': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Careers': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  if (loading) {
    return (
      <Layout>
        <div className="pt-20 pb-16 bg-gradient-to-br from-astro-blue to-blue-800 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="mt-4 text-white">Loading FAQs...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="pt-20 pb-16 bg-gradient-to-br from-astro-blue to-blue-800 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
                <p>{error}</p>
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
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Find answers to common questions about our services, projects, and company.
            </p>
          </div>
        </div>
      </div>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Category Filter */}
            {categories.length > 1 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2 justify-center">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-astro-blue text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="mb-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Showing {filteredFaqs.length} of {faqs.length} questions
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              </p>
            </div>

            {/* FAQs */}
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {faqs.length === 0 
                      ? 'No FAQs available at the moment. Check back soon!'
                      : `No FAQs found in the ${selectedCategory} category.`
                    }
                  </p>
                  {selectedCategory !== 'all' && (
                    <button 
                      onClick={() => setSelectedCategory('all')}
                      className="text-astro-blue hover:text-blue-700 transition-colors"
                    >
                      View all categories
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={faq.id} value={`item-${index}`} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center space-x-3 text-left">
                        <Badge className={getCategoryColor(faq.category)}>
                          {faq.category}
                        </Badge>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {faq.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div 
                        className="prose prose-sm max-w-none prose-slate dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            {/* Contact CTA */}
            <div className="mt-16 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Still have questions?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Can't find what you're looking for? Our team is here to help. Get in touch with us and we'll get back to you as soon as possible.
              </p>
              <a 
                href="/contact"
                className="inline-flex items-center bg-astro-blue hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ; 