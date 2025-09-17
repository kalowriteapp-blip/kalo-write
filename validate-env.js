#!/usr/bin/env node

/**
 * KaloWrite Environment Validation Script
 * 
 * This script validates that all required environment variables are set.
 * Run with: node validate-env.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const requiredVars = [
  'NEXT_PUBLIC_GRAPHQL_URL',
  'NEXT_PUBLIC_API_URL',
  'GEMINI_API_KEY',
  'JWT_SECRET',
  'DATABASE_URL',
  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'CORS_ORIGIN'
];

const optionalVars = [
  'STRIPE_WEBHOOK_SECRET',
  'DEBUG',
  'NEXT_PUBLIC_GA_ID',
  'SENTRY_DSN'
];

function validateEnvironment() {
  console.log('🔍 KaloWrite Environment Validation\n');

  let hasErrors = false;
  let hasWarnings = false;

  // Check required variables
  console.log('✅ Required Variables:');
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      console.log(`❌ ${varName}: Missing`);
      hasErrors = true;
    } else {
      // Mask sensitive values
      const displayValue = varName.includes('SECRET') || varName.includes('KEY') 
        ? `${value.substring(0, 8)}...` 
        : value;
      console.log(`✅ ${varName}: ${displayValue}`);
    }
  });

  // Check optional variables
  console.log('\n📋 Optional Variables:');
  optionalVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      console.log(`⚠️  ${varName}: Not set (optional)`);
      hasWarnings = true;
    } else {
      const displayValue = varName.includes('SECRET') || varName.includes('KEY') 
        ? `${value.substring(0, 8)}...` 
        : value;
      console.log(`✅ ${varName}: ${displayValue}`);
    }
  });

  // Environment-specific checks
  console.log('\n🌍 Environment Checks:');
  
  const nodeEnv = process.env.NODE_ENV || 'development';
  console.log(`📌 NODE_ENV: ${nodeEnv}`);

  if (nodeEnv === 'production') {
    // Production-specific checks
    const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;
    if (graphqlUrl && !graphqlUrl.startsWith('https://')) {
      console.log('⚠️  NEXT_PUBLIC_GRAPHQL_URL should use HTTPS in production');
      hasWarnings = true;
    }

    const corsOrigin = process.env.CORS_ORIGIN;
    if (corsOrigin && !corsOrigin.startsWith('https://')) {
      console.log('⚠️  CORS_ORIGIN should use HTTPS in production');
      hasWarnings = true;
    }
  }

  // API Key format validation
  console.log('\n🔑 API Key Validation:');
  
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && !geminiKey.startsWith('AIza')) {
    console.log('⚠️  GEMINI_API_KEY format may be incorrect (should start with "AIza")');
    hasWarnings = true;
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (stripeSecretKey && !stripeSecretKey.startsWith('sk_')) {
    console.log('⚠️  STRIPE_SECRET_KEY format may be incorrect (should start with "sk_")');
    hasWarnings = true;
  }

  const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  if (stripePublishableKey && !stripePublishableKey.startsWith('pk_')) {
    console.log('⚠️  STRIPE_PUBLISHABLE_KEY format may be incorrect (should start with "pk_")');
    hasWarnings = true;
  }

  // Database URL validation
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl && !databaseUrl.startsWith('postgresql://')) {
    console.log('⚠️  DATABASE_URL format may be incorrect (should start with "postgresql://")');
    hasWarnings = true;
  }

  // Summary
  console.log('\n📊 Summary:');
  
  if (hasErrors) {
    console.log('❌ Environment validation failed!');
    console.log('Please set all required environment variables.');
    console.log('\n💡 Run "npm run setup" to set up your environment variables.');
    process.exit(1);
  } else if (hasWarnings) {
    console.log('⚠️  Environment validation passed with warnings.');
    console.log('Consider reviewing the optional variables and warnings above.');
  } else {
    console.log('✅ Environment validation passed!');
    console.log('All required variables are set and properly configured.');
  }

  console.log('\n🚀 You can now start the development server with: npm run dev');
}

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('Please run "npm run setup" to create your environment file.');
  process.exit(1);
}

validateEnvironment();
