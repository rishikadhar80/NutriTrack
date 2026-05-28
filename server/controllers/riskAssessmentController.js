const RiskAssessment = require('../models/RiskAssessment');
const DailyLog = require('../models/DailyLog');
const { assessRisks } = require('../services/riskService');
const { calculateBMI } = require('../utils/helpers');

// @desc    Generate risk assessment
// @route   POST /api/risk-assessment/generate
exports.generateAssessment = async (req, res, next) => {
  try {
    const startDate = new Date(); startDate.setDate(startDate.getDate() - 14); startDate.setHours(0, 0, 0, 0);
    const logs = await DailyLog.find({ user: req.user.id, date: { $gte: startDate } });

    const bmi = calculateBMI(req.user.weight, req.user.height);

    const avgData = logs.length > 0 ? {
      avgWater: Math.round(logs.reduce((s, l) => s + (l.water || 0), 0) / logs.length),
      avgProtein: Math.round(logs.reduce((s, l) => s + (l.protein || 0), 0) / logs.length),
      avgSleep: parseFloat((logs.reduce((s, l) => s + (l.sleepHours || 0), 0) / logs.length).toFixed(1)),
      avgCalories: Math.round(logs.reduce((s, l) => s + (l.calories || 0), 0) / logs.length),
    } : { avgWater: 3, avgProtein: 30, avgSleep: 5, avgCalories: 1500 };

    const weights = logs.filter(l => l.weight).map(l => l.weight);
    const weightTrend = weights.length >= 2 ? (weights[weights.length - 1] > weights[0] ? 'increasing' : weights[weights.length - 1] < weights[0] ? 'decreasing' : 'stable') : 'stable';

    const userData = {
      bmi,
      ...avgData,
      activityLevel: req.user.activityLevel,
      weightTrend,
      dailyCalorieGoal: req.user.dailyCalorieGoal,
      dailyProteinGoal: req.user.dailyProteinGoal,
      dailyWaterGoal: req.user.dailyWaterGoal,
    };

    const aiResult = await assessRisks(userData);

    const assessment = await RiskAssessment.create({
      user: req.user.id,
      bmi,
      ...aiResult,
    });

    res.json({ success: true, data: assessment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get latest assessment
// @route   GET /api/risk-assessment/latest
exports.getLatestAssessment = async (req, res, next) => {
  try {
    const assessment = await RiskAssessment.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: assessment });
  } catch (error) {
    next(error);
  }
};
