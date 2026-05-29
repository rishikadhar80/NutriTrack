import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import DailyTracker from './pages/DailyTracker';
import DietPlanner from './pages/DietPlanner';
import WorkoutGenerator from './pages/WorkoutGenerator';
import WeeklyReport from './pages/WeeklyReport';
import RiskPredictor from './pages/RiskPredictor';
import Chatbot from './pages/Chatbot';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tracker" element={<DailyTracker />} />
          <Route path="/diet-planner" element={<DietPlanner />} />
          <Route path="/workout" element={<WorkoutGenerator />} />
          <Route path="/weekly-report" element={<WeeklyReport />} />
          <Route path="/risk-predictor" element={<RiskPredictor />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </>
  );
};

export default App;
