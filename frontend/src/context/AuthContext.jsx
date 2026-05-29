import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe, updateProfile as updateProfileAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('nutritrack_token'));

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const { data } = await getMe();
      setUser(data.user);
    } catch {
      localStorage.removeItem('nutritrack_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const { data } = await loginUser(credentials);
    localStorage.setItem('nutritrack_token', data.token);
    setToken(data.token);
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.name}!`);
    return data;
  };

  const register = async (userData) => {
    try {
      const { data } = await registerUser(userData);
      localStorage.setItem('nutritrack_token', data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success('Account created successfully!');
      return data;
    } catch (error) {
      console.error('Register error details:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('nutritrack_token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (updates) => {
    const { data } = await updateProfileAPI(updates);
    setUser(data.user);
    toast.success('Profile updated!');
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, login, register, logout, updateProfile, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
