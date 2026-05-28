const User = require('../models/User');
const { calculateBMI, calculateDailyCalories } = require('../utils/helpers');

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, age, gender, height, weight, targetWeight, activityLevel, fitnessGoal, dietaryPreference } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const dailyCalorieGoal = calculateDailyCalories(weight, height, age, gender, activityLevel, fitnessGoal);
    const dailyProteinGoal = Math.round(weight * 1.6); // 1.6g per kg bodyweight

    const user = await User.create({
      name, email, password, age, gender, height, weight, targetWeight,
      activityLevel, fitnessGoal, dietaryPreference,
      dailyCalorieGoal, dailyProteinGoal,
    });

    const token = user.getSignedJwtToken();
    const userData = await User.findById(user._id);

    res.status(201).json({ success: true, token, user: userData });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = user.getSignedJwtToken();
    const userData = await User.findById(user._id);

    res.json({ success: true, token, user: userData });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'age', 'gender', 'height', 'weight', 'targetWeight', 'activityLevel', 'fitnessGoal', 'dietaryPreference', 'dailyCalorieGoal', 'dailyProteinGoal', 'dailyWaterGoal'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (updates.weight && updates.height && updates.age && updates.gender && updates.activityLevel && updates.fitnessGoal) {
      updates.dailyCalorieGoal = calculateDailyCalories(updates.weight, updates.height, updates.age, updates.gender, updates.activityLevel, updates.fitnessGoal);
      updates.dailyProteinGoal = Math.round(updates.weight * 1.6);
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user with that email' });
    }
    // In production, send email with reset token
    res.json({ success: true, message: 'Password reset instructions sent to email' });
  } catch (error) {
    next(error);
  }
};
