import { CartProductPreview } from './product';

export interface OrderProduct {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface OrderDTO {
  id: number;
  userId: number;
  items: OrderItemDTO[];
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemDTO {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderPage {
  content: OrderDTO[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface OrderConfirmationRequest {
  shippingAddressId: number;
}

export interface CartConfirmation {
  cartId: number;
  userId: number;
  items: CartProductPreview[];
  totalPrice: number;
  shippingAddress: ShippingAddressResponse;
}

export interface ShippingAddressResponse {
  id: number;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
} 