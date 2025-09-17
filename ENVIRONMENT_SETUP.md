# KaloWrite Environment Setup Guide

This guide will help you set up all the necessary environment variables for the KaloWrite application.

## 📋 Quick Setup

1. **Copy the environment file:**
   ```bash
   cp env.example .env.local
   ```

2. **Update the values** in `.env.local` with your actual API keys and configuration

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🔑 Required Environment Variables

### Frontend (.env.local)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_GRAPHQL_URL` | Backend GraphQL endpoint | `http://localhost:3001/graphql` | ✅ |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001` | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` | ✅ |
| `JWT_SECRET` | JWT secret (must match backend) | `your-secret-key` | ✅ |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` | ✅ |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` | ✅ |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` | ✅ |

### Backend (.env)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` | ✅ |
| `JWT_SECRET` | JWT secret (must match frontend) | `your-secret-key` | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` | ✅ |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` | ✅ |
| `PORT` | Server port | `3001` | ❌ (default: 3001) |

## 🚀 Getting API Keys

### 1. Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add it to your `.env.local` file

### 2. Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up or log in to your account
3. Go to "Developers" → "API Keys"
4. Copy the "Publishable key" and "Secret key"
5. Add them to your environment files

**For Webhooks:**
1. Go to "Developers" → "Webhooks"
2. Click "Add endpoint"
3. Set URL to your backend webhook endpoint
4. Select events you want to listen to
5. Copy the webhook secret

### 3. Database Setup

#### Option A: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database named `kalowrite`
3. Update `DATABASE_URL` with your local connection string

#### Option B: Supabase (Recommended)
1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Go to "Settings" → "Database"
4. Copy the connection string
5. Update `DATABASE_URL` in your environment files

#### Option C: Railway/Render
1. Create a PostgreSQL database on Railway or Render
2. Copy the connection string
3. Update `DATABASE_URL` in your environment files

## 🔧 Environment-Specific Configuration

### Development
```env
NODE_ENV=development
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3001/graphql
NEXT_PUBLIC_API_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3000
```

### Production
```env
NODE_ENV=production
NEXT_PUBLIC_GRAPHQL_URL=https://your-backend-api.com/graphql
NEXT_PUBLIC_API_URL=https://your-backend-api.com
CORS_ORIGIN=https://your-frontend-domain.com
```

## 🐳 Docker Setup

If using Docker, update the `docker-compose.yml` file with your environment variables:

```yaml
environment:
  - NODE_ENV=production
  - DATABASE_URL=${DATABASE_URL}
  - JWT_SECRET=${JWT_SECRET}
  - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
  - GEMINI_API_KEY=${GEMINI_API_KEY}
  - CORS_ORIGIN=${CORS_ORIGIN}
```

## 🚀 Deployment

### Vercel (Frontend)
1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add all the `NEXT_PUBLIC_*` variables
5. Redeploy your application

### Render (Backend)
1. Go to your Render dashboard
2. Select your service
3. Go to "Environment"
4. Add all required environment variables
5. Redeploy your service

## 🔒 Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong, unique secrets** for JWT_SECRET
3. **Rotate API keys** regularly
4. **Use different keys** for development and production
5. **Enable HTTPS** in production
6. **Restrict CORS origins** to your actual domains

## 🐛 Troubleshooting

### Common Issues

1. **"API key not found"**
   - Check if `GEMINI_API_KEY` is set correctly
   - Verify the key is valid and has proper permissions

2. **"Database connection failed"**
   - Verify `DATABASE_URL` is correct
   - Check if the database server is running
   - Ensure the database exists

3. **"CORS error"**
   - Check if `CORS_ORIGIN` includes your frontend URL
   - Verify the backend is running on the correct port

4. **"JWT verification failed"**
   - Ensure `JWT_SECRET` is the same in both frontend and backend
   - Check if the token is not expired

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=true
LOG_LEVEL=debug
```

## 📞 Support

If you encounter any issues with environment setup, please check:

1. All required variables are set
2. API keys are valid and have proper permissions
3. Database is accessible and properly configured
4. CORS settings allow your frontend domain
5. JWT secrets match between frontend and backend

For additional help, refer to the main README or create an issue in the repository.
