// Shipping Address Types matching backend DTOs

export interface ShippingAddressRequest {
  street: string;
  city: string;
  state: string;
  country: string;
}

export interface ShippingAddressResponse {
  id: number;
  street: string;
  city: string;
  state: string;
  country: string;
}

// Legacy Address type for backward compatibility
export interface Address {
  id: number;
  label: string;
} 