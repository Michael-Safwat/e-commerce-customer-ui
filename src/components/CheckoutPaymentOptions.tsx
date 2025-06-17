import { CreditCard, DollarSign } from 'lucide-react';

interface CheckoutPaymentOptionsProps {
  selectedPayment: number | null;
  setSelectedPayment: (id: number) => void;
}

const paymentMethods = [
  {
    id: 1,
    label: 'Stripe',
    description: 'Pay securely with your credit or debit card.',
    icon: <CreditCard className="w-8 h-8 text-blue-600" />,
    border: 'border-blue-600 bg-blue-50',
  },
  {
    id: 2,
    label: 'Cash on Delivery',
    description: 'Pay with cash when your order arrives.',
    icon: <DollarSign className="w-8 h-8 text-green-600" />,
    border: 'border-green-600 bg-green-50',
  },
];

const CheckoutPaymentOptions = ({
  selectedPayment,
  setSelectedPayment,
}: CheckoutPaymentOptionsProps) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Payment</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {paymentMethods.map((pm) => (
        <div
          key={pm.id}
          className={`border rounded-lg p-4 flex items-center gap-4 cursor-pointer transition ${
            selectedPayment === pm.id ? pm.border : 'border-gray-200 bg-white'
          }`}
          onClick={() => setSelectedPayment(pm.id)}
        >
          {pm.icon}
          <div>
            <div className="font-semibold">{pm.label}</div>
            <div className="text-sm text-gray-500">{pm.description}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default CheckoutPaymentOptions;