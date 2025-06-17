import { useCart } from '../hooks/useCart';
import CheckoutSavedList from '../components/CheckoutSavedList';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { addToSavedList, SavedProduct } from '../services/savedListService';
import { CheckCircle } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import CouponInput from '../components/CouponInput';
import OrderSummary from '../components/OrderSummary';
import CheckoutPaymentOptions from '../components/CheckoutPaymentOptions';
import CheckoutAddressOptions from '../components/CheckoutAddressOptions';
import CheckoutOrderDetails from '../components/CheckoutOrderDetails';
import { CartItem } from '@/types/product';

const Checkout = () => {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const { items, total, itemCount } = cart;
  const [step, setStep] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [refreshSavedListKey, setRefreshSavedListKey] = useState(0);
  const navigate = useNavigate();



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
               <CheckoutOrderDetails
                  items={items}
                  total={total}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  addToSavedList={addToSavedList}
                  onSavedListRefresh={() => setRefreshSavedListKey(k => k + 1)}
                  toast={toast}
                />
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