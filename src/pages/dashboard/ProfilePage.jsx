import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, MapPin, Phone, Users, Package,
  DollarSign, Save, CheckCircle, AlertCircle
} from 'lucide-react';
import { merchantApi } from '../../api/merchant.api';
import { useToast } from '../../context/ToastContext';
import { Skeleton } from '../../components/common/Skeleton';

const CUSTOMER_TYPES = [
  'Retail',
  'Wholesale',
  'Both Retail & Wholesale',
  'Contractors',
  'Mixed',
];

const PRICE_RANGES = [
  'Budget (₦0 - ₦50k)',
  'Mid-range (₦50k - ₦500k)',
  'High-end (₦500k+)',
  'Mixed Range',
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

// ── Validation ────────────────────────────────────────────────────────────
function validateProfile(form) {
  const errors = {};

  if (!form.businessName.trim())
    errors.businessName = 'Business name is required';
  else if (form.businessName.trim().length < 2)
    errors.businessName = 'Business name must be at least 2 characters';
  else if (form.businessName.length > 100)
    errors.businessName = 'Business name must not exceed 100 characters';

  if (form.location && form.location.length > 150)
    errors.location = 'Location must not exceed 150 characters';

  if (form.phoneNumber && !/^(\+?[0-9\s\-().]{7,20})?$/.test(form.phoneNumber))
    errors.phoneNumber = 'Please enter a valid phone number (e.g. +2348012345678)';

  if (!form.customerType)
    errors.customerType = 'Please select a customer type';

  if (!form.products.trim())
    errors.products = 'Please describe the products you sell';
  else if (form.products.length > 500)
    errors.products = `Products description is too long (${form.products.length}/500 characters)`;

  if (form.priceRange && form.priceRange.length > 100)
    errors.priceRange = 'Price range value is invalid';

  return errors;
}

// ── Field wrapper ─────────────────────────────────────────────────────────
function Field({ label, icon: Icon, hint, error, children }) {
  return (
    <motion.div variants={item} className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${error ? 'text-red-400' : 'text-gray-400'}`} />
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      </div>
      {children}
      {error
        ? <p className="text-xs text-red-500 pl-6 flex items-center gap-1">⚠ {error}</p>
        : hint && <p className="text-xs text-gray-400 pl-6">{hint}</p>
      }
    </motion.div>
  );
}

// ── Text input ────────────────────────────────────────────────────────────
function TextInput({ name, value, onChange, placeholder, required, focused, setFocused, error }) {
  return (
    <div className={`flex items-center gap-3 bg-white dark:bg-gray-800
      border rounded-xl px-4 py-3 transition-all
      ${focused === name
        ? 'border-brand-500 ring-2 ring-brand-500/20'
        : error
          ? 'border-red-400 ring-2 ring-red-400/20'
          : 'border-gray-200 dark:border-gray-700'}`}
    >
      <input
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(name)}
        onBlur={() => setFocused('')}
        placeholder={placeholder}
        required={required}
        className="flex-1 bg-transparent text-sm text-gray-900
          dark:text-white placeholder-gray-400 outline-none"
      />
    </div>
  );
}

// ── Select input ──────────────────────────────────────────────────────────
function SelectInput({ name, value, onChange, options, placeholder, required, focused, setFocused, error }) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(name)}
      onBlur={() => setFocused('')}
      required={required}
      className={`bg-white dark:bg-gray-800 border rounded-xl px-4 py-3
        text-sm transition-all outline-none w-full text-gray-900 dark:text-white
        ${focused === name
          ? 'border-brand-500 ring-2 ring-brand-500/20'
          : error
            ? 'border-red-400 ring-2 ring-red-400/20'
            : 'border-gray-200 dark:border-gray-700'}
        ${!value ? 'text-gray-400' : ''}`}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border
        border-gray-100 dark:border-gray-800 p-8 flex flex-col gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-11 w-full" />
          </div>
        ))}
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    businessName: '',
    location:     '',
    customerType: '',
    phoneNumber:  '',
    products:     '',
    priceRange:   '',
  });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saved,    setSaved]    = useState(false);
  const [focused,  setFocused]  = useState('');
  const [isNew,    setIsNew]    = useState(true);

  useEffect(() => {
    merchantApi.getProfile()
      .then((res) => {
        const p = res.data.data;
        setForm({
          businessName: p.businessName || '',
          location:     p.location     || '',
          customerType: p.customerType || '',
          phoneNumber:  p.phoneNumber  || '',
          products:     p.products     || '',
          priceRange:   p.priceRange   || '',
        });
        setIsNew(false);
      })
      .catch(() => setIsNew(true))
      .finally(() => setFetching(false));
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation first
    const validationErrors = validateProfile(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast('Please fix the errors before saving', 'error');
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    try {
      await merchantApi.saveProfile(form);
      setSaved(true);
      setIsNew(false);
      setErrors({});
      toast('Profile saved successfully!', 'success');
    } catch (err) {
      // Handle backend validation errors (field-level)
      const data = err.response?.data;
      if (data?.fieldErrors) {
        setErrors(data.fieldErrors);
        toast(data.message || 'Please fix the errors', 'error');
      } else {
        toast(data?.message || 'Failed to save profile', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const completeness = Object.values(form).filter(Boolean).length;
  const pct      = Math.round((completeness / 6) * 100);
  const pctColor = pct < 40 ? 'bg-red-500' : pct < 80 ? 'bg-yellow-500' : 'bg-green-500';

  if (fetching) return <ProfileSkeleton />;

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-6">

        {/* Header */}
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Business Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            This information powers your AI business insights.
          </p>
        </motion.div>

        {/* Completeness bar */}
        <motion.div variants={item}
          className="bg-white dark:bg-gray-900 rounded-2xl border
            border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile completeness</p>
            <span className={`text-sm font-bold
              ${pct === 100 ? 'text-green-500' : pct >= 80 ? 'text-yellow-500' : 'text-red-500'}`}>
              {pct}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${pctColor}`}
            />
          </div>
          {pct < 100 && (
            <p className="text-xs text-gray-400 mt-2">Complete your profile for more accurate AI recommendations.</p>
          )}
          {pct === 100 && (
            <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Profile complete — AI analysis will be most accurate!
            </p>
          )}
        </motion.div>

        {/* Form card */}
        <motion.div variants={item}
          className="bg-white dark:bg-gray-900 rounded-2xl border
            border-gray-100 dark:border-gray-800 p-8">

          {isNew && (
            <div className="flex items-start gap-3 bg-brand-50 dark:bg-brand-950/30
              border border-brand-100 dark:border-brand-900 rounded-xl p-4 mb-6">
              <AlertCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
              <p className="text-sm text-brand-700 dark:text-brand-300">
                Welcome! Complete your business profile to unlock AI analysis.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            <Field icon={Building2} label="Business Name *" error={errors.businessName}>
              <TextInput
                name="businessName" value={form.businessName} onChange={handleChange}
                placeholder="e.g. Chukwu Hardware Supplies"
                required focused={focused} setFocused={setFocused} error={errors.businessName}
              />
            </Field>

            <Field icon={MapPin} label="Location (Area in Lagos)" error={errors.location}>
              <TextInput
                name="location" value={form.location} onChange={handleChange}
                placeholder="e.g. Alaba International Market, Ojo"
                focused={focused} setFocused={setFocused} error={errors.location}
              />
            </Field>

            <Field icon={Phone} label="Phone Number"
              hint="Used for SMS alerts with top recommendations"
              error={errors.phoneNumber}>
              <TextInput
                name="phoneNumber" value={form.phoneNumber} onChange={handleChange}
                placeholder="e.g. +2348012345678"
                focused={focused} setFocused={setFocused} error={errors.phoneNumber}
              />
            </Field>

            <Field icon={Users} label="Customer Type *" error={errors.customerType}>
              <SelectInput
                name="customerType" value={form.customerType} onChange={handleChange}
                options={CUSTOMER_TYPES} placeholder="Select customer type"
                required focused={focused} setFocused={setFocused} error={errors.customerType}
              />
            </Field>

            <Field icon={Package} label="Products You Sell *"
              hint="Be as detailed as possible for better AI insights"
              error={errors.products}>
              <div className={`bg-white dark:bg-gray-800 border rounded-xl
                px-4 py-3 transition-all
                ${focused === 'products'
                  ? 'border-brand-500 ring-2 ring-brand-500/20'
                  : errors.products
                    ? 'border-red-400 ring-2 ring-red-400/20'
                    : 'border-gray-200 dark:border-gray-700'}`}
              >
                <textarea
                  name="products" value={form.products} onChange={handleChange}
                  onFocus={() => setFocused('products')} onBlur={() => setFocused('')}
                  required rows={4}
                  placeholder="e.g. Cement, roofing sheets, iron rods, PVC pipes, electrical cables, plumbing fittings..."
                  className="w-full bg-transparent text-sm text-gray-900
                    dark:text-white placeholder-gray-400 outline-none resize-none"
                />
                {/* Character count */}
                <p className={`text-xs text-right mt-1 ${form.products.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
                  {form.products.length}/500
                </p>
              </div>
            </Field>

            <Field icon={DollarSign} label="Price Range" error={errors.priceRange}>
              <SelectInput
                name="priceRange" value={form.priceRange} onChange={handleChange}
                options={PRICE_RANGES} placeholder="Select price range"
                focused={focused} setFocused={setFocused} error={errors.priceRange}
              />
            </Field>

            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className={`w-full flex items-center justify-center gap-2
                py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg mt-2
                ${saved
                  ? 'bg-green-500 shadow-green-500/30 text-white'
                  : 'bg-brand-500 hover:bg-brand-600 shadow-brand-500/30 text-white'}
                ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : saved
                  ? <><CheckCircle className="w-4 h-4" /> Saved!</>
                  : <><Save className="w-4 h-4" /> Save Profile</>
              }
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}