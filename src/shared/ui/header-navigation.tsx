import Image from "next/image";
import Link from "next/link";
import bellIcon from "@/shared/assets/bell.svg";
import { LogoIcon } from "@/shared/assets/LogoIcon";

export default function NavigaitionHeader() {
  return (
    <>
      <div
        id="headerContainer"
        className="fixed top-0 left-0 z-50 flex h-12 w-full items-center justify-center border-b border-line bg-surface px-4 sm:px-8 xl:px-35"
      >
        <div id="logo" className="flex items-center gap-2">
          <LogoIcon className="h-8 w-auto" />
          <p className="text-lg font-extrabold">취준</p>
        </div>
        <div id="navMenu" className="flex flex-1 items-center justify-center gap-4 sm:gap-8">
          <Link href="/main" className="px-1 py-2">홈</Link>
          <Link href="/ranking" className="px-1 py-2">랭킹</Link>
          <Link href="/class" className="px-1 py-2">학급</Link>
        </div>
        <div id="userMenu" className="flex items-center justify-center gap-2">
          <Image src={bellIcon} alt="알림" className="h-6 w-6 cursor-pointer" width={24} height={24} />
          <button
            type="button"
            className="flex h-8 w-18 cursor-pointer items-center justify-center rounded-md bg-primary-500 px-2 text-white"
          >
            로그인
          </button>
        </div>
      </div>
    </>
  );
}
