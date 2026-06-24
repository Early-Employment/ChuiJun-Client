"use client";

import { clearAccessToken } from "@/shared/api/access-token-store";

interface LogoutButtonProps {
  className?: string;
}

// 백엔드에 로그아웃 엔드포인트가 아직 없으므로 클라이언트 토큰만 비운다.
// (refreshToken HttpOnly 쿠키 무효화 엔드포인트가 생기면 여기서 호출을 추가한다.)
export function LogoutButton({ className }: LogoutButtonProps) {
  const handleLogout = () => {
    clearAccessToken();
    window.location.href = "/signin";
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`text-label text-muted hover:text-foreground font-medium ${className}`}
    >
      로그아웃
    </button>
  );
}
