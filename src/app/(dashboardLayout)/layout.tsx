"use client";

import { DashboardSidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
  admin,
  user,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
  user: React.ReactNode;
}) {
  const { user: authUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 p-6">
          {/* 
            If user has a role, render that role's slot 
            (Parallel routes naturally match the current URL)
          */}
          {authUser?.role === "ADMIN" && admin}
          {authUser?.role === "USER" && user}

          {/* If no role is available or matched above, show the default children */}
          {!authUser?.role && children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

