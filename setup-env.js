#!/usr/bin/env node

/**
 * KaloWrite Environment Setup Script
 * 
 * This script helps you set up environment variables for the KaloWrite application.
 * Run with: node setup-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupEnvironment() {
  console.log('🚀 KaloWrite Environment Setup\n');
  console.log('This script will help you create a .env.local file with the required environment variables.\n');

  // Check if .env.local already exists
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const overwrite = await question('⚠️  .env.local already exists. Do you want to overwrite it? (y/N): ');
    if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
      console.log('❌ Setup cancelled.');
      rl.close();
      return;
    }
  }

  console.log('📝 Please provide the following information:\n');

  // Collect environment variables
  const envVars = {};

  // API Configuration
  console.log('🔗 API Configuration:');
  envVars.NEXT_PUBLIC_GRAPHQL_URL = await question('GraphQL URL (default: http://localhost:3001/graphql): ') || 'http://localhost:3001/graphql';
  envVars.NEXT_PUBLIC_API_URL = await question('API URL (default: http://localhost:3001): ') || 'http://localhost:3001';

  // AI Configuration
  console.log('\n🤖 AI Configuration:');
  envVars.GEMINI_API_KEY = await question('Google Gemini API Key: ');
  if (!envVars.GEMINI_API_KEY) {
    console.log('❌ Gemini API Key is required!');
    rl.close();
    return;
  }

  // Authentication
  console.log('\n🔐 Authentication:');
  envVars.JWT_SECRET = await question('JWT Secret (default: auto-generated): ') || generateRandomString(32);

  // Database
  console.log('\n🗄️  Database Configuration:');
  envVars.DATABASE_URL = await question('Database URL (default: postgresql://localhost:5432/kalowrite): ') || 'postgresql://localhost:5432/kalowrite';

  // Stripe
  console.log('\n💳 Stripe Configuration:');
  envVars.STRIPE_SECRET_KEY = await question('Stripe Secret Key: ');
  envVars.STRIPE_PUBLISHABLE_KEY = await question('Stripe Publishable Key: ');
  envVars.STRIPE_WEBHOOK_SECRET = await question('Stripe Webhook Secret (optional): ');

  // CORS
  console.log('\n🌐 CORS Configuration:');
  envVars.CORS_ORIGIN = await question('CORS Origin (default: http://localhost:3000): ') || 'http://localhost:3000';

  // Optional configurations
  console.log('\n📊 Optional Configuration:');
  const enableDebug = await question('Enable debug logging? (y/N): ');
  envVars.DEBUG = enableDebug.toLowerCase() === 'y' || enableDebug.toLowerCase() === 'yes' ? 'true' : 'false';

  // Generate .env.local content
  const envContent = generateEnvContent(envVars);

  // Write to file
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Environment file created successfully!');
    console.log(`📁 Location: ${envPath}`);
    console.log('\n📋 Next steps:');
    console.log('1. Review the generated .env.local file');
    console.log('2. Update any values as needed');
    console.log('3. Start the development server: npm run dev');
    console.log('\n🔒 Security reminder: Never commit .env.local to version control!');
  } catch (error) {
    console.error('❌ Error creating environment file:', error.message);
  }

  rl.close();
}

function generateEnvContent(vars) {
  return `# KaloWrite Environment Variables
# Generated on ${new Date().toISOString()}

# ===========================================
# Next.js Configuration
# ===========================================
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=KaloWrite

# ===========================================
# API Configuration
# ===========================================
NEXT_PUBLIC_GRAPHQL_URL=${vars.NEXT_PUBLIC_GRAPHQL_URL}
NEXT_PUBLIC_API_URL=${vars.NEXT_PUBLIC_API_URL}

# ===========================================
# AI Configuration
# ===========================================
GEMINI_API_KEY=${vars.GEMINI_API_KEY}

# ===========================================
# Authentication & Security
# ===========================================
JWT_SECRET=${vars.JWT_SECRET}
JWT_EXPIRES_IN=7d

# ===========================================
# Database Configuration
# ===========================================
DATABASE_URL=${vars.DATABASE_URL}

# ===========================================
# Payment Processing (Stripe)
# ===========================================
STRIPE_SECRET_KEY=${vars.STRIPE_SECRET_KEY}
STRIPE_PUBLISHABLE_KEY=${vars.STRIPE_PUBLISHABLE_KEY}
${vars.STRIPE_WEBHOOK_SECRET ? `STRIPE_WEBHOOK_SECRET=${vars.STRIPE_WEBHOOK_SECRET}` : '# STRIPE_WEBHOOK_SECRET=your_webhook_secret_here'}

# ===========================================
# CORS Configuration
# ===========================================
CORS_ORIGIN=${vars.CORS_ORIGIN}

# ===========================================
# Development & Debugging
# ===========================================
DEBUG=${vars.DEBUG}

# ===========================================
# Optional: Analytics & Monitoring
# ===========================================
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
# SENTRY_DSN=your_sentry_dsn_here
`;
}

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Run the setup
setupEnvironment().catch(console.error);
