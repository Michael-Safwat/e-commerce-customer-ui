import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { useState, useEffect } from 'react';
import AddressManager from '../components/AddressManager';
import PasswordManager from '../components/PasswordManager';
import BasicInfoManager from '../components/BasicInfoManager';
import Orders from '../components/Orders';
import Cart from '../components/Cart';
import { Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { itemCount, items, total, backendCart, removeFromCartBackend, fetchCartBackend } = useCart();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'account' | 'orders'>('account');

  // Fetch cart from backend on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCartBackend();
    }
  }, [isAuthenticated, fetchCartBackend]);

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

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

      <main className="flex-1 flex w-full max-w-5xl mx-auto py-12 px-4 gap-8">
        {/* Sidebar: 20% */}
        <aside className="basis-1/5 w-1/5 min-w-[140px] flex-shrink-0">
          <nav className="flex flex-col gap-2">
            <button
              className={`text-left px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'account'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 hover:bg-blue-50'
              }`}
              onClick={() => setActiveTab('account')}
            >
              Account Info
            </button>
            <button
              className={`text-left px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'orders'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 hover:bg-blue-50'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
          </nav>
        </aside>

        {/* Main Content: 80% */}
        <div className="basis-4/5 w-4/5 space-y-8">
          {activeTab === 'account' && (
            <>
              <BasicInfoManager />
              <AddressManager />
              <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
                <div className="text-gray-600">No payment methods added yet.</div>
              </section>
              <PasswordManager />
            </>
          )}
          {activeTab === 'orders' && <Orders />}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;