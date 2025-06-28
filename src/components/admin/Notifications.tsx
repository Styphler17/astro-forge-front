
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Bell, Check, X, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'success',
      title: 'Blog Post Published',
      message: 'Your blog post "Getting Started with React" has been published successfully.',
      time: '2 hours ago',
      read: false
    },
    {
      id: '2',
      type: 'info',
      title: 'New Comment',
      message: 'You have a new comment on your blog post "Web Development Tips".',
      time: '4 hours ago',
      read: false
    },
    {
      id: '3',
      type: 'warning',
      title: 'Storage Warning',
      message: 'You are approaching your storage limit. Consider upgrading your plan.',
      time: '1 day ago',
      read: true
    },
    {
      id: '4',
      type: 'error',
      title: 'Failed to Update',
      message: 'There was an error updating your team member profile. Please try again.',
      time: '2 days ago',
      read: true
    },
    {
      id: '5',
      type: 'info',
      title: 'Project Updated',
      message: 'Your project "E-commerce Platform" has been updated successfully.',
      time: '3 days ago',
      read: true
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationBg = (type: string, read: boolean) => {
    const alpha = read ? '10' : '20';
    switch (type) {
      case 'success':
        return `bg-green-50 dark:bg-green-900/${alpha}`;
      case 'error':
        return `bg-red-50 dark:bg-red-900/${alpha}`;
      case 'warning':
        return `bg-yellow-50 dark:bg-yellow-900/${alpha}`;
      default:
        return `bg-blue-50 dark:bg-blue-900/${alpha}`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Bell className="h-8 w-8" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Stay updated with your latest activities
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Check className="h-4 w-4" />
            <span>Mark All as Read</span>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${getNotificationBg(notification.type, notification.read)} ${
                    notification.read 
                      ? 'border-gray-200 dark:border-gray-700' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className={`font-medium ${
                            notification.read 
                              ? 'text-gray-700 dark:text-gray-300' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                          className="p-1"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No notifications yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
