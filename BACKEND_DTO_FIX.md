# Backend DTO Fix for Registration

## Issue
Your frontend is sending registration data with `name`, `email`, and `password`, but your `UserDTO` only has `email` and `name` fields.

## Solution

### 1. Create a UserRegistrationDTO (for registration requests)

```java
package com.academy.e_commerce.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserRegistrationDTO(
        @NotBlank(message = "Name cannot be blank")
        @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
        String name,

        @NotBlank(message = "Email cannot be blank")
        @Email(message = "Email should be valid")
        String email,

        @NotBlank(message = "Password cannot be blank")
        @Size(min = 6, message = "Password must be at least 6 characters")
        String password
) {}
```

### 2. Update your UserDTO (for responses)

```java
package com.academy.e_commerce.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserDTO(
        String id,  // Add this field
        
        @NotBlank(message = "Email cannot be blank")
        @Email(message = "Email should be valid")
        String email,

        @NotBlank(message = "Name cannot be blank")
        @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
        String name,
        
        Boolean isVerified,  // Add this field
        Boolean isLocked,    // Add this field
        Set<String> roles    // Add this field
) {}
```

### 3. Update your UserRegistrationController

```java
package com.academy.e_commerce.controller;

import com.academy.e_commerce.service.UserRegistrationService;
import com.academy.e_commerce.dto.UserRegistrationDTO;  // Use this for requests
import com.academy.e_commerce.dto.UserDTO;              // Use this for responses
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.endpoint.base-url}/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8081", "http://127.0.0.1:5173", "http://127.0.0.1:8081"}, allowCredentials = "true")
public class UserRegistrationController {

    private final UserRegistrationService userRegistrationService;

    public UserRegistrationController(UserRegistrationService userRegistrationService) {
        this.userRegistrationService = userRegistrationService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserRegistrationDTO dto) {
        UserDTO user = userRegistrationService.registerUser(dto);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verify(@RequestParam String token) {
        userRegistrationService.verifyUser(token);
        return ResponseEntity.ok("Account successfully verified.");
    }
}
```

### 4. Update your UserRegistrationService

```java
package com.academy.e_commerce.service;

import com.academy.e_commerce.dto.UserDTO;
import com.academy.e_commerce.dto.UserRegistrationDTO;  // Add this import
import com.academy.e_commerce.advice.RegistrationException;
import com.academy.e_commerce.advice.VerificationException;
import com.academy.e_commerce.mapper.UserMapper;
import com.academy.e_commerce.model.Role;
import com.academy.e_commerce.model.User;
import com.academy.e_commerce.model.VerificationToken;
import com.academy.e_commerce.repository.UserRepository;
import com.academy.e_commerce.repository.VerificationTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserRegistrationService {

    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public UserDTO registerUser(UserRegistrationDTO registrationDTO) {  // Change parameter type
        Optional<User> optionalUser = userRepository.findByEmail(registrationDTO.email());

        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();

            if (Boolean.TRUE.equals(existingUser.getIsVerified())) {
                log.warn("User {} already registered and verified.", existingUser.getEmail());
                throw new RegistrationException("User already exists.");
            }

            log.info("User {} exists but not verified; resending token.", existingUser.getEmail());
            resendVerification(existingUser);
            throw new RegistrationException("Verification email resent. Check your inbox.");
        }

        // Create new user if not exists
        return createNewUser(registrationDTO);
    }

    private UserDTO createNewUser(UserRegistrationDTO registrationDTO) {  // Change parameter type
        User user = UserMapper.userRegistrationDTOToUser(registrationDTO);  // Update mapper call
        user.setPassword(passwordEncoder.encode(registrationDTO.password()));
        user.setIsLocked(false);
        user.setRoles(Set.of(Role.CUSTOMER));
        user.setIsVerified(false);
        userRepository.save(user);
        log.info("Created new user with id {} and email {}", user.getId(), user.getEmail());

        generateAndSendVerificationToken(user);

        return UserMapper.userToUserDTO(user);
    }

    // ... rest of your existing methods remain the same
}
```

### 5. Update your UserMapper

```java
package com.academy.e_commerce.mapper;

import com.academy.e_commerce.dto.UserDTO;
import com.academy.e_commerce.dto.UserRegistrationDTO;  // Add this import
import com.academy.e_commerce.model.User;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UserMapper {

    public static User userRegistrationDTOToUser(UserRegistrationDTO dto) {
        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        // Don't set password here - it will be encoded in the service
        return user;
    }

    public static UserDTO userToUserDTO(User user) {
        return new UserDTO(
            user.getId().toString(),  // Convert ID to string
            user.getEmail(),
            user.getName(),
            user.getIsVerified(),
            user.getIsLocked(),
            user.getRoles().stream()
                .map(Role::name)
                .collect(Collectors.toSet())
        );
    }
}
```

### 6. Add Login DTO (for login requests)

```java
package com.academy.e_commerce.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginDTO(
        @NotBlank(message = "Email cannot be blank")
        @Email(message = "Email should be valid")
        String email,

        @NotBlank(message = "Password cannot be blank")
        String password
) {}
```

### 7. Add Login Response DTO

```java
package com.academy.e_commerce.dto;

public record LoginResponseDTO(
        String token,
        UserDTO user
) {}
```

### 8. Create AuthController for login

```java
package com.academy.e_commerce.controller;

import com.academy.e_commerce.dto.LoginDTO;
import com.academy.e_commerce.dto.LoginResponseDTO;
import com.academy.e_commerce.service.AuthService;  // You'll need to create this
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.endpoint.base-url}/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8081", "http://127.0.0.1:5173", "http://127.0.0.1:8081"}, allowCredentials = "true")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginDTO loginDTO) {
        LoginResponseDTO response = authService.login(loginDTO);
        return ResponseEntity.ok(response);
    }
}
```

## Summary of Changes

1. **UserRegistrationDTO** - For registration requests (name, email, password)
2. **UserDTO** - For responses (id, email, name, isVerified, isLocked, roles)
3. **LoginDTO** - For login requests (email, password)
4. **LoginResponseDTO** - For login responses (token, user)

This will fix the DTO mismatch and make your API work correctly with the frontend! 