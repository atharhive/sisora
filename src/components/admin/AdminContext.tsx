"use client";

import React, { createContext, useContext, useState } from "react";

export interface AdminUser {
  id?: string;
  name?: string | null;
  email?: string | null;
}

interface AdminContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  user: AdminUser | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({
  children,
  user = null,
}: {
  children: React.ReactNode;
  user?: AdminUser | null;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <AdminContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        user,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      sidebarOpen: false,
      setSidebarOpen: () => {},
      toggleSidebar: () => {},
      user: null,
    };
  }
  return context;
}
