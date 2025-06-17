import { useCart } from '../hooks/useCart';
import SavedList from '../components/SavedList';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchSavedList, addToSavedList, removeFromSavedList } from '../services/savedListService';
import { MapPin, CreditCard, DollarSign, CheckCircle } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Checkout = () => {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const { items, total, itemCount } = cart;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [savedItems, setSavedItems] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  // Dummy addresses and payment methods
  const addresses = [
    { id: 1, label: '123 Main St, City, Country' },
    { id: 2, label: '456 Elm St, City, Country' }
  ];
  const paymentMethods = [
    { id: 1, label: 'Visa **** 1234' },
    { id: 2, label: 'PayPal: user@email.com' }
  ];
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);

  // Fetch saved items on mount
  useEffect(() => {
    fetchSavedList().then(setSavedItems);
  }, []);

  // Example coupon logic
  const validCoupons = {
    SAVE10: 0.10, // 10% off
    SAVE20: 0.20, // 20% off
  };

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (validCoupons[code]) {
      setDiscount(validCoupons[code]);
      setCouponError('');
      toast({
        title: "Coupon Applied",
        description: `Coupon "${code}" applied!`,
      });
    } else {
      setDiscount(0);
      setCouponError('Invalid coupon code.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        onCartOpen={() => setIsCartOpen(true)}
        cartItemCount={itemCount}
      />
      <main className="flex-1 w-2/3 mx-auto py-8 px-4 space-y-8 min-w-[340px] max-w-4xl">
        {/* Move the Checkout header here */}
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
                            onClick={() => {
                              removeFromCart(item.id, item.selectedColor, item.selectedSize);
                              // Implement add to saved list logic here
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
                          onClick={async () => {
                            addToCart(item);
                            await removeFromSavedList(item.id);
                            // Refresh saved items list
                            fetchSavedList().then(setSavedItems);
                          }}
                        >
                          Add to cart
                        </Button>
                      </div>
                    ))}
                  </div>
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
                <h2 className="text-xl font-semibold mb-4">Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {addresses.map(addr => (
                    <div
                      key={addr.id}
                      className={`border rounded-lg p-4 flex items-center gap-4 cursor-pointer transition ${
                        selectedAddress === addr.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                      onClick={() => setSelectedAddress(addr.id)}
                    >
                      <MapPin className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="font-semibold">{addr.label}</div>
                        <div className="text-sm text-gray-500">Delivery Address</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment Section */}
                <h2 className="text-xl font-semibold mb-4">Payment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div
                    className={`border rounded-lg p-4 flex items-center gap-4 cursor-pointer transition ${
                      selectedPayment === 1
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                    onClick={() => setSelectedPayment(1)}
                  >
                    <CreditCard className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="font-semibold">Stripe</div>
                      <div className="text-sm text-gray-500">Pay securely with your credit or debit card.</div>
                    </div>
                  </div>
                  <div
                    className={`border rounded-lg p-4 flex items-center gap-4 cursor-pointer transition ${
                      selectedPayment === 2
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 bg-white'
                    }`}
                    onClick={() => setSelectedPayment(2)}
                  >
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="font-semibold">Cash on Delivery</div>
                      <div className="text-sm text-gray-500">Pay with cash when your order arrives.</div>
                    </div>
                  </div>
                </div>
              
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
              <div className="bg-white rounded-2xl shadow-md p-6 h-fit w-full">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>$0.00</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between mb-2 text-green-600">
                    <span>Discount</span>
                    <span>- ${(total * discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${(total - total * discount).toFixed(2)}</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6 mt-4 w-full">
                <label className="block font-semibold mb-2">Apply Coupon</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="border rounded px-2 py-1 flex-1 min-w-0"
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                  />
                  <Button
                    type="button"
                    className="bg-blue-600 text-white whitespace-nowrap"
                    onClick={handleApplyCoupon}
                  >
                    Apply
                  </Button>
                </div>
                {couponError && (
                  <div className="text-red-600 text-sm mt-2">{couponError}</div>
                )}
                {discount > 0 && (
                  <div className="text-green-600 text-sm mt-2">Coupon applied!</div>
                )}
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