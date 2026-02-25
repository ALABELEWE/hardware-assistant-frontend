import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, User, Brain, ShieldCheck,
  CreditCard, LogOut, Menu, X, Sun, Moon, Wrench
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { path: '/dashboard',    label: 'Dashboard', icon: LayoutDashboard },
  { path: '/profile',      label: 'Profile',   icon: User            },
  { path: '/analysis',     label: 'Analysis',  icon: Brain           },
  { path: '/subscription', label: 'Upgrade',   icon: CreditCard      },
];

const adminItems = [
  { path: '/admin', label: 'Admin', icon: ShieldCheck },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  const items = user?.role === 'ADMIN'
    ? [...navItems, ...adminItems]
    : navItems;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b 
        border-gray-100 dark:border-gray-800">
        <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center 
          justify-center shadow-lg shadow-brand-500/30">
          <Wrench className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-white text-sm">HardwareAI</p>
          <p className="text-xs text-gray-400">Business Intelligence</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {items.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl 
              text-sm font-medium transition-all
              ${isActive(path)
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* User Footer */}
      <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl 
          bg-gray-50 dark:bg-gray-800/50 mb-2">
          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 
            flex items-center justify-center">
            <span className="text-brand-600 dark:text-brand-400 font-bold text-xs">
              {user?.email?.[0]?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
              {user?.email}
            </p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-xl
            text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 
            dark:hover:bg-red-950 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-white 
        dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 
        fixed h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-full w-60 bg-white 
                dark:bg-gray-900 z-50 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b 
          border-gray-100 dark:border-gray-800 flex items-center 
          justify-between px-4 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 
              dark:hover:bg-gray-800 transition"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="hidden md:block">
            <h1 className="text-sm font-semibold text-gray-800 dark:text-white capitalize">
              {location.pathname.replace('/', '') || 'Dashboard'}
            </h1>
          </div>
          <button
            onClick={toggle}
            className="ml-auto p-2 rounded-xl hover:bg-gray-100 
              dark:hover:bg-gray-800 transition"
          >
            {dark
              ? <Sun  className="w-5 h-5 text-yellow-400" />
              : <Moon className="w-5 h-5 text-gray-500"   />
            }
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}