import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { useState } from 'react';

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

  type Address = {
    id: number;
    country: string;
    city: string;
    postalCode: string;
    street: string;
    description: string;
    buildingNumber: string;
    roofNumber: string;
    apartmentNumber: string;
  };

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressForm, setAddressForm] = useState<Address>({
    id: 0,
    country: '',
    city: '',
    postalCode: '',
    street: '',
    description: '',
    buildingNumber: '',
    roofNumber: '',
    apartmentNumber: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const handleAddressFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !addressForm.country ||
      !addressForm.city ||
      !addressForm.postalCode ||
      !addressForm.street ||
      !addressForm.buildingNumber
    ) {
      return;
    }
    if (editingId) {
      setAddresses(addresses.map(addr => addr.id === editingId ? { ...addressForm, id: editingId } : addr));
      setEditingId(null);
    } else {
      setAddresses([...addresses, { ...addressForm, id: Date.now() }]);
    }
    setAddressForm({
      id: 0,
      country: '',
      city: '',
      postalCode: '',
      street: '',
      description: '',
      buildingNumber: '',
      roofNumber: '',
      apartmentNumber: '',
    });
  };

  // Open modal for add
  const handleOpenAddAddress = () => {
    setEditingId(null);
    setAddressForm({
      id: 0,
      country: '',
      city: '',
      postalCode: '',
      street: '',
      description: '',
      buildingNumber: '',
      roofNumber: '',
      apartmentNumber: '',
    });
    setShowAddressModal(true);
  };

  // Open modal for edit
  const handleEditAddress = (addr: Address) => {
    setEditingId(addr.id);
    setAddressForm(addr);
    setShowAddressModal(true);
  };

  // Close modal
  const handleCloseAddressModal = () => {
    setShowAddressModal(false);
    setEditingId(null);
    setAddressForm({
      id: 0,
      country: '',
      city: '',
      postalCode: '',
      street: '',
      description: '',
      buildingNumber: '',
      roofNumber: '',
      apartmentNumber: '',
    });
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setAddressForm({
        id: 0,
        country: '',
        city: '',
        postalCode: '',
        street: '',
        description: '',
        buildingNumber: '',
        roofNumber: '',
        apartmentNumber: '',
      });
    }
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
          <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Addresses</h2>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 transition"
                onClick={handleOpenAddAddress}
                type="button"
              >
                Add Address
              </button>
            </div>
            <ul className="space-y-4">
              {addresses.length === 0 && (
                <li className="text-gray-600">No addresses added yet.</li>
              )}
              {addresses.map(addr => (
                <li key={addr.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <div className="font-medium">{addr.country}, {addr.city}, {addr.street} {addr.buildingNumber}</div>
                    <div className="text-sm text-gray-500">
                      Postal Code: {addr.postalCode} | Roof: {addr.roofNumber || '-'} | Apartment: {addr.apartmentNumber || '-'}
                    </div>
                    <div className="text-sm text-gray-500">{addr.description}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-600 font-semibold px-2"
                      onClick={() => handleEditAddress(addr)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 font-semibold px-2"
                      onClick={() => handleDeleteAddress(addr.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Address Modal */}
            {showAddressModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                    onClick={handleCloseAddressModal}
                    type="button"
                  >
                    &times;
                  </button>
                  <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Address' : 'Add Address'}</h3>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => { handleAddOrUpdateAddress(e); setShowAddressModal(false); }}>
                    <input
                      name="country"
                      type="text"
                      className="border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Country"
                      value={addressForm.country}
                      onChange={handleAddressFormChange}
                      required
                    />
                    <input
                      name="city"
                      type="text"
                      className="border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="City"
                      value={addressForm.city}
                      onChange={handleAddressFormChange}
                      required
                    />
                    <input
                      name="postalCode"
                      type="text"
                      className="border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Postal Code"
                      value={addressForm.postalCode}
                      onChange={handleAddressFormChange}
                      required
                    />
                    <input
                      name="street"
                      type="text"
                      className="border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Street Name"
                      value={addressForm.street}
                      onChange={handleAddressFormChange}
                      required
                    />
                    <input
                      name="buildingNumber"
                      type="text"
                      className="border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Building Number"
                      value={addressForm.buildingNumber}
                      onChange={handleAddressFormChange}
                      required
                    />
                    <input
                      name="roofNumber"
                      type="text"
                      className="border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Roof Number"
                      value={addressForm.roofNumber}
                      onChange={handleAddressFormChange}
                    />
                    <input
                      name="apartmentNumber"
                      type="text"
                      className="border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Apartment Number"
                      value={addressForm.apartmentNumber}
                      onChange={handleAddressFormChange}
                    />
                    <textarea
                      name="description"
                      className="border border-gray-300 rounded-lg px-3 py-2 md:col-span-2"
                      placeholder="Description"
                      value={addressForm.description}
                      onChange={handleAddressFormChange}
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 md:col-span-2"
                    >
                      {editingId ? 'Update Address' : 'Add Address'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </section>

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