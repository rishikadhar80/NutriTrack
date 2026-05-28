const { generateAIResponse } = require('./geminiService');

const assessRisks = async (userData) => {
  const { bmi, avgWater, avgProtein, avgSleep, avgCalories, activityLevel, weightTrend, dailyCalorieGoal, dailyProteinGoal, dailyWaterGoal } = userData;

  const prompt = `You are an AI health risk analyst. Analyze this health data and predict nutritional risks.

Health Data:
- BMI: ${bmi}
- Average Daily Water Intake: ${avgWater} glasses (Goal: ${dailyWaterGoal})
- Average Daily Protein: ${avgProtein}g (Goal: ${dailyProteinGoal}g)
- Average Daily Calories: ${avgCalories} kcal (Goal: ${dailyCalorieGoal})
- Average Sleep: ${avgSleep} hours
- Activity Level: ${activityLevel}
- Weight Trend: ${weightTrend}

Predict these 5 risks. Return ONLY valid JSON:
\`\`\`json
{
  "risks": [
    {
      "type": "dehydration",
      "level": "low",
      "score": 25,
      "reason": "Explanation of risk level",
      "recommendations": ["Drink more water", "Set reminders"],
      "suggestedFoods": ["Watermelon", "Cucumber"]
    },
    {
      "type": "protein_deficiency",
      "level": "medium",
      "score": 55,
      "reason": "Explanation",
      "recommendations": ["Increase protein intake"],
      "suggestedFoods": ["Chicken", "Lentils", "Greek Yogurt"]
    },
    {
      "type": "poor_recovery",
      "level": "low",
      "score": 30,
      "reason": "Explanation",
      "recommendations": ["Sleep more"],
      "suggestedFoods": ["Cherries", "Bananas"]
    },
    {
      "type": "obesity",
      "level": "low",
      "score": 20,
      "reason": "Explanation",
      "recommendations": ["Maintain current habits"],
      "suggestedFoods": []
    },
    {
      "type": "sedentary_lifestyle",
      "level": "medium",
      "score": 50,
      "reason": "Explanation",
      "recommendations": ["Walk 10000 steps daily"],
      "suggestedFoods": []
    }
  ],
  "overallRiskLevel": "medium",
  "aiAnalysis": "Overall health risk analysis paragraph"
}
\`\`\`
Be accurate based on BMI standards and nutritional science. Score 0-100 where higher means more risk.`;

  return await generateAIResponse(prompt);
};

module.exports = { assessRisks };
