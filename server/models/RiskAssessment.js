const mongoose = require('mongoose');

const riskSchema = new mongoose.Schema({
  type: { type: String, enum: ['dehydration', 'protein_deficiency', 'poor_recovery', 'obesity', 'sedentary_lifestyle'] },
  level: { type: String, enum: ['low', 'medium', 'high'] },
  score: { type: Number, min: 0, max: 100 },
  reason: String,
  recommendations: [String],
  suggestedFoods: [String],
});

const riskAssessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  bmi: Number,
  risks: [riskSchema],
  overallRiskLevel: { type: String, enum: ['low', 'medium', 'high'] },
  aiAnalysis: String,
}, { timestamps: true });

module.exports = mongoose.model('RiskAssessment', riskAssessmentSchema);
