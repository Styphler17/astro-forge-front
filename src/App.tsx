import { useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import DynamicPage from "./pages/DynamicPage";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import ServiceDetails from "./pages/services/ServiceDetails";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Careers from "./pages/Careers";
import JobPositionDetails from "./pages/JobPositionDetails";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import ErrorBoundary from './components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  // Clear old authentication cache on app start
  useEffect(() => {
    const clearOldAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          // Check if we're using the old user ID
          if (userData && userData.id === '9e169570-548c-11f0-bc07-345a60293f45') {
            console.log('🧹 Detected old user ID, clearing authentication cache...');
            localStorage.removeItem('user');
            localStorage.removeItem('adminRedirectPath');
            sessionStorage.clear();
          }
        }
      } catch (error) {
        console.error('Error clearing old auth:', error);
      }
    };

    clearOldAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <TooltipProvider>
              <Toaster />
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetails />} />
                  <Route path="/services/:slug" element={<ServiceDetails />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/careers/job/:id" element={<JobPositionDetails />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/*" element={<Admin />} />
                  <Route path="/dynamic-page/:slug" element={<DynamicPage />} />
                  <Route path="/:slug" element={<DynamicPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </TooltipProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
