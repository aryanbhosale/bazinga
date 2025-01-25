import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allow images from any HTTPS domain
      },
      {
        protocol: 'http',
        hostname: '**', // allow images from any HTTP domain (less secure)
      },
    ],
  },
};

export default nextConfig;
