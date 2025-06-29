import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { apiClient, CareerBenefit } from '../../../integrations/api/client';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../hooks/use-toast';

interface CareerBenefitFormProps {
  benefit?: CareerBenefit;
  onSave?: () => void;
}

const CareerBenefitForm: React.FC<CareerBenefitFormProps> = ({ benefit, onSave }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [formData, setFormData] = useState<Partial<CareerBenefit>>({
    title: '',
    description: '',
    icon: '',
    category: '',
    display_order: 0,
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch benefit data when editing
  useEffect(() => {
    const fetchBenefit = async () => {
      if (id && !benefit) {
        try {
          setInitialLoading(true);
          const data = await apiClient.getCareerBenefitById(id);
          setFormData(data);
        } catch (error) {
          console.error('Error fetching benefit:', error);
          setError('Failed to load benefit data');
          toast({
            title: "Error",
            description: "Failed to load benefit data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setInitialLoading(false);
        }
      } else if (benefit) {
        setFormData(benefit);
      }
    };

    fetchBenefit();
  }, [id, benefit, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id || benefit?.id) {
        // Update existing benefit
        const benefitId = id || benefit?.id;
        await apiClient.updateCareerBenefit(benefitId!, formData);
        toast({
          title: "Success",
          description: "Benefit updated successfully!",
          variant: "default",
        });
      } else {
        // Create new benefit
        const createData = {
          title: formData.title || '',
          description: formData.description || '',
          icon: formData.icon || '',
          category: formData.category || '',
          display_order: formData.display_order ?? 0,
          is_active: formData.is_active ?? true
        };
        await apiClient.createCareerBenefit(createData);
        toast({
          title: "Success",
          description: "Benefit created successfully!",
          variant: "default",
        });
      }
      
      onSave?.();
      navigate('/admin/careers');
    } catch (error) {
      console.error('Error saving benefit:', error);
      setError('Failed to save benefit');
      toast({
        title: "Error",
        description: "Failed to save benefit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CareerBenefit, value: string | number | boolean) => {
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
            {id || benefit ? 'Edit Benefit' : 'Create New Benefit'}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Benefit Details</CardTitle>
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
                placeholder="e.g., Health Insurance, Flexible Hours"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                required
                placeholder="Describe the benefit and what it offers to employees..."
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
                    <SelectItem value="heart">Heart</SelectItem>
                    <SelectItem value="users">Users</SelectItem>
                    <SelectItem value="award">Award</SelectItem>
                    <SelectItem value="star">Star</SelectItem>
                    <SelectItem value="target">Target</SelectItem>
                    <SelectItem value="trending-up">Trending Up</SelectItem>
                    <SelectItem value="clock">Clock</SelectItem>
                    <SelectItem value="graduation-cap">Graduation Cap</SelectItem>
                    <SelectItem value="dollar-sign">Dollar Sign</SelectItem>
                    <SelectItem value="check-circle">Check Circle</SelectItem>
                    <SelectItem value="briefcase">Briefcase</SelectItem>
                    <SelectItem value="map-pin">Map Pin</SelectItem>
                    <SelectItem value="globe">Globe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="e.g., Health, Work-Life Balance, Development"
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
                  min="0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="is_active"
                  type="checkbox"
                  checked={Boolean(formData.is_active)}
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
                <span>{loading ? 'Saving...' : (id || benefit ? 'Update Benefit' : 'Create Benefit')}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerBenefitForm; 