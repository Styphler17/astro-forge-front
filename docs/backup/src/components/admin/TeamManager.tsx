import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Plus, Edit, Trash2, Search, ArrowUp, ArrowDown, User, Mail, LinkedinIcon, Twitter } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { apiClient, TeamMember } from '../../integrations/api/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import RefreshButton from '../ui/refresh-button';

const TeamManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMembers = useCallback(async () => {
    try {
      setRefreshing(true);
      
      // Add a small delay to make the spinning animation visible
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = await apiClient.getTeamMembers();
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: "Error",
        description: "Failed to load team members. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const deleteMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;

    try {
      await apiClient.deleteTeamMember(id);
      toast({
        title: "Success",
        description: `Team member "${name}" has been deleted successfully.`,
        variant: "default",
      });
      fetchMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast({
        title: "Error",
        description: "Failed to delete team member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean, name: string) => {
    try {
      await apiClient.updateTeamMember(id, { is_active: !currentStatus });
      const action = currentStatus ? 'deactivated' : 'activated';
      toast({
        title: "Success",
        description: `Team member "${name}" has been ${action} successfully.`,
        variant: "default",
      });
      fetchMembers();
    } catch (error) {
      console.error('Error updating team member status:', error);
      toast({
        title: "Error",
        description: "Failed to update team member status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateOrder = async (id: string, newOrder: number) => {
    try {
      await apiClient.updateTeamMember(id, { display_order: newOrder });
      toast({
        title: "Success",
        description: "Team member order updated successfully.",
        variant: "default",
      });
      fetchMembers();
    } catch (error) {
      console.error('Error updating team member order:', error);
      toast({
        title: "Error",
        description: "Failed to update team member order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={`team-skeleton-${i}`} className="h-80 bg-gray-300 rounded"></div>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Team Members</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your team members and their roles
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <RefreshButton 
            onClick={fetchMembers}
            refreshing={refreshing}
            title="Refresh team members"
          />
          <Button 
            onClick={() => navigate('/admin/team/new')}
            className="bg-astro-blue text-white hover:bg-astro-blue/80 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Member</span>
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
              placeholder="Search members by name or position..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-astro-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member, index) => (
          <Card key={member.id} className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.image_url} alt={member.name} />
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{member.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge 
                      variant={member.is_active ? "default" : "secondary"}
                    >
                      {member.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Order: {member.display_order}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-1 ml-2">
                  <button
                    onClick={() => updateOrder(member.id, member.display_order - 1)}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-1"
                    title="Move up"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => updateOrder(member.id, member.display_order + 1)}
                    disabled={index === filteredMembers.length - 1}
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
                {member.bio || 'No bio available'}
              </p>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                {member.email && (
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span>{member.email}</span>
                  </div>
                )}
                {member.linkedin_url && (
                  <div className="flex items-center space-x-1">
                    <LinkedinIcon className="h-3 w-3" />
                    <span>LinkedIn</span>
                  </div>
                )}
                {member.twitter_url && (
                  <div className="flex items-center space-x-1">
                    <Twitter className="h-3 w-3" />
                    <span>Twitter</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-2">
                {member.linkedin_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(member.linkedin_url, '_blank')}
                    className="flex-1"
                  >
                    <LinkedinIcon className="h-4 w-4 mr-1" />
                    LinkedIn
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/team/edit/${member.id}`)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleActive(member.id, Boolean(member.is_active), member.name)}
                  className="flex-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {member.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteMember(member.id, member.name)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No team members found matching your search.' : 'No team members yet. Add your first team member!'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => navigate('/admin/team/new')}
                className="mt-4 bg-astro-blue text-white hover:bg-astro-blue/80"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Member
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamManager;
