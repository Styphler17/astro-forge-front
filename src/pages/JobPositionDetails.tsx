import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { apiClient, JobPosition } from '../integrations/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  MapPin, 
  Building2, 
  Clock, 
  ArrowLeft,
  CheckCircle,
  Star,
  Calendar,
  Briefcase,
  Share2
} from 'lucide-react';

const JobPositionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [jobPosition, setJobPosition] = useState<JobPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchJobPosition = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getJobPositionById(id);
        setJobPosition(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch job position:', err);
        setError('Job position not found');
        setJobPosition(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJobPosition();
  }, [id]);

  const getEmploymentTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'full-time': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'part-time': return 'bg-astro-blue/10 text-astro-blue dark:bg-astro-blue/20 dark:text-astro-blue/80';
      case 'contract': return 'bg-astro-gold/10 text-astro-gold dark:bg-astro-gold/20 dark:text-astro-gold/80';
      case 'internship': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getEmploymentTypeDisplay = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const shareJobPosition = (platform: string) => {
    const currentUrl = window.location.href;
    const jobTitle = jobPosition?.title || 'Job Position';
    const companyName = 'Astro Forge Holdings';
    
    let shareUrl = '';
    
    switch (platform) {
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(jobTitle)}&summary=${encodeURIComponent(`Check out this ${jobTitle} position at ${companyName}`)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(`Check out this ${jobTitle} position at ${companyName}!`)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`Check out this ${jobTitle} position at ${companyName}: ${currentUrl}`)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <Layout>
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-astro-blue mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading job position...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !jobPosition) {
    return (
      <Layout>
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
                <p>{error || 'Job position not found'}</p>
                <Button 
                  onClick={() => navigate('/careers')} 
                  className="mt-4 bg-astro-blue text-white hover:bg-astro-blue/80"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Careers
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
      {/* Hero Section */}
      <div className="pt-20 pb-16 bg-gradient-to-br from-astro-blue to-blue-800 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/careers')}
                className="text-white border-white hover:bg-gray-100 hover:text-astro-blue"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Careers
              </Button>
            </div>
            
            <div className="text-center">
              <Badge className={getEmploymentTypeColor(jobPosition.employment_type)}>
                {getEmploymentTypeDisplay(jobPosition.employment_type)}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
                {jobPosition.title}
              </h1>
              <div className="flex flex-wrap justify-center gap-6 text-white/90">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  <span>{jobPosition.department}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{jobPosition.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{jobPosition.experience_level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Job Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      Job Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {jobPosition.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Requirements */}
                {jobPosition.requirements && jobPosition.requirements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
                        Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {jobPosition.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Benefits */}
                {jobPosition.benefits && jobPosition.benefits.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <Star className="h-6 w-6 mr-2 text-yellow-600" />
                        Benefits & Perks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {jobPosition.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <Star className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Apply Button */}
                <Card>
                  <CardContent className="p-6">
                    <Button 
                      onClick={() => setShowApplicationForm(true)}
                      className="w-full bg-astro-blue text-white hover:bg-astro-blue/80 py-3 text-lg font-semibold"
                    >
                      Apply Now
                    </Button>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                      Join our team and make a difference
                    </p>
                  </CardContent>
                </Card>

                {/* Job Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      Job Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                        <p className="font-medium text-gray-900 dark:text-white">{jobPosition.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                        <p className="font-medium text-gray-900 dark:text-white">{jobPosition.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Employment Type</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {getEmploymentTypeDisplay(jobPosition.employment_type)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Experience Level</p>
                        <p className="font-medium text-gray-900 dark:text-white">{jobPosition.experience_level}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Posted</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(jobPosition.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Share */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Share2 className="h-5 w-5 mr-2" />
                      Share this Position
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => shareJobPosition('linkedin')}
                        className="flex items-center justify-center"
                      >
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => shareJobPosition('twitter')}
                        className="flex items-center justify-center"
                      >
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        Twitter
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => shareJobPosition('facebook')}
                        className="flex items-center justify-center"
                      >
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => shareJobPosition('whatsapp')}
                        className="flex items-center justify-center"
                      >
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                        WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Apply for {jobPosition.title}
                </h2>
                <Button 
                  variant="outline" 
                  onClick={() => setShowApplicationForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Enter your first name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-astro-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Enter your last name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-astro-blue"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="Enter your email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-astro-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input 
                    type="tel" 
                    placeholder="Enter your phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-astro-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cover Letter
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="Tell us why you're interested in this position..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-astro-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resume/CV *
                  </label>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    required
                    title="Upload your resume or CV"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-astro-blue"
                  />
                  <p className="text-sm text-gray-500 mt-1">PDF, DOC, or DOCX files only (max 5MB)</p>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setShowApplicationForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1 bg-astro-blue text-white hover:bg-astro-blue/80"
                  >
                    Submit Application
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default JobPositionDetails; 