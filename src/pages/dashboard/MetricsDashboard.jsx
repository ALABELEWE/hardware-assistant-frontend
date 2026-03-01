import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Minus,
  ShoppingCart, Wallet, PiggyBank, BarChart3,
  RefreshCw, AlertCircle
} from 'lucide-react';
import { metricsApi } from '../../api/metrics.api';

// ── Helpers ───────────────────────────────────────────────────
const fmt = (n) =>
  Number(n || 0).toLocaleString('en-NG', {
    style: 'currency', currency: 'NGN', maximumFractionDigits: 0,
  });

const fmtPct = (n) => {
  const val = Number(n || 0);
  return (val >= 0 ? '+' : '') + val.toFixed(1) + '%';
};

// ── KPI Tile ──────────────────────────────────────────────────
function KpiTile({ label, value, sub, icon: Icon, color, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-7 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse w-3/4" />
          <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse w-1/2" />
        </div>
      ) : (
        <>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </>
      )}
    </motion.div>
  );
}

// ── Growth Badge ──────────────────────────────────────────────
function GrowthBadge({ direction, percent }) {
  if (direction === 'up') return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400 px-2.5 py-1 rounded-full">
      <TrendingUp className="w-3.5 h-3.5" /> {fmtPct(percent)} vs last month
    </span>
  );
  if (direction === 'down') return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400 px-2.5 py-1 rounded-full">
      <TrendingDown className="w-3.5 h-3.5" /> {fmtPct(percent)} vs last month
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
      <Minus className="w-3.5 h-3.5" /> No change vs last month
    </span>
  );
}

// ── Expense Bar ───────────────────────────────────────────────
const BAR_COLORS = [
  'bg-brand-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500',
  'bg-rose-500',  'bg-cyan-500', 'bg-emerald-500','bg-orange-500',
];

function ExpenseBreakdown({ breakdown, total }) {
  if (!breakdown || breakdown.length === 0) return (
    <p className="text-sm text-gray-400 text-center py-6">No expenses recorded this month</p>
  );

  return (
    <div className="space-y-3">
      {breakdown.map((item, i) => (
        <div key={item.category}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.category}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{Number(item.percentOfTotal).toFixed(1)}%</span>
              <span className="text-sm font-semibold text-gray-800 dark:text-white">{fmt(item.amount)}</span>
            </div>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.percentOfTotal}%` }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Profit Gauge ──────────────────────────────────────────────
function ProfitMarginGauge({ margin }) {
  const val    = Math.max(-100, Math.min(100, Number(margin || 0)));
  const capped = Math.max(0, Math.min(100, val));   // 0-100 for bar width
  const color  = val >= 20 ? 'bg-green-500' : val >= 0 ? 'bg-amber-500' : 'bg-red-500';
  const label  = val >= 20 ? 'Healthy' : val >= 0 ? 'Thin margin' : 'Loss-making';

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Profit Margin</span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
            ${val >= 20 ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
              : val >= 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
              : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'}`}>
            {label}
          </span>
          <span className="text-lg font-bold text-gray-800 dark:text-white">{val.toFixed(1)}%</span>
        </div>
      </div>
      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${capped}%` }}
          transition={{ duration: 0.8 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-400">0%</span>
        <span className="text-xs text-gray-400">50%</span>
        <span className="text-xs text-gray-400">100%</span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function MetricsDashboard() {
  const [metrics,  setMetrics]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [refreshed, setRefreshed] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await metricsApi.getMetrics();
      setMetrics(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const refresh = async () => {
    await load();
    setRefreshed(true);
    setTimeout(() => setRefreshed(false), 2000);
  };

  if (error) return (
    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-2xl p-6 flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
      <div>
        <p className="font-semibold text-red-700 dark:text-red-400">Could not load metrics</p>
        <p className="text-sm text-red-500 mt-0.5">{error}</p>
      </div>
      <button onClick={load} className="ml-auto text-sm text-red-600 underline">Retry</button>
    </div>
  );

  const m = metrics || {};

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Business Performance</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={refresh} disabled={loading}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 transition disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {refreshed ? 'Updated' : 'Refresh'}
        </button>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile
          label="Revenue today"
          value={fmt(m.revenueToday)}
          sub={`${m.salesToday || 0} sale${m.salesToday !== 1 ? 's' : ''}`}
          icon={ShoppingCart}
          color="bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400"
          loading={loading}
        />
        <KpiTile
          label="This week"
          value={fmt(m.revenueThisWeek)}
          icon={BarChart3}
          color="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          loading={loading}
        />
        <KpiTile
          label="This month"
          value={fmt(m.revenueThisMonth)}
          sub={`${m.salesThisMonth || 0} total sales`}
          icon={Wallet}
          color="bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
          loading={loading}
        />
        <KpiTile
          label="Net profit"
          value={fmt(m.netProfitThisMonth)}
          sub={`Expenses: ${fmt(m.expensesThisMonth)}`}
          icon={PiggyBank}
          color={Number(m.netProfitThisMonth) >= 0
            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
            : 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400'}
          loading={loading}
        />
      </div>

      {/* Growth + Margin row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* MoM Growth */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Month-on-Month Growth</h3>
          {loading ? (
            <div className="space-y-3">
              <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-1/3" />
              <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            </div>
          ) : (
            <div className="space-y-4">
              <GrowthBadge direction={m.growthDirection} percent={m.momGrowthPercent} />
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Last month</p>
                  <p className="font-bold text-gray-800 dark:text-white">{fmt(m.revenueLastMonth)}</p>
                </div>
                <div className="bg-brand-50 dark:bg-brand-950 rounded-xl p-3">
                  <p className="text-xs text-brand-600 dark:text-brand-400 mb-1">This month</p>
                  <p className="font-bold text-brand-700 dark:text-brand-300">{fmt(m.revenueThisMonth)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profit Margin */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Profit Margin</h3>
          {loading ? (
            <div className="space-y-3">
              <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-1/2" />
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
            </div>
          ) : (
            <div className="space-y-4">
              <ProfitMarginGauge margin={m.profitMarginPercent} />
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Revenue</p>
                  <p className="font-bold text-gray-800 dark:text-white text-sm">{fmt(m.revenueThisMonth)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Expenses</p>
                  <p className="font-bold text-red-600 dark:text-red-400 text-sm">{fmt(m.expensesThisMonth)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-800 dark:text-white">Expense Breakdown</h3>
          {!loading && m.expensesThisMonth > 0 && (
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Total: {fmt(m.expensesThisMonth)}
            </span>
          )}
        </div>
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="space-y-1.5">
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-1/4" />
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <ExpenseBreakdown breakdown={m.expenseBreakdown} total={m.expensesThisMonth} />
        )}
      </div>

    </div>
  );
}