# Address API Integration

This document describes the integration of the frontend with the backend shipping address APIs.

## Overview

The frontend has been updated to work with the real backend shipping address APIs instead of using dummy data. The integration includes:

- Real API calls to the backend shipping address endpoints
- Proper authentication handling
- Error handling and user feedback
- Loading states and user experience improvements

## Backend API Endpoints

The frontend now connects to these backend endpoints:

- `GET /api/v1/users/{userId}/addresses` - Get all addresses for a user
- `GET /api/v1/users/{userId}/addresses/{addressId}` - Get a specific address
- `POST /api/v1/users/{userId}/addresses` - Create a new address
- `PUT /api/v1/users/{userId}/addresses/{addressId}` - Update an existing address
- `DELETE /api/v1/users/{userId}/addresses/{addressId}` - Delete an address

## Data Types

### ShippingAddressRequest
```typescript
interface ShippingAddressRequest {
  street: string;
  city: string;
  state: string;
  country: string;
}
```

### ShippingAddressResponse
```typescript
interface ShippingAddressResponse {
  id: number;
  street: string;
  city: string;
  state: string;
  country: string;
}
```

## Components Updated

### AddressManager
- Now uses real API calls instead of local state
- Handles loading states and error messages
- Provides user feedback through toast notifications
- Supports CRUD operations (Create, Read, Update, Delete)

### CheckoutAddressOptions
- Loads real addresses from the backend
- Auto-selects the first address if available
- Shows loading states and empty states
- Displays address information in a user-friendly format

## Authentication

All address API calls require authentication. The service automatically:
- Includes the JWT token in the Authorization header
- Handles 401/403 responses by redirecting to login
- Decodes the token to extract the user ID

## Error Handling

The implementation includes comprehensive error handling:
- Network errors
- Authentication errors
- Validation errors
- Server errors

All errors are displayed to the user through toast notifications.

## Usage

### In Profile Page
Users can manage their addresses in the Profile page under the "Account" tab. They can:
- View all their addresses
- Add new addresses
- Edit existing addresses
- Delete addresses

### In Checkout
During checkout, users can select from their saved addresses. The system will:
- Load all user addresses
- Auto-select the first address if available
- Allow users to change the selected address

## Backward Compatibility

The implementation maintains backward compatibility by:
- Keeping the legacy `fetchAddresses()` function
- Converting between old and new data formats where needed
- Maintaining existing component interfaces

## Testing

To test the integration:

1. Ensure the backend is running on the configured URL
2. Log in with a valid user account
3. Navigate to the Profile page and try adding/editing addresses
4. Go through the checkout process and verify address selection works
5. Check that error handling works by testing with invalid data

## Configuration

The API base URL is configured in `src/config/api.ts`:
```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  // ...
};
```

Make sure the backend is running on the correct URL and the environment variable is set if needed. 