import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Ban, X } from 'lucide-react';
import { analysisApi } from '../../api/analysis.api';
import { useToast } from '../../context/ToastContext';
import { AnalysisSkeleton } from '../../components/common/Skeleton';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';

// ── Security Warning Banner ───────────────────────────────────────────────────
function SecurityWarningBanner({ incidentType, attemptCount, message, onDismiss }) {
  if (!incidentType) return null;

  const isBanned  = incidentType === 'BANNED' || incidentType === 'BLOCKED';
  const isWarning = incidentType === 'WARNING';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0,   scale: 1     }}
        exit={{    opacity: 0, y: -12, scale: 0.98  }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`relative rounded-2xl border p-5 mb-5
          ${isBanned
            ? 'bg-red-950/60 border-red-700 shadow-lg shadow-red-900/30'
            : 'bg-amber-950/50 border-amber-600 shadow-lg shadow-amber-900/20'}`}
      >
        <div className="flex items-start gap-4">
          <div className={`shrink-0 rounded-xl p-2.5
            ${isBanned ? 'bg-red-700/40' : 'bg-amber-600/30'}`}>
            {isBanned
              ? <Ban         className="w-6 h-6 text-red-400" />
              : <ShieldAlert className="w-6 h-6 text-amber-400" />
            }
          </div>

          <div className="flex-1 min-w-0">
            <p className={`font-bold text-sm mb-1
              ${isBanned ? 'text-red-300' : 'text-amber-300'}`}>
              {isBanned
                ? '🚫 Account Suspended'
                : `⚠️ Security Warning — Attempt ${attemptCount} of 3`}
            </p>
            <p className={`text-sm leading-relaxed
              ${isBanned ? 'text-red-400' : 'text-amber-400/90'}`}>
              {message}
            </p>

            {isWarning && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-amber-500/70">Violation count</span>
                  <span className="text-xs font-bold text-amber-400">{attemptCount} / 3</span>
                </div>
                <div className="h-1.5 bg-amber-900/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(attemptCount / 3) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`h-full rounded-full
                      ${attemptCount >= 2 ? 'bg-red-500' : 'bg-amber-500'}`}
                  />
                </div>
                <p className="text-xs text-amber-600/70 mt-1.5">
                  {3 - attemptCount} more violation{3 - attemptCount !== 1 ? 's' : ''} will
                  result in account suspension.
                </p>
              </div>
            )}

            {isBanned && (
              <p className="text-xs text-red-500/80 mt-2">
                Contact{' '}
                
                  href="mailto:support@hardwareai.org"
                  className="text-red-400 underline hover:text-red-300 transition"
                >
                  support@hardwareai.org
                </a>
                {' '}if you believe this is a mistake.
              </p>
            )}
          </div>

          {isWarning && onDismiss && (
            <button
              onClick={onDismiss}
              className="shrink-0 text-amber-600 hover:text-amber-400 transition mt-0.5"
              aria-label="Dismiss warning"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Insight Card ──────────────────────────────────────────────────────────────
function InsightCard({ title, items, color }) {
  const colors = {
    green:  'bg-green-50  dark:bg-green-950  border-green-100  dark:border-green-900  text-green-800  dark:text-green-200',
    red:    'bg-red-50    dark:bg-red-950    border-red-100    dark:border-red-900    text-red-800    dark:text-red-200',
    blue:   'bg-blue-50   dark:bg-blue-950   border-blue-100   dark:border-blue-900   text-blue-800   dark:text-blue-200',
    yellow: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-100 dark:border-yellow-900 text-yellow-800 dark:text-yellow-200',
  };
  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <h3 className="font-semibold mb-3">{title}</h3>
      <ul className="flex flex-col gap-1.5">
        {items?.map((item, i) => (
          <li key={i} className="text-sm flex gap-2">
            <span className="mt-0.5 shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Analysis Result ───────────────────────────────────────────────────────────
function AnalysisResult({ data }) {
  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl border
        border-gray-100 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
          📋 Business Summary
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          {data.summary}
        </p>
      </div>

      <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl p-6 text-white">
        <p className="text-orange-200 text-sm font-medium mb-1">
          💰 Estimated Monthly Revenue Potential
        </p>
        <p className="text-3xl font-bold">
          {data.estimatedMonthlyRevenuePotential || 'Not estimated'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InsightCard title="✅ Strengths"  items={data.strengths}  color="green" />
        <InsightCard title="⚠️ Weaknesses" items={data.weaknesses} color="red"   />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border
        border-gray-100 dark:border-gray-800 p-5">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
          🎯 Recommendations
        </h3>
        <ol className="flex flex-col gap-2">
          {data.recommendations?.map((rec, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
              <span className="bg-brand-100 dark:bg-brand-900 text-brand-700
                dark:text-brand-300 font-bold rounded-full w-6 h-6 flex items-center
                justify-center shrink-0 text-xs">
                {i + 1}
              </span>
              {rec}
            </li>
          ))}
        </ol>
      </div>

      {data.marketOpportunities?.length > 0 && (
        <InsightCard
          title="🚀 Market Opportunities"
          items={data.marketOpportunities}
          color="yellow"
        />
      )}

      {data.smsAlert && (
        <div className="bg-gray-800 dark:bg-gray-950 rounded-xl p-5 text-white">
          <p className="text-gray-400 text-xs mb-2 font-medium uppercase tracking-wide">
            📱 SMS Alert Preview
          </p>
          <p className="text-sm leading-relaxed">{data.smsAlert}</p>
        </div>
      )}
    </div>
  );
}

// ── Rate Limit Banner ─────────────────────────────────────────────────────────
function RateLimitBanner({ message, retryAfterMinutes }) {
  return (
    <div className="flex items-start gap-4 bg-amber-50 dark:bg-amber-950 border
      border-amber-200 dark:border-amber-800 rounded-xl p-5 mb-4">
      <span className="text-2xl shrink-0">⏳</span>
      <div>
        <p className="font-semibold text-amber-800 dark:text-amber-200 text-sm">
          Rate limit reached
        </p>
        <p className="text-amber-700 dark:text-amber-300 text-sm mt-0.5">
          {message}
        </p>
        {retryAfterMinutes > 0 && (
          <p className="text-amber-600 dark:text-amber-400 text-xs mt-2 font-medium">
            🕐 Try again in {retryAfterMinutes} minute{retryAfterMinutes !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Error Classifier ──────────────────────────────────────────────────────────
function classifyError(err) {
  const status = err.response?.status;
  const data   = err.response?.data;
  const meta   = data?.fieldErrors;

  if (meta?.incidentType) {
    return {
      type:         'security',
      incidentType: meta.incidentType,
      attemptCount: parseInt(meta.attemptCount || '1'),
      message:      data.message,
    };
  }

  if (status === 429) return {
    type: 'rate_limit',
    message: data?.message || 'Too many analyses. Please wait before trying again.',
    retryAfterMinutes: data?.retryAfterMinutes ?? 0,
  };
  if (status === 403) return {
    type: 'forbidden',
    message: 'Please verify your email before generating analysis.',
  };
  if (status === 400) return {
    type: 'profile',
    message: data?.message || 'Please complete your merchant profile first.',
  };
  if (status === 401) return {
    type: 'auth',
    message: 'Your session has expired. Please log in again.',
  };
  if (status >= 500) return {
    type: 'server',
    message: 'Server error. Please try again in a moment.',
  };
  return {
    type: 'unknown',
    message: data?.message || err.message || 'Failed to generate analysis. Make sure your profile is complete.',
  };
}

// ── History Item ──────────────────────────────────────────────────────────────
function HistoryItem({ item }) {
  const [expanded, setExpanded] = useState(false);
  const analysis = item.analysis || null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border
      border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-2">
            {new Date(item.createdAt).toLocaleDateString('en-NG', {
              day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
          {analysis && (
            <>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                {analysis.summary}
              </p>
              {analysis.estimatedMonthlyRevenuePotential && (
                <span className="text-xs bg-brand-100 dark:bg-brand-900
                  text-brand-700 dark:text-brand-300 font-semibold px-3 py-1 rounded-full">
                  💰 {analysis.estimatedMonthlyRevenuePotential}
                </span>
              )}
            </>
          )}
        </div>
        {analysis && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="shrink-0 text-xs text-brand-500 hover:text-brand-600
              font-medium transition mt-1"
          >
            {expanded ? 'Hide ▲' : 'View ▼'}
          </button>
        )}
      </div>

      {expanded && analysis && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <AnalysisResult data={analysis} />
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AnalysisPage() {
  const [loading,          setLoading]          = useState(false);
  const [analysis,         setAnalysis]         = useState(null);
  const [history,          setHistory]          = useState([]);
  const [totalPages,       setTotalPages]       = useState(1);
  const [currentPage,      setCurrentPage]      = useState(0);
  const [error,            setError]            = useState(null);
  const [securityIncident, setSecurityIncident] = useState(null);
  const [sendSms,          setSendSms]          = useState(false);
  const [activeTab,        setActiveTab]        = useState('generate');
  const { toast } = useToast();

  const loadHistory = async (page = 0) => {
    try {
      const res = await analysisApi.getHistory(page);
      const pageData = res.data.data;
      // Each item in content has { id, createdAt, analysis: {...} }
      setHistory(pageData.content || []);
      setTotalPages(pageData.totalPages || 1);
      setCurrentPage(pageData.number || 0);
    } catch {
      // silently fail
    }
  };

  useEffect(() => { loadHistory(); }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    toast('AI analysis started...', 'info');

    try {
      const res = await analysisApi.generate(sendSms);

      // Response structure: { data: { content: [{ analysis, createdAt, id }], ... } }
      const content = res.data?.data?.content;
      if (content && content.length > 0) {
        setAnalysis(content[0].analysis);
      } else {
        // Fallback: try direct data.analysis path
        setAnalysis(res.data?.data?.analysis || null);
      }

      setSecurityIncident(null);
      loadHistory();
      toast('Analysis generated successfully!', 'success');
    } catch (err) {
      const classified = classifyError(err);

      if (classified.type === 'security') {
        setSecurityIncident({
          incidentType: classified.incidentType,
          attemptCount: classified.attemptCount,
          message:      classified.message,
        });
      } else {
        setError(classified);
        if (classified.type === 'rate_limit') {
          toast(`⏳ ${classified.message}`, 'error');
        } else if (classified.type === 'profile') {
          toast('📝 Complete your profile first', 'error');
        } else if (classified.type === 'forbidden') {
          toast('📧 Please verify your email first', 'error');
        } else if (classified.type === 'auth') {
          toast('🔒 Session expired. Please log in again.', 'error');
        } else {
          toast(classified.message, 'error');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const isBannedOrBlocked = securityIncident?.incidentType === 'BLOCKED'
                         || securityIncident?.incidentType === 'BANNED';

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          AI Business Analysis
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Get personalized insights powered by Groq AI
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6 w-fit">
        {['generate', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === 'history') loadHistory(0);
            }}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition capitalize
              ${activeTab === tab
                ? 'bg-white dark:bg-gray-900 shadow-sm text-gray-800 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            {tab === 'generate' ? '🤖 Generate' : '📂 History'}
          </button>
        ))}
      </div>

      {/* ── Generate Tab ── */}
      {activeTab === 'generate' && (
        <div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border
            border-gray-100 dark:border-gray-800 p-6">
            <h2 className="font-semibold text-gray-800 dark:text-white mb-1">
              Generate New Analysis
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
              Our AI will analyze your business profile and give you actionable recommendations.
            </p>

            <SecurityWarningBanner
              incidentType={securityIncident?.incidentType}
              attemptCount={securityIncident?.attemptCount}
              message={securityIncident?.message}
              onDismiss={() => setSecurityIncident(null)}
            />

            {!isBannedOrBlocked && (
              <label className="flex items-center gap-3 cursor-pointer mb-5 select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={sendSms}
                    onChange={(e) => setSendSms(e.target.checked)}
                  />
                  <div className={`w-10 h-6 rounded-full transition
                    ${sendSms ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                  <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white
                    shadow transition-transform ${sendSms ? 'translate-x-4' : ''}`} />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Send top recommendation via SMS
                  </span>
                  <p className="text-xs text-gray-400">Requires phone number in your profile</p>
                </div>
              </label>
            )}

            {error?.type === 'rate_limit' ? (
              <RateLimitBanner
                message={error.message}
                retryAfterMinutes={error.retryAfterMinutes}
              />
            ) : error ? (
              <ErrorMessage message={error.message} />
            ) : null}

            {!isBannedOrBlocked && (
              <Button
                onClick={handleGenerate}
                disabled={loading || error?.type === 'rate_limit'}
                size="lg"
                fullWidth
              >
                {loading ? '🤖 Analyzing your business...' : '🚀 Generate Analysis'}
              </Button>
            )}

            {error?.type === 'profile' && (
              <p className="text-xs text-center text-gray-400 mt-3">
                👉 Go to{' '}
                <a href="/profile" className="text-brand-500 underline">Profile</a>
                {' '}to complete your business details
              </p>
            )}
            {error?.type === 'forbidden' && (
              <p className="text-xs text-center text-gray-400 mt-3">
                👉 Check your inbox and click the verification link we sent you
              </p>
            )}
            {error?.type === 'auth' && (
              <p className="text-xs text-center text-gray-400 mt-3">
                👉{' '}
                <a href="/login" className="text-brand-500 underline">Log in again</a>
                {' '}to continue
              </p>
            )}
          </div>

          {loading && <AnalysisSkeleton />}
          {analysis && <AnalysisResult data={analysis} />}
        </div>
      )}

      {/* ── History Tab ── */}
      {activeTab === 'history' && (
        <div className="flex flex-col gap-3">
          {history.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📭</p>
              <p className="font-medium">No analyses yet</p>
              <p className="text-sm mt-1">Generate your first analysis to see it here</p>
            </div>
          ) : (
            <>
              {history.map((item) => (
                <HistoryItem key={item.id} item={item} />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-4">
                  <button
                    onClick={() => loadHistory(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-200
                      dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed
                      hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    ← Previous
                  </button>
                  <span className="text-sm text-gray-500">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => loadHistory(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-200
                      dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed
                      hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}