export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}

// Legacy cart item interface for backward compatibility
export interface CartItem extends Product {
  quantity: number;
}

// Legacy cart state interface for backward compatibility
export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// New cart types for backend integration
export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface CartProductPreview {
  id: number;
  product: Product;
  quantity: number;
}

export interface CartPreview {
  id: number;
  userId: number;
  items: CartProductPreview[];
  totalPrice: number;
}
