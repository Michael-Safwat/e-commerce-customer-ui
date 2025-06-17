import { Button } from '@/components/ui/button';
import { SavedProduct } from '@/services/savedListService';

interface Item {
  id: string | number;
  name: string;
  image: string;
  quantity: number;
  price: number;
  selectedColor?: string;
  selectedSize?: string;
  [key: string]: any;
}

interface CheckoutOrderDetailsProps {
  items: Item[];
  total: number;
  updateQuantity: (
    id: string | number,
    quantity: number,
    color?: string,
    size?: string
  ) => void;
  removeFromCart: (
    id: string | number,
    color?: string,
    size?: string
  ) => void;
  addToSavedList: (item: SavedProduct) => Promise<void>;
  onSavedListRefresh: () => void;
  toast: (args: { title: string; description: string }) => void;
}

const CheckoutOrderDetails = ({
  items,
  total,
  updateQuantity,
  removeFromCart,
  addToSavedList,
  onSavedListRefresh,
  toast,
}: CheckoutOrderDetailsProps) => (
  <section className="bg-white rounded-2xl shadow-md p-6 mb-6">
    <h2 className="text-xl font-semibold mb-4">Order Details</h2>
    <div className="space-y-4">
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-4 border-b pb-4">
          <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
          <div className="flex-1">
            <div className="font-semibold">{item.name}</div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              Qty:
              <button
                className="px-2 py-1 border rounded disabled:opacity-50"
                onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                disabled={item.quantity <= 1}
              >-</button>
              <span className="mx-2">{item.quantity}</span>
              <button
                className="px-2 py-1 border rounded"
                onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
              >+</button>
            </div>
            <div className="text-sm text-gray-500">Price: ${item.price.toFixed(2)}</div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={async () => {
                await addToSavedList(item);
                removeFromCart(item.id, item.selectedColor, item.selectedSize);
                onSavedListRefresh();
                toast({
                  title: "Saved for later",
                  description: `${item.name} has been moved to your saved list.`,
                });
              }}
            >
              Save for later
            </Button>
          </div>
        </div>
      ))}
    </div>
    <div className="flex justify-between font-semibold mt-4">
      <span>Total</span>
      <span>${total.toFixed(2)}</span>
    </div>
  </section>
);

export default CheckoutOrderDetails;