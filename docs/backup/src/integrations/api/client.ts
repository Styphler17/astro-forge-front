// API Client for Astro Forge Holdings
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Type definitions
interface Service {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  icon?: string;
  image_url?: string;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  image_url?: string;
  email?: string;
  linkedin_url?: string;
  twitter_url?: string;
  is_active: boolean | number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  project_url?: string;
  status: 'active' | 'completed' | 'in_progress' | 'planning';
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featured_image?: string;
  author_id?: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  content?: string;
  meta_description?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_type: string;
  setting_value: string;
  updated_at: string;
}

interface ApiResponse {
  message: string;
  id?: string;
}

interface DashboardStats {
  content: {
    blogPosts: { total: number; published: number; draft: number };
    pages: { total: number; published: number; draft: number };
    projects: { total: number; active: number; statusBreakdown: Record<string, number> };
    services: { total: number; published: number; draft: number };
  };
  team: { total: number; active: number; inactive: number };
  users: { total: number; active: number; inactive: number };
  recentActivity: { blogPosts: number; projects: number };
  summary: { totalContent: number; publishedContent: number; totalTeam: number; totalUsers: number };
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  is_active: boolean | number;
  created_at: string;
  updated_at: string;
}

interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  description?: string;
  is_active: boolean | number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active: boolean | number;
  created_at: string;
  updated_at: string;
}

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

interface ThemeSettings {
  id: string;
  theme: 'light' | 'dark' | 'auto';
  primary_color: string;
  accent_color: string;
  astro_blue: string;
  astro_gold: string;
  astro_white: string;
  astro_accent: string;
  created_at: string;
  updated_at: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; message: string }>('/health');
  }

  // Database connection test
  async testDatabaseConnection() {
    return this.request<{ status: string; message: string }>('/db/test');
  }

  // Services API
  async getServices(publishedOnly: boolean = false) {
    return this.request<Service[]>(`/services?publishedOnly=${publishedOnly}`);
  }

  async getServiceById(id: string) {
    return this.request<Service>(`/services/${id}`);
  }

  async getServiceBySlug(slug: string) {
    return this.request<Service>(`/services/slug/${slug}`);
  }

  async createService(data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) {
    return this.request<ApiResponse>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id: string, data: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>) {
    return this.request<ApiResponse>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteService(id: string) {
    return this.request<ApiResponse>(`/services/${id}`, {
      method: 'DELETE',
    });
  }

  // Team Members API
  async getTeamMembers(activeOnly: boolean = false) {
    return this.request<TeamMember[]>(`/team-members?activeOnly=${activeOnly}`);
  }

  async getTeamMemberById(id: string) {
    return this.request<TeamMember>(`/team-members/${id}`);
  }

  async createTeamMember(data: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) {
    return this.request<ApiResponse>('/team-members', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTeamMember(id: string, data: Partial<Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>>) {
    return this.request<ApiResponse>(`/team-members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTeamMember(id: string) {
    return this.request<ApiResponse>(`/team-members/${id}`, {
      method: 'DELETE',
    });
  }

  // Projects API
  async getProjects() {
    return this.request<Project[]>('/projects');
  }

  async getProjectById(id: string) {
    return this.request<Project>(`/projects/${id}`);
  }

  async createProject(data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    return this.request<ApiResponse>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>) {
    return this.request<ApiResponse>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string) {
    return this.request<ApiResponse>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Blog Posts API
  async getBlogPosts(publishedOnly: boolean = false) {
    return this.request<BlogPost[]>(`/blog-posts?publishedOnly=${publishedOnly}`);
  }

  async getBlogPostById(id: string) {
    return this.request<BlogPost>(`/blog-posts/${id}`);
  }

  async getBlogPostBySlug(slug: string) {
    return this.request<BlogPost>(`/blog-posts/slug/${slug}`);
  }

  async createBlogPost(data: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) {
    return this.request<ApiResponse>('/blog-posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBlogPost(id: string, data: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>) {
    return this.request<ApiResponse>(`/blog-posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBlogPost(id: string) {
    return this.request<ApiResponse>(`/blog-posts/${id}`, {
      method: 'DELETE',
    });
  }

  async getRelatedBlogPosts(id: string, limit: number = 3) {
    return this.request<BlogPost[]>(`/blog-posts/${id}/related?limit=${limit}`);
  }

  // Pages API
  async getPages(publishedOnly: boolean = false) {
    return this.request<Page[]>(`/pages?publishedOnly=${publishedOnly}`);
  }

  async getPageById(id: string) {
    return this.request<Page>(`/pages/${id}`);
  }

  async getPageBySlug(slug: string) {
    return this.request<Page>(`/pages/slug/${slug}`);
  }

  async createPage(data: Omit<Page, 'id' | 'created_at' | 'updated_at'>) {
    return this.request<ApiResponse>('/pages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePage(id: string, data: Partial<Omit<Page, 'id' | 'created_at' | 'updated_at'>>) {
    return this.request<ApiResponse>(`/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePage(id: string) {
    return this.request<ApiResponse>(`/pages/${id}`, {
      method: 'DELETE',
    });
  }

  // Site Settings API
  async getSiteSettings() {
    return this.request<SiteSetting[]>('/site-settings');
  }

  async getSiteSettingByKey(key: string) {
    return this.request<SiteSetting>(`/site-settings/${key}`);
  }

  async updateSiteSetting(key: string, value: unknown, type: string = 'string') {
    return this.request<ApiResponse>(`/site-settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ setting_value: value, setting_type: type }),
    });
  }

  async createSiteSetting(key: string, value: unknown, type: string = 'string') {
    return this.request<ApiResponse>('/site-settings', {
      method: 'POST',
      body: JSON.stringify({ setting_key: key, setting_value: value, setting_type: type }),
    });
  }

  // Dashboard Stats API
  async getDashboardStats() {
    return this.request<DashboardStats>('/dashboard/stats');
  }

  // Sponsors API
  async getSponsors(activeOnly: boolean = false) {
    return this.request<Sponsor[]>(`/sponsors?activeOnly=${activeOnly}`);
  }

  async getSponsorById(id: string) {
    return this.request<Sponsor>(`/sponsors/${id}`);
  }

  async createSponsor(data: Omit<Sponsor, 'id' | 'created_at' | 'updated_at'>) {
    return this.request<ApiResponse>('/sponsors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSponsor(id: string, data: Partial<Omit<Sponsor, 'id' | 'created_at' | 'updated_at'>>) {
    return this.request<ApiResponse>(`/sponsors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSponsor(id: string) {
    return this.request<ApiResponse>(`/sponsors/${id}`, {
      method: 'DELETE',
    });
  }

  // Users API
  async getUsers() {
    return this.request<User[]>('/users');
  }

  async getUserById(id: string) {
    return this.request<User>(`/users/${id}`);
  }

  async createUser(data: { email: string; password_hash: string; name: string; role: 'admin' | 'editor' | 'viewer'; is_active?: boolean }) {
    return this.request<ApiResponse>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: { email: string; name: string; role: 'admin' | 'editor' | 'viewer'; is_active: boolean }) {
    return this.request<ApiResponse>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changeUserPassword(id: string, newPassword: string) {
    return this.request<ApiResponse>(`/users/${id}/password`, {
      method: 'PUT',
      body: JSON.stringify({ newPassword }),
    });
  }

  async deleteUser(id: string) {
    return this.request<ApiResponse>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Authentication API
  async login(credentials: { email: string; password: string }) {
    return this.request<{
      success: boolean;
      user: {
        id: string;
        email: string;
        name: string;
        role: 'admin' | 'editor' | 'viewer';
      };
      message: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Admin Profile API
  async getAdminProfile(userId: string) {
    return this.request<{
      id: string;
      name: string;
      email: string;
      image_url?: string;
      bio?: string;
      phone?: string;
      timezone?: string;
      language?: string;
      role: 'admin' | 'editor' | 'viewer';
      is_active: boolean | number;
      created_at: string;
      updated_at: string;
    }>(`/admin/profile?userId=${userId}`);
  }

  async updateAdminProfile(userId: string, data: {
    name?: string;
    email?: string;
    image_url?: string;
    bio?: string;
    phone?: string;
    timezone?: string;
    language?: string;
  }) {
    return this.request<ApiResponse>(`/admin/profile?userId=${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changeAdminPassword(data: {
    currentPassword: string;
    newPassword: string;
  }) {
    return this.request<ApiResponse>('/admin/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Contact Messages
  async sendMessage(data: { name: string; email: string; subject: string; message: string }) {
    return this.request<ApiResponse>('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMessages() {
    return this.request<ContactMessage[]>('/messages');
  }

  async markMessageRead(id: number) {
    return this.request<ApiResponse>(`/messages/${id}/read`, { method: 'PATCH' });
  }

  async deleteMessage(id: number) {
    return this.request<ApiResponse>(`/messages/${id}`, {
      method: 'DELETE',
    });
  }

  // Privacy Policy API
  async getPrivacyPolicy() {
    return this.request<{ id: number; title: string; content: string; last_updated: string; created_at: string }>('/privacy-policy');
  }

  async updatePrivacyPolicy(data: { title: string; content: string }) {
    return this.request<ApiResponse>('/privacy-policy', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Terms of Service API
  async getTermsOfService() {
    return this.request<{ id: number; title: string; content: string; last_updated: string; created_at: string }>('/terms-of-service');
  }

  async updateTermsOfService(data: { title: string; content: string }) {
    return this.request<ApiResponse>('/terms-of-service', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // FAQ API
  async getFaqs() {
    return this.request<FAQ[]>('/faqs');
  }

  async getAllFaqs() {
    return this.request<FAQ[]>('/faqs/all');
  }

  async createFaq(data: Omit<FAQ, 'id' | 'created_at' | 'updated_at'>) {
    return this.request<ApiResponse>('/faqs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFaq(id: string, data: Partial<Omit<FAQ, 'id' | 'created_at' | 'updated_at'>>) {
    return this.request<ApiResponse>(`/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFaq(id: string) {
    return this.request<ApiResponse>(`/faqs/${id}`, {
      method: 'DELETE',
    });
  }

  // Job Positions API
  async getJobPositions(activeOnly: boolean = true) {
    return this.request<JobPosition[]>(activeOnly ? '/job-positions' : '/job-positions/all');
  }

  async getJobPositionById(id: string) {
    return this.request<JobPosition>(`/job-positions/${id}`);
  }

  async createJobPosition(data: Omit<JobPosition, 'id' | 'created_at' | 'updated_at'>) {
    return this.request<ApiResponse>('/job-positions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateJobPosition(id: string, data: Partial<Omit<JobPosition, 'id' | 'created_at' | 'updated_at'>>) {
    return this.request<ApiResponse>(`/job-positions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJobPosition(id: string) {
    return this.request<ApiResponse>(`/job-positions/${id}`, {
      method: 'DELETE',
    });
  }

  // Career Benefits API
  async getCareerBenefits(activeOnly: boolean = true) {
    return this.request<CareerBenefit[]>(activeOnly ? '/career-benefits' : '/career-benefits/all');
  }

  async getCareerBenefitById(id: string) {
    return this.request<CareerBenefit>(`/career-benefits/${id}`);
  }

  async createCareerBenefit(data: Omit<CareerBenefit, 'id' | 'created_at' | 'updated_at'>) {
    return this.request<ApiResponse>('/career-benefits', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCareerBenefit(id: string, data: Partial<Omit<CareerBenefit, 'id' | 'created_at' | 'updated_at'>>) {
    return this.request<ApiResponse>(`/career-benefits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCareerBenefit(id: string) {
    return this.request<ApiResponse>(`/career-benefits/${id}`, {
      method: 'DELETE',
    });
  }

  // Career Culture API
  async getCareerCulture(activeOnly: boolean = true) {
    return this.request<CareerCulture[]>(activeOnly ? '/career-culture' : '/career-culture/all');
  }

  async getCareerCultureById(id: string) {
    return this.request<CareerCulture>(`/career-culture/${id}`);
  }

  async createCareerCulture(data: Omit<CareerCulture, 'id' | 'created_at' | 'updated_at'>) {
    return this.request<ApiResponse>('/career-culture', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCareerCulture(id: string, data: Partial<Omit<CareerCulture, 'id' | 'created_at' | 'updated_at'>>) {
    return this.request<ApiResponse>(`/career-culture/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCareerCulture(id: string) {
    return this.request<ApiResponse>(`/career-culture/${id}`, {
      method: 'DELETE',
    });
  }

  // Career Application Process API
  async getCareerApplicationProcess(activeOnly: boolean = true) {
    return this.request<CareerApplicationProcess[]>(activeOnly ? '/career-application-process' : '/career-application-process/all');
  }

  async getCareerApplicationProcessById(id: string) {
    return this.request<CareerApplicationProcess>(`/career-application-process/${id}`);
  }

  async createCareerApplicationProcess(data: Omit<CareerApplicationProcess, 'id' | 'created_at' | 'updated_at'>) {
    return this.request<ApiResponse>('/career-application-process', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCareerApplicationProcess(id: string, data: Partial<Omit<CareerApplicationProcess, 'id' | 'created_at' | 'updated_at'>>) {
    return this.request<ApiResponse>(`/career-application-process/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCareerApplicationProcess(id: string) {
    return this.request<ApiResponse>(`/career-application-process/${id}`, {
      method: 'DELETE',
    });
  }

  // Career Requirements API
  async getCareerRequirements(activeOnly: boolean = true) {
    return this.request<CareerRequirement[]>(activeOnly ? '/career-requirements' : '/career-requirements/all');
  }

  async getCareerRequirementById(id: string) {
    return this.request<CareerRequirement>(`/career-requirements/${id}`);
  }

  async createCareerRequirement(data: Omit<CareerRequirement, 'id' | 'created_at' | 'updated_at'>) {
    return this.request<ApiResponse>('/career-requirements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCareerRequirement(id: string, data: Partial<Omit<CareerRequirement, 'id' | 'created_at' | 'updated_at'>>) {
    return this.request<ApiResponse>(`/career-requirements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCareerRequirement(id: string) {
    return this.request<ApiResponse>(`/career-requirements/${id}`, {
      method: 'DELETE',
    });
  }

  async getThemeSettings(): Promise<ThemeSettings> {
    try {
      const response = await this.request<ThemeSettings>('/theme-settings');
      return response;
    } catch (error) {
      console.error('Error fetching theme settings:', error);
      // Return default theme settings if API fails
      return {
        id: '1',
        theme: 'auto',
        primary_color: '#3B82F6',
        accent_color: '#F59E0B',
        astro_blue: '#007bff',
        astro_gold: '#ffd700',
        astro_white: '#ffffff',
        astro_accent: '#ff5757',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  }

  async updateThemeSettings(settings: Partial<ThemeSettings>): Promise<ThemeSettings> {
    try {
      const response = await this.request<ThemeSettings>('/theme-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      return response;
    } catch (error) {
      console.error('Error updating theme settings:', error);
      throw error;
    }
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient();

// Export the class for testing purposes
export default ApiClient;

// Export types for use in other files
export type {
  Service,
  TeamMember,
  Project,
  BlogPost,
  Page,
  SiteSetting,
  ApiResponse,
  DashboardStats,
  User,
  Sponsor,
  ContactMessage,
  FAQ,
  JobPosition,
  CareerBenefit,
  CareerCulture,
  CareerApplicationProcess,
  CareerRequirement,
  ThemeSettings,
};

export const getCompanyInfo = async () => {
  const res = await fetch('/api/company-info');
  if (!res.ok) throw new Error('Failed to fetch company info');
  return res.json();
}; 