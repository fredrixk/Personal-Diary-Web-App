# Render Deployment Guide

This guide will help you deploy the Personal Diary Web App to Render.

## Prerequisites

1. A Render account (sign up at [render.com](https://render.com))
2. A GitHub account with your code pushed to a repository
3. (Optional) MongoDB Atlas account for external database

## Deployment Steps

### Option 1: Deploy with Render's MongoDB (Recommended for Free Tier)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Create a new Web Service on Render**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure the service**
   - **Name**: `personal-diary-app` (or any name you prefer)
   - **Region**: Choose closest to you (e.g., Oregon, Frankfurt)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave blank (root of repo)
   - **Environment**: `Node`
   - **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (or upgrade for better performance)

4. **Add MongoDB Database**
   - In Render dashboard, click "New +"
   - Select "MongoDB"
   - **Name**: `mongodb-diary`
   - **Database Name**: `personal-diary`
   - **User**: `mongouser`
   - **Plan**: Free (or upgrade)
   - Click "Create Database"
   - Wait for database to be provisioned

5. **Set Environment Variables**
   - In your Web Service settings, go to "Environment"
   - Add the following variables:
     ```
     NODE_ENV=production
     PORT=10000
     MONGODB_URI=<copy from MongoDB service's Internal Connection String>
     JWT_SECRET=<generate-a-random-secret-key>
     ```
   - **Important**: Use the **Internal Connection String** from your MongoDB service
   - You can find it in your MongoDB service's "Info" tab → "Internal Connection String"

6. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app
   - Wait for the deployment to complete (5-10 minutes)

7. **Access Your App**
   - Your app will be live at: `https://personal-diary-app.onrender.com`
   - (URL will be based on your service name)

### Option 2: Deploy with MongoDB Atlas (Production Ready)

1. **Set up MongoDB Atlas**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Create a database user and get connection string
   - Whitelist `0.0.0.0/0` in Network Access (or use Render's IPs)

2. **Create Web Service on Render**
   - Follow steps 1-3 from Option 1

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-a-random-secret-key>
   ```

4. **Deploy**
   - Follow step 6 from Option 1

## Environment Variables

| Variable | Description | Where to Get It |
|----------|-------------|----------------|
| `NODE_ENV` | Environment mode | Always set to `production` |
| `PORT` | Server port | Render sets this automatically (use 10000) |
| `MONGODB_URI` | MongoDB connection string | From MongoDB service or Atlas |
| `JWT_SECRET` | Secret key for JWT tokens | Generate a random string |

## Using render.yaml (Automatic Deployment)

If you have a `render.yaml` file in your repository:

1. **Push your code** to GitHub
2. **Go to Render Dashboard**
3. **Create "Blueprint"**
   - Click "New +"
   - Select "Blueprint"
   - Connect your GitHub repository
4. **Deploy**
   - Render will automatically read `render.yaml`
   - Creates Web Service and MongoDB database automatically
   - Sets environment variables as specified

**Note**: With `render.yaml`, you still need to manually set sensitive variables like `MONGODB_URI` and `JWT_SECRET` in the Render dashboard.

## Build Configuration

The app uses the following build process:

1. **Install frontend dependencies**: `cd frontend && npm install`
2. **Build React app**: `npm run build` (creates production build)
3. **Install backend dependencies**: `cd ../backend && npm install`
4. **Start server**: `cd backend && npm start`

## Important Notes

### Render Free Tier Considerations

- **Sleep after inactivity**: Free tier services sleep after 15 minutes of inactivity
- **Cold starts**: First request after sleep can take 30-60 seconds
- **Build timeouts**: Free tier has 1-hour build timeout
- **Disk space**: 512MB ephemeral disk

### MongoDB Connection

- **Internal vs External**: When MongoDB is on Render, use **Internal Connection String**
- **Connection string format**: `mongodb://mongodb:27017/...`
- **Atlas**: Use standard MongoDB URI format

### Static File Serving

- Frontend is built during deployment and served from backend
- All API calls use relative URLs (`/api/*`)
- React Router handles client-side routing

## Troubleshooting

### Build Fails

**Issue**: `npm ERR!` or dependency errors
- **Solution**: Check that all dependencies are in `package.json`
- Verify Node.js version compatibility (Render uses latest LTS)
- Check build logs for specific errors

### MongoDB Connection Issues

**Issue**: "MongoDB connection error"
- **Solution**: 
  - Verify `MONGODB_URI` is set correctly
  - Ensure using Internal Connection String if MongoDB is on Render
  - For Atlas, check Network Access whitelist
  - Verify database user credentials

### 404 Errors or Frontend Not Loading

**Issue**: App loads but shows blank page or 404
- **Solution**:
  - Verify build completed successfully
  - Check static file serving in `backend/server.js`
  - Ensure catch-all route is after API routes
  - Check Render logs for errors

### Service Not Starting

**Issue**: Service crashes or won't start
- **Solution**:
  - Check "Events" tab in Render dashboard
  - Review application logs
  - Verify PORT environment variable
  - Ensure start command is correct

### Slow Performance

**Issue**: App is slow to load
- **Solution**:
  - Free tier sleeps after inactivity (expected behavior)
  - Consider upgrading to paid plan
  - Optimize build size
  - Use MongoDB Atlas for better performance

## Monitoring and Logs

### Viewing Logs
1. Go to your service in Render dashboard
2. Click "Logs" tab
3. View real-time application logs

### Metrics
1. Click "Metrics" tab
2. View CPU, Memory, and Network usage
3. Monitor request rate and latency

## Updating Your App

1. **Push changes to GitHub**
   ```bash
   git add .
   git commit -m "Update app"
   git push
   ```

2. **Render auto-deploys**
   - If GitHub webhook is configured, Render automatically deploys
   - Or manually trigger "Manual Deploy" in dashboard

3. **Monitor deployment**
   - Watch build logs in real-time
   - Wait for "Live" status

## Custom Domain (Optional)

1. **Add Domain**
   - Go to service settings
   - Click "Custom Domains"
   - Add your domain

2. **Configure DNS**
   - Render provides DNS instructions
   - Add CNAME or A record to your domain

3. **SSL Certificate**
   - Render automatically provisions Let's Encrypt SSL
   - Wait for certificate (usually instant)

## Backup and Recovery

### Database Backups (Free Tier)
- Free MongoDB has limited backups
- Consider upgrading for automated backups

### Manual Backup
1. Export data from MongoDB
2. Store in secure location
3. Regularly update backups

## Security Best Practices

1. **JWT Secret**: Use a strong random string
2. **Database**: Use strong passwords
3. **Environment Variables**: Never commit secrets to Git
4. **HTTPS**: Always enabled on Render
5. **CORS**: Configure properly for production

## Cost Optimization

### Free Tier Limits
- 750 hours/month compute
- 512MB RAM
- Sleep after 15 min inactivity

### Upgrade Considerations
- **Starter ($7/month)**: No sleep, 512MB RAM
- **Standard ($25/month)**: 1GB RAM, better performance
- **Pro**: Production-grade resources

## Support

- **Documentation**: [render.com/docs](https://render.com/docs)
- **Community**: [community.render.com](https://community.render.com)
- **Status**: [status.render.com](https://status.render.com)

## Next Steps

After deployment:
1. Test all features in production
2. Monitor logs for errors
3. Set up custom domain (optional)
4. Configure backups
5. Consider upgrading for production use

