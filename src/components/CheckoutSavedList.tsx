import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { fetchSavedList, removeFromSavedList, SavedItem } from '../services/savedListService';

interface CheckoutSavedListProps {
  addToCart: (item: SavedItem) => void;
}

const CheckoutSavedList = ({ addToCart }: CheckoutSavedListProps) => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    fetchSavedList().then(setSavedItems);
  }, []);

  const handleAddToCart = async (item: SavedItem) => {
    addToCart(item);
    await removeFromSavedList(String(item.id));
    fetchSavedList().then(setSavedItems);
  };

  return (
    <section className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Saved List</h2>
      <div className="space-y-4">
        {savedItems.slice(0, 3).map(item => (
          <div key={item.id} className="flex items-center gap-4 border-b pb-4">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
            <div className="flex-1">
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm text-gray-500">${item.price.toFixed(2)}</div>
            </div>
            <Button
              variant="outline"
              className="text-green-600 border-green-200 hover:bg-green-50"
              onClick={() => handleAddToCart(item)}
            >
              Add to cart
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CheckoutSavedList;