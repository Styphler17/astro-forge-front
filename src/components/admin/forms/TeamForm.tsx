import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { apiClient } from '../../../integrations/api/client';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../hooks/use-toast';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image_url?: string;
  email?: string;
  linkedin_url?: string;
  twitter_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TeamFormProps {
  member?: TeamMember;
  onSave?: () => void;
  onCancel?: () => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ member, onSave, onCancel }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    position: '',
    bio: '',
    image_url: '',
    email: '',
    linkedin_url: '',
    twitter_url: '',
    display_order: 0,
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch team member data when editing
  useEffect(() => {
    const fetchTeamMember = async () => {
      if (id && !member) {
        try {
          setInitialLoading(true);
          const data = await apiClient.getTeamMemberById(id);
          setFormData(data);
        } catch (error) {
          console.error('Error fetching team member:', error);
          setError('Failed to load team member data');
          toast({
            title: "Error",
            description: "Failed to load team member data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setInitialLoading(false);
        }
      } else if (member) {
        setFormData(member);
      }
    };

    fetchTeamMember();
  }, [id, member, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id || member?.id) {
        // Update existing member
        const memberId = id || member?.id;
        await apiClient.updateTeamMember(memberId!, formData);
        toast({
          title: "Success",
          description: "Team member updated successfully!",
          variant: "default",
        });
      } else {
        // Create new member - ensure required fields are present
        const createData = {
          name: formData.name || '',
          position: formData.position || '',
          bio: formData.bio || '',
          image_url: formData.image_url || '',
          email: formData.email || '',
          linkedin_url: formData.linkedin_url || '',
          twitter_url: formData.twitter_url || '',
          display_order: formData.display_order ?? 0,
          is_active: formData.is_active ?? true
        };
        await apiClient.createTeamMember(createData);
        toast({
          title: "Success",
          description: "Team member created successfully!",
          variant: "default",
        });
      }
      
      onSave?.();
      // Navigate back to team list after successful save
      navigate('/admin/team');
    } catch (error) {
      console.error('Error saving team member:', error);
      setError('Failed to save team member');
      toast({
        title: "Error",
        description: "Failed to save team member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof TeamMember, value: string | number | boolean) => {
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
            onClick={() => navigate('/admin/team')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Team</span>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {id || member ? 'Edit Team Member' : 'Add New Team Member'}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Member Details</CardTitle>
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
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={formData.position || ''}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                placeholder="Team member bio..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="team@astroforge.com"
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
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  value={formData.linkedin_url || ''}
                  onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <Label htmlFor="twitter_url">Twitter URL</Label>
                <Input
                  id="twitter_url"
                  value={formData.twitter_url || ''}
                  onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <input
                  id="is_active"
                  type="checkbox"
                  checked={formData.is_active || false}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="h-4 w-4"
                  aria-label="Active status"
                  title="Toggle team member active status"
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
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
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin/team')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : (id || member ? 'Update Member' : 'Create Member')}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamForm;
