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
  status: string;
  totalPrice: number;
  shippingAddress: string;
  items: OrderProduct[];
  createdAt: string; // ISO date string
}

export interface OrderPage {
  content: OrderDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

export interface OrderConfirmationRequest {
  shippingAddress: string;
}

export interface CartConfirmation {
  // Add properties based on your CartConfirmation DTO
  // This will be used for checkout confirmation
} 