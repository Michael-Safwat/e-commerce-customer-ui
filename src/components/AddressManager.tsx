import React, { useState } from 'react';

export type Address = {
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

const emptyAddress: Address = {
  id: 0,
  country: '',
  city: '',
  postalCode: '',
  street: '',
  description: '',
  buildingNumber: '',
  roofNumber: '',
  apartmentNumber: '',
};

const AddressManager: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressForm, setAddressForm] = useState<Address>(emptyAddress);
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
    setAddressForm(emptyAddress);
    setShowAddressModal(false);
  };

  const handleOpenAddAddress = () => {
    setEditingId(null);
    setAddressForm(emptyAddress);
    setShowAddressModal(true);
  };

  const handleEditAddress = (addr: Address) => {
    setEditingId(addr.id);
    setAddressForm(addr);
    setShowAddressModal(true);
  };

  const handleCloseAddressModal = () => {
    setShowAddressModal(false);
    setEditingId(null);
    setAddressForm(emptyAddress);
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setAddressForm(emptyAddress);
    }
  };

  return (
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
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleAddOrUpdateAddress}>
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
  );
};

export default AddressManager;