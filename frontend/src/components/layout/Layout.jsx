import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FiMenu, FiMoon, FiSun, FiLogOut } from 'react-icons/fi';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 glass border-b border-gray-200/60 dark:border-gray-800/60">
          <div className="h-16 px-4 md:px-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Open sidebar"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <div className="hidden lg:block">
              <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back</p>
              <p className="font-semibold text-gray-900 dark:text-white">{user?.name || 'NutriTrack user'}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>
              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                aria-label="Log out"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
