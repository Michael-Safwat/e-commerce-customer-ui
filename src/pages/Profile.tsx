import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { useState } from 'react';
import AddressManager from '../components/AddressManager';

const Profile = () => {
  const { user } = useAuth();
  const { cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // State for password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage('New passwords do not match.');
      return;
    }
    // TODO: Call your password update API here
    setPasswordMessage('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

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
          <AddressManager />

          {/* Payment Methods */}
          <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
            <div className="text-gray-600">No payment methods added yet.</div>
          </section>

          {/* Change Password */}
          <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
            <form className="space-y-4" onSubmit={handlePasswordUpdate}>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="currentPassword">Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {passwordMessage && (
                <div className="text-sm text-red-600">{passwordMessage}</div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 transition"
              >
                Update Password
              </button>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;