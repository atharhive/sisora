import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const { supabaseResponse, user } = await updateSession(req);

  // Check authentication
  const hasSupabaseUser = !!user;
  const legacySession = req.cookies.get("sisora_admin_session");
  const isAuthenticated = hasSupabaseUser || legacySession?.value === "authenticated";

  // Protect admin routes except login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in, redirect away from login page to dashboard
  if (pathname === "/admin/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // Pass current admin pathname in request headers for layout inspection
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-admin-pathname", pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
