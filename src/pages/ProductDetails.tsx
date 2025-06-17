import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Plus, Minus, ShoppingBag, Heart } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../hooks/useCart';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '../components/ProductCard';
import ProductReviews from '../components/ProductReviews';
import Header from '../components/Header';
import Cart from '../components/Cart';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '../hooks/useAuth';
import Footer from '../components/Footer';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const product = products.find(p => p.id === id);
  
  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Go back to store</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login required",
        description: "Please login to add items to your cart.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast({
        title: "Please select a color",
        description: "You need to choose a color before adding to cart.",
        variant: "destructive"
      });
      return;
    }
    
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to choose a size before adding to cart.",
        variant: "destructive"
      });
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedColor, selectedSize);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onCartOpen={() => setIsCartOpen(true)}
        cartItemCount={cart.itemCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart.items}
        total={cart.total}
        onUpdateQuantity={(id, quantity, color, size) => {
          // This will be handled by the cart hook
        }}
        onRemoveItem={(id, color, size) => {
          // This will be handled by the cart hook
        }}
      />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to store
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-white">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-medium">{product.rating}</span>
                  </div>
                  <span className="text-gray-400">({product.reviews} reviews)</span>
                </div>
                
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-semibold text-gray-900">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                  )}
                </div>
                
                <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
              </div>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Color</h3>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-12 h-12 rounded-full border-2 transition-all ${
                          selectedColor === color 
                            ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Size</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 px-4 text-center border rounded-lg transition-all ${
                          selectedSize === size
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-4 text-lg"
                  disabled={!product.inStock}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button variant="outline" size="icon" className="py-4 px-4">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
                <TabsTrigger value="similar">Similar Products</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-8">
                <div className="bg-white rounded-xl p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Product Details</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {product.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Category</h4>
                        <p className="text-gray-600 capitalize">{product.category}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Availability</h4>
                        <p className={`${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </p>
                      </div>
                      {product.colors && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Available Colors</h4>
                          <p className="text-gray-600">{product.colors.join(', ')}</p>
                        </div>
                      )}
                      {product.sizes && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Available Sizes</h4>
                          <p className="text-gray-600">{product.sizes.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-8">
                <ProductReviews productId={product.id} rating={product.rating} reviewCount={product.reviews} />
              </TabsContent>
              
              <TabsContent value="similar" className="mt-8">
                <div className="bg-white rounded-xl p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Similar Products</h3>
                  {similarProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {similarProducts.map((similarProduct) => (
                        <ProductCard
                          key={similarProduct.id}
                          product={similarProduct}
                          onAddToCart={(product) => addToCart(product)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No similar products found.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;
