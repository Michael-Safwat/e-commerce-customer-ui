import { API_CONFIG } from '@/config/api';
import { ShippingAddressRequest, ShippingAddressResponse, Address } from '@/types/address';

class AddressService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Handle unauthorized access
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Authentication required. Please login again.');
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Handle empty responses (like DELETE operations that return 204 No Content)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }

      // Check if response has content before trying to parse JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      // For non-JSON responses, return empty object
      return {} as T;
    } catch (error) {
      console.error('Address API request failed:', error);
      throw error;
    }
  }

  // Get all addresses for a user
  async getAllAddresses(userId: string): Promise<ShippingAddressResponse[]> {
    return this.makeRequest<ShippingAddressResponse[]>(`/users/${userId}/addresses`);
  }

  // Get a specific address by ID
  async getAddressById(userId: string, addressId: number): Promise<ShippingAddressResponse> {
    return this.makeRequest<ShippingAddressResponse>(`/users/${userId}/addresses/${addressId}`);
  }

  // Create a new address
  async createAddress(userId: string, addressData: ShippingAddressRequest): Promise<ShippingAddressResponse> {
    return this.makeRequest<ShippingAddressResponse>(`/users/${userId}/addresses`, {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  // Update an existing address
  async updateAddress(userId: string, addressId: number, addressData: ShippingAddressRequest): Promise<ShippingAddressResponse> {
    return this.makeRequest<ShippingAddressResponse>(`/users/${userId}/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  }

  // Delete an address
  async deleteAddress(userId: string, addressId: number): Promise<void> {
    return this.makeRequest<void>(`/users/${userId}/addresses/${addressId}`, {
      method: 'DELETE',
    });
  }

  // Legacy method for backward compatibility - converts ShippingAddressResponse to Address format
  async fetchAddresses(): Promise<Address[]> {
    // Get user ID from token
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Decode token to get userId
    const decodedToken = this.decodeToken(token);
    if (!decodedToken?.userId) {
      throw new Error('Invalid token - no userId found');
    }

    const addresses = await this.getAllAddresses(decodedToken.userId);
    
    // Convert to legacy format
    return addresses.map(addr => ({
      id: addr.id,
      label: `${addr.street}, ${addr.city}, ${addr.state}, ${addr.country}`
    }));
  }

  private decodeToken(token: string): { userId: string; email: string } | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      
      return {
        userId: payload.userId || payload.sub,
        email: payload.email || ''
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}

export const addressService = new AddressService();

// Legacy export for backward compatibility
export const fetchAddresses = () => addressService.fetchAddresses();