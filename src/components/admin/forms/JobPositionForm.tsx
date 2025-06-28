import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { apiClient, JobPosition } from '../../../integrations/api/client';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../hooks/use-toast';

interface JobPositionFormProps {
  jobPosition?: JobPosition;
  onSave?: () => void;
  onCancel?: () => void;
}

const JobPositionForm: React.FC<JobPositionFormProps> = ({ jobPosition, onSave, onCancel }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [formData, setFormData] = useState<Partial<JobPosition>>({
    title: '',
    department: '',
    location: '',
    employment_type: 'full-time',
    experience_level: '',
    description: '',
    requirements: [],
    benefits: [],
    is_active: true,
    display_order: 0
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newRequirement, setNewRequirement] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  // Fetch job position data when editing
  useEffect(() => {
    const fetchJobPosition = async () => {
      if (id && !jobPosition) {
        try {
          setInitialLoading(true);
          const data = await apiClient.getJobPositionById(id);
          setFormData(data);
        } catch (error) {
          console.error('Error fetching job position:', error);
          setError('Failed to load job position data');
          toast({
            title: "Error",
            description: "Failed to load job position data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setInitialLoading(false);
        }
      } else if (jobPosition) {
        setFormData(jobPosition);
      }
    };

    fetchJobPosition();
  }, [id, jobPosition, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id || jobPosition?.id) {
        // Update existing job position
        const jobId = id || jobPosition?.id;
        await apiClient.updateJobPosition(jobId!, formData);
        toast({
          title: "Success",
          description: "Job position updated successfully!",
          variant: "default",
        });
      } else {
        // Create new job position
        const createData = {
          title: formData.title || '',
          department: formData.department || '',
          location: formData.location || '',
          employment_type: formData.employment_type || 'full-time',
          experience_level: formData.experience_level || '',
          description: formData.description || '',
          requirements: formData.requirements || [],
          benefits: formData.benefits || [],
          is_active: formData.is_active ?? true,
          display_order: formData.display_order ?? 0
        };
        await apiClient.createJobPosition(createData);
        toast({
          title: "Success",
          description: "Job position created successfully!",
          variant: "default",
        });
      }
      
      onSave?.();
      navigate('/admin/careers');
    } catch (error) {
      console.error('Error saving job position:', error);
      setError('Failed to save job position');
      toast({
        title: "Error",
        description: "Failed to save job position. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof JobPosition, value: string | number | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      const updatedRequirements = [...(formData.requirements || []), newRequirement.trim()];
      handleInputChange('requirements', updatedRequirements);
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    const updatedRequirements = (formData.requirements || []).filter((_, i) => i !== index);
    handleInputChange('requirements', updatedRequirements);
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      const updatedBenefits = [...(formData.benefits || []), newBenefit.trim()];
      handleInputChange('benefits', updatedBenefits);
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    const updatedBenefits = (formData.benefits || []).filter((_, i) => i !== index);
    handleInputChange('benefits', updatedBenefits);
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
            {id || jobPosition ? 'Edit Job Position' : 'Create New Job Position'}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Position Details</CardTitle>
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
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  value={formData.department || ''}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="employment_type">Employment Type *</Label>
                <Select value={formData.employment_type || 'full-time'} onValueChange={(value) => handleInputChange('employment_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="experience_level">Experience Level</Label>
              <Input
                id="experience_level"
                value={formData.experience_level || ''}
                onChange={(e) => handleInputChange('experience_level', e.target.value)}
                placeholder="e.g., 2+ years, Entry Level, Senior"
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
                placeholder="Describe the role, responsibilities, and what makes this position exciting..."
              />
            </div>

            {/* Requirements Section */}
            <div>
              <Label>Requirements</Label>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    placeholder="Add a requirement..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  />
                  <Button type="button" onClick={addRequirement} className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </Button>
                </div>
                <div className="space-y-2">
                  {(formData.requirements || []).map((req, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="flex-1 text-sm">{req}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeRequirement(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div>
              <Label>Benefits</Label>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="Add a benefit..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                  />
                  <Button type="button" onClick={addBenefit} className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </Button>
                </div>
                <div className="space-y-2">
                  {(formData.benefits || []).map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="flex-1 text-sm">{benefit}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeBenefit(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
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
                <span>{loading ? 'Saving...' : (id || jobPosition ? 'Update Position' : 'Create Position')}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobPositionForm; 