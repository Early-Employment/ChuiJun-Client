// GET /auth/dg/callback 응답 계약. 백엔드 Swagger(DgLoginResponse) 기준.
export type MemberRole = "STUDENT" | "TEACHER" | "ADMIN";

export interface DgLoginResponse {
  memberId: number;
  email: string;
  name: string;
  role: MemberRole;
  accessToken: string;
  // refreshToken 은 HttpOnly 쿠키로도 내려오며, 프론트에서는 저장하지 않는다.
  refreshToken: string;
  expiresIn: number;
}
