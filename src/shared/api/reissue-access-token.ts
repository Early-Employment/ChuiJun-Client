import { instance } from "@/shared/api/instance";
import { AUTH_ROUTES } from "@/shared/config/routes";

// TODO(backend): reissue 엔드포인트와 refreshToken 쿠키가 백엔드 Swagger 에 아직 없음
interface ReissueResponse {
  accessToken: string;
  expiresIn: number;
}

export async function reissueAccessToken(): Promise<string> {
  const { data } = await instance.post<ReissueResponse>(AUTH_ROUTES.reissue, null, {
    baseURL: "",
  });
  return data.accessToken;
}
