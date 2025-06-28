import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Plus, Edit, Trash2, Eye, Search, ArrowUp, ArrowDown, FileText, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { apiClient } from '../../integrations/api/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';

interface Service {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  icon?: string;
  image_url?: string;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const ServicesManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setRefreshing(true);
      const data = await apiClient.getServices();
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load services. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteService = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;

    try {
      await apiClient.deleteService(id);
      toast({
        title: "Success",
        description: `Service "${title}" has been deleted successfully.`,
        variant: "default",
      });
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
        variant: "destructive",
      });
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean, title: string) => {
    try {
      await apiClient.updateService(id, { is_published: !currentStatus });
      const action = currentStatus ? 'unpublished' : 'published';
      toast({
        title: "Success",
        description: `Service "${title}" has been ${action} successfully.`,
        variant: "default",
      });
      fetchServices();
    } catch (error) {
      console.error('Error updating service status:', error);
      toast({
        title: "Error",
        description: "Failed to update service status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateOrder = async (id: string, newOrder: number) => {
    try {
      await apiClient.updateService(id, { display_order: newOrder });
      toast({
        title: "Success",
        description: "Service order updated successfully.",
        variant: "default",
      });
      fetchServices();
    } catch (error) {
      console.error('Error updating service order:', error);
      toast({
        title: "Error",
        description: "Failed to update service order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Services</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your services and offerings ({services.length} total)
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={fetchServices}
            disabled={refreshing}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button 
            onClick={() => navigate('/admin/services/new')}
            className="bg-astro-blue text-white hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Service</span>
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
              placeholder="Search services by title or description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-astro-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service, index) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{service.title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge 
                      variant={service.is_published ? "default" : "secondary"}
                    >
                      {service.is_published ? 'Published' : 'Draft'}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Order: {service.display_order}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-1 ml-2">
                  <button
                    onClick={() => updateOrder(service.id, service.display_order - 1)}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-1"
                    title="Move up"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => updateOrder(service.id, service.display_order + 1)}
                    disabled={index === filteredServices.length - 1}
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
                {service.description || 'No description available'}
              </p>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <FileText className="h-3 w-3" />
                <span>Slug: {service.slug}</span>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/services/${service.slug}`, '_blank')}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/services/edit/${service.id}`)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePublished(service.id, service.is_published, service.title)}
                  className="flex-1"
                >
                  {service.is_published ? 'Unpublish' : 'Publish'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteService(service.id, service.title)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No services found matching your search.' : 'No services yet. Create your first service!'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => navigate('/admin/services/new')}
                className="mt-4 bg-astro-blue text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Service
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServicesManager;
