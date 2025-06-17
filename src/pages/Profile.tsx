import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { useState } from 'react';
import AddressManager from '../components/AddressManager';
import PasswordManager from '../components/PasswordManager';
import BasicInfoManager from '../components/BasicInfoManager';

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
          <BasicInfoManager />

          {/* Addresses */}
          <AddressManager />

          {/* Payment Methods */}
          <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
            <div className="text-gray-600">No payment methods added yet.</div>
          </section>

          {/* Change Password */}
          <PasswordManager />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;