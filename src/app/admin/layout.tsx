import React from "react";
import { cookies, headers } from "next/headers";
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
  const headerList = await headers();
  const currentPath = headerList.get("x-admin-pathname") || "";

  const isAuthenticated =
    cookieStore.get("sisora_admin_session")?.value === "authenticated";

  // If on login page, render children directly without shell
  if (currentPath === "/admin/login") {
    return <div className="min-h-screen bg-[#07080a]">{children}</div>;
  }

  // If unauthenticated and accessing any admin section, redirect to login
  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return (
    <AdminShell user={{ name: "Administrator", email: "admin@sisora.si" }}>
      {children}
    </AdminShell>
  );
}
