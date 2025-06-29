import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { apiClient, Service } from '../../integrations/api/client';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

const ServicesManager: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.getServices(false); // Get all services, not just published
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load services. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleDelete = async () => {
    if (!serviceToDelete) return;

    try {
      setDeleting(true);
      await apiClient.deleteService(serviceToDelete.id);
      
      // Remove from local state
      setServices(prev => prev.filter(service => service.id !== serviceToDelete.id));
      
      toast({
        title: "Success",
        description: "Service deleted successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  const openDeleteDialog = (service: Service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const togglePublishStatus = async (service: Service) => {
    try {
      await apiClient.updateService(service.id, {
        is_published: !service.is_published
      });
      
      // Update local state
      setServices(prev => prev.map(s => 
        s.id === service.id 
          ? { ...s, is_published: !s.is_published }
          : s
      ));
      
      toast({
        title: "Success",
        description: `Service ${service.is_published ? 'unpublished' : 'published'} successfully!`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating service status:', error);
      toast({
        title: "Error",
        description: "Failed to update service status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter services based on search term and status
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && service.is_published) ||
                         (statusFilter === 'draft' && !service.is_published);
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Services Manager</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your service offerings and details
          </p>
        </div>
        <Button 
          onClick={() => navigate('/admin/services/new')}
          className="bg-astro-blue text-white hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Service</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                All ({services.length})
              </Button>
              <Button
                variant={statusFilter === 'published' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('published')}
                size="sm"
              >
                Published ({services.filter(s => s.is_published).length})
              </Button>
              <Button
                variant={statusFilter === 'draft' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('draft')}
                size="sm"
              >
                Draft ({services.filter(s => !s.is_published).length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Services ({filteredServices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredServices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No services match your filters.' 
                  : 'No services found. Create your first service to get started.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Title</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Slug</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Order</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Updated</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service) => (
                    <tr key={service.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{service.title}</div>
                          {service.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {service.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {service.slug}
                        </code>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={service.is_published ? 'default' : 'secondary'}>
                          {service.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {service.display_order}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(service.updated_at)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePublishStatus(service)}
                            title={service.is_published ? 'Unpublish' : 'Publish'}
                          >
                            {service.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/services/edit/${service.id}`)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/admin/services/edit/${service.id}`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openDeleteDialog(service)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service "{serviceToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ServicesManager;

