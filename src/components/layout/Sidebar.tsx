"use client";

import * as React from "react";
import {
    Sidebar as SidebarPrimitive,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarFooter,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { adminRoutes } from "@/routes/adminRoutes";
import { userRoutes } from "@/routes/userRoutes";
import { Route } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { LogoutButton } from "@/components/modules/authentication/LogoutButton";
import { usePathname } from "next/navigation";
import logo from "@/assets/images/logo.webp";
import Image from "next/image";
import { PERSONAL_INFO } from "@/utils/constants";
// import { motion } from "framer-motion";
import { motion } from "motion/react";

export function DashboardSidebar(props: React.ComponentProps<typeof SidebarPrimitive>) {
    const { user } = useAuth();
    const pathname = usePathname();
    let routes: Route[] = [];

    // Determine routes based on user role
    if (user?.role === "ADMIN") {
        routes = adminRoutes
    } else if (user?.role === "USER") {
        routes = userRoutes;
    }

    return (
        <SidebarPrimitive {...props}>
            <SidebarHeader className="border-b">
                <div className="px-4 py-2">
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
                {routes.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.url;
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild isActive={isActive}>
                                                <Link href={item.url} className="flex items-center gap-2">
                                                    {Icon && <Icon className="h-4 w-4" />}
                                                    <span>{item.title}</span>
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

            <SidebarFooter className="border-t p-2">
                <LogoutButton
                    size="sm"
                    variant="outline"
                    className="w-full cursor-pointer"
                />
            </SidebarFooter>

            <SidebarRail />
        </SidebarPrimitive>
    );
}

