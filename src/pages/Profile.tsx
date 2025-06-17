import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { useState } from 'react';

const Profile = () => {
  const { user } = useAuth();
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        onCartOpen={() => setIsCartOpen(true)}
        cartItemCount={cart.itemCount}
        
      />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto py-12 px-4 space-y-10">
          {/* Basic Info */}
          <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            <div className="flex items-center gap-6">
              <img
                src={user?.profileImage || '/default-profile.png'}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border"
              />
              <div>
                <div className="text-lg font-medium">{user?.name || 'Your Name'}</div>
                <div className="text-gray-600">{user?.email}</div>
                <div className="text-gray-500 text-sm">Birthday: {user?.birthday || 'Not set'}</div>
              </div>
            </div>
          </section>

          {/* Addresses */}
          <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Addresses</h2>
            {/* Render user's addresses here */}
            <div className="text-gray-600">No addresses added yet.</div>
          </section>

          {/* Payment Methods */}
          <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
            {/* Render user's payment methods here */}
            <div className="text-gray-600">No payment methods added yet.</div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;