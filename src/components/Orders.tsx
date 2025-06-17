import React, { useEffect, useState } from 'react';
import { fetchUserOrders, Order } from '../services/orderService';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
        <div className="text-gray-600">Loading...</div>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
        <div className="text-gray-600">No orders yet.</div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">Order #{order.id}</div>
                <div className="text-sm text-gray-500">Date: {order.date}</div>
                <div className="text-sm text-gray-500">Status: <span className={`font-semibold ${order.status === 'delivered' ? 'text-green-600' : order.status === 'pending' ? 'text-yellow-600' : 'text-gray-600'}`}>{order.status}</span></div>
              </div>
              <div className="font-bold text-lg">${order.total.toFixed(2)}</div>
            </div>
            <ul className="mt-2 text-sm text-gray-700">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} &times; {item.quantity} — ${item.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Orders;