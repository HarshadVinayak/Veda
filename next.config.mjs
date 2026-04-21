/**
 * PRODUCTION-READY CONFIG
 * Silencing Turbopack/Webpack mismatch error for Next.js 16
 */
const nextConfig = {
  turbopack: {},
  
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    }
  },
};

export default nextConfig;
