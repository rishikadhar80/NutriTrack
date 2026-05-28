require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:5173', credentials: true }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests, please try again later.' });
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/daily-logs', require('./routes/dailyLog'));
app.use('/api/diet-plans', require('./routes/dietPlan'));
app.use('/api/workouts', require('./routes/workout'));
app.use('/api/weekly-reports', require('./routes/weeklyReport'));
app.use('/api/risk-assessment', require('./routes/riskAssessment'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/achievements', require('./routes/achievements'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// Error handling middleware
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
