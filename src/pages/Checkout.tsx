import { useCart } from '../hooks/useCart';
import CheckoutSavedList from '../components/CheckoutSavedList';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { addToSavedList } from '../services/savedListService';
import { CheckCircle } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import CouponInput from '../components/CouponInput';
import OrderSummary from '../components/OrderSummary';
import CheckoutPaymentOptions from '../components/CheckoutPaymentOptions';
import CheckoutAddressOptions from '../components/CheckoutAddressOptions';

const Checkout = () => {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const { items, total, itemCount } = cart;
  const [step, setStep] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [refreshSavedListKey, setRefreshSavedListKey] = useState(0);
  const navigate = useNavigate();

  const addresses = [
    { id: 1, label: '123 Main St, City, Country' },
    { id: 2, label: '456 Elm St, City, Country' }
  ];

  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        onCartOpen={() => {}}
        cartItemCount={itemCount}
      />
      <main className="flex-1 w-2/3 mx-auto py-8 px-4 space-y-8 min-w-[340px] max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <div className="flex gap-8">
          {/* Left: Steps */}
          <div className="flex-1">
            {step === 1 && (
              <>
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
                              setRefreshSavedListKey(k => k + 1); // trigger refresh
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
                <section className="bg-white rounded-2xl shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Saved List</h2>
                  <CheckoutSavedList addToCart={addToCart} refreshKey={refreshSavedListKey} />
                </section>
                <Button
                  className="w-full bg-blue-600 text-white"
                  onClick={() => {
                    if (items.length === 0) {
                      toast({
                        title: "Cart is empty",
                        description: "Please add at least one item to your cart before continuing.",
                      });
                      return;
                    }
                    setStep(2);
                  }}
                  disabled={items.length === 0}
                >
                  Continue
                </Button>
              </>
            )}
            {step === 2 && (
              <section className="bg-white rounded-2xl shadow-md p-6">
                {/* Address Section */}
                <CheckoutAddressOptions
                  selectedAddress={selectedAddress}
                  setSelectedAddress={setSelectedAddress}
                />

                {/* Payment Section */}
                <CheckoutPaymentOptions
                  selectedPayment={selectedPayment}
                  setSelectedPayment={setSelectedPayment}
                />

                <Button
                  className="w-full bg-green-600 text-white flex items-center justify-center gap-2"
                  disabled={!selectedPayment || !selectedAddress}
                  onClick={() => {
                    toast({
                      title: "Order Confirmed",
                      description: "Your order has been placed successfully!",
                    });
                    navigate('/');
                  }}
                >
                  <CheckCircle className="w-5 h-5" />
                  Confirm Order
                </Button>
              </section>
            )}
          </div>
          {/* Right: Order Summary and Coupon (only in step 2) */}
          {step === 2 && (
            <div className="flex flex-col items-start w-full max-w-xs">
              <OrderSummary total={total} discount={discount} />
              <div className="bg-white rounded-2xl shadow-md p-6 mt-4 w-full">
                <CouponInput total={total} onDiscount={setDiscount} />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;