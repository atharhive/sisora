import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = {
  title: "SISORA Admin",
  description: ".SI Domain Brokerage Administration Panel",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isLoginPage = pathname === "/admin/login";

  // If not authenticated and not on login page, redirect to login
  if (!session?.user) {
    if (!isLoginPage) {
      redirect("/admin/login");
    }
    return <div className="min-h-screen bg-neutral-50">{children}</div>;
  }

  // If already authenticated and trying to access login page, redirect to dashboard
  if (isLoginPage) {
    redirect("/admin");
  }

  return <AdminShell user={session.user}>{children}</AdminShell>;
}
