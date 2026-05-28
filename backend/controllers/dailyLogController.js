const DailyLog = require('../models/DailyLog');
const User = require('../models/User');
const Achievement = require('../models/Achievement');

// @desc    Create or update daily log
// @route   POST /api/daily-logs
exports.createOrUpdateLog = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let log = await DailyLog.findOne({ user: req.user.id, date: { $gte: today, $lt: new Date(today.getTime() + 86400000) } });

    if (log) {
      Object.assign(log, req.body);
      await log.save();
    } else {
      log = await DailyLog.create({ ...req.body, user: req.user.id, date: today });

      // Update streak
      const user = await User.findById(req.user.id);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (user.lastLogDate && user.lastLogDate.toDateString() === yesterday.toDateString()) {
        user.streakCount += 1;
      } else if (!user.lastLogDate || user.lastLogDate.toDateString() !== today.toDateString()) {
        user.streakCount = 1;
      }
      user.lastLogDate = today;
      await user.save();

      // Check achievements
      await checkAchievements(req.user.id, user.streakCount, log);
    }

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

// @desc    Get today's log
// @route   GET /api/daily-logs/today
exports.getTodayLog = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const log = await DailyLog.findOne({ user: req.user.id, date: { $gte: today, $lt: new Date(today.getTime() + 86400000) } });
    res.json({ success: true, data: log || {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logs by date range
// @route   GET /api/daily-logs?start=DATE&end=DATE
exports.getLogs = async (req, res, next) => {
  try {
    const { start, end, period } = req.query;
    let startDate, endDate;

    if (period === 'week') {
      endDate = new Date(); endDate.setHours(23, 59, 59, 999);
      startDate = new Date(); startDate.setDate(startDate.getDate() - 7); startDate.setHours(0, 0, 0, 0);
    } else if (period === 'month') {
      endDate = new Date(); endDate.setHours(23, 59, 59, 999);
      startDate = new Date(); startDate.setDate(startDate.getDate() - 30); startDate.setHours(0, 0, 0, 0);
    } else {
      startDate = start ? new Date(start) : new Date(Date.now() - 7 * 86400000);
      endDate = end ? new Date(end) : new Date();
    }

    const logs = await DailyLog.find({ user: req.user.id, date: { $gte: startDate, $lte: endDate } }).sort({ date: 1 });
    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get summary
// @route   GET /api/daily-logs/summary
exports.getSummary = async (req, res, next) => {
  try {
    const { period } = req.query;
    let days = period === 'month' ? 30 : period === 'week' ? 7 : 1;
    const startDate = new Date(); startDate.setDate(startDate.getDate() - days); startDate.setHours(0, 0, 0, 0);

    const logs = await DailyLog.find({ user: req.user.id, date: { $gte: startDate } });

    if (logs.length === 0) {
      return res.json({ success: true, data: { avgCalories: 0, avgProtein: 0, avgWater: 0, avgSleep: 0, avgSteps: 0, totalWorkoutMinutes: 0, totalLogs: 0 } });
    }

    const summary = {
      avgCalories: Math.round(logs.reduce((sum, l) => sum + (l.calories || 0), 0) / logs.length),
      avgProtein: Math.round(logs.reduce((sum, l) => sum + (l.protein || 0), 0) / logs.length),
      avgWater: Math.round(logs.reduce((sum, l) => sum + (l.water || 0), 0) / logs.length),
      avgSleep: parseFloat((logs.reduce((sum, l) => sum + (l.sleepHours || 0), 0) / logs.length).toFixed(1)),
      avgSteps: Math.round(logs.reduce((sum, l) => sum + (l.steps || 0), 0) / logs.length),
      totalWorkoutMinutes: logs.reduce((sum, l) => sum + (l.workoutMinutes || 0), 0),
      totalLogs: logs.length,
    };

    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

async function checkAchievements(userId, streak, log) {
  const achievements = [];

  if (streak >= 7) achievements.push({ type: 'streak_7', title: '7 Day Warrior', description: 'Logged 7 days in a row!', icon: '🔥', category: 'streak' });
  if (streak >= 30) achievements.push({ type: 'streak_30', title: '30 Day Champion', description: 'Logged 30 days in a row!', icon: '🏆', category: 'streak' });
  if (log.water >= 8) achievements.push({ type: 'hydration_master', title: 'Hydration Master', description: 'Drank 8+ glasses in a day!', icon: '💧', category: 'hydration' });
  if (log.workoutMinutes >= 60) achievements.push({ type: 'workout_warrior', title: 'Workout Warrior', description: '60+ minutes workout!', icon: '💪', category: 'workout' });

  for (const ach of achievements) {
    try {
      await Achievement.findOneAndUpdate({ user: userId, type: ach.type }, { ...ach, user: userId }, { upsert: true, new: true });
    } catch (e) { /* ignore duplicates */ }
  }
}
