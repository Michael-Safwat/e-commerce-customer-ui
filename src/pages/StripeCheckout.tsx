import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from '@/components/ui/button';

function getUserIdFromToken() {
  const token = localStorage.getItem('token') || localStorage.getItem('userToken');
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    return payload.userId || payload.sub;
  } catch {
    return null;
  }
}

const StripeCheckout = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();
  const userId = getUserIdFromToken();

  useEffect(() => {
    if (!orderId || !userId) return;
    const userToken = localStorage.getItem('token') || localStorage.getItem('userToken');
    fetch(`/api/v1/users/${userId}/pay`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({ orderId: Number(orderId) })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to create checkout session');
        return res.json();
      })
      .then((data) => {
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          throw new Error('No checkoutUrl returned');
        }
      })
      .catch(() => {
        // Optionally show an error or redirect back
      });
  }, [orderId, userId]);

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-4">Missing Order Info</h2>
          <p>Order ID not found. Please try again from the checkout page.</p>
          <Button onClick={() => navigate('/checkout')} className="mt-4">Back to Checkout</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Redirecting to payment...</h2>
        <p>Please wait while we redirect you to the secure Stripe payment page.</p>
      </div>
    </div>
  );
};

export default StripeCheckout; 