import { API_CONFIG } from '../config/api';

export interface UserDTO {
  email: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isLoggedIn: boolean;
  profileImage?: string;
  birthday?: string;
  addresses?: string[];
  paymentMethods?: string[];
}

class UserService {
  private baseUrl = `${API_CONFIG.BASE_URL}/user`;

  async getUserProfile(userId: string): Promise<UserDTO> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        // Handle unauthorized/forbidden responses
        if (response.status === 401 || response.status === 403) {
          console.warn('Token is invalid or expired, clearing data and redirecting to login');
          // Clear stored authentication data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Redirect to login page
          window.location.href = '/login';
          throw new Error('Authentication required. Please login again.');
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Helper function to decode JWT token and extract user ID
  decodeToken(token: string): { userId: string; email: string } | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      return {
        userId: payload.userId || payload.sub, // Try both userId and sub claims
        email: payload.email
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}

export const userService = new UserService(); 