import { useState, useEffect } from 'react';
import { merchantApi } from '../../api/merchant.api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CUSTOMER_TYPES = ['Retail', 'Wholesale', 'Both Retail & Wholesale', 'Contractors', 'Mixed'];
const PRICE_RANGES = ['Budget (₦0 - ₦50k)', 'Mid-range (₦50k - ₦500k)', 'High-end (₦500k+)', 'Mixed Range'];

export default function ProfilePage() {
  const [form, setForm] = useState({
    businessName: '',
    location: '',
    customerType: '',
    phoneNumber: '',
    products: '',
    priceRange: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load existing profile on mount
  useEffect(() => {
    merchantApi.getProfile()
      .then((res) => {
        const p = res.data.data;
        setForm({
          businessName: p.businessName || '',
          location: p.location || '',
          customerType: p.customerType || '',
          phoneNumber: p.phoneNumber || '',
          products: p.products || '',
          priceRange: p.priceRange || '',
        });
      })
      .catch(() => {
        // Profile doesn't exist yet — that's fine, just leave form empty
      })
      .finally(() => setFetching(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await merchantApi.saveProfile(form);
      setSuccess('Profile saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Business Profile</h1>
        <p className="text-gray-500 text-sm mt-1">
          This information is used to generate your AI business insights.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && <ErrorMessage message={error} />}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              ✅ {success}
            </div>
          )}

          <Input
            label="Business Name"
            name="businessName"
            value={form.businessName}
            onChange={handleChange}
            placeholder="e.g. Chukwu Hardware Supplies"
            required
          />

          <Input
            label="Location (Area in Lagos)"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Alaba International Market, Ojo"
            required
          />

          <Input
            label="Phone Number"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="e.g. +2348012345678"
          />

          {/* Customer Type Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Customer Type <span className="text-red-500">*</span>
            </label>
            <select
              name="customerType"
              value={form.customerType}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select customer type</option>
              {CUSTOMER_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Products Textarea */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Products You Sell <span className="text-red-500">*</span>
            </label>
            <textarea
              name="products"
              value={form.products}
              onChange={handleChange}
              required
              rows={4}
              placeholder="e.g. Cement, roofing sheets, iron rods, PVC pipes, electrical cables, plumbing fittings..."
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <span className="text-xs text-gray-400">Be as detailed as possible for better AI insights</span>
          </div>

          {/* Price Range Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Price Range</label>
            <select
              name="priceRange"
              value={form.priceRange}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select price range</option>
              {PRICE_RANGES.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          <Button type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      </div>
    </div>
  );
}