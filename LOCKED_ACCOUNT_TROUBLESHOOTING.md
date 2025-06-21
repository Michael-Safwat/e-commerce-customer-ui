# Locked Account Detection Troubleshooting

## Problem
When an account is locked or suspended, the UI shows "Incorrect email or password" instead of the proper locked account message.

## Root Cause Analysis

### Possible Issues:
1. **Backend sends "Bad credentials" for locked accounts** instead of specific locked account messages
2. **Backend sends different text** than what the frontend is expecting
3. **Response format is different** (JSON vs plain text)
4. **Case sensitivity issues** in error message matching

## Debugging Steps

### 1. Use the Debug Button
- Enter the email and password of a locked account
- Click "Debug Login Response" button
- Check browser console for detailed response information

### 2. Check Console Output
Look for these debug messages:
```
=== DEBUG LOGIN RESPONSE ===
Status: 401
Response Body: [actual response text]
Response Body Length: [length]
=== END DEBUG ===
```

### 3. Expected vs Actual Response

#### Expected Backend Response for Locked Account:
```
Status: 401
Response Body: "User account is locked"
```

#### Possible Actual Responses:
```
Status: 401
Response Body: "Bad credentials"
```

```
Status: 401
Response Body: "Account suspended"
```

```
Status: 401
Response Body: {"error": "Account locked"}
```

## Frontend Fixes Applied

### 1. Enhanced Error Detection
- Added multiple variations of locked account messages
- Case-insensitive matching
- Better debugging and logging

### 2. Improved Error Handling
- More comprehensive error message patterns
- Better fallback handling
- Console logging for debugging

## Backend Fixes Needed

### Option 1: Send Specific Error Messages (Recommended)
Update your backend to send specific error messages for different account states:

```java
// For locked accounts
if (user.isLocked()) {
    return ResponseEntity.status(401)
        .body("User account is locked");
}

// For suspended accounts  
if (user.isSuspended()) {
    return ResponseEntity.status(401)
        .body("User account is suspended");
}

// For unverified accounts
if (!user.isEnabled()) {
    return ResponseEntity.status(401)
        .body("User account is disabled");
}

// For bad credentials
return ResponseEntity.status(401)
    .body("Bad credentials");
```

### Option 2: Use JSON Responses
Send structured JSON responses:

```java
Map<String, String> errorResponse = new HashMap<>();
errorResponse.put("error", "User account is locked");
errorResponse.put("code", "ACCOUNT_LOCKED");

return ResponseEntity.status(401)
    .contentType(MediaType.APPLICATION_JSON)
    .body(errorResponse);
```

## Testing Steps

1. **Create a locked account** in your backend
2. **Try to login** with that account
3. **Click Debug button** to see actual response
4. **Check console** for detailed information
5. **Verify error message** shows correctly

## Current Frontend Detection

The frontend now checks for these patterns:
- `locked`
- `suspended` 
- `account is locked`
- `account is suspended`
- `user account is locked`
- `user account is suspended`

## Quick Fix

If your backend sends "Bad credentials" for locked accounts, you can:

1. **Update backend** to send specific messages
2. **Or update frontend** to check for locked accounts differently
3. **Use the debug button** to identify the exact response format

## Next Steps

1. Use the debug button to see what your backend actually sends
2. Update backend to send specific error messages
3. Test with locked accounts to verify proper detection
4. Remove debug button once issue is resolved 