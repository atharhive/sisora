import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// In-memory rate limiter for brute-force protection
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "anonymous";
    const now = Date.now();
    const attempts = loginAttempts.get(ip);

    if (attempts) {
      if (now - attempts.firstAttempt > WINDOW_MS) {
        // Reset window
        loginAttempts.set(ip, { count: 1, firstAttempt: now });
      } else if (attempts.count >= MAX_ATTEMPTS) {
        const remainingMinutes = Math.ceil((WINDOW_MS - (now - attempts.firstAttempt)) / 60000);
        return NextResponse.json(
          {
            error: `Too many failed login attempts. For security, your IP is locked for ${remainingMinutes} more minutes.`,
          },
          { status: 429 }
        );
      }
    }

    const { email, password, rememberDevice } = await req.json();

    if (!password) {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    const adminEmail = email || process.env.ADMIN_EMAIL || "admin@sisora.si";
    const expectedMasterPassword = process.env.ADMIN_PASSWORD || "Admin123!@#";

    let authSuccess = false;
    let authMethod = "master";

    // 2. Prepare response object to carry session cookies
    let response = NextResponse.json({ success: true });

    // 3. Try Supabase Auth if credentials configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: password,
      });

      if (!error && data?.session) {
        authSuccess = true;
        authMethod = "supabase_auth";
      }
    }

    // 4. Fallback: Check Master Password
    if (!authSuccess && password === expectedMasterPassword) {
      authSuccess = true;
      authMethod = "master_fallback";
    }

    // 5. If failed, track attempt
    if (!authSuccess) {
      const current = loginAttempts.get(ip) || { count: 0, firstAttempt: now };
      loginAttempts.set(ip, {
        count: current.count + 1,
        firstAttempt: current.firstAttempt,
      });

      const remaining = MAX_ATTEMPTS - (current.count + 1);
      return NextResponse.json(
        {
          error:
            remaining > 0
              ? `Invalid credentials. (${remaining} attempts remaining before temporary lockout)`
              : "Too many failed attempts. Locked out for 15 minutes.",
        },
        { status: 401 }
      );
    }

    // Reset failed attempts on success
    loginAttempts.delete(ip);

    // Set secure HTTP-only session cookie.
    // If rememberDevice is true: persist for 30 days.
    // If rememberDevice is false (default): standard browser session cookie (cleared when browser closes).
    const cookieOptions: Record<string, unknown> = {
      name: "sisora_admin_session",
      value: "authenticated",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };

    if (rememberDevice) {
      cookieOptions.maxAge = 60 * 60 * 24 * 30; // 30 days
    }

    response.cookies.set(cookieOptions as any);

    return response;
  } catch (err: any) {
    console.error("Login route error:", err);
    return NextResponse.json(
      { error: "An unexpected server error occurred during authentication." },
      { status: 500 }
    );
  }
}
