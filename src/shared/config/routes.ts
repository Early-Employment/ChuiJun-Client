// 인증 없이 접근 가능한 공개 페이지 경로. 미들웨어 게이팅과 401 리다이렉트 예외에 공유된다.
export const PUBLIC_ROUTES = ["/signin", "/oauth/callback"] as const;

// 백엔드 인증(BFF) 엔드포인트. /api 프록시가 아니라 /auth/dg/* same-origin 프록시를 탄다.
// refresh: 토큰 갱신. HttpOnly 쿠키(REFRESH_TOKEN_COOKIE)의 Refresh Token 으로 새 Access Token 발급.
// (Swagger: POST /auth/dg/refresh — http://ssh.gsmsv.site:30440/swagger-ui/index.html)
export const AUTH_ROUTES = {
  refresh: "/auth/dg/refresh",
} as const;

// refresh 시 백엔드가 자동으로 읽는 HttpOnly 쿠키 이름.
// 프론트는 값에 접근하지 않고 withCredentials 로 동봉만 하지만, 미들웨어 게이팅은 존재 여부를 본다.
export const REFRESH_TOKEN_COOKIE = "refreshToken";
