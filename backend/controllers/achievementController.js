const Achievement = require('../models/Achievement');

// @desc    Get user achievements
// @route   GET /api/achievements
exports.getAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find({ user: req.user.id }).sort({ unlockedAt: -1 });

    // All possible achievements
    const allAchievements = [
      { type: 'streak_7', title: '7 Day Warrior', description: 'Log 7 days in a row', icon: '🔥', category: 'streak' },
      { type: 'streak_30', title: '30 Day Champion', description: 'Log 30 days in a row', icon: '🏆', category: 'streak' },
      { type: 'hydration_master', title: 'Hydration Master', description: 'Drink 8+ glasses in a day', icon: '💧', category: 'hydration' },
      { type: 'workout_warrior', title: 'Workout Warrior', description: '60+ minutes workout', icon: '💪', category: 'workout' },
      { type: 'nutrition_pro', title: 'Nutrition Pro', description: 'Meet calorie goal 7 days', icon: '🥗', category: 'nutrition' },
      { type: 'early_bird', title: 'Early Bird', description: 'Log before 8 AM', icon: '🌅', category: 'general' },
      { type: 'protein_king', title: 'Protein King', description: 'Meet protein goal 5 days', icon: '🥩', category: 'nutrition' },
      { type: 'step_master', title: 'Step Master', description: '10,000+ steps in a day', icon: '👟', category: 'general' },
    ];

    const unlockedTypes = new Set(achievements.map(a => a.type));
    const result = allAchievements.map(a => ({
      ...a,
      unlocked: unlockedTypes.has(a.type),
      unlockedAt: achievements.find(ua => ua.type === a.type)?.unlockedAt,
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
