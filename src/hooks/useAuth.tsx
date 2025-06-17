import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

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
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate login API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email && password) {
          const userData = { email, isLoggedIn: true };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };

  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    // Simulate registration API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email && password) {
          const userData = { email, name, isLoggedIn: true };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isLoggedIn: !!user?.isLoggedIn
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
