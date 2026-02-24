import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();

  const cards = [
    {
      icon: '👤',
      title: 'Business Profile',
      description: 'Set up your business details so we can personalize your insights.',
      link: '/profile',
      linkLabel: 'Manage Profile',
      color: 'blue',
    },
    {
      icon: '🤖',
      title: 'AI Analysis',
      description: 'Get AI-powered business insights and recommendations tailored to your store.',
      link: '/analysis',
      linkLabel: 'Generate Analysis',
      color: 'purple',
    },
    {
      icon: '📱',
      title: 'SMS Alerts',
      description: 'Receive your top business recommendation directly to your phone.',
      link: '/analysis',
      linkLabel: 'Enable SMS',
      color: 'green',
    },
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-100', btn: 'text-blue-600 hover:text-blue-800' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-100', btn: 'text-purple-600 hover:text-purple-800' },
    green: { bg: 'bg-green-50', icon: 'bg-green-100', btn: 'text-green-600 hover:text-green-800' },
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-8">
        <p className="text-blue-200 text-sm font-medium mb-1">Welcome back 👋</p>
        <h1 className="text-2xl font-bold">{user?.email}</h1>
        <p className="text-blue-100 mt-1 text-sm">
          Your AI-powered hardware business assistant is ready.
        </p>
        <Link
          to="/analysis"
          className="inline-block mt-4 bg-white text-blue-600 font-semibold text-sm px-5 py-2 rounded-lg hover:bg-blue-50 transition"
        >
          Generate Analysis →
        </Link>
      </div>

      {/* Quick Action Cards */}
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => {
          const c = colorMap[card.color];
          return (
            <div key={card.title} className={`${c.bg} rounded-2xl p-6 border border-transparent`}>
              <div className={`${c.icon} w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4`}>
                {card.icon}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{card.description}</p>
              <Link to={card.link} className={`text-sm font-semibold ${c.btn} transition`}>
                {card.linkLabel} →
              </Link>
            </div>
          );
        })}
      </div>

      {/* Info Strip */}
      <div className="mt-8 bg-white rounded-2xl border p-5 flex items-center gap-4">
        <span className="text-3xl">💡</span>
        <div>
          <p className="font-semibold text-gray-800 text-sm">Pro Tip</p>
          <p className="text-gray-500 text-sm">
            Fill in your business profile completely for more accurate AI recommendations.
          </p>
        </div>
        <Link to="/profile" className="ml-auto text-sm text-blue-600 font-medium hover:underline whitespace-nowrap">
          Update Profile
        </Link>
      </div>
    </div>
  );
}