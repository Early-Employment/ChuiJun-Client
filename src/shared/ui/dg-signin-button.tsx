"use client";

import { DGIcon } from "@/shared/assets/DGIcon";

// 백엔드(/auth/dg/login)가 PKCE state/verifier 를 쿠키에 저장하고 DataGSM 으로 리다이렉트한다.
// same-origin 경로(/auth/dg/login)로 이동해 next.config 프록시를 타야 PKCE 쿠키가
// 프론트 출처의 first-party 쿠키로 저장된다(이후 콜백 XHR 에서 전송 가능).
// SPA 라우팅이 아니라 전체 페이지 이동이어야 쿠키 설정과 외부 리다이렉트가 동작한다.
export function DgSigninButton() {
  const handleLogin = () => {
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
