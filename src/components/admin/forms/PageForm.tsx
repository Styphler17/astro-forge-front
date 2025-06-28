import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { apiClient } from '../../../integrations/api/client';
import { ArrowLeft, Save, Plus, Trash2, Eye, Code, Type, Image, Layout } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../hooks/use-toast';

interface Page {
  id: string;
  title: string;
  slug: string;
  content?: string;
  meta_description?: string;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface PageSection {
  id?: string;
  type: 'text' | 'html' | 'image' | 'layout';
  title: string;
  content: string;
  order: number;
  is_active: boolean;
}

interface PageFormProps {
  page?: Page;
  onSave?: () => void;
  onCancel?: () => void;
}

const PageForm: React.FC<PageFormProps> = ({ page, onSave, onCancel }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [formData, setFormData] = useState<Partial<Page>>({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    is_published: true,
    display_order: 0
  });
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'sections'>('content');

  useEffect(() => {
    if (page) {
      setFormData(page);
      // Initialize sections from page content if available
      if (page.content) {
        try {
          const parsedSections = JSON.parse(page.content);
          if (Array.isArray(parsedSections)) {
            setSections(parsedSections);
          }
        } catch (e) {
          // If content is not JSON, treat it as a single text section
          setSections([{
            type: 'text',
            title: 'Main Content',
            content: page.content,
            order: 1,
            is_active: true
          }]);
        }
      }
    }
  }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert sections to JSON for storage
      const sectionsContent = JSON.stringify(sections);
      const submitData = {
        ...formData,
        content: sectionsContent
      };

      if (page?.id) {
        // Update existing page
        await apiClient.updatePage(page.id, submitData);
        toast({
          title: "Success",
          description: "Page updated successfully!",
          variant: "default",
        });
      } else {
        // Create new page - ensure required fields are present
        const createData = {
          title: formData.title || '',
          slug: formData.slug || '',
          content: sectionsContent,
          meta_description: formData.meta_description || '',
          is_published: formData.is_published ?? true,
          display_order: formData.display_order ?? 0
        };
        await apiClient.createPage(createData);
        toast({
          title: "Success",
          description: "Page created successfully!",
          variant: "default",
        });
      }
      
      onSave?.();
      // Navigate back to pages list after successful save
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

  const handleInputChange = (field: keyof Page, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    handleInputChange('title', title);
    if (!page?.id) { // Only auto-generate slug for new pages
      handleInputChange('slug', generateSlug(title));
    }
  };

  // Section management functions
  const addSection = () => {
    const newSection: PageSection = {
      type: 'text',
      title: `Section ${sections.length + 1}`,
      content: '',
      order: sections.length + 1,
      is_active: true
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (index: number, field: keyof PageSection, value: any) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setSections(updatedSections);
  };

  const removeSection = (index: number) => {
    if (confirm('Are you sure you want to remove this section?')) {
      const updatedSections = sections.filter((_, i) => i !== index);
      // Reorder remaining sections
      updatedSections.forEach((section, i) => {
        section.order = i + 1;
      });
      setSections(updatedSections);
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sections.length - 1)) {
      return;
    }

    const updatedSections = [...sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedSections[index], updatedSections[newIndex]] = [updatedSections[newIndex], updatedSections[index]];
    
    // Update order numbers
    updatedSections.forEach((section, i) => {
      section.order = i + 1;
    });
    
    setSections(updatedSections);
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type className="h-4 w-4" />;
      case 'html': return <Code className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'layout': return <Layout className="h-4 w-4" />;
      default: return <Type className="h-4 w-4" />;
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {page ? 'Edit Page' : 'Create New Page'}
          </h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'content' 
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Page Details
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'sections' 
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Sections ({sections.length})
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{activeTab === 'content' ? 'Page Details' : 'Page Sections'}</CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === 'content' ? (
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
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description || ''}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  rows={3}
                  placeholder="Brief description for search engines"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    title="Toggle page published status"
                  />
                  <Label htmlFor="is_published">Published</Label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Saving...' : 'Save Page'}</span>
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Sections Management */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Page Sections</h3>
                <Button onClick={addSection} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Section</span>
                </Button>
              </div>

              {sections.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No sections yet. Add your first section to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sections.map((section, index) => (
                    <Card key={index} className="border-2 border-gray-200 dark:border-gray-700">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getSectionIcon(section.type)}
                            <Input
                              value={section.title}
                              onChange={(e) => updateSection(index, 'title', e.target.value)}
                              className="w-48"
                              placeholder="Section title"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <select
                              value={section.type}
                              onChange={(e) => updateSection(index, 'type', e.target.value)}
                              className="px-3 py-1 border border-gray-300 rounded text-sm"
                              aria-label="Section type"
                            >
                              <option value="text">Text</option>
                              <option value="html">HTML</option>
                              <option value="image">Image</option>
                              <option value="layout">Layout</option>
                            </select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => moveSection(index, 'up')}
                              disabled={index === 0}
                            >
                              ↑
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => moveSection(index, 'down')}
                              disabled={index === sections.length - 1}
                            >
                              ↓
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateSection(index, 'is_active', !section.is_active)}
                              className={section.is_active ? 'text-green-600' : 'text-gray-400'}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeSection(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={section.content}
                          onChange={(e) => updateSection(index, 'content', e.target.value)}
                          rows={6}
                          placeholder={`Enter ${section.type} content...`}
                          className="font-mono text-sm"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('content')}
                >
                  Back to Details
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Saving...' : 'Save Page & Sections'}</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PageForm;
