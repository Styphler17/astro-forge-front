import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuthStatus = () => {
      try {
        const authStatus = localStorage.getItem('isAdmin');
        setIsAdmin(authStatus === 'true');
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = () => {
    try {
      localStorage.setItem('isAdmin', 'true');
      setIsAdmin(true);
    } catch (error) {
      console.error('Error setting auth status:', error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminRedirectPath'); // Clean up redirect path
      setIsAdmin(false);
    } catch (error) {
      console.error('Error clearing auth status:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context for use in the hook file
export { AuthContext }; 