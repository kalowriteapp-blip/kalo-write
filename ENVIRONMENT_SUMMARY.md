# KaloWrite Environment Variables Summary

## 🎯 Quick Start

```bash
# 1. Interactive setup (recommended)
npm run setup

# 2. Validate your configuration
npm run validate:env

# 3. Start development
npm run dev
```

## 📁 Files Created

- **`env.example`** - Complete template with all environment variables
- **`setup-env.js`** - Interactive setup script
- **`validate-env.js`** - Environment validation script
- **`ENVIRONMENT_SETUP.md`** - Detailed setup guide
- **`ENVIRONMENT_SUMMARY.md`** - This summary file

## 🔑 Required Variables

### Frontend (.env.local)
```env
# API Configuration
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3001/graphql
NEXT_PUBLIC_API_URL=http://localhost:3001

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/kalowrite

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Backend (.env)
```env
# Application
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/kalowrite

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# AI
GEMINI_API_KEY=your_gemini_api_key_here

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 🚀 Getting API Keys

### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Copy and add to environment

### Stripe API
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get API keys from "Developers" → "API Keys"
3. Add to environment

### Database
- **Local**: Install PostgreSQL locally
- **Supabase**: Create project and get connection string
- **Railway/Render**: Create PostgreSQL database

## 📋 Available Scripts

```bash
npm run setup          # Interactive environment setup
npm run validate:env   # Validate environment variables
npm run check:env      # Alias for validate:env
npm run dev           # Start development server
npm run build         # Build for production
```

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use different keys for development and production
- Rotate API keys regularly
- Use strong, unique JWT secrets

## 🐛 Troubleshooting

1. **Missing variables**: Run `npm run validate:env` to check
2. **API errors**: Verify API keys are correct and have proper permissions
3. **Database errors**: Check connection string and database accessibility
4. **CORS errors**: Ensure CORS_ORIGIN includes your frontend URL

## 📚 Documentation

- **Detailed Setup**: [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
- **Template File**: [env.example](./env.example)
- **Main README**: [README.md](./README.md)
