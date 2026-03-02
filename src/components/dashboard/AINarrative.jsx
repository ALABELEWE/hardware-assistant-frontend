import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, TrendingUp, Wallet, Package,
  ShieldCheck, Zap, ChevronDown, ChevronUp,
  AlertCircle, RefreshCw, Clock
} from 'lucide-react';
import { narrativeApi } from '../../api/narrative.api';

// ── Impact badge ──────────────────────────────────────────────
function ImpactBadge({ impact }) {
  const styles = {
    HIGH:   'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    MEDIUM: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    LOW:    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  };
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${styles[impact] || styles.LOW}`}>
      {impact}
    </span>
  );
}

// ── Narrative Section ─────────────────────────────────────────
function NarrativeSection({ icon: Icon, title, content, color, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  const colors = {
    brand:  'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400',
    green:  'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400',
    blue:   'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
    amber:  'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
    purple: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3.5
          hover:bg-gray-50 dark:hover:bg-gray-800/50 transition text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm text-gray-800 dark:text-white">{title}</span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400" />
          : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {content}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Action Item ───────────────────────────────────────────────
function ActionItem({ item }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      <div className="w-7 h-7 bg-brand-500 text-white rounded-lg flex items-center justify-center
        text-xs font-black shrink-0 mt-0.5">
        {item.rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm text-gray-800 dark:text-white">{item.title}</span>
          <ImpactBadge impact={item.impact} />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.detail}</p>
      </div>
    </div>
  );
}

// ── Empty / Prompt State ──────────────────────────────────────
function PromptState({ onGenerate, loading }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center px-6">
      <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950 rounded-2xl flex items-center
        justify-center mb-4">
        <Sparkles className="w-8 h-8 text-brand-500" />
      </div>
      <h3 className="font-bold text-gray-800 dark:text-white mb-2">
        Get Your AI Business Narrative
      </h3>
      <p className="text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">
        AI will read your metrics, finance score, and inventory alerts
        and produce a plain-English business summary with actionable advice.
      </p>
      <button
        onClick={onGenerate}
        disabled={loading}
        className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-60
          text-white font-semibold text-sm px-6 py-3 rounded-xl transition shadow-lg
          shadow-brand-500/25"
      >
        {loading
          ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating...</>
          : <><Sparkles className="w-4 h-4" /> Generate Narrative</>}
      </button>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function AINarrative() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await narrativeApi.generate();
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate narrative. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const timestamp = data?.generatedAt
    ? new Date(data.generatedAt).toLocaleString('en-NG', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
      })
    : null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-500" />
          <h2 className="font-bold text-gray-800 dark:text-white">AI Business Narrative</h2>
          {timestamp && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" /> {timestamp}
            </div>
          )}
        </div>
        {data && (
          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-500
              hover:text-brand-600 transition disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Regenerate
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mx-6 mt-4 bg-red-50 dark:bg-red-950 border border-red-200
          dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-xs text-red-500 underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="p-6">
        {!data && !loading && !error && (
          <PromptState onGenerate={generate} loading={loading} />
        )}

        {loading && !data && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-12 h-12 bg-brand-50 dark:bg-brand-950 rounded-2xl flex items-center
              justify-center animate-pulse">
              <Sparkles className="w-6 h-6 text-brand-500" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-800 dark:text-white">Analysing your business...</p>
              <p className="text-sm text-gray-400 mt-1">Reading metrics, score and inventory alerts</p>
            </div>
            <div className="flex gap-1.5 mt-2">
              {[0, 1, 2].map(i => (
                <motion.div key={i}
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                  className="w-2 h-2 bg-brand-400 rounded-full"
                />
              ))}
            </div>
          </div>
        )}

        {data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Executive Summary */}
            <div className="bg-brand-50 dark:bg-brand-950/30 border border-brand-100
              dark:border-brand-900 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  Executive Summary
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                {data.executiveSummary}
              </p>
            </div>

            {/* Detailed Sections */}
            <div className="space-y-2">
              <NarrativeSection
                icon={TrendingUp}
                title="Revenue Analysis"
                content={data.revenueNarrative}
                color="green"
                defaultOpen={true}
              />
              <NarrativeSection
                icon={Wallet}
                title="Profit & Expenses"
                content={data.profitCommentary}
                color="blue"
              />
              <NarrativeSection
                icon={Package}
                title="Inventory Situation"
                content={data.inventoryWarning}
                color="amber"
              />
              <NarrativeSection
                icon={ShieldCheck}
                title="Finance Score Explained"
                content={data.financeScoreExplanation}
                color="purple"
              />
            </div>

            {/* Action Items */}
            {data.topActionItems?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-brand-500" />
                  <h3 className="font-bold text-sm text-gray-800 dark:text-white uppercase tracking-wider">
                    Top Action Items
                  </h3>
                </div>
                <div className="space-y-2">
                  {data.topActionItems.map(item => (
                    <ActionItem key={item.rank} item={item} />
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        )}
      </div>
    </div>
  );
}