import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { apiClient, CareerApplicationProcess } from '../../../integrations/api/client';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../hooks/use-toast';

interface CareerApplicationProcessFormProps {
  process?: CareerApplicationProcess;
  onSave?: () => void;
  onCancel?: () => void;
}

const CareerApplicationProcessForm: React.FC<CareerApplicationProcessFormProps> = ({ process, onSave, onCancel }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [formData, setFormData] = useState<Partial<CareerApplicationProcess>>({
    step_number: 1,
    title: '',
    description: '',
    estimated_duration: '',
    display_order: 0,
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch process data when editing
  useEffect(() => {
    const fetchProcess = async () => {
      if (id && !process) {
        try {
          setInitialLoading(true);
          const data = await apiClient.getCareerApplicationProcessById(id);
          setFormData(data);
        } catch (error) {
          console.error('Error fetching application process:', error);
          setError('Failed to load application process data');
          toast({
            title: "Error",
            description: "Failed to load application process data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setInitialLoading(false);
        }
      } else if (process) {
        setFormData(process);
      }
    };

    fetchProcess();
  }, [id, process, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id || process?.id) {
        // Update existing process step
        const processId = id || process?.id;
        await apiClient.updateCareerApplicationProcess(processId!, formData);
        toast({
          title: "Success",
          description: "Application process step updated successfully!",
          variant: "default",
        });
      } else {
        // Create new process step
        const createData = {
          step_number: formData.step_number || 1,
          title: formData.title || '',
          description: formData.description || '',
          estimated_duration: formData.estimated_duration || '',
          display_order: formData.display_order ?? 0,
          is_active: formData.is_active ?? true
        };
        await apiClient.createCareerApplicationProcess(createData);
        toast({
          title: "Success",
          description: "Application process step created successfully!",
          variant: "default",
        });
      }
      
      onSave?.();
      navigate('/admin/careers');
    } catch (error) {
      console.error('Error saving application process step:', error);
      setError('Failed to save application process step');
      toast({
        title: "Error",
        description: "Failed to save application process step. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CareerApplicationProcess, value: string | number | boolean) => {
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
            {id || process ? 'Edit Application Process Step' : 'Create New Application Process Step'}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Process Step Details</CardTitle>
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
                <Label htmlFor="step_number">Step Number *</Label>
                <Input
                  id="step_number"
                  type="number"
                  value={formData.step_number || 1}
                  onChange={(e) => handleInputChange('step_number', parseInt(e.target.value) || 1)}
                  required
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  placeholder="e.g., Application Review, Interview, Final Decision"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                required
                placeholder="Describe what happens in this step of the application process..."
              />
            </div>

            <div>
              <Label htmlFor="estimated_duration">Estimated Duration</Label>
              <Input
                id="estimated_duration"
                value={formData.estimated_duration || ''}
                onChange={(e) => handleInputChange('estimated_duration', e.target.value)}
                placeholder="e.g., 1-2 weeks, 3-5 business days"
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
                <span>{loading ? 'Saving...' : (id || process ? 'Update Process Step' : 'Create Process Step')}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerApplicationProcessForm; 