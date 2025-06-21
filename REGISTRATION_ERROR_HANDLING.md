# Registration Error Handling Guide

## HTTP Status Codes and Their Meanings

### 409 - Conflict (User Already Exists)
**Scenario**: User tries to register with an email that already exists but is not verified.

**Backend Response**: 
- Status: 409 Conflict
- Message: "User already exists but not verified. A new verification email has been sent."

**Frontend Handling**:
- Shows toast: "Account Exists - This email is already registered but not verified. A new verification email has been sent to your inbox."
- Redirects to login page
- User can then verify their email or request a new verification link

### 400 - Bad Request
**Scenario**: Invalid registration data (missing fields, invalid email format, etc.)

**Frontend Handling**:
- Shows validation errors
- Stays on registration page
- User can correct the data and try again

### 500 - Internal Server Error
**Scenario**: Server-side error during registration

**Frontend Handling**:
- Shows generic error message
- Stays on registration page
- User can try again

## User Flow for 409 Error

1. **User enters email that exists but is not verified**
2. **Backend returns 409 status**
3. **Frontend shows message**: "Account Exists - This email is already registered but not verified. A new verification email has been sent to your inbox."
4. **User is redirected to login page**
5. **User can**:
   - Check their email for the verification link
   - Use "Forgot Password" if they need to reset their password
   - Try logging in if they think they're already verified

## Backend Implementation Notes

### Expected Backend Behavior for 409
```java
@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody UserRegistrationDTO request) {
    if (userService.existsByEmail(request.getEmail())) {
        User user = userService.findByEmail(request.getEmail());
        if (!user.isEnabled()) {
            // User exists but not verified - resend verification email
            emailService.sendVerificationEmail(user.getEmail(), user.getName(), user.getVerificationToken());
            return ResponseEntity.status(409)
                .body("User already exists but not verified. A new verification email has been sent.");
        } else {
            // User exists and is verified
            return ResponseEntity.status(409)
                .body("User already exists and is verified. Please proceed to login.");
        }
    }
    
    // Proceed with normal registration
    // ...
}
```

## Frontend Error Messages

| Status Code | Error Message | User Action |
|-------------|---------------|-------------|
| 409 (unverified) | "Account Exists - This email is already registered but not verified. A new verification email has been sent to your inbox." | Redirect to login |
| 409 (verified) | "Account Exists - This email is already registered and verified. Please proceed to login." | Redirect to login |
| 400 | "Invalid registration data. Please check your input." | Stay on page |
| 500 | "Registration failed. Please try again." | Stay on page |

## Testing Scenarios

1. **New User Registration**: Should succeed and send verification email
2. **Existing Unverified User**: Should return 409 and resend verification email
3. **Existing Verified User**: Should return 409 and redirect to login
4. **Invalid Email Format**: Should return 400 with validation error
5. **Missing Required Fields**: Should return 400 with validation error 