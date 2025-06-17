import { useCart } from '../hooks/useCart';
import SavedList from '../components/SavedList';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Checkout = () => {
  const { cart } = useCart();
  const { items, total, itemCount } = cart;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [step, setStep] = useState(1);
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        onCartOpen={() => setIsCartOpen(true)}
        cartItemCount={itemCount}
      />
      <main className="flex-1 max-w-3xl mx-auto py-8 px-4 space-y-8">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        {step === 1 && (
          <>
            <section className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              <ul className="divide-y">
                {items.map(item => (
                  <li key={item.id} className="py-2 flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-semibold mt-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </section>
            <section className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Saved List</h2>
              <SavedList />
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
            <p>Implement your payment logic here.</p>
            <Button className="mt-4 bg-green-600 text-white" onClick={() => navigate('/')}>
              Finish & Go Home
            </Button>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;