import Link from "next/link";
import { LogoIcon } from "@/shared/assets/LogoIcon";
import { HeaderAuthActions } from "@/widgets/header/ui/header-auth-actions";
import { MobileNav } from "@/widgets/header/ui/mobile-nav";

export function Header() {
  return (
    <header className="bg-surface border-line sticky top-0 z-50 border-b">
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-4 sm:px-8 xl:px-[140px]">
        <Link href="/" className="flex items-center gap-1" aria-label="취준 홈">
          <LogoIcon className="text-accent size-8" />
          <span className="font-logo text-[25.6px] leading-normal font-normal text-[#262626]">
            취준
          </span>
        </Link>
        <nav className="hidden items-center gap-12 text-base font-medium md:flex lg:gap-16">
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
        <HeaderAuthActions className="hidden items-center gap-4 md:flex" />

        <MobileNav />
      </div>
    </header>
  );
}
