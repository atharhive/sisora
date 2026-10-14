import React from "react";
import { cookies } from "next/headers";
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

  // If not authenticated (e.g. login page), render standalone without shell
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-neutral-50">{children}</div>;
  }

  return (
    <AdminShell user={{ name: "Administrator", email: "admin@sisora.si" }}>
      {children}
    </AdminShell>
  );
}
