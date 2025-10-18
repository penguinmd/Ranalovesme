# RanaLovesMe Deployment Guide

## Recommended: Vercel (Frontend) + Railway (Backend)

### Prerequisites
- GitHub account
- Your code pushed to GitHub
- Vercel account (free)
- Railway account (free)

---

## Part 1: Deploy Backend to Railway

### Step 1: Prepare Backend
Create `railway.json` in backend directory:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Step 2: Deploy to Railway
1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your RanaLovesMe repository
5. Select the `backend` directory as root
6. Railway will auto-detect Node.js

### Step 3: Configure Environment Variables
In Railway dashboard, add these variables:
```
NODE_ENV=production
JWT_SECRET=your-super-secret-random-string-here-change-me
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
MAX_FILE_SIZE=10485760
UPLOADS_DIR=uploads
ALLOWED_ORIGINS=https://your-app-name.vercel.app
PORT=3001
```

**Generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Get Your Railway URL
After deployment, Railway will give you a URL like:
`https://your-app.up.railway.app`

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Frontend API URL
In `frontend/src/lib/api.ts`, update the baseURL:
```typescript
const API_BASE_URL = import.meta.env.PROD
  ? 'https://your-backend.up.railway.app/api'
  : 'http://localhost:3001/api';
```

### Step 2: Create Vercel Config
Create `vercel.json` in frontend directory:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 3: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? ranalovesme (or your choice)
# - Directory? ./ (current)
# - Override settings? No

# After first deploy, for production:
vercel --prod
```

Or deploy via Vercel Dashboard:
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Output Directory: dist
5. Click "Deploy"

### Step 4: Update Railway ALLOWED_ORIGINS
Go back to Railway and update:
```
ALLOWED_ORIGINS=https://your-app-name.vercel.app
```

---

## Part 3: Testing Your Deployment

### Test Backend
```bash
curl https://your-backend.up.railway.app/api/health
# Should return: {"status":"ok","message":"Server is running"}
```

### Test Frontend
1. Visit your Vercel URL: `https://your-app-name.vercel.app`
2. Try to register a new user
3. Login
4. Test creating a day, place, photo, etc.

---

## Automatic Deployments

Both Vercel and Railway will automatically redeploy when you push to GitHub!

Just commit and push:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

---

## Alternative: DigitalOcean App Platform

### Step 1: Create App
1. Go to DigitalOcean → App Platform
2. Connect GitHub repository
3. Select your repo and branch

### Step 2: Configure Components

**Backend Service:**
- Name: ranalovesme-api
- Source: backend/
- Build Command: `npm install`
- Run Command: `npm start`
- HTTP Port: 3001
- Environment Variables: (same as Railway above)
- Plan: Basic ($5/month)

**Frontend Static Site:**
- Name: ranalovesme-frontend
- Source: frontend/
- Build Command: `npm run build`
- Output Directory: dist
- Plan: Free

### Step 3: Deploy
Click "Create Resources" and wait for deployment!

---

## Alternative: Render

### Backend
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Configure:
   - Name: ranalovesme-api
   - Root Directory: backend
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free or Starter ($7/month)
5. Add environment variables

### Frontend
1. New → Static Site
2. Configure:
   - Name: ranalovesme-frontend
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Publish Directory: dist
3. Deploy

---

## Database Considerations

### Current Setup (File-based SQLite)
Your app currently uses a file-based SQLite database. This works but:
- ⚠️ Data can be lost if server restarts (on some platforms)
- ⚠️ No automatic backups
- ⚠️ Doesn't scale to multiple servers

### Solutions:

**Option 1: Use Railway Volumes (Recommended)**
In Railway, add a persistent volume:
1. Go to your service settings
2. Add Volume
3. Mount path: `/app/data`
4. This persists your SQLite database across deploys

**Option 2: Upgrade to PostgreSQL**
For production, consider migrating to PostgreSQL:
- Railway offers PostgreSQL (free tier available)
- More reliable and scalable
- Would require updating your backend code

---

## Cost Summary

### Vercel + Railway (Recommended)
- Frontend: **Free**
- Backend: **Free** (with $5 monthly credit, ~$5-10 after)
- Total: **Free to start, ~$5-10/month** after free credits

### DigitalOcean App Platform
- Frontend: **Free**
- Backend: **$5/month**
- Total: **$5/month**

### Render
- Frontend: **Free**
- Backend: **Free** (sleeps) or **$7/month** (always on)
- Total: **Free or $7/month**

---

## Troubleshooting

### CORS Errors
Make sure `ALLOWED_ORIGINS` in backend includes your frontend URL without trailing slash:
```
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Database Not Persisting
Add a volume in Railway or use PostgreSQL

### Build Failures
Check build logs in platform dashboard, usually missing dependencies or environment variables

### 404 on Frontend Routes
Make sure `vercel.json` rewrites are configured for SPA routing

---

## Next Steps After Deployment

1. ✅ Set up custom domain (optional)
2. ✅ Enable automatic deployments
3. ✅ Set up monitoring/alerts
4. ✅ Add backup strategy for database
5. ✅ Consider PostgreSQL migration for production
6. ✅ Set up CI/CD for tests

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- DigitalOcean Docs: https://docs.digitalocean.com/products/app-platform
- Render Docs: https://render.com/docs
