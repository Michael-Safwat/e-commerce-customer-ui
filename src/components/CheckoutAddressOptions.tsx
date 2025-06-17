import { MapPin } from 'lucide-react';

interface Address {
  id: number;
  label: string;
}

interface CheckoutAddressOptionsProps {
  addresses: Address[];
  selectedAddress: number | null;
  setSelectedAddress: (id: number) => void;
}

const CheckoutAddressOptions = ({
  addresses,
  selectedAddress,
  setSelectedAddress,
}: CheckoutAddressOptionsProps) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Address</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {addresses.map(addr => (
        <div
          key={addr.id}
          className={`border rounded-lg p-4 flex items-center gap-4 cursor-pointer transition ${
            selectedAddress === addr.id
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 bg-white'
          }`}
          onClick={() => setSelectedAddress(addr.id)}
        >
          <MapPin className="w-8 h-8 text-blue-600" />
          <div>
            <div className="font-semibold">{addr.label}</div>
            <div className="text-sm text-gray-500">Delivery Address</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default CheckoutAddressOptions;