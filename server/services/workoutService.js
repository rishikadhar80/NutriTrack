const { generateAIResponse } = require('./geminiService');

const generateWorkoutPlan = async (params) => {
  const { goal, fitnessLevel, duration, equipment } = params;

  const goalMap = { fat_loss: 'fat loss and calorie burning', muscle_gain: 'muscle building and hypertrophy', endurance: 'cardiovascular endurance', general_fitness: 'overall fitness improvement' };
  const equipMap = { none: 'no equipment (bodyweight only)', dumbbells: 'dumbbells', resistance_bands: 'resistance bands', full_gym: 'full gym equipment' };

  const prompt = `You are an expert personal trainer. Create a ${duration}-minute workout plan.

Goal: ${goalMap[goal] || 'general fitness'}
Fitness Level: ${fitnessLevel}
Duration: ${duration} minutes
Equipment: ${equipMap[equipment] || 'no equipment'}

Return ONLY valid JSON:
\`\`\`json
{
  "warmup": [{"name": "Exercise Name", "sets": 1, "reps": "10", "duration": "2 min", "restTime": "30 sec"}],
  "mainWorkout": [{"name": "Exercise Name", "sets": 3, "reps": "12", "duration": "3 min", "restTime": "60 sec"}],
  "cooldown": [{"name": "Exercise Name", "sets": 1, "reps": "1", "duration": "2 min", "restTime": "0"}],
  "estimatedCaloriesBurned": 350,
  "aiNotes": "Brief workout tips and form reminders"
}
\`\`\`
Include 3-4 warmup exercises, 5-8 main exercises, and 3-4 cooldown stretches. Make it appropriate for the fitness level.`;

  return await generateAIResponse(prompt);
};

module.exports = { generateWorkoutPlan };
