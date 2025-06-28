import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { apiClient } from '../../integrations/api/client';
import { Save, FileText, Shield, RefreshCw } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface PrivacyPolicy {
  id: number;
  title: string;
  content: string;
  last_updated: string;
  created_at: string;
}

interface TermsOfService {
  id: number;
  title: string;
  content: string;
  last_updated: string;
  created_at: string;
}

const PrivacyTermsManager = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');
  const [privacyData, setPrivacyData] = useState<PrivacyPolicy | null>(null);
  const [termsData, setTermsData] = useState<TermsOfService | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [privacyForm, setPrivacyForm] = useState({ title: '', content: '' });
  const [termsForm, setTermsForm] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [privacy, terms] = await Promise.all([
        apiClient.getPrivacyPolicy(),
        apiClient.getTermsOfService()
      ]);
      
      setPrivacyData(privacy);
      setTermsData(terms);
      setPrivacyForm({ title: privacy.title, content: privacy.content });
      setTermsForm({ title: terms.title, content: terms.content });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacySave = async () => {
    try {
      setSaving(true);
      await apiClient.updatePrivacyPolicy(privacyForm);
      await fetchData(); // Refresh data
      toast({
        title: "Success",
        description: "Privacy policy updated successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating privacy policy:', error);
      toast({
        title: "Error",
        description: "Failed to update privacy policy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTermsSave = async () => {
    try {
      setSaving(true);
      await apiClient.updateTermsOfService(termsForm);
      await fetchData(); // Refresh data
      toast({
        title: "Success",
        description: "Terms of service updated successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating terms of service:', error);
      toast({
        title: "Error",
        description: "Failed to update terms of service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy & Terms</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage privacy policy and terms of service content
          </p>
        </div>
        <Button 
          onClick={fetchData}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
            activeTab === 'privacy' 
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Privacy Policy</span>
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
            activeTab === 'terms' 
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Terms of Service</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'privacy' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Privacy Policy</span>
            </CardTitle>
            {privacyData && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {formatDate(privacyData.last_updated)}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="privacy-title">Title</Label>
              <Input
                id="privacy-title"
                value={privacyForm.title}
                onChange={(e) => setPrivacyForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Privacy Policy"
              />
            </div>
            
            <div>
              <Label htmlFor="privacy-content">Content (HTML supported)</Label>
              <Textarea
                id="privacy-content"
                value={privacyForm.content}
                onChange={(e) => setPrivacyForm(prev => ({ ...prev, content: e.target.value }))}
                rows={20}
                placeholder="Enter privacy policy content..."
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
              </p>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handlePrivacySave} 
                disabled={saving}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Privacy Policy'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Terms of Service</span>
            </CardTitle>
            {termsData && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {formatDate(termsData.last_updated)}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="terms-title">Title</Label>
              <Input
                id="terms-title"
                value={termsForm.title}
                onChange={(e) => setTermsForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Terms of Service"
              />
            </div>
            
            <div>
              <Label htmlFor="terms-content">Content (HTML supported)</Label>
              <Textarea
                id="terms-content"
                value={termsForm.content}
                onChange={(e) => setTermsForm(prev => ({ ...prev, content: e.target.value }))}
                rows={20}
                placeholder="Enter terms of service content..."
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
              </p>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleTermsSave} 
                disabled={saving}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Terms of Service'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PrivacyTermsManager; 