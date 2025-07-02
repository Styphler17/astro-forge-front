import { useState, useEffect, useCallback } from 'react';
import { apiClient, User } from '../../integrations/api/client';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Pencil, Trash, Plus, Search, User as UserIcon, Mail, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../hooks/useAuth';
import RefreshButton from '../ui/refresh-button';

const UsersManager: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setRefreshing(true);
      
      // Add a small delay to make the spinning animation visible
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = await apiClient.getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
    // Set current user ID from AuthContext
    if (user?.id) {
      setCurrentUserId(user.id);
    }
  }, [fetchUsers, user?.id]);

  const handleDelete = async (id: string, name: string) => {
    // Check for self-deletion
    if (currentUserId && id === currentUserId) {
      toast({
        title: "Error",
        description: "You cannot delete your own account. Please ask another admin to delete your account.",
        variant: "destructive",
      });
      return;
    }

    // Check for last admin deletion
    const adminUsers = users.filter(user => user.role === 'admin' && user.is_active);
    const userToDelete = users.find(user => user.id === id);
    
    if (userToDelete?.role === 'admin' && adminUsers.length <= 1) {
      toast({
        title: "Error",
        description: "Cannot delete the last admin user. At least one admin must remain active.",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
    
    try {
      await apiClient.deleteUser(id);
      toast({
        title: "Success",
        description: `User "${name}" has been deleted successfully.`,
        variant: "default",
      });
      fetchUsers();
    } catch (err: unknown) {
      console.error('Error deleting user:', err);
      const errorMessage = err instanceof Error ? err.message : "Failed to delete user. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean, name: string) => {
    // Check for last admin deactivation
    const adminUsers = users.filter(user => user.role === 'admin' && user.is_active);
    const userToToggle = users.find(user => user.id === id);
    
    if (userToToggle?.role === 'admin' && !currentStatus && adminUsers.length <= 1) {
      toast({
        title: "Error",
        description: "Cannot deactivate the last admin user. At least one admin must remain active.",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiClient.updateUser(id, {
        email: users.find(u => u.id === id)?.email || '',
        name: users.find(u => u.id === id)?.name || '',
        role: users.find(u => u.id === id)?.role || 'viewer',
        is_active: !currentStatus
      });
      const action = currentStatus ? 'deactivated' : 'activated';
      toast({
        title: "Success",
        description: `User "${name}" has been ${action} successfully.`,
        variant: "default",
      });
      fetchUsers();
    } catch (error: unknown) {
      console.error('Error updating user status:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update user status. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'editor':
        return 'bg-astro-blue/10 text-astro-blue dark:bg-astro-blue/20 dark:text-astro-blue/80';
      case 'viewer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'editor':
        return <Pencil className="h-4 w-4" />;
      case 'viewer':
        return <UserIcon className="h-4 w-4" />;
      default:
        return <UserIcon className="h-4 w-4" />;
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={`users-skeleton-${i}`} className="h-80 bg-gray-300 rounded"></div>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Users Management</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage user accounts and permissions ({users.length} total)
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <RefreshButton 
            onClick={fetchUsers}
            refreshing={refreshing}
            title="Refresh users"
          />
          <Button 
            onClick={() => navigate('/admin/users/new')}
            className="bg-astro-blue text-white hover:bg-astro-blue/80 flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span>New User</span>
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
              placeholder="Search users by name, email, or role..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-astro-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback>
                        <UserIcon className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge 
                      variant={user.is_active ? "default" : "secondary"}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge className={getRoleColor(user.role)}>
                      <div className="flex items-center space-x-1">
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role}</span>
                      </div>
                    </Badge>
                    {currentUserId === user.id && (
                      <Badge className="bg-astro-blue/10 text-astro-blue dark:bg-astro-blue/20 dark:text-astro-blue/80">
                        Current User
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <div>Created: {new Date(user.created_at).toLocaleDateString()}</div>
                <div>Updated: {new Date(user.updated_at).toLocaleDateString()}</div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                  className="flex-1"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleActive(user.id, Boolean(user.is_active), user.name)}
                  className="flex-1"
                  disabled={user.role === 'admin' && users.filter(u => u.role === 'admin' && u.is_active).length <= 1}
                  title={user.role === 'admin' && users.filter(u => u.role === 'admin' && u.is_active).length <= 1 
                    ? "Cannot deactivate the last admin" 
                    : "Toggle user active status"}
                >
                  {user.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(user.id, user.name)}
                  className="text-red-600 hover:text-red-700"
                  disabled={currentUserId === user.id || (user.role === 'admin' && users.filter(u => u.role === 'admin' && u.is_active).length <= 1)}
                  title={currentUserId === user.id 
                    ? "You cannot delete your own account" 
                    : user.role === 'admin' && users.filter(u => u.role === 'admin' && u.is_active).length <= 1
                    ? "Cannot delete the last admin"
                    : "Delete user"}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No users found matching your search.' : 'No users yet. Add your first user!'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => navigate('/admin/users/new')}
                className="mt-4 bg-astro-blue text-white hover:bg-astro-blue/80"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First User
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UsersManager; 
