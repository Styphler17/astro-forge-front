import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, Target, ExternalLink, ArrowRight } from 'lucide-react';
import { apiClient, Project } from '../integrations/api/client';
import FilterBar from '../components/ui/filter-bar';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at_desc');
  const [filterBy, setFilterBy] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...projects];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterBy && filterBy !== 'all') {
      filtered = filtered.filter(project => 
        project.status.toLowerCase() === filterBy.toLowerCase()
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'created_at_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'created_at_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        case 'status_asc':
          return a.status.localeCompare(b.status);
        case 'status_desc':
          return b.status.localeCompare(a.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, searchQuery, sortBy, filterBy]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in progress':
        return 'bg-astro-gold/10 text-astro-gold dark:bg-astro-gold/20 dark:text-astro-gold/80';
      case 'planned':
        return 'bg-astro-blue/10 text-astro-blue dark:bg-astro-blue/20 dark:text-astro-blue/80';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
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

  // Get unique statuses for filter options
  const statusOptions = useMemo(() => {
    const statuses = [...new Set(projects.map(project => project.status))];
    return statuses.map(status => ({
      value: status.toLowerCase(),
      label: getStatusDisplay(status)
    }));
  }, [projects]);

  // Custom sort options for projects
  const sortOptions = [
    { value: 'created_at_desc', label: 'Newest First' },
    { value: 'created_at_asc', label: 'Oldest First' },
    { value: 'title_asc', label: 'Title A-Z' },
    { value: 'title_desc', label: 'Title Z-A' },
    { value: 'status_asc', label: 'Status A-Z' },
    { value: 'status_desc', label: 'Status Z-A' },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-astro-blue mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading projects...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Our Projects
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Discover our diverse portfolio of projects that are transforming communities and industries across Africa.
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          filterOptions={statusOptions}
          sortOptions={sortOptions}
          placeholder="Search projects..."
        />

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedProjects.length} of {projects.length} projects
            {(searchQuery || (filterBy && filterBy !== 'all')) && (
              <span className="ml-2">
                {searchQuery && `matching "${searchQuery}"`}
                {filterBy && filterBy !== 'all' && ` with status "${getStatusDisplay(filterBy)}"`}
              </span>
            )}
          </p>
        </div>

        {filteredAndSortedProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {projects.length === 0 
                  ? 'No projects found. Projects will appear here once they are added to the database.'
                  : 'No projects match your current filters.'
                }
              </p>
              {(searchQuery || (filterBy && filterBy !== 'all')) && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilterBy('');
                  }}
                  className="text-astro-blue hover:text-astro-blue/80 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image_url || '/placeholder.svg'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className={getStatusColor(project.status)}>
                      {getStatusDisplay(project.status)}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-astro-blue transition-colors duration-300">
                    {project.title}
                  </CardTitle>
                  <p className="text-slate-600 dark:text-slate-400 line-clamp-3">
                    {project.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {formatDate(project.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                      <Target className="h-4 w-4" />
                      <span>{getStatusDisplay(project.status)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <Link 
                      to={`/projects/${project.id}`}
                      className="inline-flex items-center space-x-2 text-astro-blue hover:text-astro-blue/80 transition-colors duration-300 font-medium"
                    >
                      <span>View Details</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                    
                    {project.project_url && (
                      <a
                        href={project.project_url}
                        className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors duration-300"
                      >
                        <span>External</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help bring your vision to life. Our team is ready to collaborate on innovative solutions.
          </p>
          <Link 
            to="/contact"
            className="inline-flex items-center bg-astro-blue hover:bg-astro-blue/80 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Projects;
