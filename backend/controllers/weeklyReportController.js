const WeeklyReport = require('../models/WeeklyReport');
const DailyLog = require('../models/DailyLog');
const { generateWeeklyReport } = require('../services/reportService');

// @desc    Generate weekly report
// @route   POST /api/weekly-reports/generate
exports.generateReport = async (req, res, next) => {
  try {
    const endDate = new Date(); endDate.setHours(23, 59, 59, 999);
    const startDate = new Date(); startDate.setDate(startDate.getDate() - 7); startDate.setHours(0, 0, 0, 0);

    const logs = await DailyLog.find({ user: req.user.id, date: { $gte: startDate, $lte: endDate } }).sort({ date: 1 });

    if (logs.length === 0) {
      return res.status(400).json({ success: false, message: 'No data available for the past week. Please log your daily activities first.' });
    }

    const weeklyData = {
      totalDays: logs.length,
      dailyData: logs.map(l => ({
        date: l.date, calories: l.calories, protein: l.protein, water: l.water,
        sleep: l.sleepHours, steps: l.steps, workoutMinutes: l.workoutMinutes,
      })),
      averages: {
        calories: Math.round(logs.reduce((s, l) => s + (l.calories || 0), 0) / logs.length),
        protein: Math.round(logs.reduce((s, l) => s + (l.protein || 0), 0) / logs.length),
        water: Math.round(logs.reduce((s, l) => s + (l.water || 0), 0) / logs.length),
        sleep: parseFloat((logs.reduce((s, l) => s + (l.sleepHours || 0), 0) / logs.length).toFixed(1)),
        steps: Math.round(logs.reduce((s, l) => s + (l.steps || 0), 0) / logs.length),
      },
      totalWorkoutMinutes: logs.reduce((s, l) => s + (l.workoutMinutes || 0), 0),
    };

    const aiReport = await generateWeeklyReport(weeklyData, req.user);

    const report = await WeeklyReport.create({
      user: req.user.id,
      weekStart: startDate,
      weekEnd: endDate,
      avgCalories: weeklyData.averages.calories,
      avgProtein: weeklyData.averages.protein,
      avgWater: weeklyData.averages.water,
      avgSleep: weeklyData.averages.sleep,
      avgSteps: weeklyData.averages.steps,
      totalWorkoutMinutes: weeklyData.totalWorkoutMinutes,
      dailyData: weeklyData.dailyData,
      ...aiReport,
    });

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

// @desc    Get latest report
// @route   GET /api/weekly-reports/latest
exports.getLatestReport = async (req, res, next) => {
  try {
    const report = await WeeklyReport.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports
// @route   GET /api/weekly-reports
exports.getReports = async (req, res, next) => {
  try {
    const reports = await WeeklyReport.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(12);
    res.json({ success: true, data: reports });
  } catch (error) {
    next(error);
  }
};
