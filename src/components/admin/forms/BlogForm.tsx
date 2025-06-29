import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { apiClient } from '../../../integrations/api/client';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../hooks/use-toast';

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

interface BlogFormProps {
  post?: BlogPost;
  onSave?: () => void;
}

const BlogForm: React.FC<BlogFormProps> = ({ post, onSave }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    author: '',
    tags: '',
    is_published: true
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch blog post data when editing
  useEffect(() => {
    const fetchBlogPost = async () => {
      if (id && !post) {
        try {
          setInitialLoading(true);
          const data = await apiClient.getBlogPostById(id);
          setFormData(data);
        } catch (error) {
          console.error('Error fetching blog post:', error);
          setError('Failed to load blog post data');
          toast({
            title: "Error",
            description: "Failed to load blog post data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setInitialLoading(false);
        }
      } else if (post) {
        setFormData(post);
      }
    };

    fetchBlogPost();
  }, [id, post, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id || post?.id) {
        // Update existing post
        const postId = id || post?.id;
        await apiClient.updateBlogPost(postId!, formData);
        toast({
          title: "Success",
          description: "Blog post updated successfully!",
          variant: "default",
        });
      } else {
        // Create new post - ensure required fields are present
        const createData = {
          title: formData.title || '',
          slug: formData.slug || '',
          excerpt: formData.excerpt || '',
          content: formData.content || '',
          featured_image: formData.featured_image || '',
          author: formData.author || '',
          tags: formData.tags || '',
          is_published: formData.is_published ?? true
        };
        await apiClient.createBlogPost(createData);
        toast({
          title: "Success",
          description: "Blog post created successfully!",
          variant: "default",
        });
      }
      
      onSave?.();
      // Navigate back to blog list after successful save
      navigate('/admin/blog');
    } catch (error) {
      console.error('Error saving blog post:', error);
      setError('Failed to save blog post');
      toast({
        title: "Error",
        description: "Failed to save blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof BlogPost, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    handleInputChange('title', title);
    if (!id && !post?.id) { // Only auto-generate slug for new posts
      handleInputChange('slug', generateSlug(title));
    }
  };

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/blog')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blog</span>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {id || post ? 'Edit Blog Post' : 'Create New Post'}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug || ''}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt || ''}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                rows={3}
                placeholder="Brief description of the post..."
              />
            </div>

            <div>
              <Label htmlFor="featured_image">Featured Image URL</Label>
              <Input
                id="featured_image"
                value={formData.featured_image || ''}
                onChange={(e) => handleInputChange('featured_image', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content || ''}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={12}
                placeholder="Blog post content..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author || ''}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags || ''}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="is_published"
                type="checkbox"
                checked={formData.is_published || false}
                onChange={(e) => handleInputChange('is_published', e.target.checked)}
                className="h-4 w-4"
                aria-label="Published status"
                title="Toggle post published status"
              />
              <Label htmlFor="is_published">Published</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin/blog')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : (id || post ? 'Update Post' : 'Create Post')}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogForm;
