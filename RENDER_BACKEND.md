# Render Backend Deployment Guide

Quick guide for deploying just the backend API to Render (used with Vercel frontend).

## Quick Setup

### 1. Create Render Web Service

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository

### 2. Configure Service

- **Name**: `personal-diary-api`
- **Environment**: `Node`
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Plan**: Free (or upgrade)

### 3. Environment Variables

Add these in Render:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<generate-random-secret>
FRONTEND_URL=<your-vercel-app-url>
```

### 4. Deploy

Click "Create Web Service" and wait for deployment.

### 5. Get Your Backend URL

Note your Render service URL, e.g., `https://personal-diary-api.onrender.com`

Use this URL as `REACT_APP_API_URL` in your Vercel frontend deployment.

## MongoDB Atlas Setup

1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create M0 (Free) cluster
3. Create database user
4. Whitelist IP: `0.0.0.0/0`
5. Get connection string and replace `<password>` and `<dbname>`

## Done!

Your backend is now live. Use the URL in your Vercel deployment.

