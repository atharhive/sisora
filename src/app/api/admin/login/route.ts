import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (!password || password !== expectedPassword) {
      return NextResponse.json(
        { error: "Invalid admin password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: "sisora_admin_session",
      value: "authenticated",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "An error occurred during login." },
      { status: 500 }
    );
  }
}
