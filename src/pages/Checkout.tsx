import { useCart } from '../hooks/useCart';
import SavedList from '../components/SavedList';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchSavedList, addToSavedList, removeFromSavedList } from '../services/savedListService';
import { CreditCard, DollarSign, CheckCircle } from 'lucide-react';

const Checkout = () => {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const { items, total, itemCount } = cart;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [savedItems, setSavedItems] = useState([]);
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        onCartOpen={() => setIsCartOpen(true)}
        cartItemCount={itemCount}
      />
      <main className="flex-1 w-2/3 mx-auto py-8 px-4 space-y-8 min-w-[340px] max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
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
            <Button className="w-full bg-blue-600 text-white" onClick={() => setStep(2)}>
              Continue
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            <section className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Choose Address</h2>
              <ul className="space-y-2">
                {addresses.map(addr => (
                  <li key={addr.id}>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === addr.id}
                        onChange={() => setSelectedAddress(addr.id)}
                      />
                      {addr.label}
                    </label>
                  </li>
                ))}
              </ul>
            </section>
            <section className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <ul className="space-y-2">
                {paymentMethods.map(pm => (
                  <li key={pm.id}>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === pm.id}
                        onChange={() => setSelectedPayment(pm.id)}
                      />
                      {pm.label}
                    </label>
                  </li>
                ))}
              </ul>
            </section>
            <Button
              className="w-full bg-blue-600 text-white"
              disabled={!selectedAddress || !selectedPayment}
              onClick={() => setStep(3)}
            >
              Go to Pay
            </Button>
          </>
        )}
        {step === 3 && (
          <section className="bg-white rounded-2xl shadow-md p-6">
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
              disabled={!selectedPayment}
              onClick={() => {
                // Place your order confirmation logic here
                navigate('/');
              }}
            >
              <CheckCircle className="w-5 h-5" />
              Confirm Order
            </Button>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;