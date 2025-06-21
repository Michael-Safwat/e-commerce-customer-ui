# CORS Configuration for Spring Boot Backend

## Quick Fix - Add this to your Spring Boot application:

### Option 1: Using @CrossOrigin annotation (Simplest)

Add this annotation to your controller classes:

```java
@RestController
@RequestMapping("${api.endpoint.base-url}/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8081", "http://127.0.0.1:5173", "http://127.0.0.1:8081"}, allowCredentials = "true")
public class UserRegistrationController {
    // ... your existing code
}
```

### Option 2: Global CORS Configuration (Recommended)

Create a new configuration class in your Spring Boot project:

```java
package com.academy.e_commerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns("http://localhost:*", "http://127.0.0.1:*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### Option 3: Using Spring Security (If you have security configured)

If you're using Spring Security, add this to your security configuration:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            // ... your other security configurations
            ;
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:*", "http://127.0.0.1:*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
```

## Frontend Configuration Check

Your `vite.config.ts` is now configured to run on port 5173:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

## Environment Variables

Make sure your `.env` file has the correct API URL:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## Testing Steps

1. **Restart your Spring Boot backend** after adding CORS configuration
2. **Restart your React frontend** with `npm run dev` (it will now run on port 5173)
3. **Check browser console** for any remaining CORS errors
4. **Test registration** to see if the API calls work

## Common CORS Error Solutions

### Error: "Access to fetch at 'http://localhost:8080/api/v1/users/register' from origin 'http://localhost:5173' has been blocked by CORS policy"

**Solution**: Use Option 2 (Global CORS Configuration) above.

### Error: "Request header field content-type is not allowed by Access-Control-Allow-Headers"

**Solution**: Make sure `allowedHeaders("*")` is included in your CORS configuration.

### Error: "The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'"

**Solution**: Use specific origins instead of wildcards:
```java
.allowedOrigins("http://localhost:5173", "http://127.0.0.1:5173")
```

## Debugging Tips

1. **Check Network Tab**: Open browser dev tools → Network tab → see the actual CORS error
2. **Check Backend Logs**: Look at your Spring Boot console for any CORS-related errors
3. **Test with Postman**: Try the API endpoints directly to ensure they work
4. **Check Ports**: Make sure backend is on 8080 and frontend is on 5173

## Production Configuration

For production, update the allowed origins:

```java
.allowedOrigins("https://yourdomain.com", "https://www.yourdomain.com")
```

## Quick Test

After adding the CORS configuration, test with this simple endpoint:

```java
@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {
    
    @GetMapping("/api/test")
    public String test() {
        return "CORS is working!";
    }
}
```

Then try accessing `http://localhost:8080/api/test` from your frontend. 