/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hdaegpjsgyyhomfofwiz.supabase.co",
        pathname: "/storage/v1/**",
      },
    ],
  },
  allowedDevOrigins: [
    "http://192.168.100.80:3000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8080",
  ],
};

export default nextConfig;
