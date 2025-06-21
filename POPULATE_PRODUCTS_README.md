# Product Population Script

This script will populate your backend database with all the dummy products from the frontend.

## Prerequisites

1. **Backend Server Running**: Make sure your Spring Boot backend is running
2. **Node.js**: Ensure you have Node.js installed (version 14 or higher)
3. **Backend URL**: Update the `BACKEND_URL` in the script to match your backend URL
4. **API Endpoint**: Update the `API_ENDPOINT` in the script to match your actual endpoint

## Configuration

Before running the script, update these variables in `populate-products.js`:

```javascript
const BACKEND_URL = 'http://localhost:8080'; // Update this to your backend URL
const API_ENDPOINT = '/api/products'; // Update this to your actual endpoint
```

## Usage

1. **Run the script**:
   ```bash
   node populate-products.js
   ```

2. **Monitor the output**: The script will show progress for each product being created

## What the Script Does

1. **Converts Frontend Format to Backend DTO**: 
   - Maps frontend product structure to your `ProductDTO` format
   - Sets `id` to `null` to let the backend generate IDs
   - Converts `inStock` boolean to a stock number (default 100 for in-stock items)
   - Uses the image URL directly (no file upload for now)

2. **Creates Products via API**:
   - Uses `multipart/form-data` as required by your endpoint
   - Sends the product data as JSON in the `product` part
   - Currently skips image file upload (uses URLs directly)

3. **Handles Errors Gracefully**:
   - Continues processing even if some products fail
   - Shows success/failure counts at the end

## Product Data Mapping

| Frontend Field | Backend DTO Field | Notes |
|----------------|-------------------|-------|
| `name` | `name` | Direct mapping |
| `description` | `description` | Direct mapping |
| `price` | `price` | Direct mapping |
| `category` | `category` | Direct mapping |
| `rating` | `rating` | Direct mapping |
| `inStock` | `stock` | `true` → `100`, `false` → `0` |
| `image` | `image` | Uses URL directly |
| `id` | `id` | Set to `null` (backend generates) |

## Optional: Image File Upload

If you want to download and upload the actual image files instead of using URLs, uncomment this section in the script:

```javascript
const base64Image = await downloadImageAsBase64(product.image);
if (base64Image) {
  const imageBlob = await fetch(base64Image).then(r => r.blob());
  formData.append('image', imageBlob, `${product.name.replace(/\s+/g, '_')}.jpg`);
}
```

## Expected Output

```
🚀 Starting product population...
📡 Backend URL: http://localhost:8080
🔗 API Endpoint: /api/products
📦 Total products to create: 22

📝 Processing 1/22: Wireless Headphones Pro
✅ Created product: Wireless Headphones Pro
📝 Processing 2/22: Minimalist Watch
✅ Created product: Minimalist Watch
...

🎉 Product population completed!
✅ Successfully created: 22 products
❌ Failed to create: 0 products
```

## Troubleshooting

1. **Connection Refused**: Make sure your backend server is running
2. **404 Not Found**: Check that the API endpoint path is correct
3. **CORS Errors**: Ensure your backend has CORS configured for the frontend domain
4. **Validation Errors**: Check that the product data matches your backend validation rules

## Categories Included

The script will create products in these categories:
- Electronics
- Clothing  
- Accessories
- Home & Garden
- Sports & Outdoors

## Total Products

The script will create **22 products** with realistic data including:
- Product names and descriptions
- Pricing information
- Category assignments
- Ratings and review counts
- Stock availability
- Image URLs from Unsplash 