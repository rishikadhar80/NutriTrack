import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [reminders, setReminders] = useState({
    water: { enabled: true, interval: 60 }, // minutes
    workout: { enabled: true, time: '08:00' },
    sleep: { enabled: true, time: '22:00' },
    logging: { enabled: true, time: '20:00' },
  });

  const sendReminder = useCallback((type, message) => {
    toast(message, { icon: type === 'water' ? '💧' : type === 'workout' ? '💪' : type === 'sleep' ? '😴' : '📝', duration: 5000 });
  }, []);

  useEffect(() => {
    if (!reminders.water.enabled) return;
    const interval = setInterval(() => {
      sendReminder('water', 'Time to drink water! Stay hydrated 💧');
    }, reminders.water.interval * 60 * 1000);
    return () => clearInterval(interval);
  }, [reminders.water, sendReminder]);

  const updateReminder = (type, updates) => {
    setReminders(prev => ({ ...prev, [type]: { ...prev[type], ...updates } }));
  };

  return (
    <NotificationContext.Provider value={{ reminders, updateReminder, sendReminder }}>
      {children}
    </NotificationContext.Provider>
  );
};
