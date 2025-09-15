# KaloWrite Deployment Guide

This guide covers deploying both the frontend and backend of KaloWrite to production.

## 🚀 **Frontend Deployment (Vercel)**

### **Step 1: Prepare for Deployment**

1. **Ensure your code is ready**:
   ```bash
   cd kalo-write
   npm run build
   ```

2. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### **Step 2: Deploy to Vercel**

#### **Option A: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Select the `kalo-write` folder
5. Configure build settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `kalo-write`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### **Option B: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd kalo-write
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? [Your account]
# - Link to existing project? N
# - Project name: kalo-write
# - Directory: ./
# - Override settings? N
```

### **Step 3: Configure Environment Variables**

In Vercel Dashboard → Settings → Environment Variables, add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_GRAPHQL_URL` | `https://your-backend.vercel.app/graphql` | Production |
| `NEXT_PUBLIC_API_URL` | `https://your-backend.vercel.app` | Production |

## 🔧 **Backend Deployment**

### **Option 1: Deploy Backend to Vercel (Recommended)**

#### **Step 1: Prepare Backend**
```bash
cd kalo-write-backend

# Install Vercel CLI if not already installed
npm i -g vercel

# Initialize Vercel project
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? [Your account]
# - Link to existing project? N
# - Project name: kalo-write-backend
# - Directory: ./
# - Override settings? N
```

#### **Step 2: Configure Backend Environment Variables**

In Vercel Dashboard → Backend Project → Settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `your_production_database_url` | PostgreSQL connection string |
| `JWT_SECRET` | `your_super_secret_jwt_key` | JWT signing secret |
| `OPENAI_API_KEY` | `sk-...` | OpenAI API key |
| `CORS_ORIGIN` | `https://your-frontend.vercel.app` | Frontend URL for CORS |
| `NODE_ENV` | `production` | Environment |
| `PORT` | `3001` | Port number |

#### **Step 3: Update Vercel Configuration**

Create `vercel.json` in backend root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### **Option 2: Deploy Backend to Render**

#### **Step 1: Connect Repository**
1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select `kalo-write-backend` folder

#### **Step 2: Configure Service**
- **Name**: `kalo-write-backend`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`
- **Plan**: Choose appropriate plan

#### **Step 3: Set Environment Variables**
In Render Dashboard → Environment:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `your_production_database_url` |
| `JWT_SECRET` | `your_super_secret_jwt_key` |
| `OPENAI_API_KEY` | `sk-...` |
| `CORS_ORIGIN` | `https://your-frontend.vercel.app` |
| `NODE_ENV` | `production` |

## 🗄️ **Database Setup**

### **Option 1: Vercel Postgres**
1. In Vercel Dashboard → Storage
2. Create new Postgres database
3. Copy connection string to `DATABASE_URL`

### **Option 2: Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Use as `DATABASE_URL`

### **Option 3: Railway/PlanetScale**
1. Create database on your chosen platform
2. Get connection string
3. Use as `DATABASE_URL`

## 🔄 **Update Frontend URLs**

After deploying your backend, update your frontend environment variables:

1. **Get your backend URL**:
   - Vercel: `https://your-backend.vercel.app`
   - Render: `https://your-backend.onrender.com`
   - Railway: `https://your-backend.railway.app`

2. **Update frontend environment variables**:
   ```
   NEXT_PUBLIC_GRAPHQL_URL = https://your-backend-url.com/graphql
   NEXT_PUBLIC_API_URL = https://your-backend-url.com
   ```

3. **Redeploy frontend** (if needed)

## 🧪 **Testing Deployment**

### **Test Frontend**
1. Visit your frontend URL
2. Try to register/login
3. Test humanization functionality
4. Check browser console for errors

### **Test Backend**
1. Visit `https://your-backend-url.com/graphql`
2. Test GraphQL queries
3. Check API documentation at `https://your-backend-url.com/api`

### **Test Integration**
1. Use the test pages in your frontend
2. Run the API test suite
3. Verify end-to-end functionality

## 🚨 **Common Issues & Solutions**

### **CORS Errors**
- Ensure `CORS_ORIGIN` includes your frontend URL
- Check that backend allows your frontend domain

### **Database Connection Issues**
- Verify `DATABASE_URL` is correct
- Ensure database is accessible from your hosting platform
- Run migrations: `npm run db:push`

### **Environment Variable Issues**
- Check that variables are set in the correct environment
- Ensure `NEXT_PUBLIC_` prefix for client-side variables
- Redeploy after changing environment variables

### **Build Failures**
- Check build logs in Vercel/Render dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation passes

## 📊 **Monitoring & Maintenance**

### **Vercel Analytics**
- Enable Vercel Analytics for performance monitoring
- Monitor function execution times
- Check error rates

### **Database Monitoring**
- Monitor database performance
- Set up alerts for connection issues
- Regular backups

### **API Monitoring**
- Monitor API response times
- Check error rates
- Set up uptime monitoring

## 🔐 **Security Considerations**

1. **Environment Variables**: Never commit secrets to git
2. **CORS**: Only allow necessary origins
3. **Rate Limiting**: Implement rate limiting on API
4. **Authentication**: Use secure JWT secrets
5. **Database**: Use connection pooling and SSL

## 📝 **Deployment Checklist**

- [ ] Frontend builds successfully
- [ ] Backend builds successfully
- [ ] Database is set up and accessible
- [ ] Environment variables are configured
- [ ] CORS is properly configured
- [ ] SSL certificates are working
- [ ] API endpoints are accessible
- [ ] Frontend can connect to backend
- [ ] Authentication works
- [ ] Humanization functionality works
- [ ] Test suite passes
- [ ] Monitoring is set up

---

For more detailed information, refer to the [Vercel Documentation](https://vercel.com/docs) and [Render Documentation](https://render.com/docs).
