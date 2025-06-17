import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { useState } from 'react';
import AddressManager from '../components/AddressManager';
import PasswordManager from '../components/PasswordManager';
import BasicInfoManager from '../components/BasicInfoManager';
import Orders from '../components/Orders';
import SavedList from '../components/SavedList';

const Profile = () => {
  const { cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'account' | 'orders' | 'saved'>('account');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        onCartOpen={() => setIsCartOpen(true)}
        cartItemCount={cart.itemCount}
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
            <button
              className={`text-left px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'saved'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 hover:bg-blue-50'
              }`}
              onClick={() => setActiveTab('saved')}
            >
              Saved List
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
          {activeTab === 'saved' && <SavedList />}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;