const { generateAIResponse } = require('./geminiService');

const generateWeeklyReport = async (weeklyData, userProfile) => {
  const prompt = `You are an AI health analyst. Analyze this weekly health data and generate a comprehensive report.

User Profile:
- Age: ${userProfile.age}, Gender: ${userProfile.gender}
- Height: ${userProfile.height}cm, Weight: ${userProfile.weight}kg
- Goal: ${userProfile.fitnessGoal}
- Daily Calorie Goal: ${userProfile.dailyCalorieGoal}
- Daily Protein Goal: ${userProfile.dailyProteinGoal}
- Daily Water Goal: ${userProfile.dailyWaterGoal} glasses

Weekly Data:
${JSON.stringify(weeklyData, null, 2)}

Return ONLY valid JSON:
\`\`\`json
{
  "nutritionScore": 75,
  "hydrationScore": 80,
  "sleepScore": 65,
  "fitnessScore": 70,
  "overallScore": 72,
  "strengths": ["Consistent hydration", "Good workout frequency"],
  "weaknesses": ["Low protein intake", "Irregular sleep schedule"],
  "recommendations": ["Increase protein by 20g daily", "Aim for 7-8 hours sleep", "Add more vegetables"],
  "aiAnalysis": "Detailed paragraph analyzing overall weekly health performance with specific actionable insights."
}
\`\`\`
Be specific and actionable. Scores should reflect actual data quality vs goals.`;

  return await generateAIResponse(prompt);
};

module.exports = { generateWeeklyReport };
