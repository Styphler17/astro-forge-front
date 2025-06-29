import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { apiClient } from '../../../integrations/api/client';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../hooks/use-toast';

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

interface ServiceFormProps {
  service?: Service;
  onSave?: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSave }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    slug: '',
    description: '',
    content: '',
    icon: '',
    image_url: '',
    is_published: true,
    display_order: 0
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch service data when editing
  useEffect(() => {
    const fetchService = async () => {
      if (id && !service) {
        try {
          setInitialLoading(true);
          const data = await apiClient.getServiceById(id);
          setFormData(data);
        } catch (error) {
          console.error('Error fetching service:', error);
          setError('Failed to load service data');
          toast({
            title: "Error",
            description: "Failed to load service data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setInitialLoading(false);
        }
      } else if (service) {
        setFormData(service);
      }
    };

    fetchService();
  }, [id, service, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id || service?.id) {
        // Update existing service
        const serviceId = id || service?.id;
        await apiClient.updateService(serviceId!, formData);
        toast({
          title: "Success",
          description: "Service updated successfully!",
          variant: "default",
        });
      } else {
        // Create new service - ensure required fields are present
        const createData = {
          title: formData.title || '',
          slug: formData.slug || '',
          description: formData.description || '',
          content: formData.content || '',
          icon: formData.icon || '',
          image_url: formData.image_url || '',
          is_published: formData.is_published ?? true,
          display_order: formData.display_order ?? 0
        };
        await apiClient.createService(createData);
        toast({
          title: "Success",
          description: "Service created successfully!",
          variant: "default",
        });
      }
      
      onSave?.();
      // Navigate back to services list after successful save
      navigate('/admin/services');
    } catch (error) {
      console.error('Error saving service:', error);
      setError('Failed to save service');
      toast({
        title: "Error",
        description: "Failed to save service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Service, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    handleInputChange('title', title);
    if (!id && !service?.id) { // Only auto-generate slug for new services
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
            onClick={() => navigate('/admin/services')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Services</span>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {id || service ? 'Edit Service' : 'Create New Service'}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content || ''}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={6}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="icon">Icon</Label>
                <Select value={formData.icon || ''} onValueChange={(value) => handleInputChange('icon', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mountain">Mountain</SelectItem>
                    <SelectItem value="Sprout">Sprout</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Users">Users</SelectItem>
                    <SelectItem value="GraduationCap">GraduationCap</SelectItem>
                    <SelectItem value="Building2">Building2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url || ''}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order || 0}
                  onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="is_published"
                  type="checkbox"
                  checked={formData.is_published || false}
                  onChange={(e) => handleInputChange('is_published', e.target.checked)}
                  className="rounded"
                  aria-label="Published status"
                  title="Toggle service published status"
                />
                <Label htmlFor="is_published">Published</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin/services')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : (id || service ? 'Update Service' : 'Create Service')}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceForm;
