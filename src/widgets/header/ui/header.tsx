import Link from "next/link";
import { BellIcon } from "@/shared/assets/BellIcon";
import { LogoIcon } from "@/shared/assets/LogoIcon";
import { MobileNav } from "@/widgets/header/ui/mobile-nav";

export function Header() {
  return (
    <header className="bg-surface border-line sticky top-0 z-50 border-b">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-1" aria-label="취준 홈">
          <LogoIcon className="size-8" />
          <span className="text-heading font-bold">취준</span>
        </Link>
        <nav className="hidden items-center gap-20 text-sm font-medium md:flex">
          <Link href="/" className="text-foreground">
            홈
          </Link>
          <Link href="/ranking" className="text-foreground">
            랭킹
          </Link>
          <Link href="/class" className="text-foreground">
            학급
          </Link>
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            aria-label="알림"
            className="text-foreground flex size-8 items-center justify-center"
          >
            <BellIcon className="size-4" />
          </button>
          <Link
            href="/signin"
            className="bg-accent text-neutral-0 rounded-md px-4 py-2 text-sm font-medium"
          >
            로그인
          </Link>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
