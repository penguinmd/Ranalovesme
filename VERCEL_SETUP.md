# Vercel Migration Setup Guide

This guide will help you migrate your RanaLovesMe app from Railway to Vercel with Postgres and Blob storage.

## Prerequisites

- Vercel account (free tier is fine to start)
- GitHub repository connected to Vercel
- All code committed and pushed to GitHub

## Step 1: Set Up Vercel Postgres

1. **Go to your Vercel Dashboard** at https://vercel.com/dashboard

2. **Navigate to Storage** → Click "Create Database"

3. **Select "Postgres"**

4. **Choose a name**: `ranalovesme-db`

5. **Select Region**: Choose the closest to you (e.g., `us-east-1`)

6. **Click "Create"**

7. **Connect to your project**: Select your `Ranalovesme` project

Vercel will automatically add these environment variables to your project:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

## Step 2: Set Up Vercel Blob Storage

1. **Go to Storage** → Click "Create Database"

2. **Select "Blob"**

3. **Choose a name**: `ranalovesme-photos`

4. **Click "Create"**

5. **Connect to your project**: Select your `Ranalovesme` project

Vercel will automatically add:
- `BLOB_READ_WRITE_TOKEN`

## Step 3: Add Additional Environment Variables

Go to your project **Settings** → **Environment Variables** and add:

```
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random
INIT_SECRET=your-secret-init-password-for-database-setup
```

Generate random secrets:
```bash
# For JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# For INIT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 4: Deploy to Vercel

1. **Push your code to GitHub** (if not already done):
```bash
git add -A
git commit -m "Migrate to Vercel with Postgres and Blob"
git push origin master
```

2. **Vercel will automatically deploy** your app

3. **Wait for deployment to complete** (~2-3 minutes)

## Step 5: Initialize the Database

After the first deployment, you need to set up the database schema and create the default users (Rana and Mark).

1. **Get your deployment URL** from Vercel dashboard (e.g., `https://ranalovesme.vercel.app`)

2. **Run the initialization** using curl:
```bash
curl -X POST https://your-app-url.vercel.app/api/init \
  -H "Content-Type: application/json" \
  -d '{"secret": "YOUR_INIT_SECRET_HERE"}'
```

Replace:
- `your-app-url.vercel.app` with your actual Vercel URL
- `YOUR_INIT_SECRET_HERE` with the `INIT_SECRET` you set in Step 3

You should see:
```json
{
  "success": true,
  "message": "Database initialized and default users created"
}
```

## Step 6: Test the App

1. **Visit your Vercel URL**: `https://your-app.vercel.app`

2. **Login** with:
   - Username: `rana` or `mark`
   - Password: `Gentoo12mdr!`

3. **Test creating a day**:
   - Click on a date in the calendar
   - Add details
   - Upload a photo

## Step 7: Migrate Existing Data (Optional)

If you have existing data on Railway that you want to migrate:

1. **Export from Railway SQLite**:
```bash
# Connect to your Railway backend
railway run sqlite3 data/ranalovesme.db .dump > backup.sql
```

2. **Contact me** and I'll help you convert the SQL dump to Postgres format and import it.

## Step 8: Shut Down Railway

Once everything is working on Vercel:

1. **Go to Railway dashboard**
2. **Select your project**
3. **Go to Settings** → **Danger Zone**
4. **Delete the project**

This will stop billing immediately.

## Troubleshooting

### "Database connection failed"
- Check that Vercel Postgres is connected to your project
- Verify environment variables are set correctly
- Try redeploying: `vercel --prod`

### "Photo upload failed"
- Check that Vercel Blob is connected
- Verify `BLOB_READ_WRITE_TOKEN` is set
- Check Vercel function logs for errors

### "Cannot find module"
- Make sure `package.json` is in the root directory
- Redeploy with: `vercel --prod --force`

### Check Logs
1. Go to your Vercel project
2. Click on a deployment
3. Click "Functions" tab
4. Click on any function to see logs

## Cost Monitoring

### Vercel Postgres Free Tier:
- 256 MB storage
- 60 hours compute/month

### Vercel Blob Free Tier:
- 500 MB storage
- 5,000 operations/month

**Monitor your usage** in Vercel Dashboard → Storage → Your database → Usage

If you approach limits, you'll get email warnings.

## Support

If you run into issues:
1. Check Vercel function logs
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Try a fresh deployment

---

**Your app is now fully on Vercel!** 🎉

All in one place:
- Frontend
- Backend API
- Database (Postgres)
- Photo Storage (Blob)
