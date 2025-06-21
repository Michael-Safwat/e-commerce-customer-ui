#!/bin/bash

# Configuration
BACKEND_URL="http://localhost:8080"
API_ENDPOINT="/api/products"
BASE_URL="${BACKEND_URL}${API_ENDPOINT}"

echo "🚀 Starting product population with curl..."
echo "📡 Backend URL: $BACKEND_URL"
echo "🔗 API Endpoint: $API_ENDPOINT"
echo ""

# Function to create a product
create_product() {
    local name="$1"
    local description="$2"
    local price="$3"
    local category="$4"
    local image="$5"
    local rating="$6"
    local stock="$7"
    
    echo "📝 Creating product: $name"
    
    # Create the JSON data
    json_data=$(cat <<EOF
{
  "id": null,
  "name": "$name",
  "description": "$description",
  "stock": $stock,
  "price": $price,
  "category": "$category",
  "image": "$image",
  "rating": $rating
}
EOF
)
    
    # Create the multipart form data
    response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL" \
        -H "Content-Type: multipart/form-data" \
        -F "product=$json_data" \
        -o /tmp/response.json)
    
    http_code="${response: -3}"
    
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
        echo "✅ Created product: $name"
        return 0
    else
        echo "❌ Failed to create product: $name (HTTP $http_code)"
        cat /tmp/response.json
        return 1
    fi
}

# Product data - each line contains: name|description|price|category|image|rating|stock
products=(
    "Wireless Headphones Pro|Premium wireless headphones with noise cancellation|299|electronics|https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop|4.8|100"
    "Minimalist Watch|Elegant minimalist watch with leather strap|199|accessories|https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop|4.6|100"
    "Premium T-Shirt|Soft cotton t-shirt with perfect fit|79|clothing|https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop|4.5|100"
    "Laptop Stand|Adjustable aluminum laptop stand|89|electronics|https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop|4.7|100"
    "Ceramic Plant Pot|Modern ceramic plant pot with drainage|45|home|https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop|4.3|100"
    "Running Shoes|Lightweight running shoes with superior comfort|159|sports|https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop|4.6|100"
    "Bluetooth Speaker|Portable Bluetooth speaker with deep bass|129|electronics|https://images.unsplash.com/photo-1512446733611-9099a758e63c?w=400&h=400&fit=crop|4.4|100"
    "Yoga Mat|Eco-friendly non-slip yoga mat|39|sports|https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&h=400&fit=crop|4.7|100"
    "Leather Wallet|Classic genuine leather wallet|59|accessories|https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop|4.5|100"
    "Desk Lamp|Adjustable LED desk lamp with touch control|75|home|https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop|4.6|100"
    "Sports Water Bottle|Stainless steel insulated water bottle|25|sports|https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop|4.8|100"
    "Scented Candle|Hand-poured soy wax scented candle|35|home|https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop|4.9|100"
    "Smart Fitness Tracker|Track your health and activity with this smart fitness tracker|99|electronics|https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop|4.4|100"
    "Classic Backpack|Durable backpack for everyday use|69|accessories|https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop|4.7|100"
    "Cotton Bath Towel|Soft and absorbent cotton bath towel|25|home|https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&h=400&fit=crop|4.8|100"
    "Wireless Mouse|Ergonomic wireless mouse with long battery life|49|electronics|https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop|4.6|100"
    "Travel Mug|Insulated travel mug keeps drinks hot or cold|29|home|https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=400&fit=crop|4.5|100"
    "Yoga Block|Support your yoga practice with this sturdy block|19|sports|https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&h=400&fit=crop|4.7|100"
    "Graphic Tee|Trendy graphic t-shirt made from organic cotton|39|clothing|https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=400&fit=crop|4.4|100"
    "Wireless Charger|Fast wireless charger for all compatible devices|59|electronics|https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop|4.6|100"
    "Sports Socks (3 Pack)|Comfortable and breathable sports socks|15|clothing|https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=400&fit=crop|4.8|100"
    "Desk Organizer|Keep your workspace tidy with this desk organizer|35|home|https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop|4.7|100"
)

success_count=0
failure_count=0

# Process each product
for product in "${products[@]}"; do
    IFS='|' read -r name description price category image rating stock <<< "$product"
    
    if create_product "$name" "$description" "$price" "$category" "$image" "$rating" "$stock"; then
        ((success_count++))
    else
        ((failure_count++))
    fi
    
    # Add a small delay between requests
    sleep 0.5
done

echo ""
echo "🎉 Product population completed!"
echo "✅ Successfully created: $success_count products"
echo "❌ Failed to create: $failure_count products"

# Clean up
rm -f /tmp/response.json 