"use client";

import { instance } from "@/shared/api/instance";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const handleLogout = async () => {
    try {
      await instance.delete("/auth/logout");
    } finally {
      window.location.href = "/signin";
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`text-label text-muted hover:text-foreground font-medium transition-colors duration-150 ${className}`}
    >
      로그아웃
    </button>
  );
}
