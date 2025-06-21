import { API_CONFIG } from '@/config/api';
import axios from 'axios';

export interface UserRegistrationDTO {
  name: string;
  email: string;
  password: string;
}

export interface UserDTO {
  email: string;
  name: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

class AuthService {
  private handleUnauthorizedResponse(response: Response): void {
    if (response.status === 401 || response.status === 403) {
      console.warn('Token is invalid or expired, clearing data and redirecting to login');
      // Clear stored authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login page
      window.location.href = '/login';
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Remove Content-Type header for login requests to prevent browser auth popup
    if (endpoint === '/login') {
      delete defaultOptions.headers['Content-Type'];
    }

    try {
      const response = await fetch(url, defaultOptions);
      
      // Debug: Log response headers to identify WWW-Authenticate
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        // Handle unauthorized/forbidden responses first
        if (response.status === 401 || response.status === 403) {
          this.handleUnauthorizedResponse(response);
          const responseText = await response.text();
          throw new Error(responseText || 'Authentication required. Please login again.');
        }

        // Check if the response has WWW-Authenticate header (browser auth popup trigger)
        const wwwAuth = response.headers.get('WWW-Authenticate');
        if (wwwAuth) {
          console.warn('Server sent WWW-Authenticate header, this may cause browser auth popup:', wwwAuth);
        }

        // Spring Security's default 401 response for bad credentials has an empty body.
        // We will explicitly check for this status and throw the expected error message
        // so the UI can display the correct feedback.
        if (response.status === 401) {
          const responseText = await response.text();
          console.log('401 response text:', responseText);
          
          // Check for various locked/suspended account messages FIRST
          const lowerResponseText = responseText.toLowerCase();
          
          if (lowerResponseText.includes("locked") || 
              lowerResponseText.includes("suspended") || 
              lowerResponseText.includes("account is locked") ||
              lowerResponseText.includes("account is suspended") ||
              lowerResponseText.includes("user account is locked") ||
              lowerResponseText.includes("user account is suspended")) {
            throw new Error("User account is locked");
          }
          
          if (lowerResponseText.includes("disabled") || 
              lowerResponseText.includes("not enabled") ||
              lowerResponseText.includes("account is disabled") ||
              lowerResponseText.includes("User is disabled")) {
            throw new Error("User account is disabled");
          }
          
          // Only throw "Bad credentials" if it's actually a credential issue
          // and not a locked/disabled account issue
          if (responseText === "Bad credentials" || lowerResponseText.includes("bad credentials")) {
            throw new Error("Bad credentials");
          }
          
          // If we get here, it's some other 401 error
          throw new Error(responseText || "Authentication failed");
        }

        if (response.status === 404) {
          const responseText = await response.text();
          const lowerResponseText = responseText.toLowerCase();

          if (lowerResponseText.includes("user not found")) {
            throw new Error("User not found");
          }

          if (lowerResponseText.includes("disabled") || lowerResponseText.includes("not enabled")) {
            throw new Error("User account is disabled");
          }

          if (lowerResponseText.includes("full authentication is required")) {
            throw new Error("Full authentication is required to access this resource");
          }
        }

        if (response.status === 409) {
          const responseText = await response.text();
          console.log('409 response text:', responseText);
          // 409 typically means user exists but not verified
          if (responseText.includes("Verification email resent")) {
            throw new Error("User already exists but not verified. A new verification email has been sent.");
          }
          if (responseText.includes("already exists") )
          {
            throw new Error("User already exists");
          }
          throw new Error("User already exists");
        }

        if (response.status === 400) {
          const responseText = await response.text();
          console.log('400 response text:', responseText);
          if (responseText.includes("Invalid")) {
            throw new Error("Invalid email address");
          }
        }


        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // The backend often returns plain text on success, so we need to handle it.
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      }
      
      // We cast to `any` then `T` because the response is text but the generic type T might be different.
      return (await response.text()) as any as T;

    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async registerUser(registrationData: UserRegistrationDTO): Promise<string> {
    return this.makeRequest<string>('/users/register', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  }

  async verifyUser(token: string): Promise<string> {
    return this.makeRequest<string>(`/users/verify?token=${token}`, {
      method: 'GET',
    });
  }

  async loginUser(email: string, password: string): Promise<{ token: string }> {
    // For Basic Authentication, credentials are sent in a header.
    // The header value is 'Basic ' followed by the base64-encoded 'email:password' string.
    const headers = {
      'Authorization': 'Basic ' + btoa(`${email}:${password}`),
      // Remove Content-Type header for Basic Auth to prevent browser popup
    };

    try {
      const response = await this.makeRequest<any>('/login', {
        method: 'POST',
        headers: headers,
        // The body is empty for the login request when using Basic Auth.
      });

      // Handle both JSON and plain text responses
      if (typeof response === 'string') {
        // If response is a plain string (just the token)
        return { token: response };
      } else if (response && typeof response === 'object' && response.token) {
        // If response is a JSON object with token property
        return { token: response.token };
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async reactivate(email: string): Promise<string> {
    return this.makeRequest<string>(`/reactivate?email=${email}`, {
      method: 'POST',
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<string> {
    return this.makeRequest<string>(`/reset-password?token=${token}`, {
      method: 'PATCH',
      body: JSON.stringify({ newPassword }),
    });
  }

  // Debug method to help identify backend response patterns
  async debugLoginResponse(email: string, password: string): Promise<void> {
    const url = `${API_CONFIG.BASE_URL}/login`;
    const headers = {
      'Authorization': 'Basic ' + btoa(`${email}:${password}`),
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
      });

      console.log('=== DEBUG LOGIN RESPONSE ===');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Response Body:', responseText);
      console.log('Response Body Length:', responseText.length);
      console.log('Response Body (hex):', Buffer.from(responseText).toString('hex'));
      console.log('=== END DEBUG ===');

    } catch (error) {
      console.error('Debug request failed:', error);
    }
  }
}

export const authService = new AuthService(); 