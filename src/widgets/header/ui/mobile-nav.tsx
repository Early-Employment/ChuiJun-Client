"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CloseIcon } from "@/shared/assets/CloseIcon";
import { MenuIcon } from "@/shared/assets/MenuIcon";
import { useIsAuthenticated } from "@/shared/lib/use-is-authenticated";
import { LogoutButton } from "@/shared/ui/logout-button";

const navLinks = [
  { href: "/", label: "홈" },
  { href: "/ranking", label: "랭킹" },
  { href: "/class", label: "학급" },
  { href: "/mypage", label: "마이페이지" },
] as const;

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();

  // 라우트 이동 시 드로어를 닫는다.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="메뉴 열기"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="text-foreground flex size-8 items-center justify-center"
      >
        <MenuIcon className="size-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => setIsOpen(false)}
            className="bg-overlay absolute inset-0"
          />
          <div className="bg-surface absolute inset-y-0 right-0 flex w-72 max-w-[80vw] flex-col px-6 py-5">
            <div className="flex items-center justify-end">
              <button
                type="button"
                aria-label="메뉴 닫기"
                onClick={() => setIsOpen(false)}
                className="text-foreground flex size-8 items-center justify-center"
              >
                <CloseIcon className="size-6" />
              </button>
            </div>

            <nav className="mt-4 flex flex-col gap-1 text-base font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground rounded-md px-3 py-3"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="border-line mt-auto flex flex-col gap-3 border-t pt-5">
              {isAuthenticated === null ? (
                <div className="h-9" aria-hidden />
              ) : isAuthenticated ? (
                <LogoutButton className="px-4 py-2 text-center" />
              ) : (
                <Link
                  href="/signin"
                  className="bg-accent text-foreground-inverse rounded-md px-4 py-2 text-center text-sm font-medium"
                >
                  로그인
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
