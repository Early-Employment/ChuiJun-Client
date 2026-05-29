import Link from "next/link";
import { LogoIcon } from "@/shared/assets/LogoIcon";

export default function NavigaitionHeader() {
  return (
    <>
      <div id="headerContainer" className="fixed top-0 left-0 flex h-20 w-full items-center justify-center bg-white px-32">
        <div id="logo" className="flex items-center gap-2">
          <LogoIcon className="h-8 w-auto" />
          <p>취준</p>
        </div>
        <div id="navMenu" className="flex">
          <Link href="/main">홈</Link>
          <Link href="/ranking">랭킹</Link>
          <Link href="/class">학급</Link>
        </div>
        <div id="userMenu"></div>
      </div>
    </>
  );
}
