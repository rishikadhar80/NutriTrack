import { useState, useEffect } from 'react';
import { getAchievements } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { FiAward } from 'react-icons/fi';

const Achievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAchievements(); }, []);

  const loadAchievements = async () => {
    try {
      const { data } = await getAchievements();
      setAchievements(data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <LoadingSkeleton type="card" count={8} />;

  const unlocked = achievements.filter(a => a.unlocked);
  const locked = achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <FiAward className="text-yellow-500" /> Achievements
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track your milestones and earn badges</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 text-center">
          <p className="text-3xl font-bold gradient-text">{user?.streakCount || 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Day Streak 🔥</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-3xl font-bold text-yellow-500">{unlocked.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Unlocked</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-3xl font-bold text-gray-400">{locked.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Locked</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-3xl font-bold text-primary-500">{achievements.length > 0 ? Math.round((unlocked.length / achievements.length) * 100) : 0}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Complete</p>
        </div>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🏆 Unlocked</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {unlocked.map((ach, i) => (
              <div key={i} className="glass-card p-5 text-center hover:shadow-xl transition-all duration-300 border-2 border-yellow-200 dark:border-yellow-800/50 animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}>
                <span className="text-4xl block mb-2">{ach.icon}</span>
                <h4 className="font-bold text-gray-900 dark:text-white">{ach.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{ach.description}</p>
                {ach.unlockedAt && (
                  <p className="text-xs text-accent-500 mt-2">{new Date(ach.unlockedAt).toLocaleDateString()}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🔒 Locked</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {locked.map((ach, i) => (
              <div key={i} className="glass-card p-5 text-center opacity-60 grayscale">
                <span className="text-4xl block mb-2">{ach.icon}</span>
                <h4 className="font-bold text-gray-900 dark:text-white">{ach.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{ach.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;
