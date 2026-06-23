"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useIsAuthenticated } from "@/shared/lib/use-is-authenticated";
import { Spinner } from "@/shared/ui/spinner";

// 보호 라우트 가드. accessToken 이 없으면 로그인 페이지로 보낸다.
// 만료된(있지만 무효한) 토큰은 axios 401 인터셉터가 전역에서 처리한다.
export function AuthGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/signin");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated !== true) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
