import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Store, Brain, MessageSquare,
  CreditCard, TrendingUp, ShieldCheck, Search
} from 'lucide-react';
import { adminApi } from '../../api/admin.api';
import { Skeleton } from '../../components/common/Skeleton';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

function StatCard({ icon: Icon, label, value, sub, color }) {
  const colors = {
    orange: 'bg-brand-500/10 text-brand-500 border-brand-500/20',
    green:  'bg-green-500/10  text-green-500  border-green-500/20',
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    blue:   'bg-blue-500/10   text-blue-500   border-blue-500/20',
    teal:   'bg-teal-500/10   text-teal-500   border-teal-500/20',
  };
  return (
    <motion.div variants={item}
      className="bg-white dark:bg-gray-900 rounded-2xl border 
        border-gray-100 dark:border-gray-800 p-5">
      <div className={`w-10 h-10 rounded-xl border flex items-center 
        justify-center mb-4 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value ?? '—'}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </motion.div>
  );
}

function AdminSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Skeleton className="h-8 w-52 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border 
            border-gray-100 dark:border-gray-800 p-5">
            <Skeleton className="h-10 w-10 mb-4" />
            <Skeleton className="h-7 w-16 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function AdminDashboard() {
  const [stats,     setStats]     = useState(null);
  const [users,     setUsers]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [search,    setSearch]    = useState('');

  useEffect(() => {
    Promise.all([adminApi.getDashboard(), adminApi.getUsers()])
      .then(([statsRes, usersRes]) => {
        setStats(statsRes.data.data);
        setUsers(usersRes.data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminSkeleton />;

  const statCards = [
    { icon: Users,         label: 'Total Users',           value: stats?.totalUsers,          color: 'blue',   sub: 'Registered accounts'   },
    { icon: Store,         label: 'Total Merchants',        value: stats?.totalMerchants,       color: 'green',  sub: 'With business profiles' },
    { icon: Brain,         label: 'Analyses Generated',     value: stats?.totalAnalyses,        color: 'purple', sub: 'AI reports created'     },
    { icon: MessageSquare, label: 'SMS Sent',               value: stats?.totalSmsSent,         color: 'orange', sub: 'Alerts delivered'       },
    { icon: CreditCard,    label: 'Active Subscriptions',   value: stats?.activeSubscriptions,  color: 'teal',   sub: 'Paying customers'       },
  ];

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Overview',   icon: TrendingUp  },
    { id: 'users',    label: 'Users',      icon: Users       },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6"
      >
        {/* Header */}
        <motion.div variants={item}
          className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-brand-500" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Monitor your platform in real time
            </p>
          </div>
          <div className="flex items-center gap-2 bg-green-500/10 border 
            border-green-500/20 text-green-500 text-xs font-semibold 
            px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Platform Operational
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={item}
          className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 
            rounded-xl w-fit">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg 
                text-sm font-medium transition
                ${activeTab === id
                  ? 'bg-white dark:bg-gray-900 shadow-sm text-gray-800 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </motion.div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {statCards.map((card) => (
                <StatCard key={card.label} {...card} />
              ))}
            </div>

            {/* Summary Banner */}
            <motion.div variants={item}
              className="relative bg-gray-950 dark:bg-gray-900 rounded-2xl p-8 
                border border-gray-800 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 
                bg-brand-500/10 rounded-full blur-3xl 
                -translate-y-1/2 translate-x-1/4 pointer-events-none" />
              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase 
                    tracking-widest mb-2">
                    Merchant Conversion
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {stats?.totalUsers
                      ? Math.round((stats.totalMerchants / stats.totalUsers) * 100)
                      : 0}%
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Users with business profiles
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase 
                    tracking-widest mb-2">
                    Analyses per Merchant
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {stats?.totalMerchants
                      ? (stats.totalAnalyses / stats.totalMerchants).toFixed(1)
                      : 0}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Average AI reports generated
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase 
                    tracking-widest mb-2">
                    Subscription Rate
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {stats?.totalUsers
                      ? Math.round((stats.activeSubscriptions / stats.totalUsers) * 100)
                      : 0}%
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Users on paid plans
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div variants={item}
            className="bg-white dark:bg-gray-900 rounded-2xl border 
              border-gray-100 dark:border-gray-800 overflow-hidden">

            {/* Table Header */}
            <div className="flex items-center justify-between px-6 py-4 
              border-b border-gray-100 dark:border-gray-800 gap-4 flex-wrap">
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white text-sm">
                  All Users
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {filteredUsers.length} of {users.length} users
                </p>
              </div>
              {/* Search */}
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 
                border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 w-64">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by email..."
                  className="flex-1 bg-transparent text-sm text-gray-700 
                    dark:text-gray-300 placeholder-gray-400 outline-none"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b 
                  border-gray-100 dark:border-gray-800">
                  <tr>
                    {['User', 'Role', 'Status', 'Joined'].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs 
                        font-semibold text-gray-500 dark:text-gray-400 
                        uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center 
                        text-gray-400 text-sm">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 
                          transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-100 
                              dark:bg-brand-900 flex items-center justify-center 
                              shrink-0">
                              <span className="text-brand-600 dark:text-brand-400 
                                font-bold text-xs">
                                {user.email[0].toUpperCase()}
                              </span>
                            </div>
                            <span className="text-gray-800 dark:text-gray-200 
                              font-medium truncate max-w-48">
                              {user.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 
                            rounded-full
                            ${user.role === 'ADMIN'
                              ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                              : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full
                              ${user.enabled ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className={`text-xs font-semibold
                              ${user.enabled
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'}`}>
                              {user.enabled ? 'Active' : 'Disabled'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs">
                          {new Date(user.createdAt).toLocaleDateString('en-NG', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}