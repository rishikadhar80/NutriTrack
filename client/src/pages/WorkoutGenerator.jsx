import { useState, useEffect } from 'react';
import { generateWorkout as generateWorkoutAPI, saveWorkout, getWorkouts, completeWorkout } from '../services/api';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { FiActivity, FiRefreshCw, FiSave, FiCheck, FiClock, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';

const WorkoutGenerator = () => {
  const [workout, setWorkout] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [params, setParams] = useState({
    goal: 'general_fitness', fitnessLevel: 'beginner', duration: 30, equipment: 'none',
  });

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    try {
      const { data } = await getWorkouts();
      setHistory(data.data || []);
    } catch (err) { console.error(err); }
  };

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await generateWorkoutAPI(params);
      setWorkout(data.data);
      toast.success('Workout generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate workout');
    } finally { setLoading(false); }
  };

  const save = async () => {
    if (!workout) return;
    try {
      await saveWorkout({ ...workout, ...params });
      toast.success('Workout saved!');
      loadHistory();
    } catch (err) { toast.error('Failed to save'); }
  };

  const markComplete = async (id) => {
    try {
      await completeWorkout(id);
      toast.success('Workout completed! 💪');
      loadHistory();
    } catch (err) { toast.error('Failed to update'); }
  };

  const ExerciseTable = ({ exercises, title, color }) => (
    <div className="mb-6">
      <h4 className={`text-lg font-semibold mb-3 ${color}`}>{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Exercise</th>
              <th className="text-center py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Sets</th>
              <th className="text-center py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Reps</th>
              <th className="text-center py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Duration</th>
            </tr>
          </thead>
          <tbody>
            {exercises?.map((ex, i) => (
              <tr key={i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-3 px-3 font-medium text-gray-900 dark:text-white">{ex.name}</td>
                <td className="text-center py-3 px-3">{ex.sets}</td>
                <td className="text-center py-3 px-3">{ex.reps}</td>
                <td className="text-center py-3 px-3">{ex.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FiActivity className="text-orange-500" /> AI Workout Generator
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Generate personalized workouts with AI</p>
        </div>
        <button onClick={() => setShowHistory(!showHistory)} className="btn-outline text-sm">
          {showHistory ? 'New Workout' : `History (${history.length})`}
        </button>
      </div>

      {!showHistory ? (
        <>
          {/* Options */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configure Workout</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal</label>
                <select value={params.goal} onChange={e => setParams(p => ({ ...p, goal: e.target.value }))} className="input-field">
                  <option value="fat_loss">Fat Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="endurance">Endurance</option>
                  <option value="general_fitness">General Fitness</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fitness Level</label>
                <select value={params.fitnessLevel} onChange={e => setParams(p => ({ ...p, fitnessLevel: e.target.value }))} className="input-field">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                <select value={params.duration} onChange={e => setParams(p => ({ ...p, duration: parseInt(e.target.value) }))} className="input-field">
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Equipment</label>
                <select value={params.equipment} onChange={e => setParams(p => ({ ...p, equipment: e.target.value }))} className="input-field">
                  <option value="none">No Equipment</option>
                  <option value="dumbbells">Dumbbells</option>
                  <option value="resistance_bands">Resistance Bands</option>
                  <option value="full_gym">Full Gym</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={generate} disabled={loading} className="btn-primary flex items-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiZap /> Generate Workout</>}
              </button>
              {workout && (
                <button onClick={save} className="btn-secondary flex items-center gap-2"><FiSave /> Save</button>
              )}
            </div>
          </div>

          {loading && <LoadingSkeleton type="list" count={8} />}

          {workout && !loading && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Workout Plan</h3>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-sm text-gray-500"><FiClock /> {params.duration} min</span>
                  <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-sm font-medium">
                    🔥 ~{workout.estimatedCaloriesBurned} cal
                  </span>
                </div>
              </div>
              <ExerciseTable exercises={workout.warmup} title="🔥 Warm Up" color="text-yellow-600 dark:text-yellow-400" />
              <ExerciseTable exercises={workout.mainWorkout} title="💪 Main Workout" color="text-red-600 dark:text-red-400" />
              <ExerciseTable exercises={workout.cooldown} title="🧘 Cool Down" color="text-blue-600 dark:text-blue-400" />
              {workout.aiNotes && (
                <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                  <p className="text-sm text-primary-700 dark:text-primary-300">💡 {workout.aiNotes}</p>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* History */
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">No workout history yet. Generate your first workout!</p>
            </div>
          ) : history.map(w => (
            <div key={w._id} className="glass-card p-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white capitalize">{w.goal?.replace('_', ' ')} Workout</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(w.createdAt).toLocaleDateString()} • {w.duration} min • {w.fitnessLevel}</p>
                </div>
                <div className="flex items-center gap-2">
                  {w.isCompleted ? (
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <FiCheck /> Completed
                    </span>
                  ) : (
                    <button onClick={() => markComplete(w._id)} className="btn-secondary text-sm py-1.5 px-4 flex items-center gap-1">
                      <FiCheck /> Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutGenerator;
