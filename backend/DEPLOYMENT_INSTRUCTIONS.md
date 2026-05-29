# 🎯 NutriTrack Backend Vercel Deployment - Complete Setup

**Status**: ✅ **FULLY CONFIGURED AND READY TO DEPLOY**  
**Date**: May 29, 2026

---

## 📦 What Has Been Configured

Your backend is now fully set up for production deployment on Vercel! Here's what was done:

### 1. **Vercel Configuration** ✅
- `vercel.json` created with proper serverless settings
- Routes all requests to `/api/index.js` handler
- Uses Node.js runtime on Vercel

### 2. **API Handler Updated** ✅
- `api/index.js` routes adjusted for Vercel
- Removed `/api` prefix from route definitions (Vercel handles this)
- Express app properly exports for serverless execution

### 3. **Environment Setup** ✅
- `.env` file updated with all necessary variables
- `.vercelignore` created to exclude unnecessary files
- `.gitignore` updated to protect sensitive data
- `.env.example` created as template

### 4. **Deployment Scripts** ✅
- `npm run test` - Test before deploying
- `npm run deploy` - Automated deployment script
- `npm run deploy:prod` - Direct Vercel deployment

### 5. **Documentation** ✅
- `QUICK_START_DEPLOYMENT.md` - 30-second quick start
- `VERCEL_DEPLOYMENT.md` - Complete guide with troubleshooting
- `DEPLOYMENT_CHECKLIST.md` - Pre/post deployment checklist
- `DEPLOYMENT_STATUS.md` - Configuration status report

---

## 🚀 Deploy in 3 Simple Steps

### **Option A: Quickest Way (Using Script)** ⚡

```bash
cd backend
npm run deploy
```

This automated script will:
1. Check prerequisites
2. Verify configuration
3. Test your setup
4. Deploy to Vercel
5. Provide next steps

### **Option B: Manual Deployment** 📋

```bash
# 1. Install Vercel CLI (if not already installed)
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to production
cd backend
vercel --prod

# 4. Follow prompts and complete setup in dashboard
```

### **Option C: GitHub Integration** 🔄

1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your GitHub repository
5. Set root directory to `backend`
6. Add environment variables (see below)
7. Click Deploy

---

## ⚙️ Required Environment Variables

**Set these in Vercel Dashboard** (Settings → Environment Variables):

| Variable | Example Value | Required |
|----------|--------------|----------|
| `MONGODB_URI` | `mongodb+srv://user:pass@...` | ✅ Yes |
| `JWT_SECRET` | `your_strong_secret_key_here` | ✅ Yes |
| `JWT_EXPIRE` | `30d` | ✅ Yes |
| `GROQ_API_KEY` | `gsk_...` | ✅ Yes |
| `FRONTEND_URL` | `https://your-frontend.com` | ✅ Yes |
| `NODE_ENV` | `production` | ✅ Yes |

**Important**: After adding environment variables in Vercel, you must redeploy for them to take effect.

---

## 🧪 Test Your Deployment

### **Before Deploying** (Local Testing)
```bash
npm run test
```

### **After Deploying** (Test Endpoints)

Replace `your-domain` with your actual Vercel domain:

```bash
# 1. Health Check
curl https://your-domain.vercel.app/api/health

# Expected Response:
# {"status":"OK","timestamp":"2026-05-29T..."}

# 2. Test Authentication
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'

# 3. Test CORS (from frontend domain)
curl -H "Origin: https://your-frontend.com" \
  https://your-domain.vercel.app/api/health
```

---

## 📍 Your API Endpoints

After deployment, your API will be available at:

```
https://your-domain.vercel.app/api/

Routes:
├── POST   /api/auth/login
├── POST   /api/auth/signup
├── GET    /api/auth/me
├── GET    /api/daily-logs
├── POST   /api/daily-logs
├── GET    /api/diet-plans
├── POST   /api/diet-plans
├── GET    /api/workouts
├── POST   /api/workouts
├── GET    /api/weekly-reports
├── GET    /api/risk-assessment
├── GET    /api/chatbot
├── GET    /api/achievements
└── GET    /api/health (health check)
```

---

## 🔗 Update Frontend Configuration

Once your backend is deployed, update your frontend to use it:

### **For React/Vite Projects**
Create or update `.env.production`:
```
VITE_API_URL=https://your-backend-domain.vercel.app/api
```

Update your API service (`src/services/api.js` or similar):
```javascript
const API_URL = process.env.VITE_API_URL || 
  'https://your-backend-domain.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
```

### **In Your Components**
```javascript
import api from '../services/api';

// Use throughout your app
api.post('/auth/login', { email, password });
api.get('/daily-logs');
// etc.
```

---

## ✅ Deployment Checklist

Before hitting deploy, verify:

- [ ] All environment variables are correct
- [ ] MongoDB connection string is valid and accessible
- [ ] Vercel CLI is installed and you're logged in
- [ ] No sensitive data is hardcoded in the app
- [ ] `.env` file is in `.gitignore`
- [ ] All dependencies are in `package.json`
- [ ] Local tests pass (`npm run test`)

---

## 🎯 Expected Results

### ✅ Successful Deployment
- Backend URL: `https://your-domain.vercel.app`
- Health check returns 200 OK
- Database connects and works
- All API endpoints are functional
- Frontend can access the API
- No CORS errors

### ⚠️ If Something Goes Wrong
See detailed troubleshooting in:
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────┐
│         Frontend (Vercel/Other)        │
│      https://your-frontend.com         │
└──────────────────┬──────────────────────┘
                   │
                   │ HTTP Requests
                   ↓
┌─────────────────────────────────────────┐
│      Backend (Vercel Serverless)        │
│  https://your-domain.vercel.app/api     │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   Express.js App Handler        │   │
│  │   - Authentication              │   │
│  │   - Data Processing             │   │
│  │   - Business Logic              │   │
│  └─────────────────────────────────┘   │
└──────────────────┬──────────────────────┘
                   │
         ┌─────────┴─────────┐
         ↓                   ↓
    MongoDB Cloud        Groq API
    (Database)          (AI/LLM)
```

---

## 💡 Tips for Success

1. **Start with Quick Start**: Use `npm run deploy` for automated setup
2. **Monitor Logs**: Check Vercel dashboard for deployment logs
3. **Test Thoroughly**: Test all endpoints after deployment
4. **Environment Variables**: Double-check spelling in Vercel dashboard
5. **Database Access**: Ensure MongoDB allows Vercel IP ranges
6. **CORS Configuration**: Frontend URL must match exactly in FRONTEND_URL variable

---

## 🔐 Security Notes

✅ **Already Configured**:
- Environment variables not committed to git
- `.env` excluded from deployment
- HTTPS enforced by Vercel
- Security headers via Helmet.js
- Rate limiting enabled
- CORS restricted to frontend domain

⚠️ **For Production**:
- Use strong, unique JWT_SECRET
- Rotate keys periodically
- Monitor logs for suspicious activity
- Keep dependencies updated
- Review MongoDB access logs

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Test locally | `npm run test` |
| Deploy automatically | `npm run deploy` |
| Deploy manually | `vercel --prod` |
| View logs | Vercel Dashboard → Logs |
| Add env vars | Vercel Dashboard → Settings → Environment Variables |
| View deployments | Vercel Dashboard → Deployments |

---

## 🎉 You're All Set!

Your NutriTrack backend is configured and ready to deploy!

**Choose your deployment method above and get started!**

### Next Steps:
1. Run deployment command (Option A, B, or C)
2. Add environment variables in Vercel dashboard
3. Test your endpoints
4. Update frontend API URL
5. Deploy frontend
6. Test complete workflow

---

**Status**: ✅ **READY FOR PRODUCTION DEPLOYMENT**  
**Configuration Version**: 1.0  
**Last Updated**: May 29, 2026

For detailed information, see the comprehensive guides in the `backend/` directory.
