# Railway Deployment Guide

This guide will help you deploy the Personal Diary Web App to Railway.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. A MongoDB database (you can use Railway's MongoDB service or MongoDB Atlas)

## Deployment Steps

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Create a new project on Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add MongoDB Database**
   - In your Railway project, click "New"
   - Select "Database" → "MongoDB"
   - Railway will automatically create a MongoDB instance

4. **Configure Environment Variables**
   - In your Railway project, go to "Variables"
   - Add the following environment variables:
     ```
     MONGODB_URI=<your-mongodb-connection-string>
     JWT_SECRET=<generate-a-random-secret-key>
     NODE_ENV=production
     PORT=<railway-will-set-this-automatically>
     ```
   - The MongoDB URI can be found in your MongoDB service's "Variables" tab (it's usually named `MONGO_URL`)

5. **Deploy**
   - Railway will automatically detect the `railway.json` and `nixpacks.toml` configuration
   - The build process will:
     1. Install backend dependencies
     2. Install frontend dependencies
     3. Build the React frontend
     4. Start the backend server
   - Wait for deployment to complete

6. **Generate Domain**
   - In your Railway project, go to "Settings"
   - Click "Generate Domain" to get a public URL
   - Your app will be live at this URL!

### Option 2: Deploy via Railway CLI

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Railway in your project**
   ```bash
   railway init
   ```

4. **Add MongoDB service**
   ```bash
   railway add mongodb
   ```

5. **Set environment variables**
   ```bash
   railway variables set JWT_SECRET=<your-secret-key>
   railway variables set NODE_ENV=production
   ```

6. **Link MongoDB URI**
   ```bash
   railway link <mongodb-service-id>
   railway variables set MONGODB_URI=$MONGO_URL
   ```

7. **Deploy**
   ```bash
   railway up
   ```

## Environment Variables

Make sure to set these in Railway:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://mongo:27017/...` |
| `JWT_SECRET` | Secret key for JWT tokens | Generate a random string |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (Railway sets this automatically) | `5000` |

## Build Configuration

The app uses the following build process:

1. **Install dependencies**: Both backend and frontend
2. **Build frontend**: Creates optimized React production build
3. **Start server**: Backend serves the React app and API routes

## Important Notes

- Railway automatically sets the `PORT` environment variable
- The frontend is built and served as static files from the backend
- All API calls use relative URLs in production (`/api/*`)
- MongoDB connection string from Railway's MongoDB service is typically available as `MONGO_URL`

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version (Railway uses Node 18 by default)

### MongoDB Connection Issues
- Ensure `MONGODB_URI` is correctly set
- Check that MongoDB service is running in Railway
- Verify the connection string format

### Frontend Not Loading
- Check that the build completed successfully
- Verify static file serving in `backend/server.js`
- Check Railway logs for errors

## Monitoring

- View logs in Railway dashboard
- Check deployment status in the "Deployments" tab
- Monitor resource usage in the project overview

## Custom Domain (Optional)

1. Go to your service settings
2. Click "Add Custom Domain"
3. Follow Railway's instructions to configure DNS
4. Railway will automatically provision SSL certificates

