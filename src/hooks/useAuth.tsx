import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authService, UserDTO } from '@/services/authService';
import { STORAGE_KEYS } from '@/config/api';

interface User {
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
  isLoggedIn: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authService.loginUser(email, password);
      
      // The backend now only returns a token.
      // We'll create a user object with the email used for login.
      // The name can be fetched later or decoded from the JWT if needed.
      const userData: User = {
        email: email,
        name: email.split('@')[0], // Use email prefix as a temporary name
        isLoggedIn: true,
      };

      setUser(userData);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isLoggedIn: !!user?.isLoggedIn,
      isLoading
    }}>
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
