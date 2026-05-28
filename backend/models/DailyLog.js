const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, default: Date.now },
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  water: { type: Number, default: 0 }, // glasses
  steps: { type: Number, default: 0 },
  workoutMinutes: { type: Number, default: 0 },
  sleepHours: { type: Number, default: 0 },
  weight: { type: Number },
  meals: [{
    name: String,
    type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  }],
  notes: { type: String, maxlength: 500 },
}, { timestamps: true });

// Compound index for user + date uniqueness
dailyLogSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
