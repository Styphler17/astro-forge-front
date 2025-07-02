import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Plus, Edit, Trash2, Search, ArrowUp, ArrowDown, ExternalLink, Building2, Globe, Award } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { apiClient, Sponsor } from '../../integrations/api/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import RefreshButton from '../ui/refresh-button';

const SponsorsManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSponsors = useCallback(async () => {
    try {
      setRefreshing(true);
      
      // Add a small delay to make the spinning animation visible
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = await apiClient.getSponsors();
      setSponsors(data || []);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      toast({
        title: "Error",
        description: "Failed to load sponsors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors]);

  const deleteSponsor = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;

    try {
      await apiClient.deleteSponsor(id);
      toast({
        title: "Success",
        description: `Sponsor "${name}" has been deleted successfully.`,
        variant: "default",
      });
      fetchSponsors();
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      toast({
        title: "Error",
        description: "Failed to delete sponsor. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean, name: string) => {
    try {
      await apiClient.updateSponsor(id, { is_active: !currentStatus });
      const action = currentStatus ? 'deactivated' : 'activated';
      toast({
        title: "Success",
        description: `Sponsor "${name}" has been ${action} successfully.`,
        variant: "default",
      });
      fetchSponsors();
    } catch (error) {
      console.error('Error updating sponsor status:', error);
      toast({
        title: "Error",
        description: "Failed to update sponsor status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateOrder = async (id: string, newOrder: number) => {
    try {
      await apiClient.updateSponsor(id, { display_order: newOrder });
      toast({
        title: "Success",
        description: "Sponsor order updated successfully.",
        variant: "default",
      });
      fetchSponsors();
    } catch (error) {
      console.error('Error updating sponsor order:', error);
      toast({
        title: "Error",
        description: "Failed to update sponsor order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredSponsors = sponsors.filter(sponsor =>
    sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sponsor.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading skeleton component
  const LoadingSkeleton = ({ count = 6 }: { count?: number }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={`skeleton-${i}`} className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-6 h-64">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-4"></div>
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <LoadingSkeleton count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Partners & Sponsors</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your strategic partners and sponsors ({sponsors.length} total)
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <RefreshButton 
            onClick={fetchSponsors}
            refreshing={refreshing}
            title="Refresh sponsors"
          />
          <Button 
            onClick={() => navigate('/admin/sponsors/new')}
            className="bg-astro-blue text-white hover:bg-astro-blue/80 flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span>New Sponsor</span>
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
              placeholder="Search sponsors by name or description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-astro-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sponsors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSponsors.map((sponsor, index) => (
          <Card key={sponsor.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={sponsor.logo_url}
                        alt={sponsor.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-1">{sponsor.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant={sponsor.is_active ? "default" : "secondary"}
                        >
                          {sponsor.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Order: {sponsor.display_order}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-1 ml-2">
                  <button
                    onClick={() => updateOrder(sponsor.id, sponsor.display_order - 1)}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-1 rounded transition-colors"
                    title="Move up"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => updateOrder(sponsor.id, sponsor.display_order + 1)}
                    disabled={index === filteredSponsors.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-1 rounded transition-colors"
                    title="Move down"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {sponsor.description && (
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                  {sponsor.description}
                </p>
              )}
              
              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                {sponsor.website_url && (
                  <div className="flex items-center space-x-1">
                    <Globe className="h-3 w-3" />
                    <span>Website Available</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Building2 className="h-3 w-3" />
                  <span>Partner</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:space-x-2 sm:space-y-0">
                {sponsor.website_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(sponsor.website_url, '_blank')}
                    className="flex-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Visit Site
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/sponsors/edit/${sponsor.id}`)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleActive(sponsor.id, Boolean(sponsor.is_active), sponsor.name)}
                  className="flex-1"
                >
                  {sponsor.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteSponsor(sponsor.id, sponsor.name)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSponsors.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <Award className="h-16 w-16 text-gray-400" />
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                  {searchTerm ? 'No sponsors found matching your search.' : 'No sponsors yet.'}
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                  {!searchTerm && 'Add your first strategic partner or sponsor to get started!'}
                </p>
              </div>
              {!searchTerm && (
                <Button 
                  onClick={() => navigate('/admin/sponsors/new')}
                  className="bg-astro-blue text-white hover:bg-astro-blue/80"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Sponsor
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SponsorsManager; 