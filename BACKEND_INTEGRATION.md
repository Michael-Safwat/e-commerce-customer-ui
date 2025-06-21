# Backend Integration Guide

This document explains how the React frontend has been integrated with your Spring Boot backend for user registration and authentication.

## Overview

The frontend now includes:
- User registration with email verification
- User login with JWT token authentication
- Email verification flow
- Proper error handling and user feedback

## Backend Requirements

Your Spring Boot backend should have the following endpoints:

### 1. User Registration
- **POST** `/api/v1/users/register`
- **Body**: `{ "name": "string", "email": "string", "password": "string" }`
- **Response**: `UserDTO` object

### 2. Email Verification
- **GET** `/api/v1/users/verify?token={token}`
- **Response**: Success message string

### 3. User Login
- **POST** `/api/v1/auth/login`
- **Body**: `{ "email": "string", "password": "string" }`
- **Response**: `{ "token": "string", "user": UserDTO }`

## Frontend Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api/v1

# Frontend Configuration
VITE_FRONTEND_BASE_URL=http://localhost:5173

# Email Configuration (for verification links)
VITE_EMAIL_VERIFICATION_URL=http://localhost:5173/users/verify
```

### API Configuration

The frontend uses the configuration in `src/config/api.ts` to manage API settings.

## User Flow

### 1. Registration Flow
1. User fills out registration form
2. Frontend sends registration data to backend
3. Backend creates user and sends verification email
4. Frontend shows success message and redirects to login
5. User receives email with verification link
6. User clicks link and is taken to verification page
7. Frontend calls verification endpoint with token
8. User is verified and can now log in

### 2. Login Flow
1. User enters email and password
2. Frontend sends login credentials to backend
3. Backend validates credentials and returns JWT token
4. Frontend stores token and user data in localStorage
5. User is redirected to the main application

## Files Added/Modified

### New Files
- `src/services/authService.ts` - API service for authentication
- `src/pages/EmailVerification.tsx` - Email verification page
- `src/config/api.ts` - API configuration

### Modified Files
- `src/hooks/useAuth.tsx` - Updated to use backend API
- `src/pages/Register.tsx` - Updated registration flow
- `src/pages/Login.tsx` - Updated login flow
- `src/App.tsx` - Added email verification route

## Security Features

- JWT token storage in localStorage
- Email verification required before login
- Password validation (minimum 6 characters)
- Proper error handling and user feedback
- Token-based authentication for protected routes

## Testing the Integration

1. Start your Spring Boot backend on `http://localhost:8080`
2. Start the React frontend with `npm run dev`
3. Try registering a new user
4. Check your email for verification link
5. Click the verification link
6. Try logging in with the verified account

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend allows requests from `http://localhost:5173`
2. **API Connection**: Verify the API base URL in the configuration
3. **Email Not Sending**: Check your backend email configuration
4. **Token Issues**: Ensure JWT token is being properly generated and validated

### Backend CORS Configuration

Add this to your Spring Boot application:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## Next Steps

1. Implement password reset functionality
2. Add user profile management
3. Implement role-based access control
4. Add session management
5. Implement refresh tokens 