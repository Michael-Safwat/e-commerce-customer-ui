import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/orderService';
import { OrderDTO } from '../types/order';
import { Loader2, Package, Calendar, MapPin, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = async (page: number = 0) => {
    if (!user?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await orderService.getUserOrders(user.id, page, 10);
      setOrders(prev => page === 0 ? response.content : [...prev, ...response.content]);
      setHasMore(!response.last);
      setCurrentPage(page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(0);
  }, [user?.id]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchOrders(currentPage + 1);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (error) {
    return (
      <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">
          <p>Error loading orders: {error}</p>
          <button 
            onClick={() => fetchOrders(0)}
            className="mt-2 text-sm text-red-700 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (loading && orders.length === 0) {
    return (
      <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading orders...</span>
        </div>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No orders yet.</p>
          <p className="text-sm text-gray-500 mt-1">Start shopping to see your orders here.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            {/* Order Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(order.createdAt)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl text-gray-900">
                  ${order.totalPrice.toFixed(2)}
                </div>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="flex items-start text-sm text-gray-600 mb-4">
              <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{order.shippingAddress}</span>
            </div>

            {/* Order Items */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Items ({order.items.length})</h4>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img 
                      src={item.productImage} 
                      alt={item.productName}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.productName}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                Loading...
              </>
            ) : (
              'Load More Orders'
            )}
          </button>
        </div>
      )}
    </section>
  );
};

export default Orders;