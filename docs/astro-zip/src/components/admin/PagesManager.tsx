import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Plus, Edit, Trash2, Eye, Search, Calendar, FileText, ToggleLeft, ToggleRight, Settings, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { apiClient, Page } from '../../integrations/api/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import RefreshButton from '../ui/refresh-button';

const PagesManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchPages = useCallback(async () => {
    try {
      setRefreshing(true);
      
      // Add a small delay to make the spinning animation visible
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const deletePage = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;

    try {
      await apiClient.deletePage(id);
      const message = `Page "${title}" has been deleted successfully.`;
      setSuccessMessage(message);
      toast({
        title: "Success",
        description: message,
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
      console.log('=== TOGGLE PUBLISHED DEBUG ===');
      console.log('Page ID:', id);
      console.log('Current Status:', currentStatus);
      console.log('New Status:', !currentStatus);
      console.log('Page Title:', title);
      
      const updateData = { is_published: !currentStatus };
      console.log('Update Data:', updateData);
      
      const response = await apiClient.updatePage(id, updateData);
      console.log('API Response:', response);
      
      const action = currentStatus ? 'unpublished' : 'published';
      console.log('Action:', action);
      
      const message = `Page "${title}" has been ${action} successfully.`;
      console.log('Success Message:', message);
      
      setSuccessMessage(message);
      toast({
        title: "Success",
        description: message,
        variant: "default",
      });
      
      console.log('Refreshing pages list...');
      await fetchPages();
      console.log('=== TOGGLE PUBLISHED COMPLETE ===');
    } catch (error) {
      console.error('=== TOGGLE PUBLISHED ERROR ===');
      console.error('Error details:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
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
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Pages</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your website pages and content ({pages.length} total)
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
          <RefreshButton 
            onClick={fetchPages}
            refreshing={refreshing}
            title="Refresh pages"
          />
          <Button 
            onClick={() => {
              if (pages.length > 0) {
                const firstPage = pages[0];
                console.log('Testing toggle with first page:', firstPage);
                togglePublished(firstPage.id, firstPage.is_published, firstPage.title);
              }
            }}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <span>Test Toggle</span>
          </Button>
          <Button 
            onClick={() => navigate('/admin/pages/new')}
            className="bg-astro-blue text-white hover:bg-blue-700 flex items-center justify-center space-x-2 w-full lg:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span>New Page</span>
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green-500 hover:text-green-700"
          >
            ×
          </button>
        </div>
      )}

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
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredPages.map((page) => (
          <Card key={page.id} className="w-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base lg:text-lg line-clamp-2 break-words">
                    {page.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge 
                      variant={page.is_published ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {page.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => window.open(`/${page.slug}`, '_blank')}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Page
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/admin/pages/edit/${page.id}`)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Page
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/admin/pages/edit/${page.id}#sections`)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Page Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => togglePublished(page.id, page.is_published, page.title)}
                      className={page.is_published ? 'text-orange-600' : 'text-green-600'}
                    >
                      {page.is_published ? (
                        <>
                          <ToggleLeft className="h-4 w-4 mr-2" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <ToggleRight className="h-4 w-4 mr-2" />
                          Publish
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => deletePage(page.id, page.title)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-3">
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <FileText className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">/{page.slug}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span>Updated: {new Date(page.updated_at).toLocaleDateString()}</span>
              </div>

              {page.meta_description && (
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 break-words flex-1">
                  {page.meta_description}
                </p>
              )}

              {/* Mobile Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 lg:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/${page.slug}`, '_blank')}
                  className="text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/pages/edit/${page.id}`)}
                  className="text-xs"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
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
                className="mt-4 bg-astro-blue text-white hover:bg-blue-700"
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
