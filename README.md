# NutriTrack AI 🥗🤖

A modern AI-powered fitness and nutrition tracking platform built with React, Node.js, MongoDB, and Google Gemini AI.

## Features

- **AI Diet Planner** — Personalized diet plans powered by Gemini AI
- **AI Workout Generator** — Custom workout plans based on your goals
- **AI Weekly Health Reports** — Comprehensive health analysis with scores
- **AI Risk Predictor** — Nutritional risk assessment and prevention
- **AI Health Chatbot** — Ask health and nutrition questions
- **Daily Tracker** — Track calories, protein, water, sleep, steps & more
- **Gamification** — Achievements, streaks, and badges
- **Dark/Light Mode** — Beautiful glassmorphism UI
- **Fully Responsive** — Mobile, tablet, and desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT |
| Charts | Recharts |
| AI | Google Gemini API |
| Icons | React Icons |
| State | Context API |
| Forms | React Hook Form |

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Edit `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nutritrack-ai
JWT_SECRET=your_secure_random_string_here
JWT_EXPIRE=30d
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run

```bash
# Terminal 1 — Server
cd server
npm run dev

# Terminal 2 — Client
cd client
npm run dev
```

Open http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/profile | Update profile |
| POST | /api/daily-logs | Create/update log |
| GET | /api/daily-logs/today | Get today's log |
| POST | /api/diet-plans/generate | Generate AI diet plan |
| POST | /api/workouts/generate | Generate AI workout |
| POST | /api/weekly-reports/generate | Generate weekly report |
| POST | /api/risk-assessment/generate | Run risk assessment |
| POST | /api/chatbot | Chat with AI |
| GET | /api/achievements | Get achievements |
