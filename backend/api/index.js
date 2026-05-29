require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('../config/db');

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ 
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.FRONTEND_URL || 'https://yourdomain.com')
    : 'http://localhost:5173', 
  credentials: true 
}));

// Rate limiting
const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests, please try again later.' 
});
app.use('/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));

// Routes (Remove /api prefix - Vercel routes to /api/index.js so root becomes /api)
app.use('/auth', require('../routes/auth'));
app.use('/daily-logs', require('../routes/dailyLog'));
app.use('/diet-plans', require('../routes/dietPlan'));
app.use('/workouts', require('../routes/workout'));
app.use('/weekly-reports', require('../routes/weeklyReport'));
app.use('/risk-assessment', require('../routes/riskAssessment'));
app.use('/chatbot', require('../routes/chatbot'));
app.use('/achievements', require('../routes/achievements'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// Error handling middleware
app.use(require('../middleware/errorHandler'));

module.exports = app;