import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { createDailyLog, getTodayLog, getDailySummary } from '../services/api';
import ProgressRing from '../components/common/ProgressRing';
import { FiSave, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';

const DailyTracker = () => {
  const { user } = useAuth();
  const [todayLog, setTodayLog] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [period, setPeriod] = useState('day');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => { loadData(); }, []);
  useEffect(() => { loadSummary(); }, [period]);

  const loadData = async () => {
    try {
      const { data } = await getTodayLog();
      setTodayLog(data.data);
      if (data.data && Object.keys(data.data).length > 0) {
        reset({
          calories: data.data.calories || '',
          protein: data.data.protein || '',
          carbs: data.data.carbs || '',
          fat: data.data.fat || '',
          water: data.data.water || '',
          steps: data.data.steps || '',
          workoutMinutes: data.data.workoutMinutes || '',
          sleepHours: data.data.sleepHours || '',
          weight: data.data.weight || '',
          notes: data.data.notes || '',
        });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadSummary = async () => {
    try {
      const { data } = await getDailySummary({ period });
      setSummary(data.data);
    } catch (err) { console.error(err); }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const numericData = {};
      Object.entries(data).forEach(([key, val]) => {
        if (key === 'notes') numericData[key] = val;
        else if (val !== '' && val !== undefined) numericData[key] = Number(val);
      });

      const res = await createDailyLog(numericData);
      setTodayLog(res.data.data);
      toast.success('Daily log saved!');
      loadSummary();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save log');
    } finally { setSaving(false); }
  };

  const calGoal = user?.dailyCalorieGoal || 2000;
  const proGoal = user?.dailyProteinGoal || 60;
  const watGoal = user?.dailyWaterGoal || 8;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          📝 Daily Tracker
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track your daily nutrition and activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {todayLog?._id ? "Update Today's Log" : "Log Today's Data"}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'calories', label: 'Calories', icon: '🔥', unit: 'kcal', placeholder: '2000' },
                { name: 'protein', label: 'Protein', icon: '🥩', unit: 'g', placeholder: '60' },
                { name: 'carbs', label: 'Carbs', icon: '🍞', unit: 'g', placeholder: '250' },
                { name: 'fat', label: 'Fat', icon: '🥑', unit: 'g', placeholder: '65' },
                { name: 'water', label: 'Water', icon: '💧', unit: 'glasses', placeholder: '8' },
                { name: 'steps', label: 'Steps', icon: '👟', unit: 'steps', placeholder: '10000' },
                { name: 'workoutMinutes', label: 'Workout', icon: '💪', unit: 'min', placeholder: '30' },
                { name: 'sleepHours', label: 'Sleep', icon: '😴', unit: 'hours', placeholder: '7' },
                { name: 'weight', label: 'Weight', icon: '⚖️', unit: 'kg', placeholder: '70' },
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {field.icon} {field.label}
                  </label>
                  <div className="relative">
                    <input type="number" step="any" {...register(field.name)} className="input-field pr-14" placeholder={field.placeholder} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{field.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">📒 Notes</label>
              <textarea {...register('notes')} className="input-field h-20 resize-none" placeholder="How was your day?" />
            </div>

            <button type="submit" disabled={saving} className="btn-primary mt-4 flex items-center gap-2">
              {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSave /> Save Log</>}
            </button>
          </form>
        </div>

        {/* Today's Progress */}
        <div className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Progress</h3>
            <div className="space-y-6">
              <ProgressRing progress={todayLog?.calories ? (todayLog.calories / calGoal) * 100 : 0}
                color="#f97316" label="Calories" value={todayLog?.calories || 0} unit={`/ ${calGoal}`} size={100} />
              <ProgressRing progress={todayLog?.protein ? (todayLog.protein / proGoal) * 100 : 0}
                color="#8b5cf6" label="Protein" value={`${todayLog?.protein || 0}g`} unit={`/ ${proGoal}g`} size={100} />
              <ProgressRing progress={todayLog?.water ? (todayLog.water / watGoal) * 100 : 0}
                color="#3b82f6" label="Water" value={todayLog?.water || 0} unit={`/ ${watGoal}`} size={100} />
            </div>
          </div>

          {/* Summary */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FiTrendingUp className="text-primary-500" /> Summary
              </h3>
              <select value={period} onChange={e => setPeriod(e.target.value)}
                className="text-sm bg-gray-100 dark:bg-gray-800 border-0 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary-500">
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            {summary && (
              <div className="space-y-3">
                {[
                  { label: 'Avg Calories', value: `${summary.avgCalories} kcal`, icon: '🔥' },
                  { label: 'Avg Protein', value: `${summary.avgProtein}g`, icon: '🥩' },
                  { label: 'Avg Water', value: `${summary.avgWater} glasses`, icon: '💧' },
                  { label: 'Avg Sleep', value: `${summary.avgSleep}h`, icon: '😴' },
                  { label: 'Avg Steps', value: summary.avgSteps, icon: '👟' },
                  { label: 'Total Workout', value: `${summary.totalWorkoutMinutes} min`, icon: '💪' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.icon} {item.label}</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTracker;
