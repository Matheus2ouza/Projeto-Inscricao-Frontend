/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '12mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hdaegpjsgyyhomfofwiz.supabase.co',
        pathname: '/storage/v1/**',
      },
    ],
  },
  ...(process.env.NODE_ENV === 'development' && {
    allowedDevOrigins: ['192.168.1.3'],
  }),
};

export default nextConfig;
