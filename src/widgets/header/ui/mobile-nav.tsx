"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BellIcon } from "@/shared/assets/BellIcon";
import { CloseIcon } from "@/shared/assets/CloseIcon";
import { MenuIcon } from "@/shared/assets/MenuIcon";

const navLinks = [
  { href: "/", label: "홈" },
  { href: "/ranking", label: "랭킹" },
  { href: "/class", label: "학급" },
] as const;

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // 라우트 이동 시 드로어를 닫는다.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // 열려 있을 때 Escape로 닫고 배경 스크롤을 막는다.
  // 스크롤바가 사라지며 헤더(sticky)가 밀리지 않도록 폭만큼 padding으로 보정한다.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);

    // 데스크톱 폭으로 커지면 드로어는 md:hidden으로 가려지지만 isOpen은 true로 남아
    // 배경 스크롤 잠금이 풀리지 않는다. 미디어 쿼리로 감지해 드로어를 닫는다.
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false);
    };
    desktopQuery.addEventListener("change", handleDesktopChange);

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", handleDesktopChange);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

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
            className="absolute inset-0 bg-black/40"
          />
          <div className="bg-surface absolute inset-y-0 right-0 flex w-72 max-w-[80vw] flex-col px-6 py-5 shadow-lg">
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
              <button
                type="button"
                aria-label="알림"
                className="text-foreground flex items-center gap-2 px-3 py-2 text-sm font-medium"
              >
                <BellIcon className="size-5" />
                알림
              </button>
              <Link
                href="/signin"
                className="bg-accent text-neutral-0 rounded-md px-4 py-2 text-center text-sm font-medium"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
