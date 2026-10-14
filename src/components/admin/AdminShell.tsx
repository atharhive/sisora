"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AdminProvider, AdminUser } from "./AdminContext";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface AdminShellProps {
  children: React.ReactNode;
  user?: AdminUser | null;
}

export function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();

  // If on login page, render bare without admin frame
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AdminProvider user={user}>
      <div className="min-h-screen flex bg-neutral-50 text-neutral-900">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}

export default AdminShell;
