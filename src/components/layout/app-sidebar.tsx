"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { adminRoutes } from "@/routes/adminRoutes";
import { userRoutes } from "@/routes/userRoutes";
import { Route } from "@/types";
import { PERSONAL_INFO } from "@/utils/constants";
// import { motion } from "framer-motion";
import { motion } from "motion/react";

export function AppSidebar({
  user,
  ...props
}: {
  user: { role: string } & React.ComponentProps<typeof Sidebar>;
}) {
  let routes: Route[] = [];

  switch (user.role) {
    case "ADMIN":
      routes = adminRoutes;
      break;
    case "USER":
      routes = userRoutes;
      break;
    default:
      routes = [];
      break;
  }

  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b">
        <div className="p-2 pb-4 font-bold">
          <Link href="/">
            <motion.div
              className="text-2xl font-bold font-mono text-gray-900 dark:text-white hover:text-primary transition-colors cursor-pointer"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className="text-primary">&lt;</span>
              {PERSONAL_INFO.name.split(" ")[0]}
              <span className="text-primary"> /&gt;</span>
            </motion.div>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {routes.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((menuItem) => {
                  const Icon = menuItem.icon;
                  const isActive = pathname === menuItem.url;
                  return (
                    <SidebarMenuItem key={menuItem.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={menuItem.url}>
                          {Icon && <Icon className="h-4 w-4" />}
                          <span>{menuItem.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
