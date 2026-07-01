"use client";

import { DGIcon } from "@/shared/assets/DGIcon";

export function DgSigninButton() {
  const handleLogin = () => {
    // 백엔드(/auth/dg/login)가 PKCE 쿠키를 심고 DataGSM 으로 리다이렉트해야 하므로
    // SPA 라우팅이 아니라 same-origin 프록시를 타는 전체 페이지 이동이어야 한다.
    window.location.href = "/auth/dg/login";
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="bg-foreground text-foreground-inverse flex h-10 w-fit cursor-pointer items-center gap-4 rounded-md px-3 hover:opacity-90"
    >
      <DGIcon className="shrink-0" />
      <span className="text-label font-medium">DataGSM으로 시작하기</span>
    </button>
  );
}
