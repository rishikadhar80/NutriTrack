const mongoose = require('mongoose');

const weeklyReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weekStart: { type: Date, required: true },
  weekEnd: { type: Date, required: true },
  avgCalories: Number,
  avgProtein: Number,
  avgWater: Number,
  avgSleep: Number,
  avgSteps: Number,
  totalWorkoutMinutes: Number,
  nutritionScore: { type: Number, min: 0, max: 100 },
  hydrationScore: { type: Number, min: 0, max: 100 },
  sleepScore: { type: Number, min: 0, max: 100 },
  fitnessScore: { type: Number, min: 0, max: 100 },
  overallScore: { type: Number, min: 0, max: 100 },
  strengths: [String],
  weaknesses: [String],
  recommendations: [String],
  aiAnalysis: String,
  dailyData: [{
    date: Date,
    calories: Number,
    protein: Number,
    water: Number,
    sleep: Number,
    steps: Number,
    workoutMinutes: Number,
  }],
}, { timestamps: true });

module.exports = mongoose.model('WeeklyReport', weeklyReportSchema);
