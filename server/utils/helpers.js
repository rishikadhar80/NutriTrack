const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

const getBMICategory = (bmi) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

const calculateDailyCalories = (weight, height, age, gender, activityLevel, goal) => {
  // Mifflin-St Jeor Equation
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const activityMultipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
  let tdee = bmr * (activityMultipliers[activityLevel] || 1.55);

  const goalAdjustments = { weight_loss: -500, weight_gain: 500, muscle_gain: 300, maintenance: 0 };
  tdee += goalAdjustments[goal] || 0;

  return Math.round(tdee);
};

module.exports = { calculateBMI, getBMICategory, calculateDailyCalories };
