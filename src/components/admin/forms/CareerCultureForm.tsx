import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { apiClient, CareerCulture } from '../../../integrations/api/client';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../hooks/use-toast';

interface CareerCultureFormProps {
  culture?: CareerCulture;
  onSave?: () => void;
  onCancel?: () => void;
}

const CareerCultureForm: React.FC<CareerCultureFormProps> = ({ culture, onSave, onCancel }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [formData, setFormData] = useState<Partial<CareerCulture>>({
    title: '',
    description: '',
    image_url: '',
    display_order: 0,
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch culture data when editing
  useEffect(() => {
    const fetchCulture = async () => {
      if (id && !culture) {
        try {
          setInitialLoading(true);
          const data = await apiClient.getCareerCultureById(id);
          setFormData(data);
        } catch (error) {
          console.error('Error fetching culture item:', error);
          setError('Failed to load culture data');
          toast({
            title: "Error",
            description: "Failed to load culture data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setInitialLoading(false);
        }
      } else if (culture) {
        setFormData(culture);
      }
    };

    fetchCulture();
  }, [id, culture, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id || culture?.id) {
        // Update existing culture item
        const cultureId = id || culture?.id;
        await apiClient.updateCareerCulture(cultureId!, formData);
        toast({
          title: "Success",
          description: "Culture item updated successfully!",
          variant: "default",
        });
      } else {
        // Create new culture item
        const createData = {
          title: formData.title || '',
          description: formData.description || '',
          image_url: formData.image_url || '',
          display_order: formData.display_order ?? 0,
          is_active: formData.is_active ?? true
        };
        await apiClient.createCareerCulture(createData);
        toast({
          title: "Success",
          description: "Culture item created successfully!",
          variant: "default",
        });
      }
      
      onSave?.();
      navigate('/admin/careers');
    } catch (error) {
      console.error('Error saving culture item:', error);
      setError('Failed to save culture item');
      toast({
        title: "Error",
        description: "Failed to save culture item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CareerCulture, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            onClick={() => navigate('/admin/careers')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Careers</span>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {id || culture ? 'Edit Culture Item' : 'Create New Culture Item'}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Culture Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                placeholder="e.g., Innovation Culture, Team Collaboration"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                required
                placeholder="Describe this aspect of your company culture..."
              />
            </div>

            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url || ''}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              {formData.image_url && (
                <div className="mt-2">
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order || 0}
                  onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="is_active"
                  type="checkbox"
                  checked={formData.is_active || false}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="rounded"
                  aria-label="Active status"
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin/careers')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : (id || culture ? 'Update Culture Item' : 'Create Culture Item')}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerCultureForm; 