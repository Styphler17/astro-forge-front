import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../components/admin/AdminDashboard';
import BlogManager from '../components/admin/BlogManager';
import ProjectsManager from '../components/admin/ProjectsManager';
import TeamManager from '../components/admin/TeamManager';
import ServicesManager from '../components/admin/ServicesManager';
import SponsorsManager from '../components/admin/SponsorsManager';
import ThemeSettings from '../components/admin/ThemeSettings';
import HeroSettings from '../components/admin/HeroSettings';
import AboutSettings from '../components/admin/AboutSettings';
import Analytics from '../components/admin/Analytics';
import Settings from '../components/admin/Settings';
import Notifications from '../components/admin/Notifications';
import AdminProfile from '../components/admin/AdminProfile';
import BlogForm from '../components/admin/forms/BlogForm';
import ProjectForm from '../components/admin/forms/ProjectForm';
import TeamForm from '../components/admin/forms/TeamForm';
import ServiceForm from '../components/admin/forms/ServiceForm';
import SponsorForm from '../components/admin/forms/SponsorForm';
import UserForm from '../components/admin/forms/UserForm';
import UsersManager from '../components/admin/UsersManager';
import MessagesManager from '../components/admin/MessagesManager';
import PrivacyTermsManager from '../components/admin/PrivacyTermsManager';
import CareersManager from '../components/admin/CareersManager';
import FAQManager from '../components/admin/FAQManager';
import FAQForm from '../components/admin/forms/FAQForm';
import JobPositionForm from '../components/admin/forms/JobPositionForm';
import CareerBenefitForm from '../components/admin/forms/CareerBenefitForm';
import CareerCultureForm from '../components/admin/forms/CareerCultureForm';
import CareerApplicationProcessForm from '../components/admin/forms/CareerApplicationProcessForm';
import CareerRequirementForm from '../components/admin/forms/CareerRequirementForm';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, isLoading } = useAuth();
  const location = useLocation();
  
  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-astro-blue mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAdmin) {
    // Store the current path to redirect back after login
    const currentPath = location.pathname + location.search;
    if (currentPath !== '/admin/login') {
      localStorage.setItem('adminRedirectPath', currentPath);
    }
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

const Admin = () => {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="blog" element={<BlogManager />} />
          <Route path="blog/new" element={<BlogForm />} />
          <Route path="blog/edit/:id" element={<BlogForm />} />
          <Route path="projects" element={<ProjectsManager />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/edit/:id" element={<ProjectForm />} />
          <Route path="team" element={<TeamManager />} />
          <Route path="team/new" element={<TeamForm />} />
          <Route path="team/edit/:id" element={<TeamForm />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="services/new" element={<ServiceForm />} />
          <Route path="services/edit/:id" element={<ServiceForm />} />
          <Route path="sponsors" element={<SponsorsManager />} />
          <Route path="sponsors/new" element={<SponsorForm />} />
          <Route path="sponsors/edit/:id" element={<SponsorForm />} />
          <Route path="users" element={<UsersManager />} />
          <Route path="users/new" element={<UserForm />} />
          <Route path="users/edit/:id" element={<UserForm />} />
          <Route path="hero" element={<HeroSettings />} />
          <Route path="about" element={<AboutSettings />} />
          <Route path="theme" element={<ThemeSettings />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="messages" element={<MessagesManager />} />
          <Route path="privacy-terms" element={<PrivacyTermsManager />} />
          <Route path="careers" element={<CareersManager />} />
          <Route path="careers/job-positions/new" element={<JobPositionForm />} />
          <Route path="careers/job-positions/edit/:id" element={<JobPositionForm />} />
          <Route path="careers/benefits/new" element={<CareerBenefitForm />} />
          <Route path="careers/benefits/edit/:id" element={<CareerBenefitForm />} />
          <Route path="careers/culture/new" element={<CareerCultureForm />} />
          <Route path="careers/culture/edit/:id" element={<CareerCultureForm />} />
          <Route path="careers/application-process/new" element={<CareerApplicationProcessForm />} />
          <Route path="careers/application-process/edit/:id" element={<CareerApplicationProcessForm />} />
          <Route path="careers/requirements/new" element={<CareerRequirementForm />} />
          <Route path="careers/requirements/edit/:id" element={<CareerRequirementForm />} />
          <Route path="faq" element={<FAQManager />} />
          <Route path="faq/new" element={<FAQForm />} />
          <Route path="faq/edit/:id" element={<FAQForm />} />
        </Routes>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default Admin;
