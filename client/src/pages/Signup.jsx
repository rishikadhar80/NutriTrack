import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiTarget } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Signup = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: { activityLevel: 'moderate', fitnessGoal: 'maintenance', dietaryPreference: 'non_vegetarian', gender: 'male' }
  });

  const onSubmit = async (data) => {
    if (step < 2) { setStep(2); return; }
    setLoading(true);
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-600 via-primary-600 to-primary-800 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-accent-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
              <FiTarget className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">NutriTrack AI</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Start Your Journey</h2>
          <p className="text-primary-100 text-lg mb-8">Join thousands achieving their health goals with AI-powered nutrition and fitness tracking.</p>
          <div className="space-y-4">
            {['Personalized AI diet plans', 'Smart workout generator', 'Weekly health insights', 'Nutrition risk analysis'].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-accent-400 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                <span className="text-white">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex items-center gap-3 mb-6 justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <FiTarget className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">NutriTrack AI</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
          <p className="text-gray-500 mb-6">Step {step} of 2 — {step === 1 ? 'Basic Info' : 'Health Profile'}</p>

          {/* Progress bar */}
          <div className="flex gap-2 mb-8">
            <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input {...register('name', { required: 'Name is required' })} className="input-field pl-12" placeholder="John Doe" />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" {...register('email', { required: 'Email is required' })} className="input-field pl-12" placeholder="you@example.com" />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showPassword ? 'text' : 'password'} {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                      className="input-field pl-12 pr-12" placeholder="Min 6 characters" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age</label>
                    <input type="number" {...register('age', { required: 'Required', min: 10, max: 120 })} className="input-field" placeholder="25" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                    <select {...register('gender')} className="input-field">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Height (cm)</label>
                    <input type="number" {...register('height', { required: 'Required' })} className="input-field" placeholder="170" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight (kg)</label>
                    <input type="number" {...register('weight', { required: 'Required' })} className="input-field" placeholder="70" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Weight (kg)</label>
                  <input type="number" {...register('targetWeight')} className="input-field" placeholder="65" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Activity Level</label>
                  <select {...register('activityLevel')} className="input-field">
                    <option value="sedentary">Sedentary (little/no exercise)</option>
                    <option value="light">Light (1-3 days/week)</option>
                    <option value="moderate">Moderate (3-5 days/week)</option>
                    <option value="active">Active (6-7 days/week)</option>
                    <option value="very_active">Very Active (intense daily)</option>
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
              </>
            )}

            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1 py-3">Back</button>
              )}
              <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : step < 2 ? 'Next' : 'Create Account'}
              </button>
            </div>
          </form>

          <p className="text-center mt-6 text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-500 hover:text-primary-600">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
