import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { apiClient, JobPosition, CareerBenefit, CareerCulture, CareerApplicationProcess, CareerRequirement } from '../../integrations/api/client';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw,
  Heart,
  Users,
  Clock,
  Target,
  GraduationCap,
  MapPin,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';

const CareersManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('job-positions');
  
  // Job Positions State
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [jobLoading, setJobLoading] = useState(true);
  const [jobSearchTerm, setJobSearchTerm] = useState('');
  
  // Career Benefits State
  const [benefits, setBenefits] = useState<CareerBenefit[]>([]);
  const [benefitsLoading, setBenefitsLoading] = useState(true);
  const [benefitsSearchTerm, setBenefitsSearchTerm] = useState('');
  
  // Career Culture State
  const [culture, setCulture] = useState<CareerCulture[]>([]);
  const [cultureLoading, setCultureLoading] = useState(true);
  const [cultureSearchTerm, setCultureSearchTerm] = useState('');
  
  // Career Application Process State
  const [process, setProcess] = useState<CareerApplicationProcess[]>([]);
  const [processLoading, setProcessLoading] = useState(true);
  const [processSearchTerm, setProcessSearchTerm] = useState('');
  
  // Career Requirements State
  const [requirements, setRequirements] = useState<CareerRequirement[]>([]);
  const [requirementsLoading, setRequirementsLoading] = useState(true);
  const [requirementsSearchTerm, setRequirementsSearchTerm] = useState('');

  const fetchCareersData = useCallback(async () => {
    try {
      // Fetch job positions
      const jobsData = await apiClient.getJobPositions();
      setJobPositions(jobsData || []);
      
      // Fetch career benefits
      const benefitsData = await apiClient.getCareerBenefits(false);
      setBenefits(benefitsData || []);
      
      // Fetch career culture
      const cultureData = await apiClient.getCareerCulture(false);
      setCulture(cultureData || []);
      
      // Fetch career application process
      const processData = await apiClient.getCareerApplicationProcess(false);
      setProcess(processData || []);
      
      // Fetch career requirements
      const requirementsData = await apiClient.getCareerRequirements(false);
      setRequirements(requirementsData || []);
      
    } catch (error) {
      console.error('Error fetching careers data:', error);
      toast({
        title: "Error",
        description: "Failed to load careers data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setJobLoading(false);
      setBenefitsLoading(false);
      setCultureLoading(false);
      setProcessLoading(false);
      setRequirementsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCareersData();
  }, [fetchCareersData]);

  // Job Positions Functions
  const deleteJobPosition = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;

    try {
      await apiClient.deleteJobPosition(id);
      toast({
        title: "Success",
        description: `Job position "${title}" has been deleted successfully.`,
        variant: "default",
      });
      fetchCareersData();
    } catch (error) {
      console.error('Error deleting job position:', error);
      toast({
        title: "Error",
        description: "Failed to delete job position. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleJobActive = async (id: string, currentStatus: boolean, title: string) => {
    try {
      await apiClient.updateJobPosition(id, { is_active: !currentStatus });
      const action = currentStatus ? 'deactivated' : 'activated';
      toast({
        title: "Success",
        description: `Job position "${title}" has been ${action} successfully.`,
        variant: "default",
      });
      fetchCareersData();
    } catch (error) {
      console.error('Error updating job position status:', error);
      toast({
        title: "Error",
        description: "Failed to update job position status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Career Benefits Functions
  const deleteBenefit = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;

    try {
      await apiClient.deleteCareerBenefit(id);
      toast({
        title: "Success",
        description: `Benefit "${title}" has been deleted successfully.`,
        variant: "default",
      });
      fetchCareersData();
    } catch (error) {
      console.error('Error deleting benefit:', error);
      toast({
        title: "Error",
        description: "Failed to delete benefit. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleBenefitActive = async (id: string, currentStatus: boolean, title: string) => {
    try {
      await apiClient.updateCareerBenefit(id, { is_active: !currentStatus });
      const action = currentStatus ? 'deactivated' : 'activated';
      toast({
        title: "Success",
        description: `Benefit "${title}" has been ${action} successfully.`,
        variant: "default",
      });
      fetchCareersData();
    } catch (error) {
      console.error('Error updating benefit status:', error);
      toast({
        title: "Error",
        description: "Failed to update benefit status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Career Culture Functions
  const deleteCulture = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;

    try {
      await apiClient.deleteCareerCulture(id);
      toast({
        title: "Success",
        description: `Culture item "${title}" has been deleted successfully.`,
        variant: "default",
      });
      fetchCareersData();
    } catch (error) {
      console.error('Error deleting culture item:', error);
      toast({
        title: "Error",
        description: "Failed to delete culture item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleCultureActive = async (id: string, currentStatus: boolean, title: string) => {
    try {
      await apiClient.updateCareerCulture(id, { is_active: !currentStatus });
      const action = currentStatus ? 'deactivated' : 'activated';
      toast({
        title: "Success",
        description: `Culture item "${title}" has been ${action} successfully.`,
        variant: "default",
      });
      fetchCareersData();
    } catch (error) {
      console.error('Error updating culture item status:', error);
      toast({
        title: "Error",
        description: "Failed to update culture item status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Application Process Functions
  const deleteProcess = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;

    try {
      await apiClient.deleteCareerApplicationProcess(id);
      toast({
        title: "Success",
        description: `Process step "${title}" has been deleted successfully.`,
        variant: "default",
      });
      fetchCareersData();
    } catch (error) {
      console.error('Error deleting process step:', error);
      toast({
        title: "Error",
        description: "Failed to delete process step. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleProcessActive = async (id: string, currentStatus: boolean, title: string) => {
    try {
      await apiClient.updateCareerApplicationProcess(id, { is_active: !currentStatus });
      const action = currentStatus ? 'deactivated' : 'activated';
      toast({
        title: "Success",
        description: `Process step "${title}" has been ${action} successfully.`,
        variant: "default",
      });
      fetchCareersData();
    } catch (error) {
      console.error('Error updating process step status:', error);
      toast({
        title: "Error",
        description: "Failed to update process step status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Requirements Functions
  const deleteRequirement = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;

    try {
      await apiClient.deleteCareerRequirement(id);
      toast({
        title: "Success",
        description: `Requirement "${title}" has been deleted successfully.`,
        variant: "default",
      });
      fetchCareersData();
    } catch (error) {
      console.error('Error deleting requirement:', error);
      toast({
        title: "Error",
        description: "Failed to delete requirement. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleRequirementActive = async (id: string, currentStatus: boolean, title: string) => {
    try {
      await apiClient.updateCareerRequirement(id, { is_active: !currentStatus });
      const action = currentStatus ? 'deactivated' : 'activated';
      toast({
        title: "Success",
        description: `Requirement "${title}" has been ${action} successfully.`,
        variant: "default",
      });
      fetchCareersData();
    } catch (error) {
      console.error('Error updating requirement status:', error);
      toast({
        title: "Error",
        description: "Failed to update requirement status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter functions
  const filteredJobPositions = jobPositions.filter(job =>
    job.title.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(jobSearchTerm.toLowerCase())
  );

  const filteredBenefits = benefits.filter(benefit =>
    benefit.title.toLowerCase().includes(benefitsSearchTerm.toLowerCase()) ||
    benefit.category.toLowerCase().includes(benefitsSearchTerm.toLowerCase())
  );

  const filteredCulture = culture.filter(culture =>
    culture.title.toLowerCase().includes(cultureSearchTerm.toLowerCase())
  );

  const filteredProcess = process.filter(process =>
    process.title.toLowerCase().includes(processSearchTerm.toLowerCase())
  );

  const filteredRequirements = requirements.filter(requirement =>
    requirement.title.toLowerCase().includes(requirementsSearchTerm.toLowerCase()) ||
    requirement.category.toLowerCase().includes(requirementsSearchTerm.toLowerCase())
  );

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>> } = {
      heart: Heart,
      users: Users,
      clock: Clock,
      target: Target,
      'graduation-cap': GraduationCap,
      'map-pin': MapPin,
      'dollar-sign': DollarSign,
    };
    return iconMap[iconName] || Heart;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      health: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      development: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'work-life': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      compensation: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      travel: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      culture: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      education: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      experience: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      technical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'soft-skills': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      general: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };
    return colors[category] || colors.general;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Careers Management</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage careers page content, job positions, benefits, culture, and more
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={fetchCareersData}
            disabled={jobLoading || benefitsLoading || cultureLoading || processLoading || requirementsLoading}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${(jobLoading || benefitsLoading || cultureLoading || processLoading || requirementsLoading) ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="job-positions">Job Positions</TabsTrigger>
          <TabsTrigger value="benefits">Benefits & Perks</TabsTrigger>
          <TabsTrigger value="culture">Company Culture</TabsTrigger>
          <TabsTrigger value="application-process">Application Process</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
        </TabsList>

        {/* Job Positions Tab */}
        <TabsContent value="job-positions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Job Positions ({jobPositions.length})</CardTitle>
                <Button 
                  onClick={() => navigate('/admin/careers/job-positions/new')}
                  className="bg-astro-blue text-white hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Position</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-6">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search job positions..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-astro-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={jobSearchTerm}
                  onChange={(e) => setJobSearchTerm(e.target.value)}
                />
              </div>

              {/* Job Positions Grid */}
              {jobLoading ? (
                <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-80 bg-gray-300 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobPositions.map((job) => (
                    <Card key={job.id} className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{job.title}</CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{job.department}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{job.location}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant={job.is_active ? "default" : "secondary"}>
                                {job.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                              <Badge variant="outline">{job.employment_type}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                          {job.description}
                        </p>
                        
                        <div className="flex space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/careers/job-positions/edit/${job.id}`)}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleJobActive(job.id, Boolean(job.is_active), job.title)}
                            className="flex-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            {job.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteJobPosition(job.id, job.title)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {filteredJobPositions.length === 0 && !jobLoading && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      {jobSearchTerm ? 'No job positions found matching your search.' : 'No job positions yet. Add your first position!'}
                    </p>
                    {!jobSearchTerm && (
                      <Button 
                        onClick={() => navigate('/admin/careers/job-positions/new')}
                        className="mt-4 bg-astro-blue text-white hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Position
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benefits & Perks Tab */}
        <TabsContent value="benefits" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Benefits & Perks ({benefits.length})</CardTitle>
                <Button 
                  onClick={() => navigate('/admin/careers/benefits/new')}
                  className="bg-astro-blue text-white hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Benefit</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-6">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search benefits..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-astro-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={benefitsSearchTerm}
                  onChange={(e) => setBenefitsSearchTerm(e.target.value)}
                />
              </div>

              {/* Benefits Grid */}
              {benefitsLoading ? (
                <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 bg-gray-300 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBenefits.map((benefit) => {
                    const IconComponent = getIconComponent(benefit.icon);
                    return (
                      <Card key={benefit.id} className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <IconComponent className="h-6 w-6 text-astro-blue" />
                                <CardTitle className="text-lg">{benefit.title}</CardTitle>
                              </div>
                              <Badge className={getCategoryColor(benefit.category)}>
                                {benefit.category}
                              </Badge>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge variant={benefit.is_active ? "default" : "secondary"}>
                                  {benefit.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                            {benefit.description}
                          </p>
                          
                          <div className="flex space-x-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/admin/careers/benefits/edit/${benefit.id}`)}
                              className="flex-1"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleBenefitActive(benefit.id, Boolean(benefit.is_active), benefit.title)}
                              className="flex-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              {benefit.is_active ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteBenefit(benefit.id, benefit.title)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {filteredBenefits.length === 0 && !benefitsLoading && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      {benefitsSearchTerm ? 'No benefits found matching your search.' : 'No benefits yet. Add your first benefit!'}
                    </p>
                    {!benefitsSearchTerm && (
                      <Button 
                        onClick={() => navigate('/admin/careers/benefits/new')}
                        className="mt-4 bg-astro-blue text-white hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Benefit
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Culture Tab */}
        <TabsContent value="culture" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Company Culture ({culture.length})</CardTitle>
                <Button 
                  onClick={() => navigate('/admin/careers/culture/new')}
                  className="bg-astro-blue text-white hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Culture Item</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-6">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search culture items..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-astro-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={cultureSearchTerm}
                  onChange={(e) => setCultureSearchTerm(e.target.value)}
                />
              </div>

              {/* Culture Grid */}
              {cultureLoading ? (
                <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-gray-300 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCulture.map((culture) => (
                    <Card key={culture.id} className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{culture.title}</CardTitle>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant={culture.is_active ? "default" : "secondary"}>
                                {culture.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-4">
                          {culture.description}
                        </p>
                        
                        {culture.image_url && (
                          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <img 
                              src={culture.image_url} 
                              alt={culture.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/careers/culture/edit/${culture.id}`)}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleCultureActive(culture.id, Boolean(culture.is_active), culture.title)}
                            className="flex-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            {culture.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteCulture(culture.id, culture.title)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {filteredCulture.length === 0 && !cultureLoading && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      {cultureSearchTerm ? 'No culture items found matching your search.' : 'No culture items yet. Add your first item!'}
                    </p>
                    {!cultureSearchTerm && (
                      <Button 
                        onClick={() => navigate('/admin/careers/culture/new')}
                        className="mt-4 bg-astro-blue text-white hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Culture Item
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Application Process Tab */}
        <TabsContent value="application-process" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Application Process ({process.length})</CardTitle>
                <Button 
                  onClick={() => navigate('/admin/careers/application-process/new')}
                  className="bg-astro-blue text-white hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Step</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-6">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search process steps..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-astro-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={processSearchTerm}
                  onChange={(e) => setProcessSearchTerm(e.target.value)}
                />
              </div>

              {/* Process Steps Grid */}
              {processLoading ? (
                <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 bg-gray-300 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProcess.map((process) => (
                    <Card key={process.id} className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="bg-astro-blue text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                {process.step_number}
                              </div>
                              <CardTitle className="text-lg">{process.title}</CardTitle>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={process.is_active ? "default" : "secondary"}>
                                {process.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                              <Badge variant="outline">{process.estimated_duration}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-4">
                          {process.description}
                        </p>
                        
                        <div className="flex space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/careers/application-process/edit/${process.id}`)}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleProcessActive(process.id, Boolean(process.is_active), process.title)}
                            className="flex-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            {process.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteProcess(process.id, process.title)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {filteredProcess.length === 0 && !processLoading && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      {processSearchTerm ? 'No process steps found matching your search.' : 'No process steps yet. Add your first step!'}
                    </p>
                    {!processSearchTerm && (
                      <Button 
                        onClick={() => navigate('/admin/careers/application-process/new')}
                        className="mt-4 bg-astro-blue text-white hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Step
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requirements Tab */}
        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>General Requirements ({requirements.length})</CardTitle>
                <Button 
                  onClick={() => navigate('/admin/careers/requirements/new')}
                  className="bg-astro-blue text-white hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Requirement</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-6">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requirements..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-astro-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={requirementsSearchTerm}
                  onChange={(e) => setRequirementsSearchTerm(e.target.value)}
                />
              </div>

              {/* Requirements Grid */}
              {requirementsLoading ? (
                <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 bg-gray-300 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRequirements.map((requirement) => (
                    <Card key={requirement.id} className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{requirement.title}</CardTitle>
                            <Badge className={getCategoryColor(requirement.category)}>
                              {requirement.category}
                            </Badge>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant={requirement.is_active ? "default" : "secondary"}>
                                {requirement.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                          {requirement.description}
                        </p>
                        
                        <div className="flex space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/careers/requirements/edit/${requirement.id}`)}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleRequirementActive(requirement.id, Boolean(requirement.is_active), requirement.title)}
                            className="flex-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            {requirement.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteRequirement(requirement.id, requirement.title)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {filteredRequirements.length === 0 && !requirementsLoading && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      {requirementsSearchTerm ? 'No requirements found matching your search.' : 'No requirements yet. Add your first requirement!'}
                    </p>
                    {!requirementsSearchTerm && (
                      <Button 
                        onClick={() => navigate('/admin/careers/requirements/new')}
                        className="mt-4 bg-astro-blue text-white hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Requirement
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CareersManager; 