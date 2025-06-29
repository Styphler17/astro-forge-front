import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Plus, Edit, Trash2, Eye, Search, Calendar, FileText, RefreshCw, ToggleLeft, ToggleRight, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { apiClient, Page } from '../../integrations/api/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';

const PagesManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPages = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await apiClient.getPages();
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast({
        title: "Error",
        description: "Failed to load pages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const deletePage = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;

    try {
      await apiClient.deletePage(id);
      toast({
        title: "Success",
        description: `Page "${title}" has been deleted successfully.`,
        variant: "default",
      });
      fetchPages();
    } catch (error) {
      console.error('Error deleting page:', error);
      toast({
        title: "Error",
        description: "Failed to delete page. Please try again.",
        variant: "destructive",
      });
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean, title: string) => {
    try {
      await apiClient.updatePage(id, { is_published: !currentStatus });
      const action = currentStatus ? 'unpublished' : 'published';
      toast({
        title: "Success",
        description: `Page "${title}" has been ${action} successfully.`,
        variant: "default",
      });
      fetchPages();
    } catch (error) {
      console.error('Error updating page status:', error);
      toast({
        title: "Error",
        description: "Failed to update page status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid gap-4 sm:gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={`pages-skeleton-${i}`} className="h-48 bg-gray-300 rounded"></div>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Pages</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your website pages and content ({pages.length} total)
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <Button 
            onClick={fetchPages}
            disabled={refreshing}
            variant="outline"
            className="flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button 
            onClick={() => navigate('/admin/pages/new')}
            className="bg-astro-blue text-white hover:bg-astro-blue/80 flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span>New Page</span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search pages by title or slug..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-astro-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pages Grid */}
      <div className="grid gap-4 sm:gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        {filteredPages.map((page) => (
          <Card key={page.id} className="w-full min-w-0 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-base sm:text-lg line-clamp-2">{page.title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge 
                      variant={page.is_published ? "default" : "secondary"}
                    >
                      {page.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <FileText className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">/{page.slug}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span>Updated: {new Date(page.updated_at).toLocaleDateString()}</span>
              </div>

              {page.meta_description && (
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {page.meta_description}
                </p>
              )}

              <div className="grid grid-cols-2 sm:flex sm:space-x-2 gap-2 sm:gap-0 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/${page.slug}`, '_blank')}
                  className="flex-1 sm:flex-none"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">View</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/pages/edit/${page.id}`)}
                  className="flex-1 sm:flex-none"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePublished(page.id, page.is_published, page.title)}
                  className={`flex-1 sm:flex-none ${page.is_published ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}`}
                >
                  {page.is_published ? (
                    <>
                      <ToggleLeft className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Unpublish</span>
                    </>
                  ) : (
                    <>
                      <ToggleRight className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Publish</span>
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/pages/edit/${page.id}#sections`)}
                  className="flex-1 sm:flex-none"
                  title="Manage Sections"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Settings</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deletePage(page.id, page.title)}
                  className="text-red-600 hover:text-red-700 col-span-2 sm:col-span-1 sm:flex-none"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPages.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No pages found matching your search.' : 'No pages yet. Create your first page!'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => navigate('/admin/pages/new')}
                className="mt-4 bg-astro-blue text-white hover:bg-astro-blue/80"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Page
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PagesManager;
