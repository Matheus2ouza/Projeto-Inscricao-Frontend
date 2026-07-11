/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/web-api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '12mb',
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hdaegpjsgyyhomfofwiz.supabase.co',
        pathname: '/storage/v1/**',
      },
    ],
  },
  allowedDevOrigins: ['192.168.1.4', '192.168.1.6'],
};

export default nextConfig;
