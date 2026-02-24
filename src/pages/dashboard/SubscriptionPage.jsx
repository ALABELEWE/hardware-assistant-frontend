import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { paymentApi } from '../../api/payment.api';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '₦2,000',
    period: '/month',
    color: 'blue',
    features: [
      'AI Business Analysis',
      'Business Profile',
      'Analysis History',
      'Email Support',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₦5,000',
    period: '/month',
    color: 'purple',
    popular: true,
    features: [
      'Everything in Basic',
      'SMS Alerts',
      'Priority AI Analysis',
      'Advanced Insights',
      'Priority Support',
    ],
  },
];

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');

  const handleSubscribe = async (planId) => {
    setLoading(planId);
    setError('');
    try {
      const res = await paymentApi.initialize(planId);
      const { authorizationUrl } = res.data.data;
      window.location.href = authorizationUrl;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize payment. Try again.');
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Choose Your Plan</h1>
        <p className="text-gray-500 mt-2">
          Unlock the full power of AI for your hardware business
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-2xl border-2 p-8 flex flex-col
              ${plan.popular ? 'border-purple-500 shadow-lg shadow-purple-100' : 'border-gray-200'}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">{plan.name}</h2>
              <div className="flex items-end gap-1 mt-2">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-400 mb-1">{plan.period}</span>
              </div>
            </div>

            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-green-500 font-bold">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading === plan.id}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition
                ${plan.popular
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'}
                ${loading === plan.id ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading === plan.id ? 'Redirecting to payment...' : `Subscribe to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        Secured by Paystack · Cancel anytime
      </p>
    </div>
  );
}