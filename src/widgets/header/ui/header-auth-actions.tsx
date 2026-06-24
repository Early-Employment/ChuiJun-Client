"use client";

import Link from "next/link";
import { useIsAuthenticated } from "@/shared/lib/use-is-authenticated";
import { LogoutButton } from "@/shared/ui/logout-button";

// 인증 상태에 따라 로그인 링크 / 로그아웃 버튼을 전환한다.
// 마운트 전(null)에는 레이아웃 유지를 위해 빈 슬롯을 렌더한다.
export function HeaderAuthActions({ className }: { className?: string }) {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated === null) {
    return <div className={className} aria-hidden />;
  }

  return (
    <div className={className}>
      {isAuthenticated ? (
        <LogoutButton />
      ) : (
        <Link
          href="/signin"
          className="bg-accent text-foreground-inverse rounded-md px-4 py-2 text-base font-medium"
        >
          로그인
        </Link>
      )}
    </div>
  );
}
