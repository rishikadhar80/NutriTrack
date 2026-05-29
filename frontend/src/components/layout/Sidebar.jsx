import { NavLink } from 'react-router-dom';
import { FiHome, FiActivity, FiTarget, FiClock, FiMessageSquare, FiAward, FiUser, FiAlertTriangle, FiBookOpen, FiX } from 'react-icons/fi';
import { GiMeal } from 'react-icons/gi';

const navItems = [
  { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { path: '/tracker', icon: FiClock, label: 'Daily Tracker' },
  { path: '/diet-planner', icon: GiMeal, label: 'Diet Planner' },
  { path: '/workout', icon: FiActivity, label: 'Workout' },
  { path: '/weekly-report', icon: FiBookOpen, label: 'Weekly Report' },
  { path: '/risk-predictor', icon: FiAlertTriangle, label: 'Risk Predictor' },
  { path: '/chatbot', icon: FiMessageSquare, label: 'AI Chatbot' },
  { path: '/achievements', icon: FiAward, label: 'Achievements' },
  { path: '/profile', icon: FiUser, label: 'Profile' },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      <aside className={`fixed top-0 left-0 h-full w-64 glass-sidebar z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <FiTarget className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">NutriTrack</h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wider">AI POWERED</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-88px)]">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
