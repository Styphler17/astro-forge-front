import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { apiClient } from '../integrations/api/client';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

interface NotificationContextType {
  unreadCount: number;
  notifications: Notification[];
  loading: boolean;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  deleteMultipleNotifications: (ids: string[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Export the context for use in the hook
export { NotificationContext };

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      // Generate notifications from recent activity
      const [blogPosts, projects, teamMembers] = await Promise.all([
        apiClient.getBlogPosts().catch(() => []),
        apiClient.getProjects().catch(() => []),
        apiClient.getTeamMembers().catch(() => [])
      ]);

      const generatedNotifications: Notification[] = [];
      
      // Generate notifications from recent blog posts
      const recentPosts = blogPosts.slice(0, 3);
      recentPosts.forEach((post, index) => {
        generatedNotifications.push({
          id: `blog-${post.id}`,
          type: 'success',
          title: 'Blog Post Published',
          message: `"${post.title}" has been published successfully.`,
          created_at: post.created_at,
          read: index > 0 // Only the most recent is unread
        });
      });

      // Generate notifications from recent projects
      const recentProjects = projects.slice(0, 2);
      recentProjects.forEach((project, index) => {
        generatedNotifications.push({
          id: `project-${project.id}`,
          type: 'info',
          title: 'Project Added',
          message: `"${project.title}" has been added to your portfolio.`,
          created_at: project.created_at,
          read: index > 0
        });
      });

      // Generate notifications from recent team members
      const recentMembers = teamMembers.slice(0, 1);
      recentMembers.forEach(member => {
        generatedNotifications.push({
          id: `member-${member.id}`,
          type: 'info',
          title: 'Team Member Added',
          message: `${member.name} has been added to your team.`,
          created_at: member.created_at,
          read: false
        });
      });

      // Sort by creation date (newest first)
      generatedNotifications.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // Load read status from localStorage
      const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '{}');
      
      // Apply saved read status to notifications
      const notificationsWithReadStatus = generatedNotifications.map(notification => ({
        ...notification,
        read: readNotifications[notification.id] || notification.read
      }));

      setNotifications(notificationsWithReadStatus);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    
    // Save read status to localStorage
    const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '{}');
    readNotifications[id] = true;
    localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
  }, []);

  const markAllAsRead = useCallback(() => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
    setNotifications(updatedNotifications);
    
    // Save all read statuses to localStorage
    const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '{}');
    notifications.forEach(notification => {
      readNotifications[notification.id] = true;
    });
    localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
  }, [notifications]);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    
    // Remove from localStorage as well
    const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '{}');
    delete readNotifications[id];
    localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
  }, []);

  const deleteMultipleNotifications = useCallback((ids: string[]) => {
    setNotifications(prev => prev.filter(notif => !ids.includes(notif.id)));
    
    // Remove from localStorage as well
    const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '{}');
    ids.forEach(id => delete readNotifications[id]);
    localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      unreadCount,
      notifications,
      loading,
      refreshNotifications,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      deleteMultipleNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}; 