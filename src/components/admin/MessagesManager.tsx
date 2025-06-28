import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Mail, Trash2, RefreshCw, CheckCircle, Eye } from 'lucide-react';
import { apiClient } from '../../integrations/api/client';
import { useToast } from '../../hooks/use-toast';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const MessagesManager: React.FC = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await apiClient.getMessages();
      setMessages(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load messages. Please try again.',
        variant: 'destructive',
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
      toast({ title: 'Marked as read', variant: 'default' });
      fetchMessages();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to mark as read.', variant: 'destructive' });
    }
  };

  const deleteMessage = async (id: number) => {
    if (!window.confirm('Delete this message? This cannot be undone.')) return;
    try {
      await apiClient.deleteMessage(id);
      toast({ title: 'Deleted', variant: 'default' });
      fetchMessages();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete message.', variant: 'destructive' });
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Messages</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            View and manage messages sent from the contact form
          </p>
        </div>
        <Button onClick={fetchMessages} disabled={refreshing} variant="outline" className="flex items-center space-x-2">
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No messages yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {messages.map((msg) => (
            <Card key={msg.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-astro-blue" />
                    <span>{msg.subject}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2 md:mt-0">
                    <Badge variant={msg.is_read ? 'secondary' : 'default'}>
                      {msg.is_read ? 'Read' : 'Unread'}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                  {!msg.is_read && (
                    <Button size="sm" variant="outline" onClick={() => markAsRead(msg.id)} title="Mark as read">
                      <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                      Mark as Read
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => deleteMessage(msg.id)} className="text-red-600 hover:text-red-700" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <span className="font-semibold">From:</span> {msg.name} &lt;{msg.email}&gt;
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Message:</span>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 mt-1 whitespace-pre-line">
                    {msg.message}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesManager; 