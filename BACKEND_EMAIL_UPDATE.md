# Backend Email Configuration Update

## Current Issue
The backend is sending reset links to `http://localhost:8080` but the frontend is running on port 8081.

## Required Changes

### 1. Update Email Link in Backend
In your `sendReactivationEmail` method, change:

```java
// Current (incorrect)
String resetLink = "http://localhost:8080" + baseUrl + "/reset-password?token=" + token;

// Should be (correct)
String resetLink = "http://localhost:8081/reset-password?token=" + token;
```

### 2. Complete Backend Method
```java
public void sendReactivationEmail(String toEmail, String name, String token) {
    String subject = "Reset Your Password";
    String resetLink = "http://localhost:8081/reset-password?token=" + token;

    String html = """
        <p>Dear %s,</p>
        <p>Click the button below to reset your password:</p>
        <p style="text-align: center;">
          <a href="%s"
             style="
               display: inline-block;
               padding: 12px 24px;
               font-size: 16px;
               color: #ffffff;
               background-color: #007bff;
               text-decoration: none;
               border-radius: 4px;
             ">
            Reset Password
          </a>
        </p>
        <p>If that button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="%s">%s</a></p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Thanks,<br/>The E-Commerce Team</p>
        """.formatted(name, resetLink, resetLink, resetLink);

    sendHtmlEmail(toEmail, subject, html);
}
```

### 3. Backend Endpoints Required
Make sure your backend has these endpoints:

- `POST /api/v1/reactivate?email={email}` - Sends reset email
- `PATCH /api/v1/reset-password?token={token}` - Resets password with token

### 4. Environment Configuration
For production, you should make the frontend URL configurable:

```java
@Value("${app.frontend.url:http://localhost:8081}")
private String frontendUrl;

// Then use:
String resetLink = frontendUrl + "/reset-password?token=" + token;
```

## Flow Summary
1. User enters email → Frontend calls `/reactivate?email={email}`
2. Backend sends email with link to `http://localhost:8081/reset-password?token={token}`
3. User clicks link → Frontend shows reset password page
4. User enters new password → Frontend calls `/reset-password?token={token}` with new password
5. Backend updates password and unlocks account 