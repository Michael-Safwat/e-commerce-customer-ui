import React from 'react';
import { Star, Plus } from 'lucide-react';
import { Product } from '../types/product';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { toast } from '../hooks/use-toast';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void; // Keep for backward compatibility but don't use
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCartBackend } = useCart();
  const { isAuthenticated } = useAuth();

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to add items to your cart.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    try {
      // Only call backend cart - no double API calls
      await addToCartBackend(parseInt(product.id), 1);
      
      // Don't call onAddToCart to avoid double API calls
      // The backend handles all cart logic
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
    <div 
      className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleProductClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.originalPrice && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
            Sale
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            className="bg-white/80 hover:bg-white text-gray-900"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.reviews})</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
          )}
        </div>
        
        {!product.inStock && (
          <p className="text-sm text-red-600 mt-2">Out of Stock</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
