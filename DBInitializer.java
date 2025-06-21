import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Component
public class DBInitializer implements CommandLineRunner {

    @Value("${admin.name}")
    private String adminName;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPlainPassword;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProductRepository productRepository;
    private final AmazonS3 amazonS3;

    public DBInitializer(UserRepository userRepository, 
                        PasswordEncoder passwordEncoder, 
                        ProductRepository productRepository,
                        AmazonS3 amazonS3) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.productRepository = productRepository;
        this.amazonS3 = amazonS3;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🚀 Starting database initialization...");

        // Create admin user
        createAdminUser();
        
        // Create products with S3 image uploads
        createProductsWithImages();

        System.out.println("✅ Database initialization completed!");
    }

    private void createAdminUser() {
        System.out.println("👤 Creating admin user...");
        
        User admin = User.builder()
                .name(adminName)
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPlainPassword))
                .roles(Set.of(Role.SUPER_ADMIN))
                .isVerified(true)
                .isLocked(false)
                .failedAttempts(0)
                .build();

        userRepository.save(admin);
        System.out.println("✅ Admin user created successfully");
    }

    private void createProductsWithImages() {
        System.out.println("📦 Creating products with S3 image uploads...");

        List<Product> products = List.of(
            createProductWithImage("Wireless Headphones Pro", 
                "Premium wireless headphones with noise cancellation", 
                299.0, "electronics", 
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", 
                4.8),
            createProductWithImage("Minimalist Watch", 
                "Elegant minimalist watch with leather strap", 
                199.0, "accessories", 
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", 
                4.6),
            createProductWithImage("Premium T-Shirt", 
                "Soft cotton t-shirt with perfect fit", 
                79.0, "clothing", 
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", 
                4.5),
            createProductWithImage("Laptop Stand", 
                "Adjustable aluminum laptop stand", 
                89.0, "electronics", 
                "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop", 
                4.7),
            createProductWithImage("Ceramic Plant Pot", 
                "Modern ceramic plant pot with drainage", 
                45.0, "home", 
                "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop", 
                4.3),
            createProductWithImage("Running Shoes", 
                "Lightweight running shoes with superior comfort", 
                159.0, "sports", 
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", 
                4.6),
            createProductWithImage("Bluetooth Speaker", 
                "Portable Bluetooth speaker with deep bass", 
                129.0, "electronics", 
                "https://images.unsplash.com/photo-1512446733611-9099a758e63c?w=400&h=400&fit=crop", 
                4.4),
            createProductWithImage("Yoga Mat", 
                "Eco-friendly non-slip yoga mat", 
                39.0, "sports", 
                "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&h=400&fit=crop", 
                4.7),
            createProductWithImage("Leather Wallet", 
                "Classic genuine leather wallet", 
                59.0, "accessories", 
                "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop", 
                4.5),
            createProductWithImage("Desk Lamp", 
                "Adjustable LED desk lamp with touch control", 
                75.0, "home", 
                "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop", 
                4.6),
            createProductWithImage("Sports Water Bottle", 
                "Stainless steel insulated water bottle", 
                25.0, "sports", 
                "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop", 
                4.8),
            createProductWithImage("Scented Candle", 
                "Hand-poured soy wax scented candle", 
                35.0, "home", 
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop", 
                4.9),
            createProductWithImage("Smart Fitness Tracker", 
                "Track your health and activity with this smart fitness tracker.", 
                99.0, "electronics", 
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop", 
                4.4),
            createProductWithImage("Classic Backpack", 
                "Durable backpack for everyday use.", 
                69.0, "accessories", 
                "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop", 
                4.7),
            createProductWithImage("Cotton Bath Towel", 
                "Soft and absorbent cotton bath towel.", 
                25.0, "home", 
                "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&h=400&fit=crop", 
                4.8),
            createProductWithImage("Wireless Mouse", 
                "Ergonomic wireless mouse with long battery life.", 
                49.0, "electronics", 
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop", 
                4.6),
            createProductWithImage("Travel Mug", 
                "Insulated travel mug keeps drinks hot or cold.", 
                29.0, "home", 
                "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=400&fit=crop", 
                4.5),
            createProductWithImage("Yoga Block", 
                "Support your yoga practice with this sturdy block.", 
                19.0, "sports", 
                "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&h=400&fit=crop", 
                4.7),
            createProductWithImage("Graphic Tee", 
                "Trendy graphic t-shirt made from organic cotton.", 
                39.0, "clothing", 
                "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=400&fit=crop", 
                4.4),
            createProductWithImage("Wireless Charger", 
                "Fast wireless charger for all compatible devices.", 
                59.0, "electronics", 
                "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop", 
                4.6),
            createProductWithImage("Sports Socks (3 Pack)", 
                "Comfortable and breathable sports socks.", 
                15.0, "clothing", 
                "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=400&fit=crop", 
                4.8),
            createProductWithImage("Desk Organizer", 
                "Keep your workspace tidy with this desk organizer.", 
                35.0, "home", 
                "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop", 
                4.7)
        );

        productRepository.saveAll(products);
        System.out.println("✅ " + products.size() + " products created successfully");
    }

    private Product createProductWithImage(String name, String description, Double price, 
                                         String category, String imageUrl, Double rating) {
        System.out.println("📝 Processing product: " + name);
        
        String s3ImageUrl = uploadImageToS3(imageUrl, name);
        
        return Product.builder()
                .name(name)
                .description(description)
                .stock(100)
                .price(price)
                .category(category)
                .image(s3ImageUrl)
                .rating(rating)
                .build();
    }

    private String uploadImageToS3(String imageUrl, String productName) {
        try {
            System.out.println("  📤 Uploading image for: " + productName);
            
            // Generate unique key for S3
            String key = "products/" + UUID.randomUUID() + "_" + 
                        productName.replaceAll("[^a-zA-Z0-9]", "_") + ".jpg";
            
            // Download image from URL
            Resource resource = new UrlResource(new URL(imageUrl));
            Path tempFile = Files.createTempFile("product_img_", ".jpg");
            Files.copy(resource.getInputStream(), tempFile, 
                      java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            
            // Upload to S3 using AWS SDK v1
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType("image/jpeg");
            metadata.setContentLength(Files.size(tempFile));
            
            amazonS3.putObject(new PutObjectRequest(bucketName, key, tempFile.toFile())
                    .withMetadata(metadata));
            
            // Clean up temp file
            Files.deleteIfExists(tempFile);
            
            // Return S3 URL (LocalStack endpoint)
            String s3Url = "http://localhost:4566/" + bucketName + "/" + key;
            System.out.println("  ✅ Image uploaded: " + s3Url);
            
            return s3Url;
            
        } catch (Exception e) {
            System.err.println("  ❌ Failed to upload image for " + productName + ": " + e.getMessage());
            // Return original URL as fallback
            return imageUrl;
        }
    }
} 