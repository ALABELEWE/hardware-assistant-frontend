import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, TrendingUp, Wallet, ClipboardList,
  CheckCircle2, XCircle, RefreshCw, AlertCircle, Lock, Unlock
} from 'lucide-react';
import { financeScoreApi } from '../../api/financescore.api';

// ── Helpers ───────────────────────────────────────────────────
const TIER_STYLES = {
  Excellent: {
    ring: 'stroke-emerald-500',
    bg:   'bg-emerald-50 dark:bg-emerald-950',
    text: 'text-emerald-700 dark:text-emerald-400',
    badge:'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  },
  Good: {
    ring: 'stroke-green-500',
    bg:   'bg-green-50 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-400',
    badge:'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  },
  Fair: {
    ring: 'stroke-amber-500',
    bg:   'bg-amber-50 dark:bg-amber-950',
    text: 'text-amber-700 dark:text-amber-400',
    badge:'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  },
  Poor: {
    ring: 'stroke-red-500',
    bg:   'bg-red-50 dark:bg-red-950',
    text: 'text-red-700 dark:text-red-400',
    badge:'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  },
};

const COMPONENT_ICONS = {
  'Revenue Stability': Wallet,
  'Cashflow Health':   TrendingUp,
  'Growth Trajectory': TrendingUp,
  'Data Completeness': ClipboardList,
};

// ── Circular Score Dial ───────────────────────────────────────
function ScoreDial({ score, tier, loading }) {
  const radius = 54;
  const circ   = 2 * Math.PI * radius;
  const filled = loading ? 0 : (score / 100) * circ;
  const styles = TIER_STYLES[tier] || TIER_STYLES.Poor;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Track */}
          <circle cx="60" cy="60" r={radius}
            fill="none" stroke="currentColor"
            strokeWidth="10"
            className="text-gray-100 dark:text-gray-800" />
          {/* Filled arc */}
          <motion.circle
            cx="60" cy="60" r={radius}
            fill="none" strokeWidth="10"
            strokeLinecap="round"
            className={styles.ring}
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - filled }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        {/* Centre text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {loading ? (
            <div className="w-10 h-8 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          ) : (
            <>
              <span className="text-3xl font-black text-gray-800 dark:text-white">{score}</span>
              <span className="text-xs text-gray-400 font-medium">/ 100</span>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="w-20 h-6 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
      ) : (
        <span className={`text-sm font-bold px-4 py-1 rounded-full ${styles.badge}`}>
          {tier}
        </span>
      )}
    </div>
  );
}

// ── Component Bar ─────────────────────────────────────────────
function ComponentBar({ component, loading }) {
  if (loading) return (
    <div className="space-y-2">
      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-1/3" />
      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
    </div>
  );

  const Icon   = COMPONENT_ICONS[component.name] || Wallet;
  const pct    = component.rawScore;
  const color  = pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {component.name}
          </span>
          <span className="text-xs text-gray-400">({component.weight}%)</span>
        </div>
        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
          {component.rawScore}/100
        </span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">{component.insight}</p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function FinanceScore() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await financeScoreApi.getScore();
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load finance score');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (error) return (
    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-2xl p-6 flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
      <div>
        <p className="font-semibold text-red-700 dark:text-red-400">Could not load finance score</p>
        <p className="text-sm text-red-500 mt-0.5">{error}</p>
      </div>
      <button onClick={load} className="ml-auto text-sm text-red-600 underline">Retry</button>
    </div>
  );

  const d      = data || {};
  const tier   = d.tier || 'Poor';
  const styles = TIER_STYLES[tier];
  const components = [d.revenueStability, d.cashflowHealth, d.growthTrajectory, d.dataCompleteness]
    .filter(Boolean);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-500" />
          <h2 className="font-bold text-gray-800 dark:text-white">Finance Score</h2>
        </div>
        <button onClick={load} disabled={loading}
          className="text-gray-400 hover:text-brand-500 transition disabled:opacity-40">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="p-6 space-y-6">

        {/* Score dial + summary */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ScoreDial score={d.score || 0} tier={tier} loading={loading} />

          <div className="flex-1 space-y-3">
            {loading ? (
              <div className="space-y-2">
                <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-full" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-2/3" />
              </div>
            ) : (
              <>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {d.summary}
                </p>

                {/* Lending badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold
                  ${d.lendingReady
                    ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                  {d.lendingReady
                    ? <><Unlock className="w-4 h-4" /> Lending Ready</>
                    : <><Lock className="w-4 h-4" /> Not Yet Lending Ready</>}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Component breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Score Breakdown
          </h3>
          {loading
            ? [1,2,3,4].map(i => <ComponentBar key={i} loading />)
            : components.map(c => <ComponentBar key={c.name} component={c} />)
          }
        </div>

        {/* Strengths & Weaknesses */}
        {!loading && (d.strengths?.length > 0 || d.weaknesses?.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {d.strengths?.length > 0 && (
              <div className="bg-green-50 dark:bg-green-950/40 rounded-xl p-4">
                <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider mb-2">
                  Strengths
                </p>
                <ul className="space-y-1.5">
                  {d.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-green-800 dark:text-green-300">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-green-500" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {d.weaknesses?.length > 0 && (
              <div className="bg-red-50 dark:bg-red-950/40 rounded-xl p-4">
                <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider mb-2">
                  Areas to Improve
                </p>
                <ul className="space-y-1.5">
                  {d.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-800 dark:text-red-300">
                      <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}