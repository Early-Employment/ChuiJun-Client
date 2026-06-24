import { instance } from "@/shared/api/instance";
import { AUTH_ROUTES } from "@/shared/config/routes";

// POST /auth/dg/refresh — HttpOnly 쿠키(refreshToken)의 Refresh Token 으로 새 Access Token 을 발급한다.
// 쿠키는 withCredentials 로 자동 전송되므로 별도 헤더·바디가 없다. 회전된 refreshToken 은
// 응답 바디와 Set-Cookie 로 함께 내려오며, 프론트는 쿠키로 refresh 하므로 accessToken 만 사용한다.
interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export async function reissueAccessToken(): Promise<string> {
  const { data } = await instance.post<RefreshResponse>(AUTH_ROUTES.refresh, null, {
    baseURL: "",
  });
  return data.accessToken;
}
