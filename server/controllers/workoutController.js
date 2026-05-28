const Workout = require('../models/Workout');
const { generateWorkoutPlan } = require('../services/workoutService');

// @desc    Generate AI workout
// @route   POST /api/workouts/generate
exports.generateWorkout = async (req, res, next) => {
  try {
    const { goal, fitnessLevel, duration, equipment } = req.body;
    const aiWorkout = await generateWorkoutPlan({ goal, fitnessLevel, duration, equipment });
    res.json({ success: true, data: aiWorkout });
  } catch (error) {
    next(error);
  }
};

// @desc    Save workout
// @route   POST /api/workouts
exports.saveWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, data: workout });
  } catch (error) {
    next(error);
  }
};

// @desc    Get workout history
// @route   GET /api/workouts
exports.getWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: workouts });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark workout complete
// @route   PUT /api/workouts/:id/complete
exports.completeWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isCompleted: true, completedAt: new Date() },
      { new: true }
    );
    if (!workout) return res.status(404).json({ success: false, message: 'Workout not found' });
    res.json({ success: true, data: workout });
  } catch (error) {
    next(error);
  }
};
