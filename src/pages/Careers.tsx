import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { apiClient } from '../integrations/api/client';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Users, 
  Heart, 
  Globe, 
  Award, 
  MapPin, 
  Briefcase, 
  ArrowRight, 
  CheckCircle,
  Target,
  TrendingUp,
  Star,
  Clock,
  GraduationCap,
  DollarSign,
  ChevronDown,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience_level: string;
  description: string;
  requirements: string[];
  benefits: string[];
  is_active: boolean | number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface CareerBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  display_order: number;
  is_active: boolean | number;
  created_at: string;
  updated_at: string;
}

interface CareerCulture {
  id: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  is_active: boolean | number;
  created_at: string;
  updated_at: string;
}

interface CareerApplicationProcess {
  id: string;
  step_number: number;
  title: string;
  description: string;
  estimated_duration: string;
  display_order: number;
  is_active: boolean | number;
  created_at: string;
  updated_at: string;
}

interface CareerRequirement {
  id: string;
  title: string;
  description: string;
  category: string;
  display_order: number;
  is_active: boolean | number;
  created_at: string;
  updated_at: string;
}

const Careers = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [benefits, setBenefits] = useState<CareerBenefit[]>([]);
  const [culture, setCulture] = useState<CareerCulture[]>([]);
  const [applicationProcess, setApplicationProcess] = useState<CareerApplicationProcess[]>([]);
  const [requirements, setRequirements] = useState<CareerRequirement[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all career data from the new APIs
        const [jobs, benefitsData, cultureData, processData, requirementsData] = await Promise.all([
          apiClient.getJobPositions(),
          apiClient.getCareerBenefits(),
          apiClient.getCareerCulture(),
          apiClient.getCareerApplicationProcess(),
          apiClient.getCareerRequirements()
        ]);
        
        setJobPositions(jobs || []);
        setBenefits(benefitsData || []);
        setCulture(cultureData || []);
        setApplicationProcess(processData || []);
        setRequirements(requirementsData || []);
      } catch (err) {
        console.error('Failed to fetch careers data:', err);
        setError('Failed to load careers information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const departments = ['all', ...Array.from(new Set(jobPositions.map(job => job.department)))];
  const locations = ['all', ...Array.from(new Set(jobPositions.map(job => job.location)))];

  const filteredJobs = jobPositions.filter(job => {
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    return matchesDepartment && matchesLocation && job.is_active;
  });

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'part-time': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'contract': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'internship': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    // Convert kebab-case to PascalCase for icon names from API
    const convertToPascalCase = (str: string) => {
      return str.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join('');
    };
    
    const pascalCaseIconName = convertToPascalCase(iconName);
    
    const iconMap: { [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>> } = {
      'Heart': Heart,
      'Users': Users,
      'Award': Award,
      'Star': Star,
      'Target': Target,
      'TrendingUp': TrendingUp,
      'Clock': Clock,
      'GraduationCap': GraduationCap,
      'DollarSign': DollarSign,
      'CheckCircle': CheckCircle,
      'Briefcase': Briefcase,
      'MapPin': MapPin,
      'Globe': Globe
    };
    return iconMap[pascalCaseIconName] || Heart;
  };

  // Filter active items only
  const activeBenefits = benefits.filter(benefit => benefit.is_active);
  const activeCulture = culture.filter(item => item.is_active);
  const activeApplicationProcess = applicationProcess.filter(item => item.is_active);
  const activeRequirements = requirements.filter(item => item.is_active);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="pt-20 pb-16 bg-gradient-to-br from-astro-blue to-blue-800 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="mt-4 text-white">Loading careers information...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="pt-20 pb-16 bg-gradient-to-br from-astro-blue to-blue-800 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Careers</h1>
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div className="pt-20 pb-16 bg-gradient-to-br from-astro-blue to-blue-800 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center fade-in-scroll">
            <h1 className="text-5xl md:text-6xl font-bold font-poppins text-white mb-6">
              Join Our Mission
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Build the future of Africa with us. We're looking for passionate individuals who want to make a real impact.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-blue-100 mb-8">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>50+ Team Members</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>15+ Countries</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Industry Leader</span>
              </div>
            </div>
            
            {/* Quick Navigation */}
            <div className="flex flex-wrap justify-center gap-3">
              <Button 
                onClick={() => scrollToSection('why-work-with-us')}
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-astro-blue"
              >
                Why Work With Us
              </Button>
              <Button 
                onClick={() => scrollToSection('open-positions')}
                className="bg-white text-astro-blue hover:bg-gray-100"
              >
                View Open Positions
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Why Work With Us Section */}
      <section id="why-work-with-us" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Why Work With Us?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're building more than a company - we're building a movement for sustainable development across Africa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="bg-astro-blue text-white p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Purpose-Driven
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Work on projects that create real impact and transform communities across Africa.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="bg-astro-gold text-astro-blue p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Diverse Team
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Join a multicultural team with diverse perspectives and experiences from across the continent.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="bg-green-600 text-white p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Growth Opportunities
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Continuous learning and career development in a fast-growing, innovative environment.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="bg-purple-600 text-white p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Work-Life Balance
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Flexible work arrangements and comprehensive benefits to support your well-being.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Culture Section */}
      {activeCulture.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Culture
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Experience our vibrant culture that celebrates diversity, innovation, and collaboration.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {activeCulture.map((cultureItem, index) => (
                <Card key={cultureItem.id} className="text-center hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                  {cultureItem.image_url && (
                    <CardHeader className="p-0 rounded-t-lg overflow-hidden">
                      <img
                        src={cultureItem.image_url}
                        alt={cultureItem.title}
                        className="w-full h-40 object-cover"
                      />
                    </CardHeader>
                  )}
                  <CardContent className="flex-1 flex flex-col justify-center p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {cultureItem.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {cultureItem.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {activeBenefits.length > 0 && (
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Benefits & Perks
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We take care of our team with comprehensive benefits and perks that support your success.
            </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeBenefits.map((benefit, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center space-x-3 mb-4">
                    {(() => {
                      const IconComponent = getIconComponent(benefit.icon);
                      return <IconComponent className="h-6 w-6 text-astro-blue" />;
                    })()}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{benefit.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                  {benefit.category && (
                    <Badge variant="outline" className="mt-3">
                      {benefit.category}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Requirements Section */}
      {activeRequirements.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                What We Look For
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We value diverse perspectives and experiences. Here's what we typically look for in our team members.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeRequirements.map((requirement, index) => (
                <div key={requirement.id} className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{requirement.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{requirement.description}</p>
                  {requirement.category && (
                    <Badge variant="outline" className="mt-3">
                      {requirement.category}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Application Process Section */}
      {activeApplicationProcess.length > 0 && (
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Application Process
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our streamlined application process ensures a smooth experience from application to onboarding.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeApplicationProcess.map((step, index) => (
                  <div key={step.id} className="relative">
                    <div className="bg-astro-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mb-4 mx-auto">
                      {step.step_number}
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {step.description}
                      </p>
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>{step.estimated_duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Job Openings Section */}
      <section id="open-positions" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find your perfect role and join our mission to transform Africa through innovation and sustainable development.
            </p>
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''} available
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Positions</h3>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            {showFilters && (
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm mb-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Department
                    </label>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-astro-blue dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      aria-label="Filter by department"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>
                          {dept === 'all' ? 'All Departments' : dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-astro-blue dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      aria-label="Filter by location"
                    >
                      {locations.map(location => (
                        <option key={location} value={location}>
                          {location === 'all' ? 'All Locations' : location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {(selectedDepartment !== 'all' || selectedLocation !== 'all') && (
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={() => {
                        setSelectedDepartment('all');
                        setSelectedLocation('all');
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Job Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col bg-white dark:bg-gray-700">
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <div className="mb-4">
                      <Link to={`/careers/job/${job.id}`}>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-astro-blue transition-colors duration-300 cursor-pointer">
                          {job.title}
                        </h3>
                      </Link>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="text-xs">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {job.department}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {job.location}
                        </Badge>
                        <Badge className={`text-xs ${getJobTypeColor(job.employment_type)}`}>
                          {job.employment_type.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-3">
                      {job.description}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Requirements</h4>
                        <ul className="space-y-1">
                          {job.requirements.slice(0, 3).map((req, index) => (
                            <li key={index} className="flex items-start space-x-2 text-xs text-gray-600 dark:text-gray-300">
                              <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-1">{req}</span>
                            </li>
                          ))}
                          {job.requirements.length > 3 && (
                            <li className="text-xs text-gray-500 dark:text-gray-400">
                              +{job.requirements.length - 3} more requirements
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Benefits</h4>
                        <ul className="space-y-1">
                          {job.benefits.slice(0, 3).map((benefit, index) => (
                            <li key={index} className="flex items-start space-x-2 text-xs text-gray-600 dark:text-gray-300">
                              <Star className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-1">{benefit}</span>
                            </li>
                          ))}
                          {job.benefits.length > 3 && (
                            <li className="text-xs text-gray-500 dark:text-gray-400">
                              +{job.benefits.length - 3} more benefits
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <Link to={`/careers/job/${job.id}`}>
                      <Button className="w-full bg-astro-blue hover:bg-blue-700 text-white text-sm">
                        View Details & Apply
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-8 max-w-md mx-auto shadow-sm">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {jobPositions.length === 0 
                    ? 'No positions are currently available. Check back soon for new opportunities!'
                    : 'No positions match your current filters.'
                  }
                </p>
                {jobPositions.length > 0 && (
                  <Button 
                    onClick={() => {
                      setSelectedDepartment('all');
                      setSelectedLocation('all');
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-astro-blue to-blue-800 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Join our team and help us build a sustainable future for Africa. We're looking for passionate individuals who share our vision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-astro-blue hover:bg-gray-100"
              onClick={() => scrollToSection('open-positions')}
            >
              View All Positions
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-astro-blue"
              onClick={() => window.location.href = '/contact'}
            >
              Contact Our Team
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Careers; 