import { API_CONFIG } from '@/config/api';
import { OrderDTO, OrderPage, OrderConfirmationRequest, CartConfirmation, PaymentIntentResponse } from '@/types/order';

class OrderService {
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
      console.error('Order API request failed:', error);
      throw error;
    }
  }

  // Get user ID from token
  private getUserIdFromToken(): string {
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const decodedToken = this.decodeToken(token);
    if (!decodedToken?.userId) {
      throw new Error('Invalid token - no userId found');
    }

    return decodedToken.userId;
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

  // Get all orders for a user
  async getAllOrders(page: number = 0, size: number = 10): Promise<OrderPage> {
    const userId = this.getUserIdFromToken();
    return this.makeRequest<OrderPage>(`/users/${userId}/orders?page=${page}&size=${size}`);
  }

  // Get a specific order by ID
  async getOrderById(orderId: number): Promise<OrderDTO> {
    const userId = this.getUserIdFromToken();
    return this.makeRequest<OrderDTO>(`/users/${userId}/orders/${orderId}`);
  }

  // Finalize order with shipping address
  async finalizeOrder(shippingAddressId: number): Promise<CartConfirmation> {
    const userId = this.getUserIdFromToken();
    const request: OrderConfirmationRequest = { shippingAddressId };
    return this.makeRequest<CartConfirmation>(`/users/${userId}/orders/finalizeOrder`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Create payment intent for Stripe
  async createPaymentIntent(orderId: number): Promise<PaymentIntentResponse> {
    const userId = this.getUserIdFromToken();
    return this.makeRequest<PaymentIntentResponse>(`/users/${userId}/pay`, {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  }
}

export const orderService = new OrderService(); 