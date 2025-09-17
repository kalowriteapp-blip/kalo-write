# KaloWrite - AI Text Humanizer

Transform AI-generated content into natural, human-like text that passes all detection tools.

## Features

- 🤖 AI-Powered text humanization using Google Gemini
- ⚡ Lightning fast processing
- 🔒 Secure and private
- 💰 Subscription-based pricing
- 🎨 Modern, responsive UI

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **AI**: Google Gemini API
- **Database**: Supabase
- **Payments**: Stripe
- **Deployment**: Vercel

## Getting Started

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kalo-write
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Interactive setup (recommended)
   npm run setup
   
   # Or manually copy and edit
   cp env.example .env.local
   ```

4. **Validate environment**
   ```bash
   npm run validate:env
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Environment Variables

The application requires several environment variables to function properly. See the detailed setup guide:

- **📋 [Environment Setup Guide](./ENVIRONMENT_SETUP.md)** - Complete guide for setting up all environment variables
- **🔧 [env.example](./env.example)** - Template with all required variables
- **✅ Validation** - Run `npm run validate:env` to check your configuration

#### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_GRAPHQL_URL` | Backend GraphQL endpoint | `http://localhost:3001/graphql` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `JWT_SECRET` | JWT secret key | `your-secret-key` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` |

#### Available Scripts

```bash
npm run setup          # Interactive environment setup
npm run validate:env   # Validate environment variables
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run type-check    # Run TypeScript type checking
```

## Deployment

This project is deployed on Vercel. Environment variables are configured in the Vercel dashboard.

## License

Private - All rights reserved.
