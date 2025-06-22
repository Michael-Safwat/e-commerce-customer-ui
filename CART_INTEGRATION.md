# Cart Integration with Backend

This document explains the implementation of the cart functionality that integrates with your backend API.

## Overview

The cart system is designed around a **single-cart-per-customer** model where:
- Each customer has exactly one cart associated with their user ID
- The backend manages all cart logic and persistence
- The frontend syncs with the backend cart state
- No local cart storage is needed (backend handles everything)

## Backend Cart Model

### Single Cart Per Customer
- **User ID**: Each customer is identified by their user ID from the JWT token
- **Single Cart**: Each customer has exactly one cart in the database
- **Cart Association**: Products are added to the customer's existing cart
- **Persistence**: Cart data is stored in the database and persists across sessions

## Backend API Endpoints

The cart service communicates with the following backend endpoints:

- `POST /users/{userId}/cart` - Add product to customer's cart
- `GET /users/{userId}/cart` - Get customer's cart preview
- `PUT /users/{userId}/cart/items/{itemId}` - Update cart item quantity
- `DELETE /users/{userId}/cart/items/{itemId}` - Remove item from cart
- `DELETE /users/{userId}/cart` - Clear customer's cart

## DTOs

### AddToCartRequest
```typescript
interface AddToCartRequest {
  productId: number;
  quantity: number;
}
```

### CartPreview (Response)
```typescript
interface CartPreview {
  id: number;
  userId: number;
  items: CartProductPreview[];
  totalPrice: number;
}
```

### CartProductPreview
```typescript
interface CartProductPreview {
  id: number;
  product: Product;
  quantity: number;
}
```

## Implementation Details

### Cart Service (`src/services/cartService.ts`)

The cart service handles all API communication with the backend:

- **Authentication**: Uses JWT tokens from localStorage
- **User ID Extraction**: Decodes JWT token to get customer's user ID
- **Error Handling**: Handles 401/403 responses by redirecting to login
- **Single Cart Model**: All operations work with the customer's single cart

### Cart Hook (`src/hooks/useCart.tsx`)

The cart hook provides a unified interface for cart operations. **Important**: The hook returns individual properties, not a cart object.

#### Hook Return Value:
```typescript
const { 
  items,           // CartItem[] - legacy cart items (synced from backend)
  total,           // number - total price (synced from backend)
  itemCount,       // number - total item count (synced from backend)
  backendCart,     // CartPreview | null - backend cart data
  isLoading,       // boolean - loading state
  addToCartBackend,        // Primary method - add to backend cart
  removeFromCartBackend,   // Primary method - remove from backend cart
  updateQuantityBackend,   // Primary method - update quantity in backend cart
  clearCartBackend,        // Primary method - clear backend cart
  fetchCartBackend,        // Primary method - fetch cart from backend
  syncWithBackend          // Sync method - sync backend with legacy state
} = useCart();
```

#### Primary Backend Methods:
- `addToCartBackend(productId, quantity)` - Add product to customer's cart
- `removeFromCartBackend(itemId)` - Remove item from customer's cart
- `updateQuantityBackend(itemId, quantity)` - Update quantity in customer's cart
- `clearCartBackend()` - Clear customer's cart
- `fetchCartBackend()` - Fetch customer's cart from backend
- `syncWithBackend()` - Sync backend cart with legacy state for component compatibility

#### Legacy Methods (simplified):
- `addToCart(product)` - Redirects to `addToCartBackend`
- `removeFromCart(productId)` - Finds item and calls `removeFromCartBackend`
- `updateQuantity(productId, quantity)` - Finds item and calls `updateQuantityBackend`
- `clearCart()` - Redirects to `clearCartBackend`

### Components Updated

1. **ProductCard**: Uses `addToCartBackend` directly - no double API calls
2. **ProductDetails**: Uses `addToCartBackend` with selected quantity
3. **Index**: Syncs with backend on load and uses backend methods
4. **Cart**: Works with synced cart data from backend

## Usage Examples

### Using the Cart Hook

```typescript
// Correct usage - destructure individual properties
const { items, total, itemCount, addToCartBackend } = useCart();

// Incorrect usage - don't try to destructure a 'cart' object
// const { cart } = useCart(); // This will not work
```

### Adding a Product to Cart

```typescript
const { addToCartBackend } = useCart();

// Add product with quantity 1 (single API call)
await addToCartBackend(123, 1);

// Add product with specific quantity (single API call)
await addToCartBackend(123, 5);
```

### Updating Cart Item Quantity

```typescript
const { updateQuantityBackend } = useCart();

// Update quantity to 3 (single API call)
await updateQuantityBackend(itemId, 3);
```

### Removing Item from Cart

```typescript
const { removeFromCartBackend } = useCart();

// Remove item by cart item ID (single API call)
await removeFromCartBackend(itemId);
```

### Syncing with Backend

```typescript
const { syncWithBackend } = useCart();

// Sync backend cart with local state (for component compatibility)
await syncWithBackend();
```

## Flow Description

### Adding from Products Page
1. User clicks "Add to Cart" button on product card
2. System checks if user is authenticated
3. If not authenticated, redirects to login
4. If authenticated, calls `addToCartBackend(productId, 1)` **once**
5. Backend adds product to customer's cart and returns updated cart
6. Frontend updates cart state and shows success toast

### Adding from Product Details Page
1. User selects quantity using +/- buttons
2. User clicks "Add to Cart" button
3. System checks if user is authenticated
4. If not authenticated, redirects to login
5. If authenticated, calls `addToCartBackend(productId, selectedQuantity)` **once**
6. Backend adds product to customer's cart and returns updated cart
7. Frontend updates cart state and shows success toast

### Cart Synchronization
1. On page load, `syncWithBackend()` is called
2. Backend returns customer's current cart state
3. Frontend syncs legacy state with backend data
4. Components display synced cart information

## Key Benefits

### Single API Call Model
- **No Double API Calls**: Each cart operation makes exactly one API call
- **Backend-Driven**: All cart logic is handled by the backend
- **Consistent State**: Frontend always reflects backend cart state

### Single Cart Per Customer
- **Persistent**: Cart persists across sessions and devices
- **Consistent**: Same cart accessible from any device
- **Simple**: No need to manage multiple cart states

### Error Handling
- **Authentication Errors (401/403)**: Automatically redirects to login page
- **Network Errors**: Shows error toast with descriptive message
- **Validation Errors**: Shows error toast with backend error message
- **Empty Cart**: Gracefully handles empty cart states

## Backward Compatibility

The implementation maintains backward compatibility with existing components by:

1. **Legacy State**: Keeping legacy cart state (items, total, itemCount) synced with backend
2. **Legacy Methods**: Providing legacy methods that redirect to backend methods
3. **Component Compatibility**: Components can work with both legacy and backend data
4. **Gradual Migration**: Components can be gradually updated to use backend methods

## Future Enhancements

Potential improvements for the cart system:

1. **Real-time Updates**: WebSocket integration for real-time cart updates
2. **Offline Support**: Local storage fallback when backend is unavailable
3. **Cart Persistence**: Automatic cart restoration on page reload
4. **Bulk Operations**: Support for adding multiple products at once
5. **Cart Sharing**: Ability to share cart with other users 