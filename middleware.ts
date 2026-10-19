import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const { supabaseResponse, user } = await updateSession(req);

  // If Supabase is configured and handling authentication
  const isAuthenticated = !!user;

  // Protect admin routes except login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAuthenticated) {
      // Fallback check for transitional session cookie if Supabase user is not yet logged in
      const legacySession = req.cookies.get("sisora_admin_session");
      if (legacySession?.value !== "authenticated") {
        const loginUrl = new URL("/admin/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // If already logged in, redirect away from login page to dashboard
  if (pathname === "/admin/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
