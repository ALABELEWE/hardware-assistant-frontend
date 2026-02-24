import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (path, label) => (
    <Link
      to={path}
      className={`text-sm font-medium px-3 py-2 rounded-lg transition
        ${isActive(path)
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'}`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">🔧</span>
          <span className="font-bold text-gray-800 text-lg">HardwareAI</span>
        </Link>

        {/* Nav Links */}
        {user && (
          <div className="flex items-center gap-1">
            {navLink('/dashboard', 'Dashboard')}
            {navLink('/profile', 'Profile')}
            {navLink('/analysis', 'Analysis')}
            {user.role === 'ADMIN' && navLink('/admin', 'Admin')}
          </div>
        )}

        {/* User + Logout */}
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden md:block">{user.email}</span>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full
              ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
              {user.role}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-600 transition font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}