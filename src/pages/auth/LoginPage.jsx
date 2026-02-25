import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Zap, TrendingUp, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const features = [
  { icon: Zap,        text: 'AI-powered business insights in seconds' },
  { icon: TrendingUp, text: 'Revenue forecasting for Lagos merchants'  },
  { icon: Shield,     text: 'Secure, private, and always available'    },
];

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [focused, setFocused] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex w-1/2 bg-gray-950 flex-col justify-between 
        p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-96 h-96 
            bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 
            bg-brand-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            w-64 h-64 bg-brand-500/5 rounded-full blur-2xl" />
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
              ⚡ AI-Powered Platform
            </span>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Grow your hardware<br />
              <span className="text-brand-400">business smarter</span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed mb-8">
              Get AI-generated business insights, revenue forecasts, 
              and actionable recommendations — built for Lagos merchants.
            </p>
            <div className="flex flex-col gap-4">
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-500/15 rounded-lg flex 
                    items-center justify-center border border-brand-500/20 shrink-0">
                    <Icon className="w-4 h-4 text-brand-400" />
                  </div>
                  <p className="text-gray-300 text-sm">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-3 gap-4">
          {[
            { value: '500+', label: 'Merchants'    },
            { value: '98%',  label: 'Satisfaction' },
            { value: '24/7', label: 'AI Available' },
          ].map(({ value, label }) => (
            <div key={label}
              className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
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
            Welcome back
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            Sign in to your account to continue
          </p>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0  }}
              className="bg-red-50 dark:bg-red-950 border border-red-200 
                dark:border-red-800 text-red-700 dark:text-red-300 
                rounded-xl px-4 py-3 text-sm mb-6"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 
                dark:text-gray-300 mb-1.5">
                Email address
              </label>
              <div className={`flex items-center gap-3 bg-white dark:bg-gray-900 
                border rounded-xl px-4 py-3 transition-all
                ${focused === 'email'
                  ? 'border-brand-500 ring-2 ring-brand-500/20'
                  : 'border-gray-200 dark:border-gray-700'}`}
              >
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent text-sm text-gray-900 
                    dark:text-white placeholder-gray-400 outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link to="/forgot-password"
                  className="text-xs text-gray-400 hover:text-brand-400 transition">
                  Forgot password?
                </Link>
              </div>
              <div className={`flex items-center gap-3 bg-white dark:bg-gray-900 
                border rounded-xl px-4 py-3 transition-all
                ${focused === 'password'
                  ? 'border-brand-500 ring-2 ring-brand-500/20'
                  : 'border-gray-200 dark:border-gray-700'}`}
              >
                <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-sm text-gray-900 
                    dark:text-white placeholder-gray-400 outline-none"
                  required
                />
              </div>
            </div>

            {/* Submit */}
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
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register"
              className="text-brand-600 hover:text-brand-700 font-semibold transition">
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}