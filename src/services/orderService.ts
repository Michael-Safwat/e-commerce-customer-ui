export type Order = {
  id: string;
  date: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
};

export async function fetchUserOrders(): Promise<Order[]> {
  // Simulate API call delay
  await new Promise((res) => setTimeout(res, 500));
  // Dummy data
  return [
    {
      id: 'ORD-001',
      date: '2025-06-01',
      status: 'delivered',
      total: 299.99,
      items: [
        { name: 'iPhone 15', quantity: 1, price: 999.99 },
        { name: 'Apple Case', quantity: 1, price: 49.99 },
      ],
    },
    {
      id: 'ORD-002',
      date: '2025-06-10',
      status: 'pending',
      total: 59.99,
      items: [
        { name: 'Apple Watch Band', quantity: 1, price: 59.99 },
      ],
    },
  ];
}