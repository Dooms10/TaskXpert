# Render Deployment Guide for TaskXpert

## Prerequisites
- Render account (https://render.com)
- GitHub account
- MongoDB Atlas account (recommended) or use Render's MongoDB

## Quick Deployment

### Option 1: One-Click Deployment (Recommended)
1. **Go to https://render.com**
2. **Click "New +"**
3. **Select "Web Service"**
4. **Connect GitHub**
5. **Select TaskXpert repository**
6. **Configure as below**

### Option 2: Manual Configuration

## Backend Service Configuration

### Basic Settings
- **Name**: taskxpert-backend
- **Environment**: Node
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: Free

### Environment Variables
```
NODE_ENV=production
PORT=8800
JWT_SECRET=617107ec75fd0b5b6c170623abe15d8da5f67a76377b69eb6343343c0fe5148357edae07b4455044f207bcc8fddeb303ddff8f24981a36cd4d0afcb243587494
MONGODB_URI=your-mongodb-connection-string
CLIENT_URL=https://your-frontend-url.onrender.com
```

## Frontend Service Configuration

### Basic Settings
- **Name**: taskxpert-frontend
- **Environment**: Static Site
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Instance Type**: Free

### Environment Variables
```
VITE_API_URL=https://your-backend-url.onrender.com/api
NODE_ENV=production
```

## Database Setup

### Option A: MongoDB Atlas (Recommended)
1. **Go to https://www.mongodb.com/atlas**
2. **Create free cluster**
3. **Get connection string**
4. **Update MONGODB_URI in backend**

### Option B: Render MongoDB
1. **In Render dashboard, click "New +"**
2. **Select "PostgreSQL"** (or "MongoDB" if available)
3. **Configure database**
4. **Get connection string**

## Step-by-Step Deployment

### Step 1: Deploy Backend
1. **Login to Render**
2. **Click "New +" -> "Web Service"**
3. **Connect GitHub**
4. **Select TaskXpert repo**
5. **Set root directory to `server`**
6. **Configure environment variables**
7. **Click "Create Web Service"**

### Step 2: Deploy Frontend
1. **Click "New +" -> "Static Site"**
2. **Select same TaskXpert repo**
3. **Set root directory to `client`**
4. **Configure environment variables**
5. **Click "Create Static Site"**

### Step 3: Update URLs
1. **Get backend URL** from Render dashboard
2. **Get frontend URL** from Render dashboard
3. **Update CLIENT_URL in backend**
4. **Update VITE_API_URL in frontend**

## Environment Variables Details

### Backend Required Variables:
- `NODE_ENV`: Set to `production`
- `PORT`: Set to `8800` (Render's default)
- `JWT_SECRET`: Use the generated secret
- `MONGODB_URI`: Your MongoDB connection string
- `CLIENT_URL`: Your frontend Render URL

### Frontend Required Variables:
- `VITE_API_URL`: Your backend Render URL + `/api`
- `NODE_ENV`: Set to `production`

## MongoDB Atlas Setup (Recommended)

### Create Free Cluster:
1. **Sign up at https://www.mongodb.com/atlas**
2. **Create free cluster** (choose cloud provider closest to you)
3. **Create database user** with username `taskxpert`
4. **Add IP address** (0.0.0.0/0 for all access)
5. **Get connection string**

### Connection String Format:
```
mongodb+srv://taskxpert:<password>@cluster.mongodb.net/taskxpert?retryWrites=true&w=majority
```

## Testing Your Deployment

### Backend Test:
Visit: `https://your-backend.onrender.com/api/health`

Should return:
```json
{
  "success": true,
  "message": "TaskXpert API is running",
  "timestamp": "...",
  "environment": "production"
}
```

### Frontend Test:
Visit: `https://your-frontend.onrender.com`

Should load the TaskXpert application.

## Troubleshooting

### Common Issues:

**Backend 502 Error:**
- Check environment variables
- Verify MongoDB connection string
- Check Render logs

**Frontend Build Error:**
- Verify VITE_API_URL is correct
- Check build logs in Render

**CORS Issues:**
- Ensure CLIENT_URL matches frontend URL
- Check backend CORS configuration

### Useful Commands:
```bash
# Check Render logs
# Available in Render dashboard

# Redeploy service
# Click "Manual Deploy" in Render dashboard

# Check environment variables
# Available in service settings
```

## Final URLs Format

Once deployed, your URLs will be:
- **Backend**: `https://taskxpert-backend.onrender.com`
- **Frontend**: `https://taskxpert-frontend.onrender.com`

## Support

- Render documentation: https://render.com/docs
- MongoDB Atlas documentation: https://docs.mongodb.com/atlas

---

**TaskXpert on Render** - Professional deployment with automatic HTTPS and global CDN.
