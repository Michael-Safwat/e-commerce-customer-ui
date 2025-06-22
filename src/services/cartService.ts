import { API_CONFIG } from '@/config/api';
import { AddToCartRequest, CartProductPreview, CartPreview } from '@/types/product';

// Add the CartRequest interface to match the backend
export interface CartRequest {
  productId: number;
  quantity: number;
}

class CartService {
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
      console.error('Cart API request failed:', error);
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

  // Add product to cart
  async addToCart(request: AddToCartRequest): Promise<CartPreview> {
    const userId = this.getUserIdFromToken();
    return this.makeRequest<CartPreview>(`/users/${userId}/cart`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Get cart preview
  async getCartPreview(): Promise<CartPreview | null> {
    const userId = this.getUserIdFromToken();
    try {
      return await this.makeRequest<CartPreview>(`/users/${userId}/cart`);
    } catch (error) {
      // Handle the case where backend returns "Your cart is empty"
      if (error instanceof Error && error.message.includes('Your cart is empty')) {
        return null; // Return null to indicate empty cart
      }
      throw error; // Re-throw other errors
    }
  }

  // Update cart item quantity - using PATCH endpoint as per backend
  async setProductQuantity(productId: number, quantity: number): Promise<CartPreview> {
    const userId = this.getUserIdFromToken();
    const request: CartRequest = { productId, quantity };
    return this.makeRequest<CartPreview>(`/users/${userId}/cart`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    });
  }

  // Remove product from cart by setting quantity to 0
  async removeProductFromCart(productId: number): Promise<CartPreview> {
    return this.setProductQuantity(productId, 0);
  }

  // Legacy method for backward compatibility
  async updateCartItemQuantity(itemId: number, quantity: number): Promise<CartPreview> {
    // This method is kept for backward compatibility but now uses the new API
    // We need to find the product ID from the cart item ID
    const cart = await this.getCartPreview();
    const cartItem = cart.items.find(item => item.id === itemId);
    if (!cartItem) {
      throw new Error('Cart item not found');
    }
    return this.setProductQuantity(parseInt(cartItem.product.id), quantity);
  }

  // Remove item from cart
  async removeFromCart(itemId: number): Promise<void> {
    const userId = this.getUserIdFromToken();
    return this.makeRequest<void>(`/users/${userId}/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  // Clear cart
  async clearCart(): Promise<void> {
    const userId = this.getUserIdFromToken();
    return this.makeRequest<void>(`/users/${userId}/cart`, {
      method: 'DELETE',
    });
  }
}

export const cartService = new CartService(); 