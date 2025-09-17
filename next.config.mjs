/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  webpack: (config, { dev, isServer }) => {
    // Handle chunk loading errors in development
    if (dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      };
    }
    
    // Module resolution is handled by TypeScript path mapping
    
    return config;
  },
  // Add experimental features to help with chunk loading
  // experimental: {
  //   optimizePackageImports: ['lucide-react', '@apollo/client'],
  // },
};

export default nextConfig;
