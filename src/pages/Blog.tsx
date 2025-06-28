import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { apiClient } from '../integrations/api/client';
import FilterBar from '../components/ui/filter-bar';
import { Button } from '../components/ui/button';
import type { BlogPost } from '../integrations/api/client';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at_desc');
  const [filterBy, setFilterBy] = useState('');

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getBlogPosts(true); // Only published posts
        setBlogPosts(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Filter and sort blog posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...blogPosts];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
      );
    }

    // Date filter
    if (filterBy && filterBy !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filterBy) {
        case 'today':
          filterDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(post => {
        const postDate = new Date(post.published_at || post.created_at);
        return postDate >= filterDate;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'created_at_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'created_at_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [blogPosts, searchQuery, sortBy, filterBy]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  const filterOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="pt-20 pb-16 bg-gradient-to-br from-astro-blue to-blue-800 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center fade-in-scroll">
              <h1 className="text-5xl md:text-6xl font-bold font-poppins text-white mb-6">
                Our Blog
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Insights, innovations, and industry perspectives from the experts at Astro Forge Holdings.
              </p>
            </div>
          </div>
        </div>

        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-astro-blue mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading blog posts...</p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="pt-20 pb-16 bg-gradient-to-br from-astro-blue to-blue-800 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center fade-in-scroll">
              <h1 className="text-5xl md:text-6xl font-bold font-poppins text-white mb-6">
                Our Blog
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Insights, innovations, and industry perspectives from the experts at Astro Forge Holdings.
              </p>
            </div>
          </div>
        </div>

        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-20 pb-16 bg-gradient-to-br from-astro-blue to-blue-800 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center fade-in-scroll">
            <h1 className="text-5xl md:text-6xl font-bold font-poppins text-white mb-6">
              Our Blog
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Insights, innovations, and industry perspectives from the experts at Astro Forge Holdings.
            </p>
          </div>
        </div>
      </div>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {/* Filter Bar */}
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            filterBy={filterBy}
            onFilterChange={setFilterBy}
            filterOptions={filterOptions}
            placeholder="Search blog posts..."
          />

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredAndSortedPosts.length} of {blogPosts.length} posts
              {(searchQuery || (filterBy && filterBy !== 'all')) && (
                <span className="ml-2">
                  {searchQuery && `matching "${searchQuery}"`}
                  {filterBy && filterBy !== 'all' && ` from ${filterOptions.find(f => f.value === filterBy)?.label.toLowerCase()}`}
                </span>
              )}
            </p>
          </div>

          {filteredAndSortedPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {blogPosts.length === 0 
                    ? 'No blog posts available at the moment. Check back soon for new content!'
                    : 'No posts match your current filters.'
                  }
                </p>
                {(searchQuery || (filterBy && filterBy !== 'all')) && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setFilterBy('');
                    }}
                    className="text-astro-blue hover:text-blue-700 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedPosts.map((post, index) => (
                <article
                  key={post.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 fade-in-scroll"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.featured_image || '/placeholder.svg'}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-astro-blue text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Blog
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {getReadTime(post.content)}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold font-poppins text-astro-blue dark:text-white mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Astro Forge Team</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.published_at || post.created_at)}</span>
                      </div>
                    </div>
                    
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="flex items-center text-astro-blue hover:text-astro-gold transition-colors duration-300 font-semibold"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
