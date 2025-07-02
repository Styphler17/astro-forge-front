import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Calendar, ExternalLink, ArrowLeft, Clock, Target, TrendingUp } from 'lucide-react';
import { apiClient, Project } from '../integrations/api/client';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await apiClient.getProjectById(id);
        setProject(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch project:', err);
        setError('Failed to load project details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in_progress':
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'planning':
        return 'Planning';
      case 'active':
        return 'Active';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <TrendingUp className="h-5 w-5" />;
      case 'in_progress':
        return <Clock className="h-5 w-5" />;
      case 'planning':
        return <Target className="h-5 w-5" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-astro-blue mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading project details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
              <p>{error || 'Project not found'}</p>
              <div className="mt-4 space-x-2">
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/projects">Back to Projects</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="text-astro-blue hover:text-blue-700">
            <Link to="/projects" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Projects</span>
            </Link>
          </Button>
        </div>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100">
              {project.title}
            </h1>
            <Badge className={`${getStatusColor(project.status)} text-sm px-3 py-1`}>
              <div className="flex items-center space-x-1">
                {getStatusIcon(project.status)}
                <span>{getStatusDisplay(project.status)}</span>
              </div>
            </Badge>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Created: {formatDate(project.created_at)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Updated: {formatDate(project.updated_at)}</span>
            </div>
          </div>
        </div>

        {/* Project Image */}
        {project.image_url && (
          <div className="mb-8">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        )}

        {/* Project Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                    {project.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Project Status</h4>
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusDisplay(project.status)}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Display Order</h4>
                      <p className="text-slate-600 dark:text-slate-400">#{project.display_order}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Created Date</h4>
                      <p className="text-slate-600 dark:text-slate-400">{formatDate(project.created_at)}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Last Updated</h4>
                      <p className="text-slate-600 dark:text-slate-400">{formatDate(project.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Project Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.project_url && (
                  <Button asChild className="w-full">
                    <a
                      href={project.project_url}
                      className="flex items-center justify-center space-x-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>View Project</span>
                    </a>
                  </Button>
                )}
                
                <Button variant="outline" asChild className="w-full">
                  <Link to="/contact" className="flex items-center justify-center space-x-2">
                    <span>Contact Us</span>
                  </Link>
                </Button>

                <Button variant="outline" asChild className="w-full">
                  <Link to="/projects" className="flex items-center justify-center space-x-2">
                    <span>All Projects</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetails; 