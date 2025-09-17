import path from 'path';

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
    
    // Explicitly configure path aliases for Vercel
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd()),
      '@/components': path.resolve(process.cwd(), 'components'),
      '@/components/ui': path.resolve(process.cwd(), 'components/ui'),
      '@/lib': path.resolve(process.cwd(), 'lib'),
      '@/types': path.resolve(process.cwd(), 'types'),
      '@/contexts': path.resolve(process.cwd(), 'contexts'),
    };
    
    return config;
  },
};

export default nextConfig;
