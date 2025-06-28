import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { apiClient, CareerRequirement } from '../../../integrations/api/client';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../hooks/use-toast';

interface CareerRequirementFormProps {
  requirement?: CareerRequirement;
  onSave?: () => void;
  onCancel?: () => void;
}

const CareerRequirementForm: React.FC<CareerRequirementFormProps> = ({ requirement, onSave, onCancel }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [formData, setFormData] = useState<Partial<CareerRequirement>>({
    title: '',
    description: '',
    category: '',
    display_order: 0,
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch requirement data when editing
  useEffect(() => {
    const fetchRequirement = async () => {
      if (id && !requirement) {
        try {
          setInitialLoading(true);
          const data = await apiClient.getCareerRequirementById(id);
          setFormData(data);
        } catch (error) {
          console.error('Error fetching requirement:', error);
          setError('Failed to load requirement data');
          toast({
            title: "Error",
            description: "Failed to load requirement data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setInitialLoading(false);
        }
      } else if (requirement) {
        setFormData(requirement);
      }
    };

    fetchRequirement();
  }, [id, requirement, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id || requirement?.id) {
        // Update existing requirement
        const requirementId = id || requirement?.id;
        await apiClient.updateCareerRequirement(requirementId!, formData);
        toast({
          title: "Success",
          description: "Requirement updated successfully!",
          variant: "default",
        });
      } else {
        // Create new requirement
        const createData = {
          title: formData.title || '',
          description: formData.description || '',
          category: formData.category || '',
          display_order: formData.display_order ?? 0,
          is_active: formData.is_active ?? true
        };
        await apiClient.createCareerRequirement(createData);
        toast({
          title: "Success",
          description: "Requirement created successfully!",
          variant: "default",
        });
      }
      
      onSave?.();
      navigate('/admin/careers');
    } catch (error) {
      console.error('Error saving requirement:', error);
      setError('Failed to save requirement');
      toast({
        title: "Error",
        description: "Failed to save requirement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CareerRequirement, value: string | number | boolean) => {
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
            {id || requirement ? 'Edit Requirement' : 'Create New Requirement'}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Requirement Details</CardTitle>
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
                placeholder="e.g., Bachelor's Degree, 3+ Years Experience, Technical Skills"
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
                placeholder="Describe the requirement in detail..."
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="e.g., Education, Experience, Skills, Certifications"
              />
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
                <span>{loading ? 'Saving...' : (id || requirement ? 'Update Requirement' : 'Create Requirement')}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerRequirementForm; 