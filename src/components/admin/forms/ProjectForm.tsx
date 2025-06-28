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

interface Project {
  id: string;
  title: string;
  description?: string;
  content?: string;
  image_url?: string;
  project_url?: string;
  github_url?: string;
  technologies?: string;
  status: 'active' | 'completed' | 'in_progress' | 'planning';
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface ProjectFormProps {
  project?: Project;
  onSave?: () => void;
  onCancel?: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave, onCancel }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    content: '',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: '',
    status: 'planning',
    is_published: true,
    display_order: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      setFormData(project);
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (project?.id) {
        // Update existing project
        await apiClient.updateProject(project.id, formData);
        toast({
          title: "Success",
          description: "Project updated successfully!",
          variant: "default",
        });
      } else {
        // Create new project - ensure required fields are present
        const createData = {
          title: formData.title || '',
          description: formData.description || '',
          content: formData.content || '',
          image_url: formData.image_url || '',
          project_url: formData.project_url || '',
          github_url: formData.github_url || '',
          technologies: formData.technologies || '',
          status: formData.status || 'planning',
          is_published: formData.is_published ?? true,
          display_order: formData.display_order ?? 0
        };
        await apiClient.createProject(createData);
        toast({
          title: "Success",
          description: "Project created successfully!",
          variant: "default",
        });
      }
      
      onSave?.();
      // Navigate back to projects list after successful save
      navigate('/admin/projects');
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Failed to save project');
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Project, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/projects')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Projects</span>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {project ? 'Edit Project' : 'Create New Project'}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
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
              />
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
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url || ''}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="project_url">Project URL</Label>
                <Input
                  id="project_url"
                  value={formData.project_url || ''}
                  onChange={(e) => handleInputChange('project_url', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  value={formData.github_url || ''}
                  onChange={(e) => handleInputChange('github_url', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="technologies">Technologies</Label>
                <Input
                  id="technologies"
                  value={formData.technologies || ''}
                  onChange={(e) => handleInputChange('technologies', e.target.value)}
                  placeholder="React, TypeScript, Node.js"
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
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status || 'planning'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-astro-blue focus:border-transparent"
                  title="Select project status"
                >
                  <option value="planning">Planning</option>
                  <option value="in_progress">In Progress</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="is_published"
                type="checkbox"
                checked={formData.is_published || false}
                onChange={(e) => handleInputChange('is_published', e.target.checked)}
                className="rounded"
                aria-label="Published status"
                title="Toggle project published status"
              />
              <Label htmlFor="is_published">Published</Label>
            </div>

            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save Project'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectForm;
