# NutriTrack Backend - Pre-Deployment Checklist

## ✅ Configuration & Setup Verification

### Code Configuration
- [ ] `vercel.json` exists and is properly configured
- [ ] `api/index.js` exports the Express app correctly
- [ ] `.vercelignore` file created to exclude unnecessary files
- [ ] `.gitignore` includes `.env` and sensitive files
- [ ] All routes in `api/index.js` don't have `/api` prefix (routes are adjusted for Vercel)

### Database
- [ ] MongoDB URI is valid and accessible
- [ ] MongoDB connection string is in `.env`
- [ ] MongoDB cluster allows connections from anywhere (or add Vercel IP ranges)
- [ ] Database migrations/initialization scripts are ready (if needed)

### Environment Variables
- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Secure JWT secret (change from default)
- [ ] `JWT_EXPIRE` - Token expiration time (e.g., "30d")
- [ ] `GROQ_API_KEY` - Valid Groq API key
- [ ] `FRONTEND_URL` - Frontend deployment URL (e.g., `https://yourdomain.com`)
- [ ] `NODE_ENV` - Set to "production"

### API Keys & Secrets
- [ ] Groq API key is valid and has sufficient quota
- [ ] JWT secret is strong (minimum 32 characters, random)
- [ ] All sensitive information is in environment variables (not hardcoded)
- [ ] API keys are not committed to Git

### Code Quality
- [ ] No console.log statements that expose sensitive information
- [ ] Error handling middleware is in place
- [ ] CORS configuration is correct for production
- [ ] Rate limiting is configured
- [ ] All dependencies are in `package.json`

## 📦 Dependencies Check

- [ ] Run `npm install` locally - all packages install successfully
- [ ] No missing dependencies errors
- [ ] No peer dependency warnings
- [ ] Node.js version is compatible (v14+)

## 🧪 Local Testing

Before deploying, verify locally:

```bash
# 1. Test health endpoint
curl http://localhost:5000/api/health

# 2. Test database connection
npm run test

# 3. Test environment variables are loaded
npm start
# Check console for "MongoDB Connected: ..."

# 4. Test each route manually
# - POST /api/auth/login
# - POST /api/auth/signup
# - GET /api/daily-logs
# - POST /api/diet-plans
# - etc.
```

- [ ] Server starts without errors
- [ ] Health check endpoint responds with 200 OK
- [ ] Database connection is established
- [ ] All routes are accessible
- [ ] Error handling works correctly

## 🚀 Vercel Deployment

### Pre-Deployment
- [ ] Vercel CLI is installed (`npm install -g vercel`)
- [ ] You are logged in to Vercel (`vercel login`)
- [ ] Git repository is set up and committed

### Deployment Methods (Choose One)

**Method 1: Vercel CLI**
```bash
cd backend
vercel --prod
```
- [ ] Deployment started successfully
- [ ] Project is linked to your Vercel account
- [ ] All environment variables set in Vercel dashboard

**Method 2: GitHub Integration**
- [ ] Repository pushed to GitHub
- [ ] Vercel connected to GitHub account
- [ ] Project created in Vercel dashboard
- [ ] Environment variables added in Vercel settings

### Post-Deployment Configuration
- [ ] Environment variables added to Vercel dashboard:
  - [ ] `MONGODB_URI`
  - [ ] `JWT_SECRET`
  - [ ] `JWT_EXPIRE`
  - [ ] `GROQ_API_KEY`
  - [ ] `FRONTEND_URL`
  - [ ] `NODE_ENV=production`

## ✨ Post-Deployment Testing

After deployment, test these endpoints:

### Basic Connectivity
```bash
# Health check
curl https://<your-backend-domain>.vercel.app/api/health
```
- [ ] Returns `{"status":"OK","timestamp":"..."}`
- [ ] Status code is 200

### Database Connectivity
```bash
# Test auth endpoint (will fail with invalid credentials, but tests DB)
curl -X POST https://<your-backend-domain>.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```
- [ ] Response is received (no timeout)
- [ ] Database query is processed

### CORS Testing
```bash
# From frontend domain
curl -H "Origin: https://<frontend-domain>" \
  https://<your-backend-domain>.vercel.app/api/health
```
- [ ] CORS headers are present
- [ ] Frontend can access the API

### Function Performance
- [ ] First request takes < 5 seconds (cold start)
- [ ] Subsequent requests are < 500ms
- [ ] No timeout errors
- [ ] Memory usage is acceptable

## 📊 Monitoring & Logs

After deployment:
- [ ] Check Vercel dashboard for deployment status
- [ ] Review function logs for errors
- [ ] Monitor API performance and error rates
- [ ] Set up alerts for failed deployments (optional)

## 🔐 Security Checklist

- [ ] No sensitive data in logs
- [ ] CORS is restricted to frontend domain only
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced
- [ ] JWT secret is strong and unique
- [ ] API keys are not exposed in code
- [ ] Error messages don't leak sensitive information
- [ ] Database credentials are in environment variables

## 🎯 Frontend Integration

After successful deployment:
- [ ] Update frontend API base URL to Vercel backend
- [ ] Test all frontend features work with deployed backend
- [ ] Verify authentication flow works
- [ ] Test all API endpoints from frontend
- [ ] Check browser console for CORS or other errors

## 📝 Documentation & Troubleshooting

- [ ] VERCEL_DEPLOYMENT.md is available for reference
- [ ] README.md includes deployment information
- [ ] Common issues and solutions are documented
- [ ] Team members know how to deploy

## Deployment Completion

Once all items are checked, your NutriTrack backend is ready for production!

```
Deployment Status: ✅ READY FOR PRODUCTION
```

**Deployed Endpoint**: `https://<your-domain>.vercel.app/api`
**Health Check**: `https://<your-domain>.vercel.app/api/health`

---

## Common Issues & Solutions

### Cold Starts are Slow
- Expected behavior for serverless functions
- First request may take 1-2 seconds
- Subsequent requests are much faster

### Database Connection Timeout
- Verify MongoDB IP whitelist includes Vercel ranges
- Check MONGODB_URI is correct and accessible
- Ensure database is not down or overloaded

### CORS Errors
- Verify FRONTEND_URL environment variable is set
- Ensure frontend domain matches exactly (http/https, www/non-www)
- Check CORS middleware in api/index.js

### 404 Not Found on Routes
- Routes should NOT have `/api` prefix in api/index.js
- Vercel routes to `/api/index.js`, so routes are accessed as `/auth`, `/daily-logs`, etc.
- API URL from frontend should be `https://your-domain/api/`

### Environment Variables Not Loaded
- Verify variables are added to Vercel dashboard, not just local .env
- Redeploy after adding environment variables
- Check that variable names match exactly
