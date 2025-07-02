import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { apiClient, FAQ } from '../../integrations/api/client';
import { Plus, Edit, Trash2, Search, HelpCircle, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import RefreshButton from '../ui/refresh-button';

const FAQManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchFAQs = useCallback(async () => {
    try {
      setRefreshing(true);
      
      // Add a small delay to make the spinning animation visible
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = await apiClient.getFaqs();
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast({
        title: "Error",
        description: "Failed to load FAQs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  const deleteFaq = async (id: string, question: string) => {
    if (!confirm(`Are you sure you want to delete "${question}"? This action cannot be undone.`)) return;

    try {
      await apiClient.deleteFaq(id);
      toast({
        title: "Success",
        description: `FAQ "${question}" has been deleted successfully.`,
        variant: "default",
      });
      fetchFAQs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast({
        title: "Error",
        description: "Failed to delete FAQ. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean, question: string) => {
    try {
      const faq = faqs.find(f => f.id === id);
      if (!faq) return;

      await apiClient.updateFaq(id, { is_active: !currentStatus });
      const action = currentStatus ? 'deactivated' : 'activated';
      toast({
        title: "Success",
        description: `FAQ "${question}" has been ${action} successfully.`,
        variant: "default",
      });
      fetchFAQs();
    } catch (error) {
      console.error('Error updating FAQ status:', error);
      toast({
        title: "Error",
        description: "Failed to update FAQ status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateOrder = async (id: string, newOrder: number) => {
    try {
      await apiClient.updateFaq(id, { display_order: newOrder });
      toast({
        title: "Success",
        description: "FAQ order updated successfully.",
        variant: "default",
      });
      fetchFAQs();
    } catch (error) {
      console.error('Error updating FAQ order:', error);
      toast({
        title: "Error",
        description: "Failed to update FAQ order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  const getCategoryColor = (category: string) => {
    const colors = {
      'General': 'bg-astro-blue/10 text-astro-blue dark:bg-astro-blue/20 dark:text-astro-blue/80',
      'Services': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Projects': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Contact': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={`faq-skeleton-${i}`} className="h-48 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">FAQ</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your frequently asked questions
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <RefreshButton 
            onClick={fetchFAQs}
            refreshing={refreshing}
            title="Refresh FAQs"
          />
          <Button 
            onClick={() => navigate('/admin/faq/new')}
            className="bg-astro-blue text-white hover:bg-astro-blue/80 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New FAQ</span>
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-astro-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-astro-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                title="Filter by category"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFaqs.map((faq, index) => (
          <Card key={faq.id} className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <HelpCircle className="h-4 w-4 text-astro-blue" />
                    <Badge className={getCategoryColor(faq.category)}>
                      {faq.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{faq.question}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant={faq.is_active ? "default" : "secondary"}>
                      {faq.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Order: {faq.display_order}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-1 ml-2">
                  <button
                    onClick={() => updateOrder(faq.id, faq.display_order - 1)}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-1"
                    title="Move up"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => updateOrder(faq.id, faq.display_order + 1)}
                    disabled={index === filteredFaqs.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-1"
                    title="Move down"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                {faq.answer}
              </p>
              
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/faq/edit/${faq.id}`)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleActive(faq.id, Boolean(faq.is_active), faq.question)}
                  className="flex-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {faq.is_active ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                  {faq.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteFaq(faq.id, faq.question)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFaqs.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || selectedCategory !== 'all' 
                ? 'No FAQs found matching your filters.' 
                : 'No FAQs yet. Add your first FAQ!'}
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <Button 
                onClick={() => navigate('/admin/faq/new')}
                className="mt-4 bg-astro-blue text-white hover:bg-astro-blue/80"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First FAQ
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FAQManager; 