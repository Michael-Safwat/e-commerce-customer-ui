import React, { useEffect, useState } from 'react';
import { Star, Plus, Heart } from 'lucide-react';
import { Product } from '../types/product';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { addToSavedList, fetchSavedList, removeFromSavedList } from '../services/savedListService';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchSavedList().then((items) => {
      setIsSaved(items.some(item => item.id === product.id));
    });
  }, [product.id]);

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleToggleSaved = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      await removeFromSavedList(product.id);
      setIsSaved(false);
    } else {
      await addToSavedList(product);
      setIsSaved(true);
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
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className={`bg-white/80 hover:bg-white transition-colors`}
            onClick={handleToggleSaved}
            title={isSaved ? "Remove from saved list" : "Save to list"}
          >
            <Heart className={`h-4 w-4 transition-colors ${isSaved ? 'text-red-600 fill-red-600' : 'text-gray-900'}`} />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-600">{product.rating}</span>
          <span className="text-sm text-gray-400">({product.reviews})</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1">
              {product.colors.slice(0, 3).map((color) => (
                <div
                  key={color}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
