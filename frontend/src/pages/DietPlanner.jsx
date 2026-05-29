import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateDietPlan, saveDietPlan } from '../services/api';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { FiRefreshCw, FiSave, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';

const MealCard = ({ meal, type }) => {
  const colors = { Breakfast: 'from-yellow-400 to-orange-500', Lunch: 'from-green-400 to-emerald-500', Dinner: 'from-blue-400 to-indigo-500', Snacks: 'from-pink-400 to-rose-500' };
  const icons = { Breakfast: '🌅', Lunch: '☀️', Dinner: '🌙', Snacks: '🍿' };

  if (!meal) return null;

  return (
    <div className="glass-card overflow-hidden animate-slide-up">
      <div className={`bg-gradient-to-r ${colors[type] || colors.Lunch} p-4`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-2xl">{icons[type]}</span> {type}
          </h3>
          <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            {meal.totalCalories} kcal
          </span>
        </div>
      </div>
      <div className="p-4">
        {/* Macros */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Protein</p>
            <p className="font-bold text-blue-600 dark:text-blue-400">{meal.totalProtein}g</p>
          </div>
          <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Carbs</p>
            <p className="font-bold text-orange-600 dark:text-orange-400">{meal.totalCarbs}g</p>
          </div>
          <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Fat</p>
            <p className="font-bold text-purple-600 dark:text-purple-400">{meal.totalFat}g</p>
          </div>
        </div>
        {/* Items */}
        <div className="space-y-2">
          {meal.items?.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{item.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.quantity}</p>
              </div>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{item.calories} cal</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DietPlanner = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    fitnessGoal: user?.fitnessGoal || 'maintenance',
    activityLevel: user?.activityLevel || 'moderate',
    dietaryPreference: user?.dietaryPreference || 'non_vegetarian',
  });

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await generateDietPlan({ ...preferences, age: user?.age, height: user?.height, weight: user?.weight, gender: user?.gender });
      setPlan(data.data);
      toast.success('Diet plan generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate plan');
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!plan) return;
    setSaving(true);
    try {
      await saveDietPlan({ ...plan, goal: preferences.fitnessGoal, dietaryPreference: preferences.dietaryPreference });
      toast.success('Diet plan saved!');
    } catch (err) {
      toast.error('Failed to save plan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <FiZap className="text-yellow-500" /> AI Diet Planner
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Get a personalized diet plan powered by AI</p>
      </div>

      {/* Preferences */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal</label>
            <select value={preferences.fitnessGoal} onChange={e => setPreferences(p => ({ ...p, fitnessGoal: e.target.value }))} className="input-field">
              <option value="weight_loss">Weight Loss</option>
              <option value="weight_gain">Weight Gain</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Activity Level</label>
            <select value={preferences.activityLevel} onChange={e => setPreferences(p => ({ ...p, activityLevel: e.target.value }))} className="input-field">
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Diet Preference</label>
            <select value={preferences.dietaryPreference} onChange={e => setPreferences(p => ({ ...p, dietaryPreference: e.target.value }))} className="input-field">
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="non_vegetarian">Non-Vegetarian</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={generate} disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiRefreshCw /> {plan ? 'Regenerate Plan' : 'Generate Plan'}</>}
          </button>
          {plan && (
            <button onClick={save} disabled={saving} className="btn-secondary flex items-center gap-2">
              {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSave /> Save Plan</>}
            </button>
          )}
        </div>
      </div>

      {loading && <LoadingSkeleton type="card" count={4} />}

      {plan && !loading && (
        <>
          {/* Daily Summary */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Nutritional Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/10 rounded-xl">
                <p className="text-3xl font-bold text-orange-600">{plan.dailyCalories}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Calories</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl">
                <p className="text-3xl font-bold text-blue-600">{plan.dailyProtein}g</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Protein</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 rounded-xl">
                <p className="text-3xl font-bold text-green-600">{plan.dailyCarbs}g</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Carbs</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl">
                <p className="text-3xl font-bold text-purple-600">{plan.dailyFat}g</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fat</p>
              </div>
            </div>
          </div>

          {/* Meal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MealCard meal={plan.breakfast} type="Breakfast" />
            <MealCard meal={plan.lunch} type="Lunch" />
            <MealCard meal={plan.dinner} type="Dinner" />
            <MealCard meal={plan.snacks} type="Snacks" />
          </div>

          {plan.aiNotes && (
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">💡 AI Tips</h3>
              <p className="text-gray-600 dark:text-gray-400">{plan.aiNotes}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DietPlanner;
