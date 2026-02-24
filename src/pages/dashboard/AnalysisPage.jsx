import { useState, useEffect } from 'react';
import { analysisApi } from '../../api/analysis.api';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

function InsightCard({ title, items, color }) {
  const colors = {
    green: 'bg-green-50 border-green-100 text-green-800',
    red: 'bg-red-50 border-red-100 text-red-800',
    blue: 'bg-blue-50 border-blue-100 text-blue-800',
    yellow: 'bg-yellow-50 border-yellow-100 text-yellow-800',
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

function AnalysisResult({ data }) {
  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-800 mb-2">📋 Business Summary</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{data.summary}</p>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <p className="text-blue-200 text-sm font-medium mb-1">💰 Estimated Monthly Revenue Potential</p>
        <p className="text-3xl font-bold">{data.estimatedMonthlyRevenuePotential || 'Not estimated'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InsightCard title="✅ Strengths" items={data.strengths} color="green" />
        <InsightCard title="⚠️ Weaknesses" items={data.weaknesses} color="red" />
      </div>

      <div className="bg-white rounded-xl border p-5">
        <h3 className="font-semibold text-gray-800 mb-3">🎯 Recommendations</h3>
        <ol className="flex flex-col gap-2">
          {data.recommendations?.map((rec, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-700">
              <span className="bg-blue-100 text-blue-700 font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs">
                {i + 1}
              </span>
              {rec}
            </li>
          ))}
        </ol>
      </div>

      {data.marketOpportunities?.length > 0 && (
        <InsightCard title="🚀 Market Opportunities" items={data.marketOpportunities} color="yellow" />
      )}

      {data.smsAlert && (
        <div className="bg-gray-800 rounded-xl p-5 text-white">
          <p className="text-gray-400 text-xs mb-2 font-medium uppercase tracking-wide">📱 SMS Alert Preview</p>
          <p className="text-sm leading-relaxed">{data.smsAlert}</p>
        </div>
      )}
    </div>
  );
}

export default function AnalysisPage() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [sendSms, setSendSms] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');

  const loadHistory = async () => {
    try {
      const res = await analysisApi.getHistory();
      setHistory(res.data.data.content || []);
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setAnalysis(null);
    try {
      const res = await analysisApi.generate(sendSms);
      const parsed = res.data.data.analysis;
      setAnalysis(parsed);
      loadHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate analysis. Make sure your profile is complete.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">AI Business Analysis</h1>
        <p className="text-gray-500 text-sm mt-1">
          Get personalized insights powered by Claude AI
        </p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {['generate', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition capitalize
              ${activeTab === tab ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab === 'generate' ? '🤖 Generate' : '📂 History'}
          </button>
        ))}
      </div>

      {activeTab === 'generate' && (
        <div>
          <div className="bg-white rounded-2xl border p-6">
            <h2 className="font-semibold text-gray-800 mb-1">Generate New Analysis</h2>
            <p className="text-gray-500 text-sm mb-5">
              Our AI will analyze your business profile and give you actionable recommendations.
            </p>

            <label className="flex items-center gap-3 cursor-pointer mb-5 select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={sendSms}
                  onChange={(e) => setSendSms(e.target.checked)}
                />
                <div className={`w-10 h-6 rounded-full transition ${sendSms ? 'bg-blue-600' : 'bg-gray-300'}`} />
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform
                  ${sendSms ? 'translate-x-4' : ''}`} />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Send top recommendation via SMS</span>
                <p className="text-xs text-gray-400">Requires phone number in your profile</p>
              </div>
            </label>

            <ErrorMessage message={error} />

            <Button onClick={handleGenerate} disabled={loading} size="lg" fullWidth>
              {loading ? '🤖 Analyzing your business...' : '🚀 Generate Analysis'}
            </Button>
          </div>

          {loading && (
            <div className="mt-8 flex flex-col items-center gap-3 text-gray-400">
              <LoadingSpinner size="lg" />
              <p className="text-sm">AI is analyzing your business...</p>
            </div>
          )}

          {analysis && <AnalysisResult data={analysis} />}
        </div>
      )}

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
                <div key={item.id} className="bg-white rounded-xl border p-5">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString('en-NG', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {parsed && (
                    <>
                      <p className="text-sm text-gray-700 mb-3">{parsed.summary}</p>
                      {parsed.estimatedMonthlyRevenuePotential && (
                        <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full">
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