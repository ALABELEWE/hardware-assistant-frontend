import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, DatabaseZap, TrendingUp, ShoppingCart,
  Package, CheckCircle2, ArrowRight, Sparkles,
  AlertCircle
} from 'lucide-react';
import { dataReadinessApi } from '../../api/dataReadiness.api';
import AINarrative from './AINarrative';

// ── Progress Step ─────────────────────────────────────────────
function ProgressStep({ icon: Icon, label, done, active }) {
  return (
    <div className={`flex items-center gap-2.5 text-sm font-medium
      ${done ? 'text-green-600 dark:text-green-400'
        : active ? 'text-brand-600 dark:text-brand-400'
        : 'text-gray-400'}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0
        ${done ? 'bg-green-100 dark:bg-green-900'
          : active ? 'bg-brand-100 dark:bg-brand-900'
          : 'bg-gray-100 dark:bg-gray-800'}`}>
        {done
          ? <CheckCircle2 className="w-4 h-4" />
          : <Icon className="w-3.5 h-3.5" />}
      </div>
      {label}
    </div>
  );
}

// ── NONE state — no data at all ───────────────────────────────
function OnboardingExperience({ readiness }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100
      dark:border-gray-800 overflow-hidden">

      {/* Header */}
      <div className="bg-gray-950 dark:bg-gray-900 px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-5 h-5 text-brand-400" />
          <span className="font-bold text-white">AI Intelligence</span>
        </div>
        <p className="text-gray-400 text-sm">
          Complete these steps to unlock your AI Business Narrative
        </p>
      </div>

      <div className="p-6 space-y-6">

        {/* Progress checklist */}
        <div className="space-y-3">
          <ProgressStep
            icon={Brain}
            label="Complete your business profile"
            done={true}
          />
          <ProgressStep
            icon={Package}
            label="Add your products"
            done={readiness.totalProducts > 0}
            active={readiness.totalProducts === 0}
          />
          <ProgressStep
            icon={ShoppingCart}
            label="Log your first sale"
            done={readiness.salesThisMonth > 0 || readiness.salesLastMonth > 0}
            active={readiness.totalProducts > 0}
          />
          <ProgressStep
            icon={TrendingUp}
            label="Log at least one expense"
            done={readiness.hasExpenses}
            active={readiness.salesThisMonth > 0}
          />
          <ProgressStep
            icon={Sparkles}
            label="Generate AI Narrative"
            done={false}
            active={false}
          />
        </div>

        {/* Guidance message */}
        <div className="bg-brand-50 dark:bg-brand-950/30 border border-brand-100
          dark:border-brand-900 rounded-xl p-4">
          <p className="text-sm text-brand-700 dark:text-brand-300 leading-relaxed">
            {readiness.message}
          </p>
        </div>

        {/* CTA */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/data"
            className="flex items-center justify-center gap-2 bg-brand-500
              hover:bg-brand-600 text-white font-semibold text-sm px-4 py-2.5
              rounded-xl transition">
            <DatabaseZap className="w-4 h-4" />
            Log Data
          </Link>
          <Link to="/analysis"
            className="flex items-center justify-center gap-2 bg-gray-100
              dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
              text-gray-700 dark:text-gray-300 font-semibold text-sm px-4 py-2.5
              rounded-xl transition">
            <Brain className="w-4 h-4" />
            Profile Analysis
          </Link>
        </div>

        {/* Fallback note */}
        <p className="text-xs text-gray-400 text-center">
          No data yet? Use{' '}
          <Link to="/analysis" className="text-brand-500 hover:underline font-medium">
            Profile Analysis
          </Link>{' '}
          to get general AI advice based on your business profile.
        </p>
      </div>
    </div>
  );
}

// ── PARTIAL state — has some data but not complete ────────────
function PartialExperience({ readiness }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100
      dark:border-gray-800 overflow-hidden">

      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-amber-500" />
        <h2 className="font-bold text-gray-800 dark:text-white">Almost Ready</h2>
      </div>

      <div className="p-6 space-y-5">

        {/* Progress */}
        <div className="space-y-3">
          <ProgressStep icon={Brain}       label="Business profile complete" done={true} />
          <ProgressStep icon={ShoppingCart} label={`${readiness.salesThisMonth} sale${readiness.salesThisMonth !== 1 ? 's' : ''} logged this month`}
            done={readiness.salesThisMonth > 0}
            active={readiness.salesThisMonth === 0} />
          <ProgressStep icon={TrendingUp}  label="Expenses logged this month"
            done={readiness.hasExpenses}
            active={readiness.salesThisMonth > 0 && !readiness.hasExpenses} />
          <ProgressStep icon={Sparkles}    label="AI Narrative unlocked" done={false} active={false} />
        </div>

        {/* Message */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100
          dark:border-amber-900 rounded-xl p-4">
          <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
            {readiness.message}
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/data"
            className="flex items-center justify-center gap-2 bg-brand-500
              hover:bg-brand-600 text-white font-semibold text-sm px-4 py-2.5
              rounded-xl transition">
            <DatabaseZap className="w-4 h-4" />
            Log More Data
          </Link>
          <Link to="/analysis"
            className="flex items-center justify-center gap-2 bg-gray-100
              dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
              text-gray-700 dark:text-gray-300 font-semibold text-sm px-4 py-2.5
              rounded-xl transition">
            <Brain className="w-4 h-4" />
            Profile Analysis
          </Link>
        </div>

        <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
          <ArrowRight className="w-3 h-3" />
          Complete the steps above to unlock your AI Business Narrative
        </p>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function IntelligenceSection() {
  const [readiness, setReadiness] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    dataReadinessApi.check()
      .then(res => setReadiness(res.data.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100
      dark:border-gray-800 p-8 flex items-center justify-center">
      <div className="flex items-center gap-3 text-gray-400">
        <Brain className="w-5 h-5 animate-pulse" />
        <span className="text-sm">Checking data readiness...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100
      dark:border-gray-800 p-6 flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-red-500" />
      <p className="text-sm text-gray-500">Could not check data readiness.</p>
      <Link to="/analysis" className="ml-auto text-sm text-brand-500 font-medium flex items-center gap-1">
        Use Profile Analysis <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {readiness.readinessLevel === 'READY'   && <AINarrative />}
      {readiness.readinessLevel === 'PARTIAL' && <PartialExperience readiness={readiness} />}
      {readiness.readinessLevel === 'NONE'    && <OnboardingExperience readiness={readiness} />}
    </motion.div>
  );
}