/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack is enabled by default in many dev environments, 
  // but we can add specific config if needed.
  experimental: {
    // Ensuring smooth server action handling
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  // Ensure we throw errors on missing mandatory env vars during build
  webpack: (config, { isServer, buildId, dev, isDev, config: nextConfig }) => {
    if (!dev && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      throw new Error('FATAL: NEXT_PUBLIC_SUPABASE_URL is missing from environment.');
    }
    return config;
  },
};

export default nextConfig;
