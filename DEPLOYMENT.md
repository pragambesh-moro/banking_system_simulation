# Deployment Guide - Banking System Simulation

This guide will help you deploy your banking system for **completely free** using:
- **Frontend**: Vercel
- **Backend**: Render.com
- **Database**: Neon.tech

---

## Step 1: Database Setup (Neon.tech - FREE)

1. **Create Account**: Go to [neon.tech](https://neon.tech) and sign up (GitHub login recommended)

2. **Create Project**:
   - Click "Create Project"
   - Name: `banking-system-db`
   - Region: Choose closest to you
   - PostgreSQL version: 16

3. **Get Connection String**:
   - Copy the connection string (it looks like: `postgresql://user:password@host/database`)
   - Save it - you'll need it for Render

4. **Initialize Database**:
   ```bash
   # Use the connection string from Neon
   export DATABASE_URL="your-neon-connection-string"
   
   # Run the table creation script
   python create_tables.py
   ```

---

## Step 2: Backend Deployment (Render.com - FREE)

1. **Create Account**: Go to [render.com](https://render.com) and sign up with GitHub

2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `banking_system_simulation` repo

3. **Configure Service**:
   - **Name**: `banking-backend`
   - **Region**: Oregon (or closest free region)
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

4. **Add Environment Variables**:
   Click "Environment" and add:
   ```
   DATABASE_URL = your-neon-connection-string
   SECRET_KEY = generate-a-random-secret-key
   ENVIRONMENT = production
   CORS_ORIGINS = *
   ```

5. **Deploy**: Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Copy the URL (e.g., `https://banking-backend.onrender.com`)

6. **⚠️ Important - Free Tier Limitation**:
   - The backend will **sleep after 15 minutes of inactivity**
   - First request after sleep takes ~30 seconds to wake up
   - This is normal for free tier

---

## Step 3: Frontend Deployment (Vercel - FREE)

1. **Update API URL**:
   First, update the frontend to use your deployed backend:
   
   ```bash
   # Edit frontend/src/services/api.js
   # Change baseURL to your Render backend URL
   ```

   In `frontend/src/services/api.js`:
   ```javascript
   const api = axios.create({
     baseURL: 'https://banking-backend.onrender.com', // Your Render URL
     headers: {
       'Content-Type': 'application/json',
     },
   });
   ```

2. **Commit Changes**:
   ```bash
   git add .
   git commit -m "chore: Update API URL for production"
   git push
   ```

3. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign up with GitHub
   - Click "Add New..." → "Project"
   - Import your `banking_system_simulation` repository

4. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Deploy**: Click "Deploy"
   - Wait 1-2 minutes
   - Your app will be live at `https://your-project.vercel.app`

6. **Update CORS in Backend**:
   - Go back to Render.com
   - Update the `CORS_ORIGINS` environment variable:
     ```
     CORS_ORIGINS = https://your-project.vercel.app
     ```

---

## Step 4: Test Your Deployment

1. **Visit your Vercel URL**: `https://your-project.vercel.app`
2. **Sign Up** for a new account (creates user in production DB)
3. **Test all features**:
   - Dashboard loads correctly
   - Deposit/Withdraw work
   - Transfers work
   - Transactions page shows data
4. **Check for errors** in browser console

---

## Troubleshooting

### Backend won't start on Render
- Check environment variables are set correctly
- Verify `DATABASE_URL` is valid
- Check Render logs for errors

### Frontend can't connect to backend
- Verify API URL in `frontend/src/services/api.js`
- Check CORS settings in backend
- Ensure backend is awake (visit backend URL directly)

### Database connection errors
- Verify Neon connection string is correct
- Check if tables were created (`python create_tables.py`)
- Ensure Neon project is active

### First load is very slow
- This is normal! Free tier backend sleeps after 15 min
- First request wakes it up (~30 seconds)
- Consider upgrading to paid tier if needed

---

## Cost Summary

- ✅ **Neon Database**: FREE (0.5GB storage, unlimited requests)
- ✅ **Render Backend**: FREE (sleeps after 15min inactivity)
- ✅ **Vercel Frontend**: FREE (unlimited bandwidth, auto-deploy)

**Total Cost**: $0/month 🎉

---

## Alternative: Railway.app (All-in-One)

If you prefer everything in one place:

1. **Sign up**: [railway.app](https://railway.app) - $5/month free credit
2. **New Project** → "Deploy from GitHub"
3. **Add Services**:
   - PostgreSQL database (auto-configured)
   - Backend (Python)
   - Frontend (Node.js)

Railway automatically:
- Sets up DATABASE_URL
- Builds and deploys both services
- Handles networking

**Pros**: Easier setup, everything together
**Cons**: $5 credit runs out faster with 3 services

---

## Custom Domain (Optional - FREE)

Both Vercel and Render support custom domains for free:

1. **Buy domain** (or use free subdomain from freenom.com)
2. **Vercel**: Settings → Domains → Add
3. **Render**: Settings → Custom Domain → Add

---

## Continuous Deployment

Both Vercel and Render auto-deploy on every push to `main`:
```bash
git add .
git commit -m "feat: Add new feature"
git push
```

Vercel and Render automatically rebuild and redeploy! 🚀

---

## Monitoring & Logs

- **Render Logs**: Dashboard → Your Service → Logs
- **Vercel Logs**: Deployments → Click deployment → Function Logs
- **Database**: Neon Dashboard → Monitoring

---

## Next Steps

1. Add error tracking: [Sentry.io](https://sentry.io) (free tier)
2. Add analytics: [Vercel Analytics](https://vercel.com/analytics) (free)
3. Set up status monitoring: [UptimeRobot](https://uptimerobot.com) (free)

---

**Questions?** Check:
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
