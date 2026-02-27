import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
  DollarSign, Zap, Users, Activity,
  ArrowUpRight, ArrowDownRight,
  Calendar, Download, RefreshCw
} from "lucide-react";

// ── API ───────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL ||
  "https://hardware-assistant-backend-production.up.railway.app/api";

async function fetchAiUsage(token) {
  const res = await fetch(`${API_BASE}/admin/ai-usage`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch AI usage");
  const json = await res.json();
  // Unwrap ApiResponse wrapper: { data: { ... } }
  return json.data ?? json;
}

// ── Fallback (shown only if API totally fails) ────────────────────────────
const FALLBACK_MONTHLY = [
  { month: "Sep", cost: 0, tokens: 0, analyses: 0 },
  { month: "Oct", cost: 0, tokens: 0, analyses: 0 },
  { month: "Nov", cost: 0, tokens: 0, analyses: 0 },
  { month: "Dec", cost: 0, tokens: 0, analyses: 0 },
  { month: "Jan", cost: 0, tokens: 0, analyses: 0 },
  { month: "Feb", cost: 0, tokens: 0, analyses: 0 },
];

const TOKEN_SPLIT = [
  { name: "Prompt",     value: 62, color: "#00ff87" },
  { name: "Completion", value: 38, color: "#0099ff" },
];

// ── Helpers ───────────────────────────────────────────────────────────────
function safeNum(v, fallback = 0) {
  const n = parseFloat(v);
  return isNaN(n) ? fallback : n;
}

// ── StatCard ──────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, trend, delay = 0 }) {
  const up = trend > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="stat-card"
    >
      <div className="stat-icon-wrap">
        <Icon size={18} strokeWidth={1.5} />
      </div>
      <div className="stat-body">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {sub && <span className="stat-sub">{sub}</span>}
      </div>
      {trend !== undefined && (
        <div className={`stat-trend ${up ? "up" : "down"}`}>
          {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </motion.div>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tt-label">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}:{" "}
          <strong>
            {p.name === "cost"
              ? `$${safeNum(p.value).toFixed(4)}`
              : safeNum(p.value).toLocaleString()}
          </strong>
        </p>
      ))}
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────
export default function AiUsagePage() {
  const [apiData,    setApiData]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState("cost");
  const [refreshing, setRefreshing] = useState(false);

  const token = localStorage.getItem("token");

  async function load() {
    try {
      setRefreshing(true);
      const result = await fetchAiUsage(token);
      setApiData(result);
    } catch (e) {
      console.error("AI usage fetch failed:", e.message);
      setApiData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);

  // ── Derive display values from real API data ──────────────────────────
  const monthly = apiData?.monthlyTrend?.length
    ? apiData.monthlyTrend.map((m) => ({
        month:    m.month,
        cost:     safeNum(m.cost),
        tokens:   safeNum(m.tokens),
        analyses: safeNum(m.analyses),
      }))
    : FALLBACK_MONTHLY;

  const users = apiData?.perUserUsage?.length
    ? apiData.perUserUsage.map((u) => ({
        email:     u.email,
        totalCost: safeNum(u.totalCost),
        tokens:    safeNum(u.totalTokens),
        analyses:  safeNum(u.analyses),
      }))
    : [];

  const totalCost       = safeNum(apiData?.totalCost);
  const totalTokens     = safeNum(apiData?.totalTokens);
  const thisMonthCost   = safeNum(apiData?.totalCostThisMonth);
  const monthlyAnalyses = safeNum(apiData?.monthlyAnalyses);

  // Cost trend: compare last two months
  const lastMonth = monthly[monthly.length - 1];
  const prevMonth = monthly[monthly.length - 2];
  const costTrend = prevMonth?.cost > 0
    ? Math.round(((lastMonth.cost - prevMonth.cost) / prevMonth.cost) * 100)
    : 0;

  const trendTotalTokens = users.reduce((s, u) => s + u.tokens, 0) || 1;
  const totalAnalyses    = monthly.reduce((s, m) => s + m.analyses, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .ai-page { min-height: 100vh; background: #080c10; color: #e2e8f0; font-family: 'DM Sans', sans-serif; padding: 0 0 60px 0; }
        .page-header { border-bottom: 1px solid rgba(0,255,135,0.08); padding: 28px 40px 24px; display: flex; align-items: center; justify-content: space-between; background: linear-gradient(180deg, rgba(0,255,135,0.03) 0%, transparent 100%); }
        .header-left { display: flex; flex-direction: column; gap: 4px; }
        .header-eyebrow { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #00ff87; opacity: 0.7; }
        .header-title { font-family: 'Space Mono', monospace; font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.5px; }
        .header-actions { display: flex; gap: 10px; align-items: center; }
        .btn-icon { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: #94a3b8; font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .btn-icon:hover { background: rgba(255,255,255,0.07); color: #e2e8f0; }
        .btn-refresh { color: #00ff87; border-color: rgba(0,255,135,0.2); }
        .btn-refresh:hover { background: rgba(0,255,135,0.07); }
        .spinning { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .live-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: #00ff87; opacity: 0.7; font-family: 'Space Mono', monospace; }
        .live-dot { width: 6px; height: 6px; border-radius: 50%; background: #00ff87; animation: pulse-dot 2s infinite; }
        @keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .page-body { padding: 32px 40px; display: flex; flex-direction: column; gap: 32px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .stat-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 20px; display: flex; align-items: flex-start; gap: 14px; position: relative; overflow: hidden; transition: border-color 0.2s; }
        .stat-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,255,135,0.03) 0%, transparent 60%); pointer-events: none; }
        .stat-card:hover { border-color: rgba(0,255,135,0.2); }
        .stat-icon-wrap { width: 36px; height: 36px; border-radius: 10px; background: rgba(0,255,135,0.08); border: 1px solid rgba(0,255,135,0.15); display: flex; align-items: center; justify-content: center; color: #00ff87; flex-shrink: 0; }
        .stat-body { flex: 1; display: flex; flex-direction: column; gap: 3px; }
        .stat-label { font-size: 11px; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase; }
        .stat-value { font-family: 'Space Mono', monospace; font-size: 22px; font-weight: 700; color: #fff; }
        .stat-sub { font-size: 12px; color: #64748b; }
        .stat-trend { display: flex; align-items: center; gap: 3px; font-size: 12px; font-weight: 600; padding: 4px 8px; border-radius: 20px; flex-shrink: 0; margin-top: 2px; }
        .stat-trend.up { color: #00ff87; background: rgba(0,255,135,0.1); }
        .stat-trend.down { color: #f87171; background: rgba(248,113,113,0.1); }
        .charts-row { display: grid; grid-template-columns: 1fr 320px; gap: 20px; }
        .chart-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; }
        .chart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .chart-title { font-family: 'Space Mono', monospace; font-size: 13px; color: #94a3b8; letter-spacing: 0.5px; }
        .tab-group { display: flex; gap: 4px; }
        .tab-btn { padding: 5px 12px; border-radius: 6px; border: 1px solid transparent; background: transparent; color: #64748b; font-size: 12px; cursor: pointer; transition: all 0.2s; }
        .tab-btn.active { background: rgba(0,255,135,0.1); border-color: rgba(0,255,135,0.2); color: #00ff87; }
        .tab-btn:hover:not(.active) { color: #94a3b8; background: rgba(255,255,255,0.04); }
        .chart-tooltip { background: #0f1923; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 14px; font-size: 13px; }
        .tt-label { color: #64748b; font-size: 11px; margin-bottom: 4px; }
        .pie-wrap { display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .pie-legend { width: 100%; display: flex; flex-direction: column; gap: 10px; }
        .legend-item { display: flex; align-items: center; justify-content: space-between; }
        .legend-dot-label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #94a3b8; }
        .legend-dot { width: 8px; height: 8px; border-radius: 50%; }
        .legend-val { font-family: 'Space Mono', monospace; font-size: 13px; color: #e2e8f0; }
        .table-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; overflow: hidden; }
        .table-head { padding: 20px 24px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .table-title { font-family: 'Space Mono', monospace; font-size: 13px; color: #94a3b8; }
        table { width: 100%; border-collapse: collapse; }
        th { padding: 11px 24px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #475569; font-weight: 500; background: rgba(0,0,0,0.2); }
        td { padding: 14px 24px; font-size: 13px; color: #94a3b8; border-bottom: 1px solid rgba(255,255,255,0.03); }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(255,255,255,0.02); }
        .td-email { color: #e2e8f0; font-weight: 500; }
        .td-mono { font-family: 'Space Mono', monospace; font-size: 12px; }
        .td-cost { color: #00ff87; font-family: 'Space Mono', monospace; font-size: 12px; }
        .usage-bar-wrap { display: flex; align-items: center; gap: 10px; }
        .usage-bar-bg { flex: 1; height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
        .usage-bar-fill { height: 100%; background: linear-gradient(90deg, #00ff87, #0099ff); border-radius: 2px; }
        .empty-row td { text-align: center; color: #475569; padding: 40px 24px; font-size: 13px; }
        .loading-screen { display: flex; align-items: center; justify-content: center; min-height: 60vh; flex-direction: column; gap: 16px; }
        .pulse-ring { width: 48px; height: 48px; border: 2px solid rgba(0,255,135,0.2); border-top-color: #00ff87; border-radius: 50%; animation: spin 0.8s linear infinite; }
        .loading-text { font-family: 'Space Mono', monospace; font-size: 12px; color: #00ff87; opacity: 0.6; }
        @media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .charts-row { grid-template-columns: 1fr; } .page-header, .page-body { padding-left: 20px; padding-right: 20px; } }
      `}</style>

      <div className="ai-page">
        {/* Header */}
        <div className="page-header">
          <div className="header-left">
            <span className="header-eyebrow">Platform Intelligence</span>
            <h1 className="header-title">AI Usage & Cost Monitor</h1>
          </div>
          <div className="header-actions">
            <div className="live-badge">
              <div className="live-dot" /> LIVE DATA
            </div>
            <button className="btn-icon">
              <Calendar size={14} /> This Month
            </button>
            <button className="btn-icon">
              <Download size={14} /> Export
            </button>
            <button className="btn-icon btn-refresh" onClick={load}>
              <RefreshCw size={14} className={refreshing ? "spinning" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-screen">
            <div className="pulse-ring" />
            <span className="loading-text">LOADING USAGE DATA...</span>
          </div>
        ) : (
          <div className="page-body">

            {/* Stat Cards */}
            <div className="stats-grid">
              <StatCard
                icon={DollarSign}
                label="Total Platform Cost"
                value={`$${totalCost.toFixed(4)}`}
                sub="All time"
                trend={costTrend}
                delay={0}
              />
              <StatCard
                icon={Zap}
                label="Total Tokens Used"
                value={totalTokens >= 1000
                  ? `${(totalTokens / 1000).toFixed(0)}K`
                  : String(totalTokens)}
                sub={`${totalAnalyses} analyses`}
                trend={12}
                delay={0.08}
              />
              <StatCard
                icon={Activity}
                label="This Month"
                value={`$${thisMonthCost.toFixed(4)}`}
                sub={`${monthlyAnalyses} analyses`}
                trend={costTrend}
                delay={0.16}
              />
              <StatCard
                icon={Users}
                label="Active Merchants"
                value={users.length}
                sub="Using AI features"
                trend={8}
                delay={0.24}
              />
            </div>

            {/* Charts Row */}
            <motion.div
              className="charts-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {/* Trend chart */}
              <div className="chart-card">
                <div className="chart-header">
                  <span className="chart-title">6-MONTH TREND</span>
                  <div className="tab-group">
                    {["cost", "tokens", "analyses"].map((t) => (
                      <button
                        key={t}
                        className={`tab-btn ${activeTab === t ? "active" : ""}`}
                        onClick={() => setActiveTab(t)}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={monthly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00ff87" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#00ff87" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey={activeTab}
                      stroke="#00ff87"
                      strokeWidth={2}
                      fill="url(#areaGrad)"
                      dot={{ fill: "#00ff87", strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: "#00ff87", stroke: "#080c10", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Token split pie */}
              <div className="chart-card">
                <div className="chart-header">
                  <span className="chart-title">TOKEN SPLIT</span>
                </div>
                <div className="pie-wrap">
                  <PieChart width={180} height={180}>
                    <Pie
                      data={TOKEN_SPLIT}
                      cx={86} cy={86}
                      innerRadius={52} outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {TOKEN_SPLIT.map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="pie-legend">
                    {TOKEN_SPLIT.map((t) => (
                      <div key={t.name} className="legend-item">
                        <div className="legend-dot-label">
                          <div className="legend-dot" style={{ background: t.color }} />
                          {t.name} tokens
                        </div>
                        <span className="legend-val">{t.value}%</span>
                      </div>
                    ))}
                    <div className="legend-item" style={{ marginTop: 8, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="legend-dot-label" style={{ color: "#e2e8f0" }}>Cost / 1M tokens</div>
                      <span className="legend-val" style={{ color: "#00ff87" }}>$0.59</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Per-user table */}
            <motion.div
              className="table-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.5 }}
            >
              <div className="table-head">
                <span className="table-title">PER-USER BREAKDOWN</span>
                <span style={{ fontSize: 12, color: "#475569" }}>{users.length} merchants</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Merchant</th>
                    <th>Analyses</th>
                    <th>Tokens Used</th>
                    <th>Usage Share</th>
                    <th>Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr className="empty-row">
                      <td colSpan={5}>No usage data yet</td>
                    </tr>
                  ) : (
                    users.map((u, i) => {
                      const share = Math.round((u.tokens / trendTotalTokens) * 100);
                      return (
                        <motion.tr
                          key={u.email}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.06 }}
                        >
                          <td className="td-email">{u.email}</td>
                          <td className="td-mono">{u.analyses}</td>
                          <td className="td-mono">
                            {u.tokens >= 1000
                              ? `${(u.tokens / 1000).toFixed(0)}K`
                              : u.tokens}
                          </td>
                          <td>
                            <div className="usage-bar-wrap">
                              <div className="usage-bar-bg">
                                <div className="usage-bar-fill" style={{ width: `${Math.min(share, 100)}%` }} />
                              </div>
                              <span style={{ fontSize: 11, color: "#64748b", minWidth: 28 }}>{share}%</span>
                            </div>
                          </td>
                          <td className="td-cost">${u.totalCost.toFixed(4)}</td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </motion.div>

          </div>
        )}
      </div>
    </>
  );
}