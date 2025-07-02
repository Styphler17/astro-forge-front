import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Plus, Edit, Trash2, Eye, Search, Calendar, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { apiClient } from '../../integrations/api/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import RefreshButton from '../ui/refresh-button';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featured_image?: string;
  author?: string;
  tags?: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

const BlogManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPosts = useCallback(async () => {
    try {
      setRefreshing(true);
      
      // Add a small delay to make the spinning animation visible
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = await apiClient.getBlogPosts();
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "Error",
        description: "Failed to load blog posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const deletePost = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;

    try {
      await apiClient.deleteBlogPost(id);
      toast({
        title: "Success",
        description: `Blog post "${title}" has been deleted successfully.`,
        variant: "default",
      });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean, title: string) => {
    try {
      await apiClient.updateBlogPost(id, { 
        is_published: !currentStatus,
        published_at: !currentStatus ? new Date().toISOString() : undefined
      });
      const action = currentStatus ? 'unpublished' : 'published';
      toast({
        title: "Success",
        description: `Blog post "${title}" has been ${action} successfully.`,
        variant: "default",
      });
      fetchPosts();
    } catch (error) {
      console.error('Error updating blog post status:', error);
      toast({
        title: "Error",
        description: "Failed to update blog post status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={`blog-skeleton-${i}`} className="h-64 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your blog content and articles ({posts.length} total)
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <RefreshButton 
            onClick={fetchPosts}
            refreshing={refreshing}
            title="Refresh posts"
          />
          <Button 
            onClick={() => navigate('/admin/blog/new')}
            className="bg-astro-blue text-white hover:bg-astro-blue/80 flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span>New Post</span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts by title, slug, or excerpt..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-astro-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                <Badge 
                  variant={post.is_published ? "default" : "secondary"}
                  className="ml-2"
                >
                  {post.is_published ? 'Published' : 'Draft'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                {post.excerpt || 'No excerpt available'}
              </p>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{post.author || 'Unknown'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePublished(post.id, post.is_published, post.title)}
                  className="flex-1"
                >
                  {post.is_published ? 'Unpublish' : 'Publish'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deletePost(post.id, post.title)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No posts found matching your search.' : 'No blog posts yet. Create your first post!'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => navigate('/admin/blog/new')}
                className="mt-4 bg-astro-blue text-white hover:bg-astro-blue/80"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Post
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlogManager;
