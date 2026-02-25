import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authApi } from '../../api/auth.api';

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0  }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center 
            justify-center shadow-lg shadow-brand-500/30">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
              <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
            </svg>
          </div>
          <span className="font-bold text-white text-xl">HardwareAI</span>
        </div>

        <div className="bg-white/4 border border-white/10 rounded-2xl p-8">
          {!sent ? (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">
                Forgot your password?
              </h1>
              <p className="text-gray-400 text-sm mb-8">
                Enter your email and we'll send you a link to reset it.
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0  }}
                  className="bg-red-500/10 border border-red-500/30 text-red-400 
                    rounded-xl px-4 py-3 text-sm mb-6"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Email address
                  </label>
                  <div className={`flex items-center gap-3 bg-white/5 border 
                    rounded-xl px-4 py-3 transition-all
                    ${focused
                      ? 'border-brand-500 ring-2 ring-brand-500/20'
                      : 'border-white/10'}`}
                  >
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="you@example.com"
                      className="flex-1 bg-transparent text-sm text-white 
                        placeholder-gray-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-brand-500 hover:bg-brand-600 
                    disabled:opacity-60 text-white font-semibold py-3 
                    rounded-xl transition-all shadow-lg shadow-brand-500/30 mt-2"
                >
                  {loading
                    ? <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 
                          border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    : 'Send Reset Link'
                  }
                </motion.button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1   }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 bg-green-500/15 rounded-full flex 
                items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                We sent a password reset link to<br />
                <span className="text-white font-medium">{email}</span>
              </p>
              <p className="text-gray-500 text-xs">
                Didn't receive it? Check your spam folder or{' '}
                <button onClick={() => setSent(false)}
                  className="text-brand-400 hover:text-brand-300 font-medium">
                  try again
                </button>
              </p>
            </motion.div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link to="/login"
            className="flex items-center justify-center gap-2 text-sm 
              text-gray-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}