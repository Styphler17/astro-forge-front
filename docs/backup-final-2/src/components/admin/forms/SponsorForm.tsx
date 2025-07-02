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

interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  description?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface SponsorFormProps {
  sponsor?: Sponsor;
  onSave?: () => void;
}

const SponsorForm: React.FC<SponsorFormProps> = ({ sponsor, onSave }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [formData, setFormData] = useState<Partial<Sponsor>>({
    name: '',
    logo_url: '',
    website_url: '',
    description: '',
    is_active: true,
    display_order: 0
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch sponsor data when editing
  useEffect(() => {
    const fetchSponsor = async () => {
      if (id && !sponsor) {
        try {
          setInitialLoading(true);
          const data = await apiClient.getSponsorById(id);
          setFormData(data as Partial<Sponsor>);
        } catch (error) {
          console.error('Error fetching sponsor:', error);
          setError('Failed to load sponsor data');
          toast({
            title: "Error",
            description: "Failed to load sponsor data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setInitialLoading(false);
        }
      } else if (sponsor) {
        setFormData(sponsor);
      }
    };

    fetchSponsor();
  }, [id, sponsor, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id || sponsor?.id) {
        // Update existing sponsor
        const sponsorId = id || sponsor?.id;
        await apiClient.updateSponsor(sponsorId!, formData);
        toast({
          title: "Success",
          description: "Sponsor updated successfully!",
          variant: "default",
        });
      } else {
        // Create new sponsor - ensure required fields are present
        const createData = {
          name: formData.name || '',
          logo_url: formData.logo_url || '',
          website_url: formData.website_url || '',
          description: formData.description || '',
          is_active: formData.is_active ?? true,
          display_order: formData.display_order ?? 0
        };
        await apiClient.createSponsor(createData);
        toast({
          title: "Success",
          description: "Sponsor created successfully!",
          variant: "default",
        });
      }
      
      onSave?.();
      // Navigate back to sponsors list after successful save
      navigate('/admin/sponsors');
    } catch (error) {
      console.error('Error saving sponsor:', error);
      setError('Failed to save sponsor');
      toast({
        title: "Error",
        description: "Failed to save sponsor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Sponsor, value: string | number | boolean) => {
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
            onClick={() => navigate('/admin/sponsors')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Sponsors</span>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {id || sponsor ? 'Edit Sponsor' : 'Add New Sponsor'}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sponsor Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="name">Sponsor Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                placeholder="Company Name"
              />
            </div>

            <div>
              <Label htmlFor="logo_url">Logo URL *</Label>
              <Input
                id="logo_url"
                value={formData.logo_url || ''}
                onChange={(e) => handleInputChange('logo_url', e.target.value)}
                required
                placeholder="https://example.com/logo.png"
              />
              {formData.logo_url && (
                <div className="mt-2">
                  <Label className="text-sm text-gray-600">Logo Preview:</Label>
                  <div className="mt-1 w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img
                      src={formData.logo_url}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="website_url">Website URL</Label>
              <Input
                id="website_url"
                value={formData.website_url || ''}
                onChange={(e) => handleInputChange('website_url', e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                placeholder="Brief description of the sponsor..."
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
                onClick={() => navigate('/admin/sponsors')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : (id || sponsor ? 'Update Sponsor' : 'Create Sponsor')}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SponsorForm; 