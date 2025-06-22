import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { addressService } from '../services/addressService';
import { ShippingAddressRequest, ShippingAddressResponse } from '../types/address';
import { toast } from '../hooks/use-toast';

const AddressManager: React.FC = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<ShippingAddressResponse[]>([]);
  const [addressForm, setAddressForm] = useState<ShippingAddressRequest>({
    street: '',
    city: '',
    state: '',
    country: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load addresses on component mount
  useEffect(() => {
    if (user?.id) {
      loadAddresses();
    }
  }, [user?.id]);

  const loadAddresses = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const fetchedAddresses = await addressService.getAllAddresses(user.id);
      setAddresses(fetchedAddresses);
    } catch (error) {
      console.error('Failed to load addresses:', error);
      toast({
        title: "Error",
        description: "Failed to load addresses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.country) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      if (editingId) {
        // Update existing address
        const updatedAddress = await addressService.updateAddress(user.id, editingId, addressForm);
        setAddresses(addresses.map(addr => addr.id === editingId ? updatedAddress : addr));
        toast({
          title: "Success",
          description: "Address updated successfully",
        });
      } else {
        // Create new address
        const newAddress = await addressService.createAddress(user.id, addressForm);
        setAddresses([...addresses, newAddress]);
        toast({
          title: "Success",
          description: "Address added successfully",
        });
      }
      
      setAddressForm({ street: '', city: '', state: '', country: '' });
      setEditingId(null);
      setShowAddressModal(false);
    } catch (error) {
      console.error('Failed to save address:', error);
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddAddress = () => {
    setEditingId(null);
    setAddressForm({ street: '', city: '', state: '', country: '' });
    setShowAddressModal(true);
  };

  const handleEditAddress = (addr: ShippingAddressResponse) => {
    setEditingId(addr.id);
    setAddressForm({
      street: addr.street,
      city: addr.city,
      state: addr.state,
      country: addr.country,
    });
    setShowAddressModal(true);
  };

  const handleCloseAddressModal = () => {
    setShowAddressModal(false);
    setEditingId(null);
    setAddressForm({ street: '', city: '', state: '', country: '' });
  };

  const handleDeleteAddress = async (id: number) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await addressService.deleteAddress(user.id, id);
      setAddresses(addresses.filter(addr => addr.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setAddressForm({ street: '', city: '', state: '', country: '' });
      }
      toast({
        title: "Success",
        description: "Address deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete address:', error);
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Addresses</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 transition disabled:opacity-50"
          onClick={handleOpenAddAddress}
          type="button"
          disabled={isLoading}
        >
          Add Address
        </button>
      </div>
      
      {isLoading && addresses.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading addresses...</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {addresses.length === 0 && (
            <li className="text-gray-600">No addresses added yet.</li>
          )}
          {addresses.map(addr => (
            <li key={addr.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <div className="font-medium">{addr.country}, {addr.city}, {addr.street}</div>
                <div className="text-sm text-gray-500">
                  State: {addr.state}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-blue-600 font-semibold px-2 disabled:opacity-50"
                  onClick={() => handleEditAddress(addr)}
                  type="button"
                  disabled={isLoading}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 font-semibold px-2 disabled:opacity-50"
                  onClick={() => handleDeleteAddress(addr.id)}
                  type="button"
                  disabled={isLoading}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
              onClick={handleCloseAddressModal}
              type="button"
              disabled={isLoading}
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Address' : 'Add Address'}</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleAddOrUpdateAddress}>
              <input
                name="street"
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Street"
                value={addressForm.street}
                onChange={handleAddressFormChange}
                required
                disabled={isLoading}
              />
              <input
                name="city"
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="City"
                value={addressForm.city}
                onChange={handleAddressFormChange}
                required
                disabled={isLoading}
              />
              <input
                name="state"
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="State"
                value={addressForm.state}
                onChange={handleAddressFormChange}
                required
                disabled={isLoading}
              />
              <input
                name="country"
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Country"
                value={addressForm.country}
                onChange={handleAddressFormChange}
                required
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 md:col-span-2 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (editingId ? 'Update Address' : 'Add Address')}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AddressManager;