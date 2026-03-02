import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, User, MessageSquare, TrendingUp,
  ArrowRight, Sparkles, Clock, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { analysisApi } from '../../api/analysis.api';
import MetricsDashboard from '../../components/dashboard/MetricsDashboard';
import FinanceScore from '../../components/dashboard/Financescore';
import InventoryAlerts from '../../components/dashboard/InventoryAlerts';
// import AINarrative from '../../components/dashboard/AINarrative';
// Add this:
import IntelligenceSection from '../../components/dashboard/IntelligenceSection';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

function StatCard({ label, value, sub, icon: Icon, color }) {
  const colors = {
    orange: 'bg-brand-500/10 text-brand-500 border-brand-500/20',
    blue:   'bg-blue-500/10   text-blue-500   border-blue-500/20',
    green:  'bg-green-500/10  text-green-500  border-green-500/20',
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  };
  return (
    <motion.div variants={item}
      className="bg-white dark:bg-gray-900 rounded-2xl border 
        border-gray-100 dark:border-gray-800 p-5 flex flex-col gap-4">
      <div className={`w-10 h-10 rounded-xl border flex items-center 
        justify-center ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

function ActionCard({ icon: Icon, title, description, link, linkLabel, accent }) {
  const accents = {
    orange: 'group-hover:bg-brand-500',
    blue:   'group-hover:bg-blue-500',
    green:  'group-hover:bg-green-500',
  };
  const iconBg = {
    orange: 'bg-brand-500/10 text-brand-500',
    blue:   'bg-blue-500/10   text-blue-500',
    green:  'bg-green-500/10  text-green-500',
  };
  return (
    <motion.div variants={item}>
      <Link to={link}
        className="group block bg-white dark:bg-gray-900 rounded-2xl border 
          border-gray-100 dark:border-gray-800 p-6 hover:border-gray-300 
          dark:hover:border-gray-600 hover:shadow-lg transition-all duration-300"
      >
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center 
          mb-4 transition-all duration-300 ${iconBg[accent]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
          {description}
        </p>
        <div className="flex items-center gap-1.5 text-sm font-semibold 
          text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
          {linkLabel}
          <ChevronRight className="w-4 h-4 transition-transform 
            group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [analysisCount, setAnalysisCount] = useState('—');
  const [lastAnalysis,  setLastAnalysis]  = useState(null);
  const [recentItems,   setRecentItems]   = useState([]);

  useEffect(() => {
    analysisApi.getHistory()
      .then(res => {
        const content = res.data.data.content || [];
        setAnalysisCount(content.length);
        if (content.length > 0) {
          setLastAnalysis(content[0]);
          setRecentItems(content.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  const firstName = user?.email?.split('@')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6"
      >
        {/* Hero Banner */}
        <motion.div variants={item}
          className="relative bg-gray-950 dark:bg-gray-900 rounded-2xl p-8 
            overflow-hidden border border-gray-800"
        >
          {/* Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 
            bg-brand-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 
            bg-brand-600/10 rounded-full blur-2xl translate-y-1/2" />

          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs font-medium">AI Ready</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {greeting}, {firstName} 👋
              </h1>
              <p className="text-gray-400 text-sm max-w-md">
                Your AI business advisor is ready to generate insights 
                for your hardware store.
              </p>
            </div>
            <Link to="/analysis"
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 
                text-white font-semibold text-sm px-5 py-2.5 rounded-xl 
                transition-all shadow-lg shadow-brand-500/30 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              Generate Analysis
            </Link>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Analyses Run"
            value={analysisCount}
            sub="Total generated"
            icon={Brain}
            color="orange"
          />
          <StatCard
            label="AI Model"
            value="Groq"
            sub="Llama 3.3 70B"
            icon={Sparkles}
            color="purple"
          />
          <StatCard
            label="Last Analysis"
            value={lastAnalysis
              ? new Date(lastAnalysis.createdAt).toLocaleDateString('en-NG', {
                  day: 'numeric', month: 'short'
                })
              : 'None yet'}
            sub="Most recent"
            icon={Clock}
            color="blue"
          />
          <StatCard
            label="Revenue Est."
            value={lastAnalysis?.analysis?.estimatedMonthlyRevenuePotential
              ? '₦' + lastAnalysis.analysis.estimatedMonthlyRevenuePotential
                  .replace(/[₦\s]/g, '').split('–')[0].trim().slice(0, 4) + '...'
              : 'N/A'}
            sub="From last analysis"
            icon={TrendingUp}
            color="green"
          />
        </div>

        {/* Metrics */}
        <motion.div variants={item}>
          <MetricsDashboard />
        </motion.div>

        <motion.div variants={item}>
          <FinanceScore />
        </motion.div>

        <motion.div variants={item}>
          <InventoryAlerts />
        </motion.div>

        {/* <motion.div variants={item}>
          <AINarrative />
        </motion.div> */}
        
        <motion.div variants={item}>
          <IntelligenceSection />
        </motion.div>

        {/* Action Cards */}
        <div>
          <motion.h2 variants={item}
            className="text-sm font-semibold text-gray-500 dark:text-gray-400 
              uppercase tracking-wider mb-4">
            Quick Actions
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionCard
              icon={Brain}
              title="AI Analysis"
              description="Generate personalized insights and revenue forecasts for your hardware store."
              link="/analysis"
              linkLabel="Generate now"
              accent="orange"
            />
            <ActionCard
              icon={User}
              title="Business Profile"
              description="Keep your business details updated for more accurate AI recommendations."
              link="/profile"
              linkLabel="Manage profile"
              accent="blue"
            />
            <ActionCard
              icon={MessageSquare}
              title="SMS Alerts"
              description="Get your top business recommendation sent directly to your phone."
              link="/analysis"
              linkLabel="Enable alerts"
              accent="green"
            />
          </div>
        </div>

        {/* Recent Analyses */}
        {recentItems.length > 0 && (
          <motion.div variants={item}
            className="bg-white dark:bg-gray-900 rounded-2xl border 
              border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 
              border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-semibold text-gray-900 dark:text-white text-sm">
                Recent Analyses
              </h2>
              <Link to="/analysis"
                className="text-xs text-brand-500 hover:text-brand-600 
                  font-medium flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {recentItems.map((r) => (
                <div key={r.id}
                  className="px-6 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300 
                      truncate leading-relaxed">
                      {r.analysis?.summary?.slice(0, 90)}...
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(r.createdAt).toLocaleDateString('en-NG', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                  {r.analysis?.estimatedMonthlyRevenuePotential && (
                    <span className="text-xs bg-brand-50 dark:bg-brand-950 
                      text-brand-600 dark:text-brand-400 font-semibold px-2.5 
                      py-1 rounded-full shrink-0 whitespace-nowrap">
                      {r.analysis.estimatedMonthlyRevenuePotential}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Pro Tip */}
        <motion.div variants={item}
          className="bg-brand-50 dark:bg-brand-950/30 rounded-2xl border 
            border-brand-100 dark:border-brand-900 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-500/15 rounded-xl flex items-center 
            justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-brand-500" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800 dark:text-white text-sm">
              Pro Tip
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              Fill in your business profile completely for more accurate AI recommendations.
            </p>
          </div>
          <Link to="/profile"
            className="text-sm text-brand-600 dark:text-brand-400 font-semibold 
              hover:text-brand-700 transition whitespace-nowrap flex items-center gap-1">
            Update Profile <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}