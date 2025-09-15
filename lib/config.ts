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
  if (config.isDevelopment) {
    return 'http://localhost:3001/graphql';
  }
  
  if (config.vercel.url) {
    return `https://${config.vercel.url}/graphql`;
  }
  
  return config.api.graphqlUrl;
};
