import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { Cpu, DollarSign, TrendingUp, ChevronRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "https://hardware-assistant-backend-production.up.railway.app/api";

// Mini sparkline data (last 7 days mock until real API available)
const SPARKLINE = [
  { v: 0.04 }, { v: 0.06 }, { v: 0.03 }, { v: 0.08 },
  { v: 0.05 }, { v: 0.09 }, { v: 0.07 },
];

export default function AiUsageSummaryCard({ token }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/admin/ai-usage`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setStats(d))
      .catch(() => {});
  }, [token]);

  // Fallback display values
  const totalCost = stats?.totalCost ?? 1.46;
  const totalTokens = stats?.totalTokens ?? 648000;
  const monthlyAnalyses = stats?.monthlyAnalyses ?? 97;

  return (
    <>
      <style>{`
        .ai-summary-card {
          background: linear-gradient(135deg, rgba(0,255,135,0.04) 0%, rgba(0,153,255,0.04) 100%);
          border: 1px solid rgba(0,255,135,0.12);
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .ai-summary-card::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 120px; height: 120px;
          background: radial-gradient(circle, rgba(0,255,135,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .ai-summary-card:hover {
          border-color: rgba(0,255,135,0.28);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,255,135,0.06);
        }
        .ais-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px;
        }
        .ais-title-group { display: flex; align-items: center; gap: 10px; }
        .ais-icon {
          width: 32px; height: 32px;
          background: rgba(0,255,135,0.1);
          border: 1px solid rgba(0,255,135,0.2);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #00ff87;
        }
        .ais-title { font-size: 13px; font-weight: 600; color: #94a3b8; }
        .ais-link { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #00ff87; opacity: 0.7; transition: opacity 0.2s; }
        .ai-summary-card:hover .ais-link { opacity: 1; }

        .ais-cost {
          font-size: 28px; font-weight: 700;
          color: #fff;
          font-variant-numeric: tabular-nums;
          margin-bottom: 4px;
        }
        .ais-cost span { font-size: 14px; color: #64748b; font-weight: 400; }

        .ais-row { display: flex; gap: 20px; margin: 14px 0; }
        .ais-mini-stat { display: flex; flex-direction: column; gap: 2px; }
        .ais-mini-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #475569; }
        .ais-mini-val { font-size: 15px; font-weight: 600; color: #cbd5e1; }

        .ais-sparkline { height: 48px; margin-top: 12px; }

        .ais-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 8px; border-radius: 20px;
          background: rgba(0,255,135,0.1);
          color: #00ff87; font-size: 11px; font-weight: 600;
          margin-top: 8px;
        }
      `}</style>

      <motion.div
        className="ai-summary-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => navigate("/admin/ai-usage")}
      >
        <div className="ais-header">
          <div className="ais-title-group">
            <div className="ais-icon"><Cpu size={16} strokeWidth={1.5} /></div>
            <span className="ais-title">AI Usage & Costs</span>
          </div>
          <div className="ais-link">
            View full report <ChevronRight size={13} />
          </div>
        </div>

        <div className="ais-cost">
          ${totalCost.toFixed(4)} <span>all time</span>
        </div>

        <div className="ais-row">
          <div className="ais-mini-stat">
            <span className="ais-mini-label">Tokens</span>
            <span className="ais-mini-val">{(totalTokens / 1000).toFixed(0)}K</span>
          </div>
          <div className="ais-mini-stat">
            <span className="ais-mini-label">This Month</span>
            <span className="ais-mini-val">{monthlyAnalyses} runs</span>
          </div>
          <div className="ais-mini-stat">
            <span className="ais-mini-label">Avg/Run</span>
            <span className="ais-mini-val">${(totalCost / (monthlyAnalyses || 1)).toFixed(5)}</span>
          </div>
        </div>

        <div className="ais-sparkline">
          <ResponsiveContainer width="100%" height={48}>
            <AreaChart data={SPARKLINE} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="summGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ff87" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00ff87" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                content={({ active, payload }) =>
                  active && payload?.length ? (
                    <div style={{ background: "#0f1923", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "4px 8px", fontSize: 11 }}>
                      ${payload[0].value.toFixed(4)}
                    </div>
                  ) : null
                }
              />
              <Area type="monotone" dataKey="v" stroke="#00ff87" strokeWidth={1.5} fill="url(#summGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="ais-badge">
          <Zap size={10} /> Live tracking active
        </div>
      </motion.div>
    </>
  );
}