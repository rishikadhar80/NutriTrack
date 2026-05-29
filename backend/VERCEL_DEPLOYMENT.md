# NutriTrack Backend - Vercel Deployment Guide

## Prerequisites
- [Vercel CLI](https://vercel.com/docs/cli) installed: `npm install -g vercel`
- GitHub account with your repository pushed
- MongoDB URI (already configured)
- API keys (Groq, Google Generative AI)

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

4. **Deploy**:
   ```bash
   vercel --prod
   ```

5. **Set Environment Variables**:
   - When prompted, link to your Git repository
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project
   - Go to **Settings > Environment Variables**
   - Add these variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret key
     - `GROQ_API_KEY`: Your Groq API key
     - `FRONTEND_URL`: Your frontend deployment URL (e.g., `https://your-frontend.vercel.app`)
     - `NODE_ENV`: `production`

### Option 2: Deploy via GitHub Integration

1. **Push your code to GitHub**:
   ```bash
   git push origin main
   ```

2. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

3. **Click "Add New Project"**

4. **Import your Git repository**

5. **Configure Project Settings**:
   - Root Directory: `backend`
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)

6. **Add Environment Variables**:
   - Go to project settings → Environment Variables
   - Add all variables from `.env.example`

7. **Click "Deploy"**

## Environment Variables to Set in Vercel

| Variable | Value | Notes |
|----------|-------|-------|
| `MONGODB_URI` | Your MongoDB connection string | Keep from .env |
| `JWT_SECRET` | Your JWT secret (change in production!) | Strong, random string |
| `JWT_EXPIRE` | `30d` | Token expiration time |
| `GROQ_API_KEY` | Your Groq API key | From .env |
| `FRONTEND_URL` | Your frontend domain | e.g., `https://your-app.vercel.app` |
| `NODE_ENV` | `production` | Production mode |

## Testing Your Deployment

After deployment, test these endpoints:

1. **Health Check**:
   ```bash
   curl https://your-backend.vercel.app/api/health
   ```
   Expected response: `{"status":"OK","timestamp":"2026-05-29T...","message":"Backend is running!"}`

2. **Login (to verify database connection)**:
   ```bash
   curl -X POST https://your-backend.vercel.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

3. **Check CORS** (from frontend domain):
   ```bash
   curl -H "Origin: https://your-frontend.vercel.app" \
     https://your-backend.vercel.app/api/health
   ```

## Troubleshooting

### Build Errors
- Check that all dependencies are in `package.json`
- Run `npm install` locally to verify dependencies
- Check Vercel build logs in dashboard

### Database Connection Issues
- Verify `MONGODB_URI` is set correctly in environment variables
- Check MongoDB network access (IP whitelist may need updating)
- Ensure connection string is properly URL-encoded

### CORS Errors
- Add your frontend URL to `FRONTEND_URL` environment variable
- Verify frontend domain matches exactly (http vs https, www vs non-www)

### API Route Issues
- Ensure all route files exist and have proper exports
- Check middleware order in `api/index.js`
- Verify middleware doesn't have issues with async operations

### Rate Limiting Issues
- If getting "Too many requests" errors, the rate limit is working
- Default is 100 requests per 15 minutes
- Adjust in `api/index.js` if needed

## Monitoring

1. **Vercel Dashboard**: Monitor function invocations, logs, and performance
2. **Function Logs**: Go to Deployments → Click latest deployment → Logs
3. **Analytics**: Check usage and error rates

## Important Notes

⚠️ **Security**:
- Never commit `.env` file to Git
- Use `.vercelignore` to exclude unnecessary files
- Change JWT_SECRET in production
- Keep API keys secure in environment variables only

⚠️ **Database**:
- Ensure MongoDB cluster allows connections from Vercel IPs
- Consider adding Vercel IP ranges to MongoDB network access
- Monitor database connection limits

⚠️ **Cold Starts**:
- Serverless functions may have initial latency (~1-2s)
- Subsequent requests are faster
- Database connections are cached when possible

## Deployment Status

Your backend is now configured for Vercel deployment. The following files have been updated:

- ✅ `vercel.json` - Proper Vercel configuration
- ✅ `api/index.js` - Routes configured for Vercel serverless
- ✅ `.vercelignore` - Files excluded from deployment
- ✅ `.env` - Development environment variables set
- ✅ `.env.example` - Template for environment variables

## Next Steps

1. Ensure all environment variables are added to Vercel dashboard
2. Test the deployed API using the endpoints above
3. Update frontend `FRONTEND_URL` to point to your Vercel backend
4. Monitor logs and performance after deployment
