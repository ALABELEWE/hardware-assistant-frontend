import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, AlertTriangle, Info, TrendingDown,
  RefreshCw, AlertCircle, CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react';
import { inventoryAlertsApi } from '../../api/inventoryAlerts.api';

// ── Config ────────────────────────────────────────────────────
const ALERT_CONFIG = {
  LOW_STOCK: {
    icon:    AlertTriangle,
    bg:      'bg-red-50 dark:bg-red-950/40',
    border:  'border-red-200 dark:border-red-800',
    icon_cl: 'text-red-500',
    badge:   'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    label:   'Low Stock',
  },
  OVERSTOCK: {
    icon:    TrendingDown,
    bg:      'bg-amber-50 dark:bg-amber-950/40',
    border:  'border-amber-200 dark:border-amber-800',
    icon_cl: 'text-amber-500',
    badge:   'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    label:   'Overstock',
  },
  DEAD_STOCK: {
    icon:    Info,
    bg:      'bg-blue-50 dark:bg-blue-950/40',
    border:  'border-blue-200 dark:border-blue-800',
    icon_cl: 'text-blue-500',
    badge:   'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    label:   'Dead Stock',
  },
};

// ── Summary Pill ──────────────────────────────────────────────
function SummaryPill({ count, label, color }) {
  if (count === 0) return null;
  const colors = {
    red:   'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    blue:  'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${colors[color]}`}>
      {count} {label}
    </span>
  );
}

// ── Alert Card ────────────────────────────────────────────────
function AlertCard({ alert, index }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = ALERT_CONFIG[alert.type] || ALERT_CONFIG.DEAD_STOCK;
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${cfg.icon_cl}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
              {cfg.label}
            </span>
            {alert.category && (
              <span className="text-xs text-gray-400">{alert.category}</span>
            )}
          </div>
          <p className="text-sm font-semibold text-gray-800 dark:text-white leading-snug">
            {alert.message}
          </p>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Recommended Action
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{alert.action}</p>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-white/60 dark:bg-white/5 rounded-lg p-2">
                      <p className="text-xs text-gray-400">Current Stock</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-white">
                        {Number(alert.currentStock).toFixed(0)} units
                      </p>
                    </div>
                    {alert.reorderLevel > 0 && (
                      <div className="bg-white/60 dark:bg-white/5 rounded-lg p-2">
                        <p className="text-xs text-gray-400">Reorder Level</p>
                        <p className="text-sm font-bold text-gray-800 dark:text-white">
                          {Number(alert.reorderLevel).toFixed(0)} units
                        </p>
                      </div>
                    )}
                    {alert.avgMonthlySales > 0 && (
                      <div className="bg-white/60 dark:bg-white/5 rounded-lg p-2">
                        <p className="text-xs text-gray-400">Avg Monthly Sales</p>
                        <p className="text-sm font-bold text-gray-800 dark:text-white">
                          {Number(alert.avgMonthlySales).toFixed(1)} units
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => setExpanded(v => !v)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition shrink-0"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
    </motion.div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-1/4" />
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Filter Tab ────────────────────────────────────────────────
function FilterTab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition
        ${active
          ? 'bg-brand-500 text-white'
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
    >
      {label}
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function InventoryAlerts() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [filter,  setFilter]  = useState('ALL');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await inventoryAlertsApi.getAlerts();
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load inventory alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const alerts = data?.alerts || [];
  const filtered = filter === 'ALL'
    ? alerts
    : alerts.filter(a => a.type === filter);

  if (error) return (
    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-2xl p-6 flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
      <div>
        <p className="font-semibold text-red-700 dark:text-red-400">Could not load inventory alerts</p>
        <p className="text-sm text-red-500 mt-0.5">{error}</p>
      </div>
      <button onClick={load} className="ml-auto text-sm text-red-600 underline">Retry</button>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Package className="w-5 h-5 text-brand-500" />
          <h2 className="font-bold text-gray-800 dark:text-white">Inventory Alerts</h2>
          {!loading && data && (
            <div className="flex items-center gap-1.5">
              <SummaryPill count={data.criticalCount} label="Critical" color="red" />
              <SummaryPill count={data.warningCount}  label="Warning"  color="amber" />
              <SummaryPill count={data.infoCount}     label="Info"     color="blue" />
            </div>
          )}
        </div>
        <button onClick={load} disabled={loading}
          className="text-gray-400 hover:text-brand-500 transition disabled:opacity-40">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="p-6 space-y-4">

        {/* Filters */}
        {!loading && alerts.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <FilterTab label="All"        active={filter === 'ALL'}        onClick={() => setFilter('ALL')} />
            <FilterTab label="Low Stock"  active={filter === 'LOW_STOCK'}  onClick={() => setFilter('LOW_STOCK')} />
            <FilterTab label="Overstock"  active={filter === 'OVERSTOCK'}  onClick={() => setFilter('OVERSTOCK')} />
            <FilterTab label="Dead Stock" active={filter === 'DEAD_STOCK'} onClick={() => setFilter('DEAD_STOCK')} />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <Skeleton />
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 bg-green-50 dark:bg-green-950 rounded-2xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-7 h-7 text-green-500" />
            </div>
            <p className="font-semibold text-gray-800 dark:text-white">All stock levels look healthy</p>
            <p className="text-sm text-gray-400 mt-1">No alerts at the moment — keep logging your sales</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-8">No {filter.replace('_', ' ').toLowerCase()} alerts</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((alert, i) => (
              <AlertCard key={`${alert.productId}-${alert.type}`} alert={alert} index={i} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}