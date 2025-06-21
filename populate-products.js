// Product data from the frontend
const products = [
  {
    id: '1',
    name: 'Wireless Headphones Pro',
    price: 299,
    originalPrice: 349,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'electronics',
    description: 'Premium wireless headphones with noise cancellation',
    colors: ['Black', 'White', 'Silver'],
    inStock: true,
    rating: 4.8,
    reviews: 234
  },
  {
    id: '2',
    name: 'Minimalist Watch',
    price: 199,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: 'accessories',
    description: 'Elegant minimalist watch with leather strap',
    colors: ['Brown', 'Black'],
    inStock: true,
    rating: 4.6,
    reviews: 156
  },
  {
    id: '3',
    name: 'Premium T-Shirt',
    price: 79,
    originalPrice: 99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: 'clothing',
    description: 'Soft cotton t-shirt with perfect fit',
    colors: ['White', 'Black', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    rating: 4.5,
    reviews: 89
  },
  {
    id: '4',
    name: 'Laptop Stand',
    price: 89,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
    category: 'electronics',
    description: 'Adjustable aluminum laptop stand',
    colors: ['Silver', 'Space Gray'],
    inStock: true,
    rating: 4.7,
    reviews: 67
  },
  {
    id: '5',
    name: 'Ceramic Plant Pot',
    price: 45,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
    category: 'home',
    description: 'Modern ceramic plant pot with drainage',
    colors: ['White', 'Terracotta', 'Black'],
    inStock: true,
    rating: 4.3,
    reviews: 45
  },
  {
    id: '6',
    name: 'Running Shoes',
    price: 159,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    category: 'sports',
    description: 'Lightweight running shoes with superior comfort',
    colors: ['White', 'Black', 'Blue'],
    sizes: ['7', '8', '9', '10', '11'],
    inStock: true,
    rating: 4.6,
    reviews: 123
  },
  {
    id: '7',
    name: 'Bluetooth Speaker',
    price: 129,
    originalPrice: 149,
    image: 'https://images.unsplash.com/photo-1512446733611-9099a758e63c?w=400&h=400&fit=crop',
    category: 'electronics',
    description: 'Portable Bluetooth speaker with deep bass',
    colors: ['Black', 'Blue', 'Red'],
    inStock: true,
    rating: 4.4,
    reviews: 78
  },
  {
    id: '8',
    name: 'Yoga Mat',
    price: 39,
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&h=400&fit=crop',
    category: 'sports',
    description: 'Eco-friendly non-slip yoga mat',
    colors: ['Purple', 'Green', 'Blue'],
    inStock: true,
    rating: 4.7,
    reviews: 102
  },
  {
    id: '9',
    name: 'Leather Wallet',
    price: 59,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop',
    category: 'accessories',
    description: 'Classic genuine leather wallet',
    colors: ['Brown', 'Black'],
    inStock: true,
    rating: 4.5,
    reviews: 54
  },
  {
    id: '10',
    name: 'Desk Lamp',
    price: 75,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop',
    category: 'home',
    description: 'Adjustable LED desk lamp with touch control',
    colors: ['White', 'Black'],
    inStock: true,
    rating: 4.6,
    reviews: 61
  },
  {
    id: '11',
    name: 'Sports Water Bottle',
    price: 25,
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop',
    category: 'sports',
    description: 'Stainless steel insulated water bottle',
    colors: ['Blue', 'Red', 'Silver'],
    inStock: true,
    rating: 4.8,
    reviews: 134
  },
  {
    id: '12',
    name: 'Scented Candle',
    price: 35,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop',
    category: 'home',
    description: 'Hand-poured soy wax scented candle',
    colors: ['White'],
    inStock: true,
    rating: 4.9,
    reviews: 89
  },
  {
    id: '13',
    name: 'Smart Fitness Tracker',
    price: 99,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    category: 'electronics',
    description: 'Track your health and activity with this smart fitness tracker.',
    colors: ['Black', 'Pink', 'Blue'],
    inStock: true,
    rating: 4.4,
    reviews: 77
  },
  {
    id: '14',
    name: 'Classic Backpack',
    price: 69,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop',
    category: 'accessories',
    description: 'Durable backpack for everyday use.',
    colors: ['Black', 'Gray', 'Navy'],
    inStock: true,
    rating: 4.7,
    reviews: 120
  },
  {
    id: '15',
    name: 'Cotton Bath Towel',
    price: 25,
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&h=400&fit=crop',
    category: 'home',
    description: 'Soft and absorbent cotton bath towel.',
    colors: ['White', 'Beige', 'Gray'],
    inStock: true,
    rating: 4.8,
    reviews: 98
  },
  {
    id: '16',
    name: 'Wireless Mouse',
    price: 49,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
    category: 'electronics',
    description: 'Ergonomic wireless mouse with long battery life.',
    colors: ['Black', 'White'],
    inStock: true,
    rating: 4.6,
    reviews: 112
  },
  {
    id: '17',
    name: 'Travel Mug',
    price: 29,
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=400&fit=crop',
    category: 'home',
    description: 'Insulated travel mug keeps drinks hot or cold.',
    colors: ['Silver', 'Black', 'Red'],
    inStock: true,
    rating: 4.5,
    reviews: 87
  },
  {
    id: '18',
    name: 'Yoga Block',
    price: 19,
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&h=400&fit=crop',
    category: 'sports',
    description: 'Support your yoga practice with this sturdy block.',
    colors: ['Purple', 'Blue', 'Gray'],
    inStock: true,
    rating: 4.7,
    reviews: 65
  },
  {
    id: '19',
    name: 'Graphic Tee',
    price: 39,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=400&fit=crop',
    category: 'clothing',
    description: 'Trendy graphic t-shirt made from organic cotton.',
    colors: ['White', 'Black'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    rating: 4.4,
    reviews: 53
  },
  {
    id: '20',
    name: 'Wireless Charger',
    price: 59,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop',
    category: 'electronics',
    description: 'Fast wireless charger for all compatible devices.',
    colors: ['Black', 'White'],
    inStock: true,
    rating: 4.6,
    reviews: 101
  },
  {
    id: '21',
    name: 'Sports Socks (3 Pack)',
    price: 15,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=400&fit=crop',
    category: 'clothing',
    description: 'Comfortable and breathable sports socks.',
    colors: ['White', 'Black', 'Gray'],
    sizes: ['M', 'L', 'XL'],
    inStock: true,
    rating: 4.8,
    reviews: 76
  },
  {
    id: '22',
    name: 'Desk Organizer',
    price: 35,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop',
    category: 'home',
    description: 'Keep your workspace tidy with this desk organizer.',
    colors: ['Black', 'White'],
    inStock: true,
    rating: 4.7,
    reviews: 59
  }
];

// Configuration
const BACKEND_URL = 'http://localhost:8080'; // Update this to your backend URL
const API_ENDPOINT = '/api/products'; // Update this to your actual endpoint

// Function to download image and convert to base64
async function downloadImageAsBase64(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const contentType = response.headers.get('content-type');
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error(`Failed to download image from ${imageUrl}:`, error.message);
    return null;
  }
}

// Function to create a product
async function createProduct(product) {
  try {
    // Convert frontend product format to backend DTO format
    const productDTO = {
      id: null, // Let the backend generate the ID
      name: product.name,
      description: product.description,
      stock: product.inStock ? 100 : 0, // Default stock value
      price: product.price,
      category: product.category,
      image: product.image, // We'll use the URL directly for now
      rating: product.rating
    };

    // Create FormData for multipart/form-data
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(productDTO)], {
      type: 'application/json'
    }));

    // For now, we'll send without image file since we're using URLs
    // If you want to download and upload images, uncomment the following:
    /*
    const base64Image = await downloadImageAsBase64(product.image);
    if (base64Image) {
      const imageBlob = await fetch(base64Image).then(r => r.blob());
      formData.append('image', imageBlob, `${product.name.replace(/\s+/g, '_')}.jpg`);
    }
    */

    const response = await fetch(`${BACKEND_URL}${API_ENDPOINT}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(`✅ Created product: ${product.name}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to create product ${product.name}:`, error.message);
    return null;
  }
}

// Main function to populate all products
async function populateProducts() {
  console.log('🚀 Starting product population...');
  console.log(`📡 Backend URL: ${BACKEND_URL}`);
  console.log(`🔗 API Endpoint: ${API_ENDPOINT}`);
  console.log(`📦 Total products to create: ${products.length}`);
  console.log('');

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`📝 Processing ${i + 1}/${products.length}: ${product.name}`);
    
    const result = await createProduct(product);
    if (result) {
      successCount++;
    } else {
      failureCount++;
    }

    // Add a small delay between requests to avoid overwhelming the server
    if (i < products.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log('');
  console.log('🎉 Product population completed!');
  console.log(`✅ Successfully created: ${successCount} products`);
  console.log(`❌ Failed to create: ${failureCount} products`);
}

// Run the script
populateProducts().catch(console.error); 