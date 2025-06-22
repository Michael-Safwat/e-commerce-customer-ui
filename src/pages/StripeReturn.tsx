import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const StripeReturn = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    if (!sessionId) {
      setStatus('missing');
      return;
    }

    fetch(`/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === 'open') {
    navigate('/checkout');
    return null;
  }

  if (status === 'complete') {
    return (
      <section id="success" className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            We appreciate your business! A confirmation email will be sent to {customerEmail}.
            <br />
            If you have any questions, please email <a href="mailto:orders@example.com" className="text-blue-600 underline">orders@example.com</a>.
          </p>
          <Button onClick={() => navigate('/')} className="w-full bg-blue-600 hover:bg-blue-700">Go to Home</Button>
        </div>
      </section>
    );
  }

  if (status === 'missing') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-4">Missing Session</h2>
          <p>Session ID not found. Please try again from the checkout page.</p>
          <Button onClick={() => navigate('/checkout')} className="mt-4">Back to Checkout</Button>
        </div>
      </div>
    );
  }

  return null;
};

export default StripeReturn; 