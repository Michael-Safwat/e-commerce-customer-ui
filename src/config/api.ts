// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

// Frontend Configuration
export const FRONTEND_CONFIG = {
  BASE_URL: import.meta.env.VITE_FRONTEND_BASE_URL || 'http://localhost:5173',
};

// Email verification configuration
export const EMAIL_CONFIG = {
  VERIFICATION_PATH: '/users/verify',
  RESET_PASSWORD_PATH: '/reset-password',
};

// Local storage keys
export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  CART: 'cart',
}; 