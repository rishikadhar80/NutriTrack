const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 50 },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Please use a valid email'] },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  age: { type: Number, min: 10, max: 120 },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  height: { type: Number, min: 50, max: 300 }, // cm
  weight: { type: Number, min: 20, max: 500 }, // kg
  targetWeight: { type: Number, min: 20, max: 500 },
  activityLevel: { type: String, enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'], default: 'moderate' },
  fitnessGoal: { type: String, enum: ['weight_loss', 'weight_gain', 'muscle_gain', 'maintenance'], default: 'maintenance' },
  dietaryPreference: { type: String, enum: ['vegetarian', 'vegan', 'non_vegetarian'], default: 'non_vegetarian' },
  dailyCalorieGoal: { type: Number, default: 2000 },
  dailyProteinGoal: { type: Number, default: 60 },
  dailyWaterGoal: { type: Number, default: 8 }, // glasses
  streakCount: { type: Number, default: 0 },
  lastLogDate: { type: Date },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
