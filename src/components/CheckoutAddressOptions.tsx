import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { addressService } from '../services/addressService';
import { ShippingAddressResponse } from '../types/address';
import { useAuth } from '../hooks/useAuth';
import { toast } from '../hooks/use-toast';

interface CheckoutAddressOptionsProps {
  selectedAddress: number | null;
  setSelectedAddress: (id: number) => void;
}

const CheckoutAddressOptions = ({
  selectedAddress,
  setSelectedAddress,
}: CheckoutAddressOptionsProps) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<ShippingAddressResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      
      // Auto-select the first address if available and none is selected
      if (fetchedAddresses.length > 0 && !selectedAddress) {
        setSelectedAddress(fetchedAddresses[0].id);
      }
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

  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Address</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading addresses...</p>
        </div>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Address</h2>
        <div className="text-center py-8">
          <p className="text-gray-600">No addresses found. Please add an address in your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Address</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {addresses.map(addr => (
          <div
            key={addr.id}
            className={`border rounded-lg p-4 flex items-center gap-4 cursor-pointer transition ${
              selectedAddress === addr.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => setSelectedAddress(addr.id)}
          >
            <MapPin className="w-8 h-8 text-blue-600" />
            <div className="flex-1">
              <div className="font-semibold">{addr.street}</div>
              <div className="text-sm text-gray-500">
                {addr.city}, {addr.state}, {addr.country}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutAddressOptions;