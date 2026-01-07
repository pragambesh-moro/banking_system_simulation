# 🚀 Quick Deploy Guide (5 minutes)

Deploy your banking system completely FREE in 3 steps:

## 1️⃣ Database (Neon - 2 min)

```bash
# 1. Go to https://neon.tech and create free account
# 2. Create new project called "banking-system-db"
# 3. Copy the connection string
# 4. Initialize the database:

export DATABASE_URL="your-neon-connection-string-here"
python create_tables.py
```

## 2️⃣ Backend (Render - 2 min)

```bash
# 1. Go to https://render.com and sign up with GitHub
# 2. New → Web Service → Connect your repo
# 3. Configure:

Name: banking-backend
Build: pip install -r requirements.txt
Start: uvicorn app.main:app --host 0.0.0.0 --port $PORT
Plan: Free

# 4. Add Environment Variables:
DATABASE_URL = (paste your Neon connection string)
SECRET_KEY = (generate with: openssl rand -hex 32)
ENVIRONMENT = production
CORS_ORIGINS = *

# 5. Click Deploy → Wait 2 min → Copy your backend URL
```

## 3️⃣ Frontend (Vercel - 1 min)

```bash
# 1. Update API URL in your code
# Edit: frontend/src/config/constants.js
# Or create: frontend/.env

VITE_API_URL=https://your-backend-url.onrender.com

# 2. Commit and push
git add .
git commit -m "chore: Configure for production"
git push

# 3. Go to https://vercel.com → New Project
# 4. Import your repo → Root Directory: frontend → Deploy
# 5. Done! Your app is live at https://your-project.vercel.app
```

## ✅ Done!

Your banking system is now live and completely free!

**URLs:**
- Frontend: `https://your-project.vercel.app`
- Backend: `https://banking-backend.onrender.com`
- Database: Neon Dashboard

## 🔧 Important Notes

1. **Backend sleeps** after 15 min (free tier) - first request takes ~30s
2. **Auto-deploy**: Every push to `main` auto-deploys to Vercel and Render
3. **Logs**: Check Render/Vercel dashboards for errors
4. **Custom domain**: Add for free in Vercel settings

## 📊 Free Tier Limits

- ✅ Neon: 0.5GB storage, unlimited requests
- ✅ Render: Unlimited requests, sleeps after 15min
- ✅ Vercel: Unlimited bandwidth, 100GB/month

**Total Cost: $0** 🎉
