"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@/shared/api/access-token-store";

// sessionStorage 기반 인증 여부. 로그인/로그아웃은 전체 페이지 이동을 동반하므로
// 마운트 시점 1회 조회로 충분하다. (mounted 이전에는 null 을 반환해 hydration 불일치를 피한다.)
export function useIsAuthenticated(): boolean | null {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    setIsAuthenticated(getAccessToken() !== null);
  }, []);

  return isAuthenticated;
}
