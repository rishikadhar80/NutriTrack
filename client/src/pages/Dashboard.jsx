import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTodayLog, getDailyLogs } from '../services/api';
import StatCard from '../components/common/StatCard';
import ProgressRing from '../components/common/ProgressRing';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FiTrendingUp, FiDroplet, FiActivity, FiMoon, FiTarget } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [todayLog, setTodayLog] = useState(null);
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [todayRes, weeklyRes] = await Promise.all([
        getTodayLog(),
        getDailyLogs({ period: 'week' }),
      ]);
      setTodayLog(todayRes.data.data);
      setWeeklyLogs(weeklyRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton type="page" />;

  const bmi = user?.weight && user?.height ? (user.weight / ((user.height / 100) ** 2)).toFixed(1) : '--';
  const calorieProgress = todayLog?.calories ? Math.min((todayLog.calories / (user?.dailyCalorieGoal || 2000)) * 100, 100) : 0;
  const proteinProgress = todayLog?.protein ? Math.min((todayLog.protein / (user?.dailyProteinGoal || 60)) * 100, 100) : 0;
  const waterProgress = todayLog?.water ? Math.min((todayLog.water / (user?.dailyWaterGoal || 8)) * 100, 100) : 0;

  const chartData = weeklyLogs.map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' }),
    calories: log.calories || 0,
    protein: log.protein || 0,
    water: log.water || 0,
    sleep: log.sleepHours || 0,
    weight: log.weight || user?.weight || 0,
    steps: log.steps || 0,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Your health overview at a glance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <StatCard title="Current Weight" value={user?.weight || '--'} unit="kg" icon="⚖️" color="blue" />
        <StatCard title="Target Weight" value={user?.targetWeight || '--'} unit="kg" icon="🎯" color="accent" />
        <StatCard title="BMI" value={bmi} icon="📊" color="purple" />
        <StatCard title="Daily Calories" value={user?.dailyCalorieGoal || 2000} unit="kcal" icon="🔥" color="orange" />
        <StatCard title="Streak" value={user?.streakCount || 0} unit="days" icon="⚡" color="yellow" />
      </div>

      {/* Progress Rings */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Today's Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
          <ProgressRing progress={calorieProgress} color="#f97316" label="Calories"
            value={todayLog?.calories || 0} unit={`/ ${user?.dailyCalorieGoal || 2000}`} />
          <ProgressRing progress={proteinProgress} color="#8b5cf6" label="Protein"
            value={`${todayLog?.protein || 0}g`} unit={`/ ${user?.dailyProteinGoal || 60}g`} />
          <ProgressRing progress={waterProgress} color="#3b82f6" label="Water"
            value={todayLog?.water || 0} unit={`/ ${user?.dailyWaterGoal || 8} glasses`} />
          <ProgressRing progress={todayLog?.workoutMinutes ? Math.min((todayLog.workoutMinutes / 60) * 100, 100) : 0}
            color="#10b981" label="Workout" value={`${todayLog?.workoutMinutes || 0}m`} unit="/ 60 min" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calories Trend */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-orange-500" /> Calories Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={2} fill="url(#colorCalories)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weight Progress */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiTarget className="text-purple-500" /> Weight Progress
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5, fill: '#8b5cf6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Water Intake */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiDroplet className="text-blue-500" /> Water Intake
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="water" stroke="#3b82f6" strokeWidth={2} fill="url(#colorWater)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sleep Trend */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiMoon className="text-indigo-500" /> Sleep Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="sleep" stroke="#6366f1" strokeWidth={2} fill="url(#colorSleep)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Log Today', path: '/tracker', icon: '📝', color: 'from-blue-500 to-blue-600' },
            { label: 'Diet Plan', path: '/diet-planner', icon: '🍽️', color: 'from-green-500 to-green-600' },
            { label: 'Workout', path: '/workout', icon: '💪', color: 'from-orange-500 to-orange-600' },
            { label: 'AI Chat', path: '/chatbot', icon: '🤖', color: 'from-purple-500 to-purple-600' },
          ].map(action => (
            <a key={action.path} href={action.path}
              className={`bg-gradient-to-r ${action.color} p-4 rounded-xl text-white text-center hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]`}>
              <span className="text-2xl block mb-1">{action.icon}</span>
              <span className="text-sm font-medium">{action.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
