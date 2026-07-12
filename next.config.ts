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
      // 로컬/개발 환경 S3 대체 스토리지. 백엔드 라우트 자체가 "/api/local-upload/*" 라
      // 아래 일반 규칙(/api/:path* -> /:path*)을 타면 "/api" 세그먼트가 유실돼 404 난다.
      // 더 구체적인 규칙을 앞에 둬 그대로 보존한다.
      {
        source: "/api/local-upload/:path*",
        destination: `${NEXT_PUBLIC_API_BASE_URL}/api/local-upload/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${NEXT_PUBLIC_API_BASE_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
