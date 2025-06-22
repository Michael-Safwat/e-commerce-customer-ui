import { create } from 'zustand';
import { Product, CartItem, CartState, CartProductPreview, CartPreview, AddToCartRequest } from '../types/product';
import { cartService } from '../services/cartService';
import { toast } from './use-toast';

interface CartStore extends CartState {
  backendCart: CartPreview | null;
  isLoading: boolean;
  
  // Backend methods (primary)
  addToCartBackend: (productId: number, quantity: number) => Promise<void>;
  removeFromCartBackend: (itemId: number) => Promise<void>;
  setProductQuantity: (productId: number, quantity: number) => Promise<void>;
  removeProductFromCart: (productId: number) => Promise<void>;
  clearCartBackend: () => Promise<void>;
  fetchCartBackend: () => Promise<void>;
  syncWithBackend: () => Promise<void>;
  clearCartData: () => void;
  
  // Legacy methods (for backward compatibility - simplified)
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>((set, get) => ({
  // Cart state (synced from backend)
  items: [],
  total: 0,
  itemCount: 0,
  backendCart: null,
  isLoading: false,

  // Backend methods (primary)
  addToCartBackend: async (productId: number, quantity: number) => {
    // Check if user is authenticated before making API call
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    if (!token) {
      throw new Error('Authentication required. Please login to add items to your cart.');
    }

    try {
      set({ isLoading: true });
      const request: AddToCartRequest = { productId, quantity };
      const cartPreview = await cartService.addToCart(request);
      
      // Update both backend cart and legacy state
      set({ backendCart: cartPreview, isLoading: false });
      
      // Sync the legacy state with backend data
      get().syncWithBackend();
      
      toast({ title: "Success", description: "Product added to cart successfully!" });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error adding to cart:', error);
      
      // Handle authentication errors specifically
      if (error instanceof Error && error.message.includes('Authentication required')) {
        toast({ 
          title: "Login required", 
          description: "Please login to add items to your cart.", 
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: "Error", 
          description: error instanceof Error ? error.message : "Failed to add product to cart", 
          variant: "destructive" 
        });
      }
    }
  },

  removeFromCartBackend: async (itemId: number) => {
    // Check if user is authenticated before making API call
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    if (!token) {
      throw new Error('Authentication required. Please login to manage your cart.');
    }

    try {
      set({ isLoading: true });
      
      // Find the product ID from the cart item ID and remove by setting quantity to 0
      const { backendCart } = get();
      const cartItem = backendCart?.items.find(item => item.id === itemId);
      if (!cartItem) {
        throw new Error('Cart item not found');
      }
      
      await cartService.removeProductFromCart(parseInt(cartItem.product.id));
      
      // Fetch updated cart from backend
      await get().fetchCartBackend();
      
      toast({ title: "Success", description: "Item removed from cart successfully!" });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error removing from cart:', error);
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to remove item from cart", variant: "destructive" });
    }
  },

  setProductQuantity: async (productId: number, quantity: number) => {
    // Check if user is authenticated before making API call
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    if (!token) {
      throw new Error('Authentication required. Please login to manage your cart.');
    }

    try {
      set({ isLoading: true });
      const cartPreview = await cartService.setProductQuantity(productId, quantity);
      
      // Update both backend cart and legacy state
      set({ backendCart: cartPreview, isLoading: false });
      
      // Sync the legacy state with backend data
      get().syncWithBackend();
      
      toast({ title: "Success", description: "Cart updated successfully!" });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error updating cart:', error);
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to update cart", variant: "destructive" });
    }
  },

  removeProductFromCart: async (productId: number) => {
    // Check if user is authenticated before making API call
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    if (!token) {
      throw new Error('Authentication required. Please login to manage your cart.');
    }

    try {
      set({ isLoading: true });
      await cartService.removeProductFromCart(productId);
      
      // Fetch updated cart from backend
      await get().fetchCartBackend();
      
      toast({ title: "Success", description: "Product removed from cart successfully!" });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error removing product from cart:', error);
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to remove product from cart", variant: "destructive" });
    }
  },

  clearCartBackend: async () => {
    // Check if user is authenticated before making API call
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    if (!token) {
      throw new Error('Authentication required. Please login to manage your cart.');
    }

    try {
      set({ isLoading: true });
      await cartService.clearCart();
      
      // Clear both backend cart and legacy state
      set({ 
        backendCart: null,
        items: [],
        total: 0,
        itemCount: 0,
        isLoading: false 
      });
      
      toast({ title: "Success", description: "Cart cleared successfully!" });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error clearing cart:', error);
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to clear cart", variant: "destructive" });
    }
  },

  fetchCartBackend: async () => {
    // Check if user is authenticated before making API call
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    if (!token) {
      // Don't throw error for fetch, just return early
      return;
    }

    try {
      set({ isLoading: true });
      const cartPreview = await cartService.getCartPreview();
      set({ backendCart: cartPreview, isLoading: false });
      
      // Sync legacy state with backend data
      get().syncWithBackend();
    } catch (error) {
      set({ isLoading: false });
      console.error('Error fetching cart:', error);
      // Don't show toast for fetch errors as they might be expected (empty cart, etc.)
    }
  },

  syncWithBackend: async () => {
    try {
      const { backendCart } = get();
      
      if (backendCart) {
        // Convert backend cart items to legacy format for component compatibility
        const legacyItems: CartItem[] = backendCart.items.map(item => ({
          id: item.product.id.toString(),
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          category: item.product.category,
          description: item.product.description,
          inStock: item.product.inStock,
          rating: item.product.rating,
          reviews: item.product.reviews,
          quantity: item.quantity,
        }));
        
        set({
          items: legacyItems,
          total: backendCart.totalPrice,
          itemCount: legacyItems.reduce((sum, item) => sum + item.quantity, 0),
        });
      } else {
        // If no backend cart (null), clear legacy state
        set({
          items: [],
          total: 0,
          itemCount: 0,
        });
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  },

  // Legacy methods (simplified - just for backward compatibility)
  addToCart: (product: Product) => {
    // Legacy method - redirect to backend method
    get().addToCartBackend(parseInt(product.id), 1);
  },

  removeFromCart: (productId: string) => {
    // Legacy method - remove product by setting quantity to 0
    get().removeProductFromCart(parseInt(productId));
  },

  updateQuantity: (productId: string, quantity: number) => {
    // Legacy method - find item and update via backend
    const { backendCart } = get();
    const cartItem = backendCart?.items.find(item => item.product.id.toString() === productId);
    if (cartItem) {
      get().setProductQuantity(parseInt(cartItem.product.id), quantity);
    }
  },

  clearCart: () => {
    // Legacy method - redirect to backend method
    get().clearCartBackend();
  },

  clearCartData: () => {
    // Clear all cart data without making API calls (for logout)
    set({ 
      backendCart: null,
      items: [],
      total: 0,
      itemCount: 0,
      isLoading: false 
    });
  },
}));