import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { authService, UserDTO } from '@/services/authService';
import { userService } from '@/services/userService';
import { STORAGE_KEYS } from '@/config/api';

interface User {
  id: string;
  email: string;
  name?: string;
  isLoggedIn: boolean;
  profileImage?: string; 
  birthday?: string; // Optional field for user's birthday
  addresses?: string[]; // Optional field for user's addresses
  paymentMethods?: string[]; // Optional field for user's payment methods
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: () => boolean;
  validateToken: () => Promise<boolean>;
  isLoading: boolean;
  refreshUserProfile: () => Promise<void>;
  setLogoutCallback: (callback: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [logoutCallback, setLogoutCallback] = useState<() => void>(() => {});

  // Function to decode JWT token and extract user info
  const decodeToken = (token: string): { userId: string; email: string } | null => {
    try {
      if (!token || typeof token !== 'string') {
        console.error('Invalid token provided:', token);
        return null;
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid JWT token format');
        return null;
      }

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      
      // Check if required fields exist
      if (!payload.userId && !payload.sub) {
        console.error('No userId or sub found in token payload');
        return null;
      }

      return {
        userId: payload.userId || payload.sub, // Try both userId and sub claims
        email: payload.email || ''
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Function to fetch user profile from backend
  const fetchUserProfile = async (userId: string, email: string): Promise<User> => {
    try {
      console.log('Fetching user profile for userId:', userId, 'email:', email);
      
      if (!userId) {
        throw new Error('No userId provided for profile fetch');
      }

      const userData = await userService.getUserProfile(userId);
      console.log('User profile data received:', userData);
      
      return {
        id: userId, // Use the userId from token since UserDTO doesn't have id
        email: userData.email || email,
        name: userData.name || 'Unknown User',
        isLoggedIn: true,
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Return a basic user object if profile fetch fails
      return {
        id: userId,
        email: email,
        name: 'Unknown User',
        isLoggedIn: true,
      };
    }
  };

  // Function to refresh user profile
  const refreshUserProfile = async (): Promise<void> => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN) || localStorage.getItem('token');
    if (!token) return;

    const decodedToken = decodeToken(token);
    if (!decodedToken) return;

    try {
      const userProfile = await fetchUserProfile(decodedToken.userId, decodedToken.email);
      setUser(userProfile);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userProfile));
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
    }
  };

  // Initialize auth state on app startup
  const initializeAuth = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN) || localStorage.getItem('token');
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER) || localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        console.log('Initializing auth with stored token and user');
        const decodedToken = decodeToken(token);
        
        if (decodedToken) {
          console.log('Token is valid, fetching fresh user profile');
          const userProfile = await fetchUserProfile(decodedToken.userId, decodedToken.email);
          setUser(userProfile);
        } else {
          console.log('Token is invalid, clearing stored data');
          logout();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        logout();
      }
    }
    
    setIsLoading(false);
  }, []);

  // Effect to initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Starting login process for:', email);
      const response = await authService.loginUser(email, password);
      
      console.log('Login response received:', response);
      
      // Check if we received a valid token
      if (!response || !response.token) {
        console.error('No token received from server:', response);
        throw new Error('No token received from server');
      }

      console.log('Token received, attempting to decode...');
      
      // Decode token to get user ID
      const decodedToken = decodeToken(response.token);
      console.log('Decoded token:', decodedToken);
      
      if (!decodedToken) {
        console.error('Failed to decode token');
        throw new Error('Invalid token received from server');
      }

      console.log('Token decoded successfully, fetching user profile...');

      // Store token first
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);

      // Fetch user profile from backend immediately
      const userProfile = await fetchUserProfile(decodedToken.userId, decodedToken.email);
      console.log('User profile fetched:', userProfile);

      // Set user state and store in localStorage
      setUser(userProfile);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userProfile));
      
      console.log('Login completed successfully');
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (email: string, password: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const userData = await authService.registerUser({
        email,
        password,
        name: name || '',
      });

      // Don't automatically log in after registration since email verification is required
      // The user will need to verify their email first
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = useCallback((): boolean => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN) || localStorage.getItem('token');
    if (!token) return false;
    
    const decodedToken = decodeToken(token);
    if (!decodedToken) {
      console.log('Token is invalid, logging out user');
      logout();
      return false;
    }
    
    return true;
  }, []);

  // Validate token and refresh user profile if needed
  const validateToken = useCallback(async (): Promise<boolean> => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN) || localStorage.getItem('token');
    if (!token) return false;
    
    const decodedToken = decodeToken(token);
    if (!decodedToken) {
      console.log('Token is invalid, logging out user');
      logout();
      return false;
    }
    
    try {
      // Try to fetch user profile to validate token
      const userProfile = await fetchUserProfile(decodedToken.userId, decodedToken.email);
      setUser(userProfile);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userProfile));
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      logout();
      return false;
    }
  }, []);

  const logout = () => {
    console.log('Logging out user, clearing all data');
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    // Also clear any other auth-related data that might be stored
    localStorage.removeItem('token'); // Fallback for any direct token storage
    localStorage.removeItem('user'); // Fallback for any direct user storage
    logoutCallback();
  };

  const value = {
    user,
    login,
    logout,
    register,
    isAuthenticated,
    validateToken,
    isLoading,
    refreshUserProfile,
    setLogoutCallback
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
