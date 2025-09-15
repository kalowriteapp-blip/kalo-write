// Environment configuration for different deployment environments

export const config = {
  // API Configuration
  api: {
    graphqlUrl: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql',
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
  
  // Environment detection
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isPreview: process.env.VERCEL_ENV === 'preview',
  
  // Vercel environment info
  vercel: {
    env: process.env.VERCEL_ENV,
    url: process.env.VERCEL_URL,
    region: process.env.VERCEL_REGION,
  }
};

// Helper function to get the correct API URL
export const getApiUrl = () => {
  if (config.isDevelopment) {
    return 'http://localhost:3001';
  }
  
  if (config.vercel.url) {
    return `https://${config.vercel.url}`;
  }
  
  return config.api.baseUrl;
};

// Helper function to get the correct GraphQL URL
export const getGraphQLUrl = () => {
  // Debug logging
  console.log('Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    isDevelopment: config.isDevelopment,
    isProduction: config.isProduction
  });
  
  // Always use environment variable if set (for production)
  if (process.env.NEXT_PUBLIC_GRAPHQL_URL) {
    console.log('Using NEXT_PUBLIC_GRAPHQL_URL:', process.env.NEXT_PUBLIC_GRAPHQL_URL);
    return process.env.NEXT_PUBLIC_GRAPHQL_URL;
  }
  
  // Fallback to localhost for development
  if (config.isDevelopment) {
    console.log('Using development fallback: http://localhost:3001/graphql');
    return 'http://localhost:3001/graphql';
  }
  
  // This should not happen in production if env var is set
  console.warn('NEXT_PUBLIC_GRAPHQL_URL not set, using fallback');
  return 'http://localhost:3001/graphql';
};
