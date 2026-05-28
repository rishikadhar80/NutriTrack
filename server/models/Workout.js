const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: String,
  sets: Number,
  reps: String,
  duration: String,
  restTime: String,
});

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goal: { type: String, enum: ['fat_loss', 'muscle_gain', 'endurance', 'general_fitness'] },
  fitnessLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  duration: { type: Number }, // minutes
  equipment: { type: String, enum: ['none', 'dumbbells', 'resistance_bands', 'full_gym'] },
  warmup: [exerciseSchema],
  mainWorkout: [exerciseSchema],
  cooldown: [exerciseSchema],
  estimatedCaloriesBurned: Number,
  isCompleted: { type: Boolean, default: false },
  completedAt: Date,
  aiNotes: String,
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
