
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { BarChart3, Users, FileText, Eye, TrendingUp, TrendingDown } from 'lucide-react';

const Analytics = () => {
  // Mock data for analytics
  const stats = [
    {
      title: 'Total Pages',
      value: '12',
      change: '+2',
      trend: 'up',
      icon: FileText
    },
    {
      title: 'Blog Posts',
      value: '8',
      change: '+1',
      trend: 'up',
      icon: FileText
    },
    {
      title: 'Projects',
      value: '6',
      change: '0',
      trend: 'neutral',
      icon: BarChart3
    },
    {
      title: 'Team Members',
      value: '5',
      change: '+1',
      trend: 'up',
      icon: Users
    }
  ];

  const recentActivity = [
    { action: 'New blog post created', item: 'Getting Started with React', time: '2 hours ago' },
    { action: 'Page updated', item: 'About Us', time: '1 day ago' },
    { action: 'Project added', item: 'E-commerce Platform', time: '2 days ago' },
    { action: 'Team member added', item: 'John Doe', time: '3 days ago' },
    { action: 'Page published', item: 'Services Overview', time: '1 week ago' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Track your content and website performance
        </p>
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
            {recentActivity.map((activity, index) => (
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
            ))}
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
            <button className="p-4 text-left bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">Create Page</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add a new page to your site</p>
            </button>
            
            <button className="p-4 text-left bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <FileText className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">Write Post</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Create a new blog post</p>
            </button>
            
            <button className="p-4 text-left bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
              <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">Add Project</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Showcase a new project</p>
            </button>
            
            <button className="p-4 text-left bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
              <Users className="h-6 w-6 text-orange-600 dark:text-orange-400 mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">Add Member</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add a team member</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
