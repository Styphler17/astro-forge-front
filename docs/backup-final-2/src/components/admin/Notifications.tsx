import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X, 
  Trash2, 
  Filter,
  Check,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useNotifications } from '../../hooks/useNotifications';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import RefreshButton from '../ui/refresh-button';

type FilterType = 'all' | 'success' | 'error' | 'warning' | 'info';
type ReadStatus = 'all' | 'read' | 'unread';
type SortBy = 'date' | 'type' | 'title';
type SortOrder = 'asc' | 'desc';

const Notifications = () => {
  const { toast } = useToast();
  const { 
    notifications, 
    loading, 
    refreshNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    deleteMultipleNotifications
  } = useNotifications();
  
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filter and sort states
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [readStatus, setReadStatus] = useState<ReadStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort notifications
  const filteredAndSortedNotifications = notifications
    .filter(notification => {
      // Filter by type
      if (filterType !== 'all' && notification.type !== filterType) {
        return false;
      }
      
      // Filter by read status
      if (readStatus === 'read' && !notification.read) {
        return false;
      }
      if (readStatus === 'unread' && notification.read) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          notification.title.toLowerCase().includes(searchLower) ||
          notification.message.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSelectAll = useCallback((checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedNotifications(new Set(filteredAndSortedNotifications.map(n => n.id)));
    } else {
      setSelectedNotifications(new Set());
    }
  }, [filteredAndSortedNotifications]);

  // Keyboard shortcut for select all (Ctrl+A)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault();
        if (notifications.length > 0) {
          handleSelectAll(!selectAll);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [notifications.length, selectAll, handleSelectAll]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      
      // Add a small delay to make the spinning animation visible
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await refreshNotifications();
    } catch (error) {
      console.error('Error refreshing notifications:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    toast({
      title: "Success",
      description: "Notification marked as read.",
      variant: "default",
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast({
      title: "Success",
      description: "All notifications marked as read.",
      variant: "default",
    });
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id);
    // Remove from selected if it was selected
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    toast({
      title: "Success",
      description: "Notification deleted.",
      variant: "default",
    });
  };

  const handleBulkDelete = () => {
    if (selectedNotifications.size === 0) {
      toast({
        title: "Warning",
        description: "Please select notifications to delete.",
        variant: "destructive",
      });
      return;
    }

    if (confirm(`Are you sure you want to delete ${selectedNotifications.size} notification(s)?`)) {
      const selectedIds = Array.from(selectedNotifications);
      deleteMultipleNotifications(selectedIds);
      setSelectedNotifications(new Set());
      setSelectAll(false);
      toast({
        title: "Success",
        description: `${selectedNotifications.size} notification(s) deleted successfully.`,
        variant: "default",
      });
    }
  };

  const handleSelectNotification = (id: string, checked: boolean) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      
      // Check if all filtered notifications are now selected
      const allSelected = newSet.size === filteredAndSortedNotifications.length;
      setSelectAll(allSelected);
      
      return newSet;
    });
  };

  const clearFilters = () => {
    setFilterType('all');
    setReadStatus('all');
    setSearchTerm('');
    setSortBy('date');
    setSortOrder('desc');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <X className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const hasActiveFilters = filterType !== 'all' || readStatus !== 'all' || searchTerm || sortBy !== 'date' || sortOrder !== 'desc';

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={`notifications-skeleton-${i}`} className="h-24 bg-gray-300 rounded"></div>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Stay updated with your latest activities ({notifications.length} total, {unreadCount} unread)
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <Button 
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </Button>
          <RefreshButton 
            onClick={handleRefresh}
            refreshing={refreshing}
            title="Refresh notifications"
          />
          {unreadCount > 0 && (
            <Button 
              onClick={handleMarkAllAsRead}
              variant="outline"
              className="flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <Check className="h-4 w-4" />
              <span>Mark All Read</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Type Filter */}
              <div>
                <Label htmlFor="type-filter">Type</Label>
                <Select value={filterType} onValueChange={(value: FilterType) => setFilterType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Read Status Filter */}
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select value={readStatus} onValueChange={(value: ReadStatus) => setReadStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div>
                <Label htmlFor="sort">Sort By</Label>
                <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                </Button>
                <span className="text-sm text-gray-500">
                  Showing {filteredAndSortedNotifications.length} of {notifications.length} notifications
                </span>
              </div>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline" size="sm">
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions */}
      {filteredAndSortedNotifications.length > 0 && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    id="select-all"
                  />
                  <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                    Select All ({filteredAndSortedNotifications.length})
                  </label>
                </div>
                {selectedNotifications.size > 0 && (
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    {selectedNotifications.size} selected
                  </span>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Press Ctrl+A to select all
                </span>
              </div>
              {selectedNotifications.size > 0 && (
                <Button 
                  onClick={handleBulkDelete}
                  variant="destructive"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Selected ({selectedNotifications.size})</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredAndSortedNotifications.length > 0 ? (
          filteredAndSortedNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-all duration-200 hover:shadow-md ${
                !notification.read ? 'ring-2 ring-astro-blue/20' : ''
              } ${selectedNotifications.has(notification.id) ? 'ring-2 ring-blue-500' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <Checkbox
                      checked={selectedNotifications.has(notification.id)}
                      onCheckedChange={(checked) => handleSelectNotification(notification.id, checked as boolean)}
                      id={`notification-${notification.id}`}
                    />
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`text-sm font-medium ${
                          !notification.read 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {formatTime(notification.created_at)}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            notification.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            notification.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                            notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          }`}>
                            {notification.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-4">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                            title="Mark as read"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                          title="Delete notification"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500">
                <Info className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium">
                  {notifications.length === 0 ? 'No notifications' : 'No notifications match your filters'}
                </p>
                <p className="text-sm">
                  {notifications.length === 0 
                    ? "You're all caught up! Check back later for updates."
                    : "Try adjusting your filters to see more notifications."
                  }
                </p>
                {hasActiveFilters && (
                  <Button onClick={clearFilters} className="mt-4">
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Notifications;
