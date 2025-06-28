import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { apiClient } from '../../../integrations/api/client';
import { ArrowLeft, Save, HelpCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../hooks/use-toast';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface FAQFormProps {
  faq?: FAQ;
  onSave?: () => void;
  onCancel?: () => void;
}

const FAQForm: React.FC<FAQFormProps> = ({ faq, onSave, onCancel }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [formData, setFormData] = useState<Partial<FAQ>>({
    question: '',
    answer: '',
    category: 'General',
    display_order: 0,
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch FAQ data when editing
  useEffect(() => {
    const fetchFAQ = async () => {
      if (id && !faq) {
        try {
          setInitialLoading(true);
          // Note: We'll need to add getFAQById to the API client
          const allFaqs = await apiClient.getAllFaqs();
          const faqData = allFaqs.find(f => f.id === id);
          if (faqData) {
            setFormData(faqData);
          } else {
            setError('FAQ not found');
          }
        } catch (error) {
          console.error('Error fetching FAQ:', error);
          setError('Failed to load FAQ data');
          toast({
            title: "Error",
            description: "Failed to load FAQ data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setInitialLoading(false);
        }
      } else if (faq) {
        setFormData(faq);
      }
    };

    fetchFAQ();
  }, [id, faq, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id || faq?.id) {
        // Update existing FAQ
        const faqId = id || faq?.id;
        await apiClient.updateFaq(faqId!, formData);
        toast({
          title: "Success",
          description: "FAQ updated successfully!",
          variant: "default",
        });
      } else {
        // Create new FAQ
        const createData = {
          question: formData.question || '',
          answer: formData.answer || '',
          category: formData.category || 'General',
          display_order: formData.display_order ?? 0,
          is_active: formData.is_active ?? true
        };
        await apiClient.createFaq(createData);
        toast({
          title: "Success",
          description: "FAQ created successfully!",
          variant: "default",
        });
      }
      
      onSave?.();
      navigate('/admin/faq');
    } catch (error) {
      console.error('Error saving FAQ:', error);
      setError('Failed to save FAQ');
      toast({
        title: "Error",
        description: "Failed to save FAQ. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FAQ, value: string | number | boolean) => {
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
            onClick={() => navigate('/admin/faq')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to FAQs</span>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {id || faq ? 'Edit FAQ' : 'Create New FAQ'}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5" />
            <span>FAQ Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="question">Question *</Label>
              <Input
                id="question"
                value={formData.question || ''}
                onChange={(e) => handleInputChange('question', e.target.value)}
                required
                placeholder="Enter the question..."
              />
            </div>

            <div>
              <Label htmlFor="answer">Answer *</Label>
              <Textarea
                id="answer"
                value={formData.answer || ''}
                onChange={(e) => handleInputChange('answer', e.target.value)}
                rows={6}
                required
                placeholder="Enter the answer..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category || 'General'} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Services">Services</SelectItem>
                    <SelectItem value="Projects">Projects</SelectItem>
                    <SelectItem value="Contact">Contact</SelectItem>
                    <SelectItem value="Careers">Careers</SelectItem>
                  </SelectContent>
                </Select>
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

            <div className="flex items-center space-x-2">
              <input
                id="is_active"
                type="checkbox"
                checked={formData.is_active || false}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
                className="rounded"
                aria-label="Active status"
                title="Toggle FAQ active status"
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin/faq')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : (id || faq ? 'Update FAQ' : 'Create FAQ')}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQForm; 