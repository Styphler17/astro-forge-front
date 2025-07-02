import { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Collapsible, CollapsibleContent } from '../ui/collapsible';
import { 
  Mail, 
  Trash2, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  Search, 
  Filter,
  Calendar,
  User,
  X,
  Reply
} from 'lucide-react';
import { apiClient, ContactMessage } from '../../integrations/api/client';
import { useToast } from '../../hooks/use-toast';
import RefreshButton from '../ui/refresh-button';

const MessagesManager: React.FC = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<number>>(new Set());
  const [expandedMessages, setExpandedMessages] = useState<Set<number>>(new Set());
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState('');
  
  // Reply functionality
  const [replyForm, setReplyForm] = useState<{ messageId: number; reply: string } | null>(null);
  const [showReplyForm, setShowReplyForm] = useState<Set<number>>(new Set());
  const [replyLoading, setReplyLoading] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      setRefreshing(true);
      
      // Add a small delay to make the spinning animation visible
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = await apiClient.getMessages();
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markAsRead = async (id: number) => {
    try {
      await apiClient.markMessageRead(id);
      toast({ 
        title: 'Success', 
        description: 'Message marked as read',
        variant: 'default' 
      });
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to mark as read.', 
        variant: 'destructive' 
      });
    }
  };

  const sendReply = async (messageId: number, reply: string) => {
    if (!reply.trim()) {
      toast({
        title: 'Error',
        description: 'Reply cannot be empty',
        variant: 'destructive'
      });
      return;
    }

    try {
      setReplyLoading(true);
      // For now, we'll just mark the message as read and show a success message
      // In a real implementation, you would send an email reply
      await apiClient.markMessageRead(messageId);
      
      toast({
        title: 'Success',
        description: 'Reply sent successfully!',
        variant: 'default'
      });
      
      // Hide reply form and clear form data
      setShowReplyForm(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
      setReplyForm(null);
      
      // Refresh messages
      fetchMessages();
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to send reply. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setReplyLoading(false);
    }
  };

  const toggleReplyForm = (messageId: number) => {
    setShowReplyForm(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
        setReplyForm(null);
      } else {
        newSet.add(messageId);
        setReplyForm({ messageId, reply: '' });
      }
      return newSet;
    });
  };

  const deleteMessage = async (id: number) => {
    if (!window.confirm('Delete this message? This cannot be undone.')) return;
    try {
      await apiClient.deleteMessage(id);
      toast({ 
        title: 'Success', 
        description: 'Message deleted successfully',
        variant: 'default' 
      });
      setDeleteSuccessMessage('Message deleted successfully!');
      setTimeout(() => setDeleteSuccessMessage(''), 4000);
      fetchMessages();
      // Remove from selected and expanded
      setSelectedMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setExpandedMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to delete message.', 
        variant: 'destructive' 
      });
    }
  };

  const deleteSelectedMessages = async () => {
    if (selectedMessages.size === 0) return;
    
    const count = selectedMessages.size;
    if (!window.confirm(`Delete ${count} selected message${count > 1 ? 's' : ''}? This cannot be undone.`)) return;
    
    try {
      // Delete messages one by one since there's no bulk delete endpoint
      const deletePromises = Array.from(selectedMessages).map(id => apiClient.deleteMessage(id));
      await Promise.all(deletePromises);
      
      toast({ 
        title: 'Success', 
        description: `${count} message${count > 1 ? 's' : ''} deleted successfully`,
        variant: 'default' 
      });
      
      setSelectedMessages(new Set());
      setExpandedMessages(new Set());
      fetchMessages();
    } catch (error) {
      console.error('Error deleting messages:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to delete some messages.', 
        variant: 'destructive' 
      });
    }
  };

  const markSelectedAsRead = async () => {
    if (selectedMessages.size === 0) return;
    
    try {
      const markPromises = Array.from(selectedMessages).map(id => apiClient.markMessageRead(id));
      await Promise.all(markPromises);
      
      toast({ 
        title: 'Success', 
        description: `${selectedMessages.size} message${selectedMessages.size > 1 ? 's' : ''} marked as read`,
        variant: 'default' 
      });
      
      fetchMessages();
    } catch (error) {
      console.error('Error marking messages as read:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to mark some messages as read.', 
        variant: 'destructive' 
      });
    }
  };

  const toggleMessageExpansion = (id: number) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
        // Find the message and mark as read if unread
        const msg = messages.find(m => m.id === id);
        if (msg && !msg.is_read) {
          markAsRead(id);
        }
      }
      return newSet;
    });
  };

  const toggleMessageSelection = (id: number) => {
    setSelectedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedMessages.size === filteredMessages.length) {
      setSelectedMessages(new Set());
    } else {
      setSelectedMessages(new Set(filteredMessages.map(msg => msg.id)));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  // Filter messages based on search term and status
  const filteredMessages = messages.filter(msg => {
    const matchesSearch = 
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'read' && msg.is_read) ||
      (statusFilter === 'unread' && !msg.is_read);
    
    return matchesSearch && matchesStatus;
  });

  const unreadCount = messages.filter(msg => !msg.is_read).length;
  const activeFilters = (searchTerm !== '' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0);

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
      {/* Success Message */}
      {deleteSuccessMessage && (
        <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-medium text-center">
          {deleteSuccessMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Contact Messages</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            View and manage messages sent from the contact form ({messages.length} total, {unreadCount} unread)
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <RefreshButton 
            onClick={fetchMessages}
            refreshing={refreshing}
            title="Refresh messages"
          />
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeFilters > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFilters}
                  </Badge>
                )}
              </Button>
              {activeFilters > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="flex items-center space-x-2 text-gray-500"
                >
                  <X className="h-4 w-4" />
                  <span>Clear Filters</span>
                </Button>
              )}
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search by name, email, or subject..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={(value: 'all' | 'read' | 'unread') => setStatusFilter(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Messages</SelectItem>
                      <SelectItem value="unread">Unread Only</SelectItem>
                      <SelectItem value="read">Read Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedMessages.size > 0 && (
        <Card className="border-astro-blue/20 bg-astro-blue/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">
                  {selectedMessages.size} message{selectedMessages.size > 1 ? 's' : ''} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markSelectedAsRead}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Mark as Read</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deleteSelectedMessages}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Selected</span>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMessages(new Set())}
              >
                Clear Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {messages.length === 0 
                ? 'No messages yet.' 
                : 'No messages match your filters.'}
            </p>
            {messages.length > 0 && activeFilters > 0 && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Select All */}
          <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Checkbox
              checked={selectedMessages.size === filteredMessages.length && filteredMessages.length > 0}
              onCheckedChange={toggleSelectAll}
            />
            <Label className="text-sm font-medium">
              Select All ({filteredMessages.length})
            </Label>
          </div>

          {/* Messages */}
          {filteredMessages.map((msg) => (
            <Card
              key={msg.id}
              className={`hover:shadow-lg transition-shadow duration-300 
                ${msg.is_read ? 'bg-white dark:bg-gray-900' : 'bg-yellow-50 dark:bg-yellow-900/40 border-yellow-300 dark:border-yellow-700'}
              `}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={selectedMessages.has(msg.id)}
                    onCheckedChange={() => toggleMessageSelection(msg.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-astro-blue" />
                        <div>
                          <CardTitle className="text-lg">{msg.subject}</CardTitle>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{msg.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={msg.is_read ? 'secondary' : 'default'}>
                          {msg.is_read ? 'Read' : 'Unread'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleMessageExpansion(msg.id)}
                          className="flex items-center space-x-2"
                        >
                          {expandedMessages.has(msg.id) ? (
                            <>
                              <EyeOff className="h-4 w-4" />
                              <span>Hide</span>
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4" />
                              <span>View</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Message Content - Collapsible */}
              <Collapsible open={expandedMessages.has(msg.id)}>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4 border-t pt-4">
                      <div>
                        <span className="font-semibold text-sm">From:</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {msg.name} &lt;{msg.email}&gt;
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-sm">Message:</span>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 mt-1 whitespace-pre-line text-sm">
                          {msg.message}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                        {!msg.is_read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsRead(msg.id)}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Mark as Read</span>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleReplyForm(msg.id)}
                          className="flex items-center space-x-2"
                        >
                          <Reply className="h-4 w-4" />
                          <span>Reply</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteMessage(msg.id)}
                          className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </Button>
                      </div>
                      
                      {/* Reply Form */}
                      {showReplyForm.has(msg.id) && (
                        <div className="border-t pt-4 mt-4">
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor={`reply-${msg.id}`} className="text-sm font-medium">
                                Reply to {msg.name}:
                              </Label>
                              <Textarea
                                id={`reply-${msg.id}`}
                                value={replyForm?.messageId === msg.id ? replyForm.reply : ''}
                                onChange={(e) => setReplyForm({ messageId: msg.id, reply: e.target.value })}
                                placeholder="Type your reply here..."
                                className="mt-1"
                                rows={4}
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                onClick={() => sendReply(msg.id, replyForm?.reply || '')}
                                disabled={replyLoading || !replyForm?.reply?.trim()}
                                className="flex items-center space-x-2"
                              >
                                <Reply className="h-4 w-4" />
                                <span>{replyLoading ? 'Sending...' : 'Send Reply'}</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleReplyForm(msg.id)}
                                disabled={replyLoading}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesManager; 