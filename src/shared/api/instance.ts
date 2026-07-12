import axios, { HttpStatusCode, type InternalAxiosRequestConfig } from "axios";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/shared/api/access-token-store";
import { clearMemberSession } from "@/shared/api/member-session-store";
import { AUTH_ROUTES, PUBLIC_ROUTES } from "@/shared/config/routes";

export const instance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export const serverInstance = axios.create({
  headers: { "Content-Type": "application/json" },
});

// POST /auth/dg/refresh — HttpOnly 쿠키(refreshToken)로 새 Access Token 을 발급한다.
// 회전된 refreshToken 은 응답 바디·Set-Cookie 로 함께 내려오지만, 프론트는 쿠키로 refresh 하므로
// accessToken 만 사용한다. baseURL "" 로 /api 프록시가 아닌 root(/auth/dg/*) 프록시를 탄다.
interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

let reissuePromise: Promise<string> | null = null;

async function runReissue(): Promise<string> {
  try {
    const { data } = await instance.post<RefreshResponse>(AUTH_ROUTES.refresh, null, {
      baseURL: "",
    });
    setAccessToken(data.accessToken);
    return data.accessToken;
  } finally {
    reissuePromise = null;
  }
}

function reissue(): Promise<string> {
  reissuePromise ??= runReissue();
  return reissuePromise;
}

function redirectToSignin() {
  clearAccessToken();
  clearMemberSession();
  if (!PUBLIC_ROUTES.some((route) => route === window.location.pathname)) {
    window.location.replace("/signin");
  }
}

// GET 요청에 한해 최소 로딩 시간을 보장한다. 응답이 너무 빨리 오면 스켈레톤이
// 깜빡였다 사라지는(flash) 문제가 생기기 때문. 사용자 액션인 POST/PUT/DELETE 는
// 즉각 반응해야 하므로 대상에서 제외한다.
const MIN_LOADING_DURATION_MS = 400;

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

// 요청 인터셉터: accessToken 이 없으면 보내기 전에 선제 재발급에 합류한다.
// (재오픈 탭·만료 직후 첫 요청에서 401 폭포 없이 토큰을 확보한다. /auth/* 는 제외.)
instance.interceptors.request.use(async (config) => {
  let token = getAccessToken();
  const url = config.url ?? "";

  if (!token && !url.startsWith("/auth/") && typeof window !== "undefined") {
    try {
      token = await reissue();
    } catch {
      token = null;
    }
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  (config as InternalAxiosRequestConfig & { _requestedAt?: number })._requestedAt = Date.now();
  return config;
});

// 응답 인터셉터: 사용 중 만료로 401 이 나면 1회 재발급·재시도한다.
// 재발급도 실패하면 세션을 정리하고 /signin 으로 보낸다.
instance.interceptors.response.use(
  async (response) => {
    const config = response.config as InternalAxiosRequestConfig & { _requestedAt?: number };
    if (config.method?.toLowerCase() === "get" && config._requestedAt !== undefined) {
      const remaining = MIN_LOADING_DURATION_MS - (Date.now() - config._requestedAt);
      if (remaining > 0) await delay(remaining);
    }
    return response;
  },
  async (error) => {
    if (typeof window === "undefined") return Promise.reject(error);

    const config = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;
    const url = config?.url ?? "";

    const shouldRetry =
      error.response?.status === HttpStatusCode.Unauthorized &&
      config !== undefined &&
      !config._retried &&
      !url.startsWith("/auth/");

    if (!shouldRetry) {
      return Promise.reject(error);
    }

    config._retried = true;
    try {
      await reissue();
      // 재요청은 요청 인터셉터가 갱신된 토큰으로 Authorization 을 다시 채운다.
      return instance(config);
    } catch (reissueError) {
      redirectToSignin();
      return Promise.reject(reissueError);
    }
  },
);
