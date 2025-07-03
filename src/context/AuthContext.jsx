import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user is authenticated by calling a protected endpoint
      const response = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        credentials: 'include', // Important: This sends cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        // Not authenticated or session expired
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password, role) => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        credentials: 'include', // FIXED: Added credentials to send/receive cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // FIXED: Don't store in localStorage, rely on server session
        const userData = {
          email,
          role,
          ...data.user // Include any additional user data from API
        };

        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, data };
      } else {
        return { 
          success: false, 
          error: data.message || "Login failed. Please check your credentials." 
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        error: "Network error. Please check your connection and try again." 
      };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to destroy session on server
      await fetch("http://localhost:3000/api/admin/logout", {
        method: "POST",
        credentials: 'include', // Important: This sends cookies
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state regardless of API call success
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus, // Expose this for manual auth checks
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};