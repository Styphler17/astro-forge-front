import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { apiClient, Page } from '../../../integrations/api/client';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../hooks/use-toast';

interface PageFormProps {
  page?: Page;
  onSave?: () => void;
}

const PageForm: React.FC<PageFormProps> = ({ page, onSave }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [formData, setFormData] = useState<Partial<Page>>({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    is_published: false
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch page data when editing
  useEffect(() => {
    const fetchPage = async () => {
      if (id && !page) {
        try {
          setInitialLoading(true);
          const pageData = await apiClient.getPageById(id);
          setFormData({
            ...pageData,
            is_published: Boolean(pageData.is_published)
          });
        } catch (error) {
          console.error('Error fetching page:', error);
          setError('Failed to load page data');
          toast({
            title: "Error",
            description: "Failed to load page data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setInitialLoading(false);
        }
      } else if (page) {
        setFormData(page);
      }
    };

    fetchPage();
  }, [id, page, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id || page?.id) {
        // Update existing page
        const pageId = id || page?.id;
        await apiClient.updatePage(pageId!, formData);
        toast({
          title: "Success",
          description: "Page updated successfully!",
          variant: "default",
        });
      } else {
        // Create new page
        const createData = {
          title: formData.title || '',
          slug: formData.slug || '',
          content: formData.content || '',
          meta_description: formData.meta_description || '',
          is_published: formData.is_published ?? false
        };
        await apiClient.createPage(createData);
        toast({
          title: "Success",
          description: "Page created successfully!",
          variant: "default",
        });
      }
      
      onSave?.();
      navigate('/admin/pages');
    } catch (error) {
      console.error('Error saving page:', error);
      setError('Failed to save page');
      toast({
        title: "Error",
        description: "Failed to save page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Page, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    handleInputChange('title', title);
    // Auto-generate slug if it's empty or hasn't been manually edited
    if (!formData.slug || formData.slug === generateSlug(formData.title || '')) {
      handleInputChange('slug', generateSlug(title));
    }
  };

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
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
            onClick={() => navigate('/admin/pages')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Pages</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>{page ? 'Edit Page' : 'Create New Page'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter page title..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug || ''}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="page-url-slug"
                  required
                />
                <p className="text-xs text-gray-500">
                  This will be the URL: /{formData.slug || 'page-url-slug'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description || ''}
                onChange={(e) => handleInputChange('meta_description', e.target.value)}
                placeholder="Enter meta description for SEO..."
                rows={3}
              />
              <p className="text-xs text-gray-500">
                {formData.meta_description?.length || 0}/160 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Page Content *</Label>
              <Textarea
                id="content"
                value={formData.content || ''}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Enter page content..."
                rows={15}
                required
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                You can use HTML tags for formatting. Example: &lt;h2&gt;Heading&lt;/h2&gt;, &lt;p&gt;Paragraph&lt;/p&gt;
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published ?? false}
                onChange={(e) => handleInputChange('is_published', e.target.checked)}
                className="rounded border-gray-300"
                title="Toggle page published status"
              />
              <Label htmlFor="is_published">Published</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/pages')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-astro-blue text-white hover:bg-astro-blue/80 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save Page'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageForm;
