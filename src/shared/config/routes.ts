// 인증 없이 접근 가능한 공개 페이지 경로. 미들웨어 게이팅과 401 리다이렉트 예외에 공유된다.
export const PUBLIC_ROUTES = ["/signin", "/oauth/callback"] as const;

// 백엔드 인증(BFF) 엔드포인트. /api 프록시가 아니라 /auth/dg/* same-origin 프록시를 탄다.
// TODO(backend): reissue 는 Swagger 미구현 — 가정 경로다.
export const AUTH_ROUTES = {
  reissue: "/auth/dg/reissue",
} as const;
