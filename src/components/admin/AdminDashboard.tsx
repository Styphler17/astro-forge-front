import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { FileText, Newspaper, FolderOpen, Users, Eye, TrendingUp, Plus, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { apiClient } from '../../integrations/api/client';
import { Link } from 'react-router-dom';

interface DashboardStats {
  content: {
    blogPosts: { total: number; published: number; draft: number };
    projects: { total: number; active: number; statusBreakdown: Record<string, number> };
    services: { total: number; published: number; draft: number };
  };
  team: { total: number; active: number; inactive: number };
  users: { total: number; active: number; inactive: number };
  recentActivity: { blogPosts: number; projects: number };
  summary: { totalContent: number; publishedContent: number; totalTeam: number; totalUsers: number };
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardStats = await apiClient.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'planning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in_progress':
        return 'text-blue-600';
      case 'planning':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={`dashboard-skeleton-${i}`} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
          <button 
            onClick={fetchStats}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Welcome to your content management system
          </p>
        </div>
        <button 
          onClick={fetchStats}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Stats
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Content</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.summary.totalContent}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stats.summary.publishedContent} published
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Blog Posts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.content.blogPosts.total}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stats.content.blogPosts.published} published, {stats.content.blogPosts.draft} drafts
                </p>
              </div>
              <Newspaper className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Projects</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.content.projects.total}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stats.content.projects.active} active
                </p>
              </div>
              <FolderOpen className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Members</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.team.total}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stats.team.active} active, {stats.team.inactive} inactive
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Content Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Blog Posts</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{stats.content.blogPosts?.total ?? 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Projects</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{stats.content.projects?.total ?? 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Services</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{stats.content.services?.total ?? 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <Newspaper className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {stats.recentActivity.blogPosts} new blog posts in the last 7 days
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <FolderOpen className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {stats.recentActivity.projects} new projects in the last 7 days
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Status Breakdown */}
      {Object.keys(stats.content.projects.statusBreakdown).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5" />
              <span>Project Status Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(stats.content.projects.statusBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  {getStatusIcon(status)}
                  <div>
                    <div className={`text-sm font-medium capitalize ${getStatusColor(status)}`}>
                      {status.replace('_', ' ')}
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{count}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link to="/admin/blog">
                <button className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="font-medium text-gray-900 dark:text-white">Manage Blog Posts</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Create and edit blog content</div>
                </button>
              </Link>
              <Link to="/admin/projects">
                <button className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="font-medium text-gray-900 dark:text-white">Manage Projects</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Update project information</div>
                </button>
              </Link>
              <Link to="/admin/team">
                <button className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="font-medium text-gray-900 dark:text-white">Manage Team</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Update team member details</div>
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-700 dark:text-green-300">
                  Database connected successfully
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                <Eye className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  Content management system ready
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
