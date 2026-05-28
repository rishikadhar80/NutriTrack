const { generateAIResponse } = require('./geminiService');

const generateDietPlan = async (userProfile) => {
  const { age, height, weight, fitnessGoal, activityLevel, dietaryPreference, gender } = userProfile;

  const goalMap = { weight_loss: 'lose weight', weight_gain: 'gain weight', muscle_gain: 'build muscle', maintenance: 'maintain current weight' };
  const activityMap = { sedentary: 'sedentary (little or no exercise)', light: 'lightly active (1-3 days/week)', moderate: 'moderately active (3-5 days/week)', active: 'very active (6-7 days/week)', very_active: 'extra active (very hard exercise)' };
  const dietMap = { vegetarian: 'vegetarian', vegan: 'vegan', non_vegetarian: 'non-vegetarian (includes meat, fish, eggs)' };

  const prompt = `You are an expert nutritionist. Generate a personalized daily diet plan for a person with these details:
- Age: ${age} years
- Gender: ${gender}
- Height: ${height} cm
- Weight: ${weight} kg
- Goal: ${goalMap[fitnessGoal] || 'maintain weight'}
- Activity Level: ${activityMap[activityLevel] || 'moderate'}
- Dietary Preference: ${dietMap[dietaryPreference] || 'non-vegetarian'}

Return ONLY valid JSON in this exact format:
\`\`\`json
{
  "dailyCalories": 2000,
  "dailyProtein": 80,
  "dailyCarbs": 250,
  "dailyFat": 65,
  "breakfast": {
    "name": "Breakfast",
    "items": [{"name": "food item", "quantity": "amount", "calories": 200, "protein": 10, "carbs": 30, "fat": 5}],
    "totalCalories": 400, "totalProtein": 20, "totalCarbs": 50, "totalFat": 12
  },
  "lunch": {
    "name": "Lunch",
    "items": [{"name": "food item", "quantity": "amount", "calories": 200, "protein": 10, "carbs": 30, "fat": 5}],
    "totalCalories": 600, "totalProtein": 30, "totalCarbs": 70, "totalFat": 20
  },
  "dinner": {
    "name": "Dinner",
    "items": [{"name": "food item", "quantity": "amount", "calories": 200, "protein": 10, "carbs": 30, "fat": 5}],
    "totalCalories": 500, "totalProtein": 25, "totalCarbs": 60, "totalFat": 18
  },
  "snacks": {
    "name": "Snacks",
    "items": [{"name": "food item", "quantity": "amount", "calories": 100, "protein": 5, "carbs": 15, "fat": 3}],
    "totalCalories": 300, "totalProtein": 10, "totalCarbs": 35, "totalFat": 10
  },
  "aiNotes": "Brief personalized nutrition advice"
}
\`\`\`
Make meals realistic, varied, and culturally diverse. Include 3-5 items per meal.`;

  return await generateAIResponse(prompt);
};

module.exports = { generateDietPlan };
