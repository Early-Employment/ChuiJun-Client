import type { NextConfig } from "next";

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    if (!NEXT_PUBLIC_API_BASE_URL) return [];
    return [
      {
        source: "/auth/dg/:path*",
        destination: `${NEXT_PUBLIC_API_BASE_URL}/auth/dg/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${NEXT_PUBLIC_API_BASE_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
