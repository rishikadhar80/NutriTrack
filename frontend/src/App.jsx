import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import DailyTracker from './pages/DailyTracker';
import DietPlanner from './pages/DietPlanner';
import WorkoutGenerator from './pages/WorkoutGenerator';
import WeeklyReport from './pages/WeeklyReport';
import RiskPredictor from './pages/RiskPredictor';
import Chatbot from './pages/Chatbot';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';

function App() {
  const { user, loading } = useAuth();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0,0,0,0.05)',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
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

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
      </Routes>
    </>
  );
}

export default App;
