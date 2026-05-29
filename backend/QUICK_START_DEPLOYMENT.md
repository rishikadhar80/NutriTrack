# 🚀 Quick Start: Deploy NutriTrack Backend to Vercel

## 📋 What's Been Configured

Your backend is now ready for Vercel deployment! Here's what has been set up:

✅ **vercel.json** - Proper Vercel serverless configuration  
✅ **api/index.js** - Routes adjusted for Vercel serverless environment  
✅ **.vercelignore** - Files excluded from deployment  
✅ **.env** - Development environment variables  
✅ **package.json** - Deploy and test scripts added  
✅ **Deployment guides** - Comprehensive documentation

## 🏃 Quick Deploy (30 seconds)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
From the backend directory:
```bash
cd backend
vercel --prod
```

### Step 4: Set Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your project
3. Go to **Settings > Environment Variables**
4. Add these variables:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Your JWT secret key |
| `JWT_EXPIRE` | `30d` |
| `GROQ_API_KEY` | Your Groq API key |
| `FRONTEND_URL` | Your frontend URL (e.g., `https://your-app.vercel.app`) |
| `NODE_ENV` | `production` |

### Step 5: Test Your Deployment
```bash
# Your backend URL will be shown in Vercel after deployment
curl https://your-backend-domain.vercel.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-05-29T..."
}
```

## 🧪 Test Before Deploying (Optional)

```bash
# Test endpoints locally
npm run test

# Or run specific tests
node test-deployment.js
```

## 📖 Detailed Guides

- **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** - Complete deployment guide with troubleshooting
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Pre and post-deployment checklist

## ⚡ Using Deployment Script (Automated)

Instead of manual steps, you can use the automated deployment script:

```bash
npm run deploy
```

This script will:
1. Check prerequisites (npm, Vercel CLI, authentication)
2. Verify all configuration files
3. Check environment variables
4. Install dependencies
5. Run pre-deployment tests
6. Deploy to Vercel
7. Provide post-deployment instructions

## 🔗 Update Frontend

After deployment, update your frontend API URL:

### React (src/services/api.js or similar)
```javascript
const API_URL = process.env.REACT_APP_API_URL || 
  'https://your-backend-domain.vercel.app/api';
```

### Vite (.env.production)
```
VITE_API_URL=https://your-backend-domain.vercel.app/api
```

## ✅ Verify Deployment Works

Test each major endpoint:

```bash
# 1. Health check
curl https://your-domain.vercel.app/api/health

# 2. Signup (replace with test email)
curl -X POST https://your-domain.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"testpass123"}'

# 3. Login
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

## 🚨 Troubleshooting

### Issue: "Database connection timeout"
**Solution**: Ensure MongoDB cluster allows connections from Vercel IPs or set to allow all IPs (0.0.0.0/0)

### Issue: "CORS error from frontend"
**Solution**: Add your frontend URL to `FRONTEND_URL` environment variable in Vercel dashboard

### Issue: "Environment variables not loaded"
**Solution**: Ensure you set them in Vercel dashboard (not just local .env), then redeploy

### Issue: "Routes return 404"
**Solution**: Routes in api/index.js should NOT have `/api` prefix. They should be:
- ✅ `/auth` (not `/api/auth`)
- ✅ `/daily-logs` (not `/api/daily-logs`)

## 📞 Need Help?

1. Check [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed guides
2. See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for comprehensive checks
3. Review Vercel logs: Dashboard → Deployments → Click latest → Logs
4. Check server logs: `vercel logs https://your-domain.vercel.app`

## 🎉 Success!

Once deployed and tested:
- Backend API is live on Vercel
- Database is connected and working
- All endpoints are accessible
- Frontend can communicate with backend

Your NutriTrack app is ready for production! 🚀

---

**Current Status**: ✅ Ready for Deployment  
**Last Updated**: May 29, 2026  
**Backend Configuration**: Vercel Serverless
