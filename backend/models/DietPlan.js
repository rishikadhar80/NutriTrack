const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: String,
  items: [{ name: String, quantity: String, calories: Number, protein: Number, carbs: Number, fat: Number }],
  totalCalories: Number,
  totalProtein: Number,
  totalCarbs: Number,
  totalFat: Number,
});

const dietPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dailyCalories: Number,
  dailyProtein: Number,
  dailyCarbs: Number,
  dailyFat: Number,
  goal: { type: String, enum: ['weight_loss', 'weight_gain', 'muscle_gain', 'maintenance'] },
  dietaryPreference: { type: String, enum: ['vegetarian', 'vegan', 'non_vegetarian'] },
  breakfast: mealSchema,
  lunch: mealSchema,
  dinner: mealSchema,
  snacks: mealSchema,
  aiNotes: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('DietPlan', dietPlanSchema);
