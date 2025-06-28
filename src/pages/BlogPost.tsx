import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar, User, ArrowLeft, Clock, Share2, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import { apiClient } from '../integrations/api/client';
import type { BlogPost } from '../integrations/api/client';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const data = await apiClient.getBlogPostBySlug(slug);
        setPost(data);
        
        // Fetch related posts
        if (data.id) {
          const related = await apiClient.getRelatedBlogPosts(data.id, 3);
          setRelatedPosts(related);
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch blog post:', err);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

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

  const sharePost = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || 'Blog Post';
    const text = post?.excerpt || '';

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} - ${text} ${url}`)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-astro-blue mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading blog post...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
              <p>{error || 'Blog post not found'}</p>
              <div className="mt-4 space-x-2">
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/blog">Back to Blog</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="text-astro-blue hover:text-blue-700">
            <Link to="/blog" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Blog</span>
            </Link>
          </Button>
        </div>

        {/* Blog Post Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-600 dark:text-slate-400 mb-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Astro Forge Team</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.published_at || post.created_at)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{getReadTime(post.content)}</span>
              </div>
            </div>

            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              {post.excerpt}
            </p>
          </div>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="mb-8">
            <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        )}

        {/* Blog Post Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                <div 
                  className="prose prose-slate dark:prose-invert max-w-none prose-lg"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Share Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Share This Post
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    onClick={() => sharePost('facebook')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Share on Facebook
                  </Button>
                  <Button 
                    onClick={() => sharePost('twitter')}
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Share on Twitter
                  </Button>
                  <Button 
                    onClick={() => sharePost('linkedin')}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    Share on LinkedIn
                  </Button>
                  <Button 
                    onClick={() => sharePost('whatsapp')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Share on WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Author Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  About the Author
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-astro-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Astro Forge Team
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Our team of experts brings together decades of experience across multiple industries, 
                    providing insights and innovative solutions for tomorrow's challenges.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Posts Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Related Posts
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Explore more insights and industry perspectives
            </p>
          </div>
          
          {relatedPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {relatedPost.featured_image && (
                    <div className="relative h-48">
                      <img
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(relatedPost.published_at || relatedPost.created_at)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3" />
                        <span>{getReadTime(relatedPost.content)}</span>
                      </div>
                    </div>
                    <Button asChild className="w-full bg-astro-blue hover:bg-blue-700 text-white">
                      <Link to={`/blog/${relatedPost.slug}`}>
                        Read More
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                No related posts available at the moment.
              </p>
            </div>
          )}
          
          <div className="text-center">
            <Button asChild className="bg-astro-blue hover:bg-blue-700 text-white">
              <Link to="/blog">
                View All Posts
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost; 