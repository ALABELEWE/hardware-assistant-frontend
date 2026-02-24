import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { paymentApi } from '../../api/payment.api';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  useEffect(() => {
    if (reference) {
      paymentApi.verify(reference)
        .then((res) => {
          const paymentStatus = res.data.data.status;
          setStatus(paymentStatus === 'success' ? 'success' : 'failed');
        })
        .catch(() => setStatus('failed'));
    } else {
      setStatus('failed');
    }
  }, [reference]);

  return (
    <div className="max-w-md mx-auto text-center py-16">
      {status === 'verifying' && (
        <>
          <div className="text-5xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-gray-800">Verifying Payment...</h1>
          <p className="text-gray-500 mt-2">Please wait while we confirm your payment.</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-800">Payment Successful!</h1>
          <p className="text-gray-500 mt-2">Your subscription is now active.</p>
          <Link
            to="/dashboard"
            className="inline-block mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        </>
      )}

      {status === 'failed' && (
        <>
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800">Payment Failed</h1>
          <p className="text-gray-500 mt-2">Something went wrong. Please try again.</p>
          <Link
            to="/subscription"
            className="inline-block mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Try Again
          </Link>
        </>
      )}
    </div>
  );
}
