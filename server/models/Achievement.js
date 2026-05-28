const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  icon: String,
  unlockedAt: { type: Date, default: Date.now },
  category: { type: String, enum: ['hydration', 'workout', 'nutrition', 'streak', 'general'] },
}, { timestamps: true });

achievementSchema.index({ user: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Achievement', achievementSchema);
