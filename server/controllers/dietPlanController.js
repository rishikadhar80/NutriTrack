const DietPlan = require('../models/DietPlan');
const { generateDietPlan } = require('../services/dietService');

// @desc    Generate AI diet plan
// @route   POST /api/diet-plans/generate
exports.generatePlan = async (req, res, next) => {
  try {
    const userProfile = { ...req.user.toObject(), ...req.body };
    const aiPlan = await generateDietPlan(userProfile);

    res.json({ success: true, data: aiPlan });
  } catch (error) {
    next(error);
  }
};

// @desc    Save diet plan
// @route   POST /api/diet-plans
exports.savePlan = async (req, res, next) => {
  try {
    // Deactivate old plans
    await DietPlan.updateMany({ user: req.user.id, isActive: true }, { isActive: false });

    const plan = await DietPlan.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active diet plan
// @route   GET /api/diet-plans/active
exports.getActivePlan = async (req, res, next) => {
  try {
    const plan = await DietPlan.findOne({ user: req.user.id, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all diet plans
// @route   GET /api/diet-plans
exports.getPlans = async (req, res, next) => {
  try {
    const plans = await DietPlan.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
};
