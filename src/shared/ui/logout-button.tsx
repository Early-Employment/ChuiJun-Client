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
      className={`text-label text-muted font-medium transition-colors duration-150 hover:text-foreground${className ? ` ${className}` : ""}`}
    >
      로그아웃
    </button>
  );
}
