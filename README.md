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

## Project Structure

```
NUTRITRACK/
├── frontend/          # React + Vite frontend application
├── backend/           # Node.js + Express backend server
├── README.md
└── .gitignore
```

## Prerequisites

- **Node.js** 18+
- **MongoDB** (local or Atlas cloud)
- **Google Gemini API** key
- **npm** or **yarn** package manager

---

## 🎨 Frontend Setup

The frontend is a React application using Vite for fast development and Tailwind CSS for styling.

### Installation

```bash
cd frontend
npm install
```

### Configuration

The frontend proxies API calls to the backend. Check `frontend/vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  }
}
```

### Running Development Server

```bash
cd frontend
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
cd frontend
npm run build
```

### Frontend Dependencies

- **React** 18.3 — UI library
- **Vite** 5.4 — Build tool & dev server
- **Tailwind CSS** 3.4 — Styling
- **React Router** 6.26 — Navigation
- **React Hook Form** 7.53 — Form handling
- **Recharts** 2.12 — Data visualization
- **React Icons** 5.3 — Icon library

---

## ⚙️ Backend Setup

The backend is a Node.js/Express server that handles authentication, data processing, and AI integrations.

### Installation

```bash
cd backend
npm install
```

### Configuration

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nutritrack-ai?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_secure_random_jwt_secret_key_here
JWT_EXPIRE=30d

# AI Services
GEMINI_API_KEY=your_google_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

**⚠️ Important:** If using MongoDB Atlas, ensure your IP is whitelisted in Network Access settings.

### Running Development Server

```bash
cd backend
npm run dev
```

The server will run on **http://localhost:5000**

### Running Production Server

```bash
cd backend
npm start
```

### Backend Dependencies

- **Express** 4.21 — Web framework
- **MongoDB & Mongoose** 8.6 — Database & ODM
- **JWT** 9.0 — Authentication
- **Bcryptjs** 2.4 — Password hashing
- **CORS** 2.8 — Cross-origin requests
- **Helmet** 7.1 — Security headers
- **Express Rate Limit** 7.4 — Request throttling
- **Groq SDK** 1.2 — AI API client
- **Google Generative AI** 0.24 — Gemini AI client

---

## 🚀 Running Both Frontend & Backend

### Terminal 1 — Backend Server

```bash
cd backend
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB Connected: ...
```

### Terminal 2 — Frontend Dev Server

```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v5.4.3  ready in 345 ms
  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser and start using NutriTrack AI!

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
