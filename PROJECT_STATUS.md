# RanaLovesMe - Project Status

**Last Updated:** January 19, 2025

## Overview

RanaLovesMe is a relationship memory tracker app that has been successfully migrated from Railway (backend) + Vercel (frontend) to a fully Vercel-hosted solution with Vercel Postgres and Blob storage.

## Current Deployment

**Live URL:** https://frontend-pi-five-87.vercel.app

**Vercel Project Name:** `frontend`

**Repository:** https://github.com/penguinmd/Ranalovesme

## What's Working ✅

### Infrastructure
- ✅ **Vercel Postgres Database** - Successfully created and connected (`ranalovesme-db`)
- ✅ **Vercel Blob Storage** - Successfully created and connected for photo storage
- ✅ **Database Schema** - All tables initialized (users, days_together, photos, places, music, activities, day_photos, place_photos)
- ✅ **Default Users Created** - Rana and Mark accounts created with password: `Gentoo12mdr!`

### API Endpoints Working
- ✅ `/api/init` - Database initialization (one-time setup, already completed)
- ✅ `/api/debug` - Environment variable verification
- ✅ `/api/auth/login` - User authentication with JWT tokens
- ✅ `/api/auth/me` - Get current user info (presumed working, uses same auth pattern)
- ✅ `/api/days` - GET all days (working)

### Frontend
- ✅ Login page functional
- ✅ Can access the app and view calendar
- ✅ Authentication working

## Known Issues ⚠️

### Active Bug: Cannot Create/Edit Days
**Status:** Under Investigation

**Symptoms:**
- When trying to create or edit a day entry, getting 400 error
- Console shows: "RangeError: Invalid time value"
- Error occurs in `/api/days` endpoint

**Recent Changes:**
- Added detailed error logging to diagnose the issue
- Logs will show exact request body and where parsing fails

**Next Steps to Debug:**
1. Check Vercel function logs at: Vercel Dashboard → frontend project → Deployments → Latest → Functions → `/api/days/index`
2. Look for console.log output showing:
   - Received body
   - Parsed fields
   - Any error details
3. Likely causes:
   - Date format mismatch (frontend sending different format than backend expects)
   - JSON body parsing issue (though we've applied fixes)
   - Database constraint issue

### Untested Features
The following endpoints exist but haven't been tested yet:
- ❓ `/api/days/[id]` - GET/PUT/DELETE specific day
- ❓ `/api/days/stats` - Get statistics
- ❓ `/api/days/[id]/photos` - Get photos for a day
- ❓ `/api/days/[id]/photos/[photoId]` - Add/remove photo from day
- ❓ `/api/photos` - Photo upload (using Vercel Blob)

## Environment Variables

All environment variables are configured in Vercel project settings:

### Database (Auto-configured by Vercel)
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### Storage (Auto-configured by Vercel)
- `BLOB_READ_WRITE_TOKEN`

### Secrets (Manually configured)
- `JWT_SECRET` - Used for JWT token generation/verification
- `INIT_SECRET` - Used for database initialization (already used, can be kept for reference)

**To view/edit:** Vercel Dashboard → frontend project → Settings → Environment Variables

## Architecture

### Frontend
- **Location:** `/frontend` directory
- **Framework:** React + Vite
- **API Base URL:** `/api` (same-origin, no CORS needed)
- **Build Output:** `/frontend/dist`

### Backend
- **Type:** Vercel Serverless Functions
- **Location:** `/api` directory
- **Language:** TypeScript
- **Runtime:** Node.js

### Database
- **Type:** PostgreSQL (via Vercel Postgres powered by Neon)
- **Schema:** Defined in `/lib/db.ts`

### Photo Storage
- **Type:** Vercel Blob
- **Upload:** Via `/api/photos` endpoint using formidable for multipart parsing

## Project Structure

```
/Ranalovesme
├── api/                      # Vercel serverless functions
│   ├── auth/
│   │   ├── login.ts         # JWT authentication
│   │   └── me.ts            # Get current user
│   ├── days/
│   │   ├── index.ts         # GET all days, POST create day, GET stats
│   │   ├── [id].ts          # GET/PUT/DELETE specific day
│   │   ├── [id]/photos.ts   # Get photos for a day
│   │   └── [id]/photos/[photoId].ts  # Add/remove photo
│   ├── photos/
│   │   └── index.ts         # Upload photo (Vercel Blob)
│   ├── init.ts              # Database initialization (one-time)
│   └── debug.ts             # Debug endpoint
├── lib/
│   ├── db.ts                # Database connection and schema
│   └── auth.ts              # JWT middleware
├── frontend/                # React frontend
│   ├── src/
│   │   ├── lib/api.ts       # API client (updated for Vercel)
│   │   └── ...
│   └── dist/                # Build output
├── vercel.json              # Vercel configuration
├── package.json             # Root dependencies (API)
├── tsconfig.json            # TypeScript config (API)
├── VERCEL_SETUP.md          # Original migration guide
└── PROJECT_STATUS.md        # This file
```

## Database Schema

### users
- `id` - SERIAL PRIMARY KEY
- `username` - VARCHAR(50) UNIQUE
- `password` - VARCHAR(255) (bcrypt hashed)
- `display_name` - VARCHAR(100)
- `created_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP

**Default Users:**
- Username: `rana`, Password: `Gentoo12mdr!`
- Username: `mark`, Password: `Gentoo12mdr!`

### days_together
- `id` - SERIAL PRIMARY KEY
- `date` - DATE UNIQUE NOT NULL
- `title` - VARCHAR(255)
- `description` - TEXT
- `mood` - VARCHAR(50)
- `rating` - INTEGER (removed from UI but still in schema)
- `created_by` - INTEGER REFERENCES users(id)
- `created_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### photos
- `id` - SERIAL PRIMARY KEY
- `filename` - VARCHAR(255) (stores full Vercel Blob URL)
- `original_name` - VARCHAR(255)
- `caption` - TEXT
- `location` - VARCHAR(255)
- `taken_date` - DATE
- `uploaded_by` - INTEGER REFERENCES users(id)
- `created_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### day_photos (junction table)
- `day_id` - INTEGER REFERENCES days_together(id) ON DELETE CASCADE
- `photo_id` - INTEGER REFERENCES photos(id) ON DELETE CASCADE
- PRIMARY KEY (day_id, photo_id)

### places, music, activities, place_photos
- Similar structure (see `/lib/db.ts` for full schema)

## How to Deploy Changes

### 1. Make Code Changes
```bash
# Edit files as needed
git add .
git commit -m "Your commit message"
git push origin master
```

### 2. Automatic Deployment
Vercel automatically deploys when you push to the `master` branch. Deployment takes about 30-60 seconds.

### 3. Verify Deployment
- Check Vercel dashboard: https://vercel.com/dashboard
- Look for the latest deployment under the "frontend" project
- Click on the deployment to see build logs and function logs

### 4. Test Changes
- Visit: https://frontend-pi-five-87.vercel.app
- Check browser console for errors
- Check Vercel function logs for server-side errors

## How to Check Logs

### Frontend Errors
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for errors when performing actions

### Backend Errors
1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Click on "frontend" project
3. Click "Deployments"
4. Click on the latest deployment
5. Click "Functions" tab
6. Click on the specific function (e.g., `/api/days/index`)
7. View real-time logs

## How to Access Database Directly

### Via Vercel Dashboard
1. Go to Vercel Dashboard → Storage
2. Click on "ranalovesme-db"
3. Click "Data" tab to browse tables
4. Click "Query" tab to run SQL queries

### Via CLI (if needed)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
cd /Users/mdr/SynologyDrive/projects/Ranalovesme
vercel link

# Get database connection string
vercel env pull .env.local

# Use with psql
psql $(grep POSTGRES_URL .env.local | cut -d '=' -f2-)
```

## Troubleshooting

### "Invalid or expired token" Error
- User's JWT token is stale
- Solution: Logout and login again
- Tokens expire after 30 days

### "Method not allowed" on API endpoints
- Vercel routing issue
- Check `vercel.json` configuration
- Make sure accessing correct HTTP method (GET/POST/PUT/DELETE)

### Photos Not Uploading
1. Check Vercel Blob is connected to project
2. Verify `BLOB_READ_WRITE_TOKEN` environment variable is set
3. Check function logs for detailed error

### Database Connection Errors
1. Verify Vercel Postgres is connected to project
2. Check `POSTGRES_URL` environment variable is set
3. Make sure database hasn't exceeded free tier limits:
   - 256 MB storage
   - 60 hours compute/month

## Next Steps / TODO

### Immediate Priority
1. **Fix day creation/editing bug**
   - Check Vercel logs for detailed error messages
   - Verify date format being sent from frontend
   - Test with curl to isolate frontend vs backend issue

### Nice to Have
1. Test photo upload functionality
2. Test all day operations (GET/PUT/DELETE specific day)
3. Remove debug logging once everything works
4. Clean up unused test endpoints (`/api/test-login.ts`, `/api/minimal-login.ts`, `/api/login.ts`)
5. Migrate any existing data from Railway (if needed)
6. Shut down Railway backend to stop billing

### Future Enhancements
1. Add photo albums/galleries
2. Add place tracking
3. Add music/activity tracking
4. Export data functionality
5. Enhanced search/filtering

## Cost Monitoring

### Vercel Free Tier Limits

**Postgres:**
- 256 MB storage
- 60 hours compute/month

**Blob:**
- 500 MB storage
- 5,000 operations/month

**Monitor at:** Vercel Dashboard → Storage → Usage

You'll get email warnings if approaching limits.

## Useful Commands

### Local Development
```bash
# Install dependencies
npm install

# Run Vercel dev server (simulates serverless environment)
npm run dev

# Or use Vercel CLI
vercel dev
```

### Test API Endpoints
```bash
# Login
curl -X POST https://frontend-pi-five-87.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "rana", "password": "Gentoo12mdr!"}'

# Get all days (requires token from login)
curl https://frontend-pi-five-87.vercel.app/api/days \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create a day
curl -X POST https://frontend-pi-five-87.vercel.app/api/days \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"date": "2025-01-19", "title": "Test Day", "description": "Testing"}'
```

## Support & References

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Postgres Docs:** https://vercel.com/docs/storage/vercel-postgres
- **Vercel Blob Docs:** https://vercel.com/docs/storage/vercel-blob
- **Original Setup Guide:** See `VERCEL_SETUP.md` in this directory

## Migration History

**Before:**
- Frontend: Vercel
- Backend: Railway (Express.js + SQLite)
- Photos: Local filesystem on Railway

**After:**
- Frontend: Vercel
- Backend: Vercel Serverless Functions
- Database: Vercel Postgres (PostgreSQL)
- Photos: Vercel Blob

**Migration Date:** January 2025

**Benefits:**
- Single platform (easier management)
- No separate backend billing
- Better integration
- Scalable database and storage
- Likely lower costs (Vercel free tier is generous)

---

**Questions or Issues?**
- Check Vercel function logs first
- Review the error messages (now with detailed logging)
- Test with curl to isolate issues
- Check this file for troubleshooting steps
