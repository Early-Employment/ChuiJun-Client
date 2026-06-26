// GET /auth/dg/callback 응답 계약. 백엔드 DgLoginResponse 기준.
// refreshToken 은 응답 바디로 내려오고 동시에 HttpOnly 쿠키(refreshToken)로도 내려온다.
// 프론트는 refresh 를 쿠키(withCredentials)로 처리하므로 바디의 refreshToken 은 저장하지 않는다.
export type MemberRole = "STUDENT" | "TEACHER" | "ADMIN";

export interface DgLoginResponse {
  memberId: number;
  email: string;
  name: string;
  role: MemberRole;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
