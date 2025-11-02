# Vercel Deployment Guide

Complete guide to deploy the Personal Diary Web App to production.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. A Render account (sign up at [render.com](https://render.com)) for backend hosting
3. A MongoDB Atlas account (free tier available)
4. A GitHub account with your code pushed to a repository

## Architecture Overview

**Deployment Strategy:**
- **Frontend (React)**: Deployed on Vercel 🚀
- **Backend (API)**: Deployed on Render ⚙️
- **Database**: MongoDB Atlas 🗄️

This split architecture leverages the best of both platforms: Vercel's blazing-fast CDN for frontend and Render's reliable Node.js hosting for the backend API.

## ⚡ Quick Start Checklist

- [ ] Push code to GitHub
- [ ] Deploy backend to Render (Steps 1.1-1.4)
- [ ] Set Render environment variables
- [ ] Get Render backend URL
- [ ] Deploy frontend to Vercel (Step 2)
- [ ] **⚠️ Set Root Directory to `frontend` in Vercel**
- [ ] Set `REACT_APP_API_URL` in Vercel
- [ ] Add `FRONTEND_URL` to Render
- [ ] Restart Render service
- [ ] Test your deployed app!

📌 **Most Common Mistake**: Forgetting to set Root Directory to `frontend` in Vercel project settings!

## Step 1: Deploy Backend to Render

### 1.1 Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 1.2 Create Render Web Service

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `personal-diary-api`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

### 1.3 Set Environment Variables

In Render, add these environment variables:
```
MONGODB_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<generate-a-random-secret-key>
NODE_ENV=production
PORT=10000
```

### 1.4 Get Your Backend URL

After deployment, note your Render service URL (e.g., `https://personal-diary-api.onrender.com`)

## Step 2: Deploy Frontend to Vercel

### 2.1 Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

2. **Configure Project** ⚠️ **CRITICAL STEP!**
   
   In the project configuration:
   - **Framework Preset**: Create React App (auto-detected)
   - **Root Directory**: Click "Edit" and set to `frontend` ← **MUST DO THIS!**
   - **Build Command**: Leave as auto-detected (`npm run build`)
   - **Output Directory**: Leave as auto-detected (`build`)
   
   📌 **Why Root Directory is Critical**: Without setting this to `frontend`, Vercel will try to build from the repository root where there are no frontend dependencies, causing the build to fail.

3. **Set Environment Variables**
   - Click "Environment Variables"
   - Add variable:
     - **Key**: `REACT_APP_API_URL`
     - **Value**: Your Render backend URL + `/api`
     - Example: `https://personal-diary-api.onrender.com/api`
   - Make sure it's set for "Production"

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (2-5 minutes)
   - Your app will be live!

### 2.2 Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to Frontend**
   ```bash
   cd frontend
   ```

4. **Deploy**
   ```bash
   vercel
   ```

5. **Set Environment Variable**
   ```bash
   vercel env add REACT_APP_API_URL
   # Enter your Render backend URL + /api
   ```

6. **Redeploy**
   ```bash
   vercel --prod
   ```

## Step 3: Update CORS in Backend

Since frontend and backend are on different domains, you need to update the backend CORS configuration.

### 3.1 Update Backend Environment Variables in Render

1. Go to your Render dashboard
2. Select your backend service
3. Click on "Environment" tab
4. Add new environment variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)

### 3.2 Restart Backend Service

1. In Render dashboard, click "Manual Deploy" → "Deploy latest commit"
2. Wait for deployment to complete

The CORS configuration in `backend/server.js` is already set up to use the `FRONTEND_URL` environment variable.

## Alternative: Full Vercel Deployment (Advanced)

If you want to deploy everything on Vercel, you'll need to convert the Express backend to Vercel Serverless Functions. This is more complex but keeps everything on one platform.

### Converting to Serverless Functions

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Create API Routes**
   - Move each Express route to `api/*.js` files
   - Use Vercel's serverless function format

3. **Restructure Project**
   ```
   personal-diary/
   ├── api/
   │   ├── auth.js
   │   ├── entries.js
   │   └── analytics.js
   ├── public/
   ├── src/
   └── vercel.json
   ```

This requires significant code restructuring and is not recommended for this guide.

## Environment Variables Summary

### Vercel (Frontend)
| Variable | Value |
|----------|-------|
| `REACT_APP_API_URL` | `https://your-backend.onrender.com/api` |

### Render (Backend)
| Variable | Value |
|----------|-------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Random secret key |
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `FRONTEND_URL` | `https://your-app.vercel.app` |

### MongoDB Atlas
| Setting | Value |
|---------|-------|
| **Cluster** | Free tier M0 |
| **Region** | Closest to your users |
| **Network Access** | Whitelist `0.0.0.0/0` |
| **Database User** | Create with password |

## MongoDB Atlas Setup

1. **Create Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free

2. **Create Cluster**
   - Click "Build a Database"
   - Select "M0 Free" tier
   - Choose region closest to you
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Enter username and strong password
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Add `0.0.0.0/0` (allow from anywhere)
   - Or add specific IPs for better security

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `personal-diary`

## Testing Your Deployment

1. **Test Frontend**
   - Visit your Vercel URL
   - Should load the React app

2. **Test API**
   - Visit `https://your-backend.onrender.com/api/health` (if you add this endpoint)
   - Should return success

3. **Test Registration**
   - Try creating an account
   - Check MongoDB Atlas to see if user was created

4. **Test All Features**
   - Login
   - Create entries
   - View analytics

## Updating Your Deployment

### Frontend Updates
1. Push changes to GitHub
2. Vercel automatically redeploys
3. Changes go live immediately

### Backend Updates
1. Push changes to GitHub
2. Render automatically redeploys
3. May take a few minutes

## Troubleshooting

### Build Failed: "react-scripts: command not found"
**Issue**: Root directory not set correctly in Vercel
**Solution**: 
1. Go to Vercel project settings
2. Navigate to "General" → "Root Directory"
3. Click "Edit"
4. Set to: `frontend`
5. Click "Save"
6. Redeploy

### CORS Errors
**Issue**: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Solution**: 
- Add your Vercel URL to Render's `FRONTEND_URL` environment variable
- Restart Render service

### API Not Working
**Issue**: Frontend can't connect to API
**Solution**:
- Verify `REACT_APP_API_URL` is set correctly in Vercel
- Check that backend is running on Render
- View Render logs for errors

### MongoDB Connection Issues
**Issue**: "MongoDB connection error"
**Solution**:
- Verify connection string is correct
- Check that `<password>` and `<dbname>` are replaced
- Verify network access allows connections
- Check MongoDB user has proper permissions

### Build Failures
**Vercel**:
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Check for TypeScript/ESLint errors

**Render**:
- Check deployment logs
- Verify build command is correct
- Check for missing environment variables

## Cost Comparison

### Vercel Free Tier
- ✅ Unlimited deployments
- ✅ HTTPS included
- ✅ Global CDN
- ✅ Automatic deployments
- ✅ 100GB bandwidth/month
- ⚠️ Serverless functions have execution limits

### Render Free Tier
- ✅ 750 hours/month compute time
- ✅ HTTPS included
- ⚠️ Services sleep after 15 min inactivity
- ⚠️ Cold starts can be slow
- ⚠️ 512MB RAM limit

### MongoDB Atlas Free Tier
- ✅ 512MB storage
- ✅ Shared cluster
- ✅ Good for development/small apps
- ⚠️ Not for production scale

## Production Considerations

For production use, consider:

1. **Upgrade to Paid Plans**
   - Render Starter ($7/month) - no sleep
   - Vercel Pro ($20/month) - more functions
   - MongoDB Atlas M10 - better performance

2. **Add Monitoring**
   - Set up error tracking (Sentry)
   - Monitor API response times
   - Track deployment success rates

3. **Security Enhancements**
   - Implement rate limiting
   - Add request validation
   - Use environment-specific secrets
   - Enable MongoDB Atlas auditing

4. **Performance Optimization**
   - Enable caching headers
   - Optimize bundle size
   - Use CDN for static assets
   - Implement API response caching

## Support Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Render Docs**: [render.com/docs](https://render.com/docs)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Render Community**: [community.render.com](https://community.render.com)

## Summary

This deployment strategy gives you:
- ✅ Fast, global frontend on Vercel with CDN
- ✅ Reliable backend on Render
- ✅ Free tier friendly
- ✅ Easy updates via Git push
- ✅ Professional production setup
- ✅ HTTPS automatically configured

Your app will be live at: `https://your-app.vercel.app`

## Common Deployment Issues & Solutions

### Issue 1: "react-scripts: command not found"
**Cause**: Root Directory not set to `frontend` in Vercel  
**Solution**: Project Settings → General → Root Directory → Set to `frontend`

### Issue 2: "CORS error" in browser console
**Cause**: Frontend URL not added to backend CORS whitelist  
**Solution**: Add `FRONTEND_URL` environment variable in Render with your Vercel URL

### Issue 3: API calls failing with 404
**Cause**: `REACT_APP_API_URL` not set correctly  
**Solution**: Verify in Vercel environment variables that URL ends with `/api`

### Issue 4: "MongoDB connection error"
**Cause**: Incorrect connection string or network access  
**Solution**: Check MongoDB Atlas connection string and whitelist IP `0.0.0.0/0`

Happy deploying! 🚀

---

**Need Help?** Check the [Support Resources](#support-resources) section above.

