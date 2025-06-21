# Login Error Handling Guide

## Error Message Logic

### "Incorrect email or password" 
**Shown ONLY when:**
- Backend returns "Bad credentials"
- Backend returns "User not found"
- Any other actual credential validation failure

**NOT shown for:**
- Locked accounts
- Suspended accounts
- Unverified accounts
- Other authentication issues

### "Your account is suspended"
**Shown when:**
- Backend response contains: "locked", "suspended", "account is locked", "account is suspended", "user account is locked", "user account is suspended"
- Sets `isLocked` state to true
- Shows password reset option

### "Your account is not verified"
**Shown when:**
- Backend response contains: "disabled", "not enabled", "account is disabled", "user account is disabled"
- Indicates email verification is required

## Error Detection Priority

The system checks for errors in this order:

1. **Locked/Suspended Accounts** (highest priority)
   - Checks for locked/suspended keywords
   - Shows suspension message
   - Enables password reset flow

2. **Unverified Accounts**
   - Checks for disabled/not enabled keywords
   - Shows verification message

3. **Bad Credentials** (lowest priority)
   - Only if not locked/suspended/unverified
   - Shows "Incorrect email or password"

## Backend Response Examples

### For Locked Account:
```
Status: 401
Response: "User account is locked"
Frontend: "Your account is suspended. Please check your email to reset your password, or request a new link below."
```

### For Unverified Account:
```
Status: 401
Response: "User account is disabled"
Frontend: "Your account is not verified. Please check your email for a verification link."
```

### For Bad Credentials:
```
Status: 401
Response: "Bad credentials"
Frontend: "Incorrect email or password."
```

### For User Not Found:
```
Status: 404
Response: "User not found"
Frontend: "Incorrect email or password."
```

## Testing Scenarios

### Test Case 1: Wrong Password
- **Backend Response**: 401 "Bad credentials"
- **Expected UI**: "Incorrect email or password."

### Test Case 2: Non-existent Email
- **Backend Response**: 404 "User not found"
- **Expected UI**: "Incorrect email or password."

### Test Case 3: Locked Account
- **Backend Response**: 401 "User account is locked"
- **Expected UI**: "Your account is suspended. Please check your email to reset your password, or request a new link below."

### Test Case 4: Unverified Account
- **Backend Response**: 401 "User account is disabled"
- **Expected UI**: "Your account is not verified. Please check your email for a verification link."

## Debug Information

The system logs all error messages to console:
- `Login error message: [error]` - Shows the actual error from backend
- `Login catch error: [error]` - Shows errors caught in catch block
- `401 response text: [text]` - Shows raw backend response

## Backend Requirements

For proper error handling, your backend should send:

1. **Specific error messages** for different account states
2. **Consistent response format** (plain text or JSON)
3. **Appropriate HTTP status codes** (401 for auth issues, 404 for not found)

## Example Backend Implementation

```java
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    User user = userService.findByEmail(request.getEmail());
    
    if (user == null) {
        return ResponseEntity.status(404)
            .body("User not found");
    }
    
    if (!user.isEnabled()) {
        return ResponseEntity.status(401)
            .body("User account is disabled");
    }
    
    if (user.isLocked()) {
        return ResponseEntity.status(401)
            .body("User account is locked");
    }
    
    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        return ResponseEntity.status(401)
            .body("Bad credentials");
    }
    
    // Success - return JWT token
    return ResponseEntity.ok(new LoginResponse(generateToken(user)));
}
``` 