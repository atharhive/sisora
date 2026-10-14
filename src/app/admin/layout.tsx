import React from "react";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
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
  const cookieStore = await cookies();
  const isAuthenticated =
    cookieStore.get("sisora_admin_session")?.value === "authenticated";
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isLoginPage = pathname === "/admin/login";

  // If not authenticated and not on login page, redirect to login
  if (!isAuthenticated) {
    if (!isLoginPage) {
      redirect("/admin/login");
    }
    return <div className="min-h-screen bg-neutral-50">{children}</div>;
  }

  // If already authenticated and trying to access login page, redirect to dashboard
  if (isLoginPage) {
    redirect("/admin");
  }

  return (
    <AdminShell user={{ name: "Administrator", email: "admin@sisora.si" }}>
      {children}
    </AdminShell>
  );
}
