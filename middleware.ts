import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin routes except login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = req.cookies.get("sisora_admin_session");
    if (session?.value !== "authenticated") {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in, redirect away from login page to dashboard
  if (pathname === "/admin/login") {
    const session = req.cookies.get("sisora_admin_session");
    if (session?.value === "authenticated") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
