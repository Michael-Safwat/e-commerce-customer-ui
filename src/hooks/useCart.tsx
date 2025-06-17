import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, CartState, Product } from '../types/product';
import { toast } from '@/hooks/use-toast';

type CartContextType = {
  cart: CartState;
  addToCart: (product: Product, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (productId: string, selectedColor?: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedColor?: string, selectedSize?: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartState>({
    items: [],
    total: 0,
    itemCount: 0
  });

  const updateCartTotals = useCallback((items: CartItem[]) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { total, itemCount };
  }, []);

  const addToCart = useCallback((product: Product, selectedColor?: string, selectedSize?: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(
        item => item.id === product.id && 
                item.selectedColor === selectedColor && 
                item.selectedSize === selectedSize
      );

      let newItems: CartItem[];
      
      if (existingItem) {
        newItems = prevCart.items.map(item =>
          item.id === product.id && 
          item.selectedColor === selectedColor && 
          item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const cartItem: CartItem = {
          ...product,
          quantity: 1,
          selectedColor,
          selectedSize
        };
        newItems = [...prevCart.items, cartItem];
      }

      const { total, itemCount } = updateCartTotals(newItems);
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });

      return {
        items: newItems,
        total,
        itemCount
      };
    });
  }, [updateCartTotals]);

  const removeFromCart = useCallback((productId: string, selectedColor?: string, selectedSize?: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(
        item => !(item.id === productId && 
                 item.selectedColor === selectedColor && 
                 item.selectedSize === selectedSize)
      );
      
      const { total, itemCount } = updateCartTotals(newItems);
      
      return {
        items: newItems,
        total,
        itemCount
      };
    });
  }, [updateCartTotals]);

  const updateQuantity = useCallback((productId: string, quantity: number, selectedColor?: string, selectedSize?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor, selectedSize);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.id === productId && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      );
      
      const { total, itemCount } = updateCartTotals(newItems);
      
      return {
        items: newItems,
        total,
        itemCount
      };
    });
  }, [updateCartTotals, removeFromCart]);

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      total: 0,
      itemCount: 0
    });
  }, []);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};