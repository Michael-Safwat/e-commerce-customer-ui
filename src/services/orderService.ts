import { API_CONFIG } from '@/config/api';
import { OrderDTO, OrderPage, OrderConfirmationRequest, CartConfirmation } from '@/types/order';

class OrderService {
  private baseUrl = `${API_CONFIG.BASE_URL}/users`;

  async getUserOrders(userId: string, page: number = 0, size: number = 10): Promise<OrderPage> {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('user_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `${this.baseUrl}/${userId}/orders?page=${page}&size=${size}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        // Handle unauthorized/forbidden responses
        if (response.status === 401 || response.status === 403) {
          console.warn('Token is invalid or expired, clearing data and redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Authentication required. Please login again.');
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }

  async getOrderById(userId: string, orderId: number): Promise<OrderDTO> {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('user_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `${this.baseUrl}/${userId}/orders/${orderId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        // Handle unauthorized/forbidden responses
        if (response.status === 401 || response.status === 403) {
          console.warn('Token is invalid or expired, clearing data and redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Authentication required. Please login again.');
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }

  async finalizeOrder(userId: string, request: OrderConfirmationRequest): Promise<CartConfirmation> {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('user_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `${this.baseUrl}/${userId}/orders/finalizeOrder`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        // Handle unauthorized/forbidden responses
        if (response.status === 401 || response.status === 403) {
          console.warn('Token is invalid or expired, clearing data and redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Authentication required. Please login again.');
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error finalizing order:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService(); 