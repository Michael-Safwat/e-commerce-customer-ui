import React from 'react';

interface OrderSummaryProps {
  total: number;
  discount: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ total, discount }) => (
  <div className="bg-white rounded-2xl shadow-md p-6 h-fit w-full">
    <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
    <div className="flex justify-between mb-2">
      <span>Subtotal</span>
      <span>${total.toFixed(2)}</span>
    </div>
    <div className="flex justify-between mb-2">
      <span>Shipping</span>
      <span>$0.00</span>
    </div>
    {discount > 0 && (
      <div className="flex justify-between mb-2 text-green-600">
        <span>Discount</span>
        <span>- ${(total * discount).toFixed(2)}</span>
      </div>
    )}
    <div className="flex justify-between font-bold text-lg border-t pt-2">
      <span>Total</span>
      <span>${(total - total * discount).toFixed(2)}</span>
    </div>
  </div>
);

export default OrderSummary;