import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || '',
      age: user?.age || '',
      gender: user?.gender || 'male',
      height: user?.height || '',
      weight: user?.weight || '',
      targetWeight: user?.targetWeight || '',
      activityLevel: user?.activityLevel || 'moderate',
      fitnessGoal: user?.fitnessGoal || 'maintenance',
      dietaryPreference: user?.dietaryPreference || 'non_vegetarian',
      dailyCalorieGoal: user?.dailyCalorieGoal || 2000,
      dailyProteinGoal: user?.dailyProteinGoal || 60,
      dailyWaterGoal: user?.dailyWaterGoal || 8,
    },
  });

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const numericFields = ['age', 'height', 'weight', 'targetWeight', 'dailyCalorieGoal', 'dailyProteinGoal', 'dailyWaterGoal'];
      const cleanData = { ...data };
      numericFields.forEach(f => { if (cleanData[f]) cleanData[f] = Number(cleanData[f]); });
      await updateProfile(cleanData);
    } catch (err) {
      toast.error('Failed to update profile');
    } finally { setSaving(false); }
  };

  const bmi = user?.weight && user?.height ? (user.weight / ((user.height / 100) ** 2)).toFixed(1) : '--';
  const bmiCategory = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
        <FiUser className="text-primary-500" /> Profile
      </h1>

      {/* Profile Header */}
      <div className="glass-card p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
          <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
          <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-xs font-medium capitalize">
              {user?.fitnessGoal?.replace('_', ' ')}
            </span>
            <span className="px-3 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 rounded-full text-xs font-medium">
              BMI: {bmi} ({bmiCategory})
            </span>
            <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-xs font-medium">
              🔥 {user?.streakCount || 0} day streak
            </span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Edit Profile</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input {...register('name')} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age</label>
            <input type="number" {...register('age')} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
            <select {...register('gender')} className="input-field">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Height (cm)</label>
            <input type="number" {...register('height')} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight (kg)</label>
            <input type="number" {...register('weight')} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Weight (kg)</label>
            <input type="number" {...register('targetWeight')} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Activity Level</label>
            <select {...register('activityLevel')} className="input-field">
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fitness Goal</label>
            <select {...register('fitnessGoal')} className="input-field">
              <option value="weight_loss">Weight Loss</option>
              <option value="weight_gain">Weight Gain</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dietary Preference</label>
            <select {...register('dietaryPreference')} className="input-field">
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="non_vegetarian">Non-Vegetarian</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Daily Calorie Goal</label>
            <input type="number" {...register('dailyCalorieGoal')} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Daily Protein Goal (g)</label>
            <input type="number" {...register('dailyProteinGoal')} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Daily Water Goal (glasses)</label>
            <input type="number" {...register('dailyWaterGoal')} className="input-field" />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSave /> Save Changes</>}
          </button>
          <button type="button" onClick={logout} className="text-red-500 hover:text-red-600 font-medium text-sm">
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
