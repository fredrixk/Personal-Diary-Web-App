# Render Deployment Guide

Simple guide to deploy the entire Personal Diary Web App to Render.

## Prerequisites

1. A Render account (sign up at [render.com](https://render.com))
2. A MongoDB Atlas account (free tier available)
3. A GitHub account with your code pushed to a repository

## Architecture

**Single Service Deployment:**
- **Frontend**: React app served as static files by Express
- **Backend**: Express API with Node.js
- **Database**: MongoDB Atlas
- **All deployed on**: Render 🚀

## Deployment Steps

### 1. Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Set Up MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create M0 (Free) cluster
4. Create database user with password
5. Configure Network Access: whitelist `0.0.0.0/0`
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your user password
   - Replace `<dbname>` with `personal-diary`

### 3. Deploy to Render

#### Option A: Automatic Deployment (Using render.yaml)

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Click "Apply"
5. Render will read `render.yaml` and configure everything automatically
6. Add `MONGODB_URI` in Environment tab:
   - Copy your MongoDB Atlas connection string
   - Add as environment variable
7. Deploy completes automatically!

#### Option B: Manual Deployment

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository

4. **Configure Service:**
   - **Name**: `personal-diary-app`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: Leave blank
   - **Runtime**: Node
   - **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

5. **Add Environment Variables:**
   - Click "Advanced"
   - Add variables:
     - `NODE_ENV` = `production`
     - `PORT` = `10000` (Render sets this automatically)
     - `MONGODB_URI` = Your MongoDB Atlas connection string
     - `JWT_SECRET` = Generate a random secret key

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)

### 4. Your App is Live! 🎉

Your app will be available at: `https://personal-diary-app.onrender.com`

## Environment Variables

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` (auto-set by Render) |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Random secret (generate one) |

## How It Works

1. **Build Process:**
   - Installs frontend dependencies
   - Builds React app to `frontend/build`
   - Installs backend dependencies

2. **Runtime:**
   - Express server starts
   - Serves static React files for all non-API routes
   - Serves API at `/api/*` routes
   - Connects to MongoDB Atlas

3. **Access:**
   - Frontend and backend on same domain
   - No CORS issues
   - Clean URLs

## Testing Your Deployment

1. Visit your Render URL
2. Register a new account
3. Create a diary entry
4. Check MongoDB Atlas to see data saved
5. View analytics dashboard

## Updates & Redeployment

- **Auto-deploy**: Push to GitHub triggers automatic deployment
- **Manual deploy**: Click "Manual Deploy" in Render dashboard
- **View logs**: Check "Logs" tab for deployment progress

## Troubleshooting

### Build Fails

**"react-scripts: command not found"**
- Check build command includes frontend npm install
- Verify dependencies in `frontend/package.json`

### App Not Loading

**Blank page or errors**
- Check Render logs for errors
- Verify MongoDB connection string
- Check environment variables are set

### MongoDB Connection Error

**"MongoDB connection error"**
- Verify connection string has `<password>` replaced
- Check MongoDB Atlas network access allows connections
- Verify database name is `personal-diary`

### Slow Performance

**App is slow to load**
- Free tier sleeps after 15 min inactivity (expected)
- First request after sleep takes 30-60 seconds
- Consider upgrading to Starter plan ($7/month) for no sleep

## Free Tier Limitations

- Services sleep after 15 minutes of inactivity
- Cold starts: first request after sleep is slow
- 750 hours/month compute time
- 512MB RAM

## Upgrading for Production

**Starter Plan ($7/month):**
- Never sleeps
- Better performance
- More reliable for production

## Support

- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Render Community](https://community.render.com)

## Summary

✅ **One platform** for everything  
✅ **Simple deployment** with render.yaml  
✅ **Free tier** available  
✅ **Auto-deployment** from GitHub  
✅ **HTTPS included**  
✅ **No CORS issues** (same domain)

Your Personal Diary is now live at: `https://personal-diary-app.onrender.com` 🎉

