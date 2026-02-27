import { useState, useEffect } from 'react';
import { analysisApi } from '../../api/analysis.api';
import { useToast } from '../../context/ToastContext';
import { AnalysisSkeleton } from '../../components/common/Skeleton';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';

// ── Insight Card ─────────────────────────────────────────────────────────────
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

// ── Analysis Result ──────────────────────────────────────────────────────────
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

// ── Rate Limit Banner ────────────────────────────────────────────────────────
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

// ── Error Classifier ─────────────────────────────────────────────────────────
function classifyError(err) {
  const status = err.response?.status;
  const data   = err.response?.data;

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

// ── Main Page ────────────────────────────────────────────────────────────────
export default function AnalysisPage() {
  const [loading,   setLoading]   = useState(false);
  const [analysis,  setAnalysis]  = useState(null);
  const [history,   setHistory]   = useState([]);
  const [error,     setError]     = useState(null);  // { type, message, retryAfterMinutes? }
  const [sendSms,   setSendSms]   = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  const { toast } = useToast();

  const loadHistory = async () => {
    try {
      const res = await analysisApi.getHistory();
      setHistory(res.data.data.content || []);
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
      const parsed = res.data.data.analysis;
      setAnalysis(parsed);
      loadHistory();
      toast('Analysis generated successfully!', 'success');
    } catch (err) {
      const classified = classifyError(err);
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
    } finally {
      setLoading(false);
    }
  };

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
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition capitalize
              ${activeTab === tab
                ? 'bg-white dark:bg-gray-900 shadow-sm text-gray-800 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            {tab === 'generate' ? '🤖 Generate' : '📂 History'}
          </button>
        ))}
      </div>

      {/* Generate Tab */}
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

            {/* SMS toggle */}
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

            {/* Error display — rate limit gets special banner, others get standard */}
            {error?.type === 'rate_limit' ? (
              <RateLimitBanner
                message={error.message}
                retryAfterMinutes={error.retryAfterMinutes}
              />
            ) : error ? (
              <ErrorMessage message={error.message} />
            ) : null}

            <Button
              onClick={handleGenerate}
              disabled={loading || error?.type === 'rate_limit'}
              size="lg"
              fullWidth
            >
              {loading ? '🤖 Analyzing your business...' : '🚀 Generate Analysis'}
            </Button>

            {/* Context-specific hints below button */}
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

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="flex flex-col gap-3">
          {history.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📭</p>
              <p className="font-medium">No analyses yet</p>
              <p className="text-sm mt-1">Generate your first analysis to see it here</p>
            </div>
          ) : (
            history.map((item) => {
              const parsed = item.analysis || null;
              return (
                <div key={item.id} className="bg-white dark:bg-gray-900 rounded-xl
                  border border-gray-100 dark:border-gray-800 p-5">
                  <p className="text-xs text-gray-400 mb-3">
                    {new Date(item.createdAt).toLocaleDateString('en-NG', {
                      day: 'numeric', month: 'long', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                  {parsed && (
                    <>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        {parsed.summary}
                      </p>
                      {parsed.estimatedMonthlyRevenuePotential && (
                        <span className="text-xs bg-brand-100 dark:bg-brand-900
                          text-brand-700 dark:text-brand-300 font-semibold px-3 py-1 rounded-full">
                          💰 {parsed.estimatedMonthlyRevenuePotential}
                        </span>
                      )}
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}