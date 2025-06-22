import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { CheckCircle, Loader2 } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import CouponInput from '../components/CouponInput';
import OrderSummary from '../components/OrderSummary';
import CheckoutPaymentOptions from '../components/CheckoutPaymentOptions';
import CheckoutAddressOptions from '../components/CheckoutAddressOptions';
import CheckoutOrderDetails from '../components/CheckoutOrderDetails';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/orderService';
import { loadStripe } from '@stripe/stripe-js';

// Payment method IDs
const PAYMENT_METHODS = {
  STRIPE: 1,
  CASH_ON_DELIVERY: 2,
} as const;

// Initialize Stripe (you'll need to replace with your actual publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here');

const Checkout = () => {
  const { items, total, itemCount, backendCart, fetchCartBackend, setProductQuantity, removeFromCartBackend } = useCart();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const navigate = useNavigate();

  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    navigate('/login');
    return null;
  }

  // Fetch cart from backend on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCartBackend();
    }
  }, [isAuthenticated, fetchCartBackend]);

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      // If quantity would be less than 1, remove the item instead
      const cartItem = backendCart?.items.find(item => item.product.id.toString() === productId);
      if (cartItem) {
        await removeFromCartBackend(cartItem.id);
      }
      return;
    }
    
    try {
      await setProductQuantity(parseInt(productId), quantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = (productId: string) => {
    const cartItem = backendCart?.items.find(item => item.product.id.toString() === productId);
    if (cartItem) {
      removeFromCartBackend(cartItem.id);
    }
  };

  const handleProceedToPayment = async () => {
    if (!selectedAddress) {
      toast({
        title: "Address Required",
        description: "Please select a shipping address.",
        variant: "destructive"
      });
      return;
    }

    if (selectedPayment !== PAYMENT_METHODS.STRIPE) {
      // Handle cash on delivery
      toast({
        title: "Order Confirmed",
        description: "Your order has been placed successfully!",
      });
      navigate('/');
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Step 1: Finalize order with shipping address
      toast({
        title: "Processing",
        description: "Finalizing your order...",
      });
      
      const cartConfirmation = await orderService.finalizeOrder(selectedAddress);
      
      // Redirect to Stripe checkout page with orderId
      navigate(`/stripe-checkout?orderId=${encodeURIComponent(cartConfirmation.cartId)}`);
      return;
    } catch (error) {
      console.error('Payment error:', error);
      
      let errorMessage = "Failed to process payment. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('500')) {
          errorMessage = "Server error. Please check your backend configuration.";
        } else if (error.message.includes('401') || error.message.includes('403')) {
          errorMessage = "Authentication error. Please login again.";
        } else if (error.message.includes('404')) {
          errorMessage = "Order not found. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        onCartOpen={() => setIsCartOpen(true)}
        cartItemCount={itemCount}
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
                  updateQuantity={handleUpdateQuantity}
                  removeFromCart={handleRemoveItem}
                  toast={toast}
                />
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
                  onClick={handleProceedToPayment}
                >
                  {isProcessingPayment ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      {selectedPayment === PAYMENT_METHODS.STRIPE ? 'Proceed to Payment' : 'Confirm Order'}
                    </>
                  )}
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