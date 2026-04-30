# Firebase + GitHub Pages Deployment Guide

## Overview
Deploy TaskXpert completely free using:
- **Frontend**: GitHub Pages (unlimited free)
- **Backend**: Firebase Functions (free tier)
- **Database**: Firebase Firestore (free tier)

## Step 1: Set Up Firebase Project

### 1.1 Create Firebase Project
1. **Go to https://console.firebase.google.com**
2. **Click "Add project"**
3. **Project name**: `TaskXpert`
4. **Click "Create project"**

### 1.2 Enable Firestore Database
1. **In Firebase console, click "Firestore Database"**
2. **Click "Create database"**
3. **Select "Start in test mode"**
4. **Choose location** (closest to you)
5. **Click "Enable"**

### 1.3 Enable Firebase Functions
1. **Click "Functions"** (left sidebar)
2. **Click "Get started"**
3. **Configure**:
   - Plan: Blaze (Pay-as-you-go)
   - **Note**: Free tier covers 125,000 invocations/month
4. **Click "Enable**

### 1.4 Enable Firebase Hosting
1. **Click "Hosting"** (left sidebar)
2. **Click "Get started"**
3. **Click "Continue"**

## Step 2: Deploy Backend to Firebase Functions

### 2.1 Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2.2 Initialize Firebase
```bash
cd firebase
firebase login
firebase init functions
```

### 2.3 Deploy Functions
```bash
cd firebase/functions
npm install
firebase deploy --only functions
```

### 2.4 Set Environment Variables
In Firebase console → Functions → Variables:
```
MONGODB_URI=mongodb+srv://taskxpert:taskxpert123@cluster.mongodb.net/taskxpert?retryWrites=true&w=majority
JWT_SECRET=617107ec75fd0b5b6c170623abe15d8da5f67a76377b69eb6343343c0fe5148357edae07b4455044f207bcc8fddeb303ddff8f24981a36cd4d0afcb243587494
NODE_ENV=production
```

## Step 3: Deploy Frontend to GitHub Pages

### 3.1 Build Frontend for Production
```bash
cd client
npm run build
```

### 3.2 Push to GitHub
```bash
git add client/dist
git commit -m "Add production build"
git push origin main
```

### 3.3 Enable GitHub Pages
1. **Go to your TaskXpert repository on GitHub**
2. **Click "Settings"**
3. **Scroll to "Pages" section**
4. **Source**: Deploy from a branch
5. **Branch**: main
6. **Folder**: /client/dist
7. **Click "Save"**

## Step 4: Configure Frontend API URL

### 4.1 Update Frontend Environment
Create `client/.env.production`:
```env
VITE_API_URL=https://your-region-project.cloudfunctions.net/api
NODE_ENV=production
```

### 4.2 Rebuild and Deploy
```bash
cd client
npm run build
git add client/dist
git commit -m "Update API URL"
git push origin main
```

## Step 5: Test Your Application

### 5.1 Get Your URLs
- **Frontend**: `https://username.github.io/TaskXpert`
- **Backend**: `https://your-region-project.cloudfunctions.net/api`

### 5.2 Test Endpoints
1. **Frontend**: Visit GitHub Pages URL
2. **Backend Health**: `https://your-region-project.cloudfunctions.net/api/health`
3. **Test Features**: Register user, create tasks

## Expected Results

### Frontend URL:
```
https://username.github.io/TaskXpert
```

### Backend URL:
```
https://us-central1-taskxpert.cloudfunctions.net/api
```

### API Endpoints:
```
GET  https://us-central1-taskxpert.cloudfunctions.net/api/health
POST https://us-central1-taskxpert.cloudfunctions.net/api/auth/register
POST https://us-central1-taskxpert.cloudfunctions.net/api/auth/login
GET  https://us-central1-taskxpert.cloudfunctions.net/api/tasks
POST https://us-central1-taskxpert.cloudfunctions.net/api/tasks
```

## Benefits

✅ **Completely FREE forever**
✅ **Unlimited bandwidth**
✅ **Global CDN**
✅ **Automatic HTTPS**
✅ **Custom domains supported**
✅ **125,000 function invocations/month free**
✅ **1GB Firestore storage free**

## Troubleshooting

### Common Issues:
- **Function not found**: Check Firebase deployment
- **CORS errors**: Update allowed origins
- **Build errors**: Check VITE_API_URL
- **Database connection**: Verify MONGODB_URI

### Useful Commands:
```bash
# Redeploy functions
firebase deploy --only functions

# Check function logs
firebase functions:log

# View function list
firebase functions:list
```

## File Structure

```
TaskXpert/
├── firebase/
│   ├── functions/
│   │   ├── index.js
│   │   ├── package.json
│   │   └── routes/
│   │       ├── auth.js
│   │       └── tasks.js
│   └── firebase.json
├── client/
│   ├── dist/ (built for GitHub Pages)
│   └── .env.production
└── FIREBASE_DEPLOYMENT.md
```

## Next Steps

1. **Set up Firebase project**
2. **Deploy backend functions**
3. **Build and deploy frontend to GitHub Pages**
4. **Test complete application**

Your TaskXpert will be live and completely free!
