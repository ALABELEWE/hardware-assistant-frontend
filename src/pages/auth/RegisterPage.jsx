import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const perks = [
  'Free AI business analysis',
  'Revenue potential forecasting',
  'Personalized recommendations',
  'SMS alerts for top insights',
];

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const e = {};
    if (!form.email)                              e.email           = 'Email is required';
    if (form.password.length < 8)                 e.password        = 'At least 8 characters';
    if (form.password !== form.confirmPassword)   e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }
    const result = await register({ email: form.email, password: form.password });
    if (result.success) navigate('/verify-email-pending', {state: { email: form.email }});
    else setErrors({ general: result.error });
  };

  const Field = ({ name, label, type = 'text', placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 
        dark:text-gray-300 mb-1.5">
        {label}
      </label>
      <div className={`flex items-center gap-3 bg-white dark:bg-gray-900 
        border rounded-xl px-4 py-3 transition-all
        ${focused === name
          ? 'border-brand-500 ring-2 ring-brand-500/20'
          : errors[name]
            ? 'border-red-400 ring-2 ring-red-400/20'
            : 'border-gray-200 dark:border-gray-700'}`}
      >
        {name === 'email'
          ? <Mail className="w-4 h-4 text-gray-400 shrink-0" />
          : <Lock className="w-4 h-4 text-gray-400 shrink-0" />
        }
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          onFocus={() => setFocused(name)}
          onBlur={() => setFocused('')}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-gray-900 
            dark:text-white placeholder-gray-400 outline-none"
          required
        />
      </div>
      {errors[name] && (
        <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-gray-950 flex-col justify-between 
        p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 
            bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 
            bg-brand-600/10 rounded-full blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center 
            justify-center shadow-lg shadow-brand-500/40">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
              <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-white text-lg">HardwareAI</p>
            <p className="text-xs text-gray-400">Business Intelligence</p>
          </div>
        </div>

        {/* Hero */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-brand-500/20 text-brand-400 
              text-xs font-semibold px-3 py-1 rounded-full mb-4 
              border border-brand-500/30">
              🚀 Join 500+ merchants
            </span>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Your AI business<br />
              <span className="text-brand-400">advisor awaits</span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed mb-8">
              Join hundreds of Lagos hardware merchants already using 
              AI to make smarter business decisions every day.
            </p>

            <div className="flex flex-col gap-3">
              {perks.map((perk) => (
                <div key={perk} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-400 shrink-0" />
                  <p className="text-gray-300 text-sm">{perk}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Testimonial */}
        <div className="relative bg-white/5 rounded-2xl p-6 border border-white/10">
          <p className="text-gray-300 text-sm leading-relaxed italic mb-4">
            "HardwareAI helped me identify that I was underpricing my PVC pipes 
            by 15%. That single insight increased my monthly revenue by ₦180,000."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-500 rounded-full flex items-center 
              justify-center font-bold text-white text-sm">A</div>
            <div>
              <p className="text-white text-sm font-semibold">Adewale O.</p>
              <p className="text-gray-400 text-xs">Hardware Merchant, Ikeja</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 
        bg-gray-50 dark:bg-gray-950">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0  }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center 
              justify-center shadow-lg shadow-brand-500/30">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">HardwareAI</p>
              <p className="text-xs text-gray-400">Business Intelligence</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Create your account
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            Free forever · No credit card required
          </p>

          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0  }}
              className="bg-red-50 dark:bg-red-950 border border-red-200 
                dark:border-red-800 text-red-700 dark:text-red-300 
                rounded-xl px-4 py-3 text-sm mb-6"
            >
              {errors.general}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field
              name="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
            />
            <Field
              name="password"
              label="Password"
              type="password"
              placeholder="At least 8 characters"
            />
            <Field
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
            />

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60
                text-white font-semibold py-3 rounded-xl transition-all
                flex items-center justify-center gap-2 shadow-lg 
                shadow-brand-500/30 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 
                  border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login"
              className="text-brand-600 hover:text-brand-700 font-semibold transition">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}