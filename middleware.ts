import { NextResponse, type NextRequest } from "next/server";

// const PUBLIC_PATHS = ["/signin", "/oauth/callback"];

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const isPublic = PUBLIC_PATHS.some(
//     (path) => pathname === path || pathname.startsWith(`${path}/`),
//   );
//   const isAuthenticated = request.cookies.has("accessToken");

//   if (!isAuthenticated && !isPublic) {
//     return NextResponse.redirect(new URL("/signin", request.url));
//   }

//   return NextResponse.next();
// }

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

export function middleware(request: NextRequest) {
  return NextResponse.next();
}
