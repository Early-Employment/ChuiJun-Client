import { NextResponse, type NextRequest } from "next/server";
import { REFRESH_TOKEN_COOKIE } from "@/shared/config/routes";

export const config = {
  matcher: ["/((?!api|auth|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  // 이미 인증된 사용자가 /signin 에 오면 홈으로 보낸다.
  if (pathname === "/signin" && refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}
