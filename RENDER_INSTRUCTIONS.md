# Render Deployment Instructions for TaskXpert

## Step 1: Set Up MongoDB Atlas (Free)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/atlas
   - Sign up for free account

2. **Create Free Cluster**
   - Click "Create a cluster"
   - Choose: AWS, region closest to you
   - Select M0 Sandbox (Free)
   - Click "Create cluster"

3. **Configure Cluster**
   - Wait for cluster to be created (2-5 minutes)
   - Click "Database Access" → "Add new user"
   - Username: `taskxpert`
   - Password: `taskxpert123`
   - Click "Add user"

4. **Set Network Access**
   - Click "Network Access" → "Add IP Address"
   - Select "Allow access from anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Click "Database" → "Connect"
   - Select "Drivers"
   - Copy the connection string
   - Replace `<password>` with `taskxpert123`

## Step 2: Deploy Backend to Render

1. **Login to Render**
   - Go to https://render.com
   - Login with GitHub

2. **Create Backend Service**
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Select "TaskXpert" repository
   - Configure:
     - Name: `taskxpert-backend`
     - Environment: `Node`
     - Root Directory: `server`
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Plan: `Free`

3. **Add Environment Variables**
   ```
   NODE_ENV=production
   PORT=8800
   JWT_SECRET=617107ec75fd0b5b6c170623abe15d8da5f67a76377b69eb6343343c0fe5148357edae07b4455044f207bcc8fddeb303ddff8f24981a36cd4d0afcb243587494
   MONGODB_URI=mongodb+srv://taskxpert:taskxpert123@cluster.mongodb.net/taskxpert?retryWrites=true&w=majority
   CLIENT_URL=https://taskxpert-frontend.onrender.com
   ```

4. **Deploy Backend**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)

## Step 3: Deploy Frontend to Render

1. **Create Frontend Service**
   - Click "New +" → "Static Site"
   - Select same "TaskXpert" repository
   - Configure:
     - Name: `taskxpert-frontend`
     - Environment: `Static Site`
     - Root Directory: `client`
     - Build Command: `npm run build`
     - Publish Directory: `dist`
     - Plan: `Free`

2. **Add Environment Variables**
   ```
   VITE_API_URL=https://taskxpert-backend.onrender.com/api
   NODE_ENV=production
   ```

3. **Deploy Frontend**
   - Click "Create Static Site"
   - Wait for deployment (1-2 minutes)

## Step 4: Update URLs

1. **Get Your URLs**
   - Backend URL will be: `https://taskxpert-backend.onrender.com`
   - Frontend URL will be: `https://taskxpert-frontend.onrender.com`

2. **Update Environment Variables**
   - Go to backend service settings
   - Update `CLIENT_URL` to your actual frontend URL
   - Go to frontend service settings
   - Update `VITE_API_URL` to your actual backend URL

## Step 5: Test Your Application

1. **Test Backend**
   - Visit: `https://taskxpert-backend.onrender.com/api/health`
   - Should return: `{"success": true, "message": "TaskXpert API is running"}`

2. **Test Frontend**
   - Visit: `https://taskxpert-frontend.onrender.com`
   - Should load TaskXpert application

3. **Test Features**
   - Register new user
   - Create tasks
   - Test all functionality

## Troubleshooting

### Common Issues:
- **Backend 502 Error**: Check MongoDB connection string
- **Frontend Build Error**: Check VITE_API_URL
- **CORS Issues**: Update CLIENT_URL in backend

### Useful Commands:
- **Redeploy**: Click "Manual Deploy" in Render dashboard
- **Check Logs**: View logs in service dashboard
- **Update Variables**: Edit environment variables in settings

## Final URLs:
- **Frontend**: `https://taskxpert-frontend.onrender.com`
- **Backend**: `https://taskxpert-backend.onrender.com/api`
- **Database**: MongoDB Atlas free cluster

## Benefits:
✅ Completely free deployment
✅ Automatic HTTPS
✅ Global CDN
✅ Custom domains supported
✅ Easy scaling when needed
