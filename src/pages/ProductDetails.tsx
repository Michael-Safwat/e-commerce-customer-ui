import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Plus, Minus, ShoppingBag, Loader2 } from 'lucide-react';
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
import { productService } from '../services/productService';
import { Product } from '../types/product';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { itemCount, items, total, backendCart, addToCartBackend, removeFromCartBackend, fetchCartBackend } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart from backend on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCartBackend();
    }
  }, [isAuthenticated, fetchCartBackend]);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const productData = await productService.getProductById(parseInt(id));
        setProduct(productData);
        
        // Fetch similar products from the same category
        const similarResult = await productService.getProductsByCategory(
          productData.category, 
          0, 
          4
        );
        setSimilarProducts(
          similarResult.content.filter(p => p.id !== productData.id)
        );
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load product details. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-600 mb-4">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <Button onClick={() => navigate('/')}>Go back to store</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to add items to your cart.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (!product) return;

    try {
      await addToCartBackend(parseInt(product.id), quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      // Handle authentication errors by redirecting to login
      if (error instanceof Error && error.message.includes('Authentication required')) {
        toast({
          title: "Login required",
          description: "Please login to add items to your cart.",
          variant: "destructive"
        });
        navigate('/login');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onCartOpen={() => setIsCartOpen(true)}
        cartItemCount={itemCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        total={total}
        onRemoveItem={(productId) => {
          // Find the cart item by product ID and remove it
          const cartItem = backendCart?.items.find(item => item.product.id.toString() === productId);
          if (cartItem) {
            removeFromCartBackend(cartItem.id);
          }
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
                  <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold"
                disabled={!product.inStock}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <div className="bg-white rounded-lg p-6">
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <ProductReviews 
                  productId={product.id} 
                  rating={product.rating}
                  reviewCount={product.reviews}
                />
              </TabsContent>
              
              <TabsContent value="shipping" className="mt-6">
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                  <div className="space-y-3 text-gray-600">
                    <p>• Free shipping on orders over $50</p>
                    <p>• Standard delivery: 3-5 business days</p>
                    <p>• Express delivery: 1-2 business days</p>
                    <p>• International shipping available</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">Similar Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((similarProduct) => (
                  <ProductCard
                    key={similarProduct.id}
                    product={similarProduct}
                    onAddToCart={() => {
                      if (!isAuthenticated) {
                        toast({
                          title: "Login required",
                          description: "Please login to add items to your cart.",
                          variant: "destructive"
                        });
                        navigate('/login');
                        return;
                      }
                      addToCart(similarProduct);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;
