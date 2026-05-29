import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('nutritrack_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nutritrack_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);

// Daily Logs
export const createDailyLog = (data) => API.post('/daily-logs', data);
export const getTodayLog = () => API.get('/daily-logs/today');
export const getDailyLogs = (params) => API.get('/daily-logs', { params });
export const getDailySummary = (params) => API.get('/daily-logs/summary', { params });

// Diet Plans
export const generateDietPlan = (data) => API.post('/diet-plans/generate', data);
export const saveDietPlan = (data) => API.post('/diet-plans', data);
export const getActiveDietPlan = () => API.get('/diet-plans/active');
export const getDietPlans = () => API.get('/diet-plans');

// Workouts
export const generateWorkout = (data) => API.post('/workouts/generate', data);
export const saveWorkout = (data) => API.post('/workouts', data);
export const getWorkouts = () => API.get('/workouts');
export const completeWorkout = (id) => API.put(`/workouts/${id}/complete`);

// Weekly Reports
export const generateWeeklyReport = () => API.post('/weekly-reports/generate');
export const getLatestReport = () => API.get('/weekly-reports/latest');
export const getWeeklyReports = () => API.get('/weekly-reports');

// Risk Assessment
export const generateRiskAssessment = () => API.post('/risk-assessment/generate');
export const getLatestRiskAssessment = () => API.get('/risk-assessment/latest');

// Chatbot
export const sendChatMessage = (message) => API.post('/chatbot', { message });

// Achievements
export const getAchievements = () => API.get('/achievements');

export default API;
