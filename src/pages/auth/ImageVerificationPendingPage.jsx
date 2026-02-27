import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

export default function EmailVerificationPendingPage() {
  const location = useLocation();
  const email = location.state?.email || '';
  const [resending, setResending] = useState(false);
  const [resent,    setResent]    = useState(false);
  const [error,     setError]     = useState('');

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      await axios.post(`${API}/auth/resend-verification`, { email });
      setResent(true);
    } catch {
      setError('Failed to resend. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
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
          <div className="flex flex-col items-center text-center gap-4 mb-8">
            <div className="w-16 h-16 bg-brand-500/15 rounded-full flex 
              items-center justify-center">
              <Mail className="w-8 h-8 text-brand-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Check your email
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                We sent a verification link to<br />
                {email && (
                  <span className="text-white font-medium">{email}</span>
                )}
              </p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-brand-500/20 rounded-full flex 
                items-center justify-center shrink-0 mt-0.5">
                <span className="text-brand-400 text-xs font-bold">1</span>
              </div>
              <p className="text-gray-300 text-sm">
                Open the email from <span className="text-white">HardwareAI</span>
              </p>
            </div>
            <div className="flex items-start gap-3 mt-3">
              <div className="w-6 h-6 bg-brand-500/20 rounded-full flex 
                items-center justify-center shrink-0 mt-0.5">
                <span className="text-brand-400 text-xs font-bold">2</span>
              </div>
              <p className="text-gray-300 text-sm">
                Click the <span className="text-white">Verify Email</span> button
              </p>
            </div>
            <div className="flex items-start gap-3 mt-3">
              <div className="w-6 h-6 bg-brand-500/20 rounded-full flex 
                items-center justify-center shrink-0 mt-0.5">
                <span className="text-brand-400 text-xs font-bold">3</span>
              </div>
              <p className="text-gray-300 text-sm">
                Come back and <span className="text-white">sign in</span>
              </p>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}

          {resent ? (
            <div className="flex items-center justify-center gap-2 
              text-green-400 text-sm py-3">
              <CheckCircle className="w-4 h-4" />
              Verification email resent!
            </div>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full flex items-center justify-center gap-2 
                bg-white/10 hover:bg-white/20 text-white font-medium 
                py-3 rounded-xl transition text-sm disabled:opacity-60"
            >
              {resending
                ? <div className="w-4 h-4 border-2 border-white/30 
                    border-t-white rounded-full animate-spin" />
                : <RefreshCw className="w-4 h-4" />
              }
              Resend verification email
            </button>
          )}

          <p className="mt-4 text-center text-xs text-gray-500">
            Already verified?{' '}
            <Link to="/login"
              className="text-brand-400 hover:text-brand-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}