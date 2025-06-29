import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { BarChart3, Users, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../integrations/api/client';

interface Activity {
  action: string;
  item: string;
  time: string;
}

const Analytics = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    { title: 'Blog Posts', value: '0', change: '0', trend: 'neutral', icon: FileText },
    { title: 'Projects', value: '0', change: '0', trend: 'neutral', icon: BarChart3 },
    { title: 'Team Members', value: '0', change: '0', trend: 'neutral', icon: Users }
  ]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch real data from API
      const [blogPosts, projects, teamMembers] = await Promise.all([
        apiClient.getBlogPosts().catch(() => []),
        apiClient.getProjects().catch(() => []),
        apiClient.getTeamMembers().catch(() => [])
      ]);

      // Calculate statistics
      const newStats = [
        {
          title: 'Blog Posts',
          value: blogPosts.length.toString(),
          change: '+0',
          trend: 'neutral',
          icon: FileText
        },
        {
          title: 'Projects',
          value: projects.length.toString(),
          change: '+0',
          trend: 'neutral',
          icon: BarChart3
        },
        {
          title: 'Team Members',
          value: teamMembers.length.toString(),
          change: '+0',
          trend: 'neutral',
          icon: Users
        }
      ];

      setStats(newStats);

      // Generate recent activity from actual data
      const activity: Activity[] = [];
      
      // Add recent blog posts
      const recentPosts = blogPosts.slice(0, 2);
      recentPosts.forEach(post => {
        activity.push({
          action: 'Blog post created',
          item: post.title,
          time: new Date(post.created_at).toLocaleDateString()
        });
      });

      // Add recent projects
      const recentProjects = projects.slice(0, 2);
      recentProjects.forEach(project => {
        activity.push({
          action: 'Project added',
          item: project.title,
          time: new Date(project.created_at).toLocaleDateString()
        });
      });

      // Add recent team members
      const recentMembers = teamMembers.slice(0, 1);
      recentMembers.forEach(member => {
        activity.push({
          action: 'Team member added',
          item: member.name,
          time: new Date(member.created_at).toLocaleDateString()
        });
      });

      setRecentActivity(activity.slice(0, 5)); // Limit to 5 most recent
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Write Post',
      description: 'Create a new blog post',
      icon: FileText,
      color: 'green',
      onClick: () => navigate('/admin/blog/new')
    },
    {
      title: 'Add Project',
      description: 'Showcase a new project',
      icon: BarChart3,
      color: 'purple',
      onClick: () => navigate('/admin/projects/new')
    },
    {
      title: 'Add Member',
      description: 'Add a team member',
      icon: Users,
      color: 'orange',
      onClick: () => navigate('/admin/team/new')
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Track your content and website performance
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <Card key={`analytics-skeleton-${i}`}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Track your content and website performance
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="w-full sm:w-auto px-4 py-2 bg-astro-blue text-white rounded-lg hover:bg-astro-blue/80 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${
                  stat.trend === 'up' 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                    : stat.trend === 'down'
                    ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              {stat.change !== '0' && (
                <div className="mt-4 flex items-center">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">this month</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.item}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.title}
                onClick={action.onClick}
                className={`p-4 text-left bg-${action.color}-50 dark:bg-${action.color}-900/20 rounded-lg hover:bg-${action.color}-100 dark:hover:bg-${action.color}-900/30 transition-colors`}
              >
                <action.icon className={`h-6 w-6 text-${action.color}-600 dark:text-${action.color}-400 mb-2`} />
                <p className="font-medium text-gray-900 dark:text-white">{action.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
