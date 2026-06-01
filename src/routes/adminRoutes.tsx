import { Route } from "@/types";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FolderKanban,
  UserCog,
  TrendingUp,
  Landmark,
  Settings,
  Image,
  GraduationCap,
  Briefcase,
  Wrench,
  Video,
  MessageSquare,
  Cpu,
} from "lucide-react";

export const adminRoutes: Route[] = [
  {
    title: "Admin Menu",
    items: [
      {
        title: "Dashboard",
        url: "/admin-dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "About",
        url: "/admin-dashboard/about",
        icon: UserCog,
      },
      {
        title: "Education",
        url: "/admin-dashboard/education",
        icon: GraduationCap,
      },
      {
        title: "Experience",
        url: "/admin-dashboard/experience",
        icon: Briefcase,
      },
      {
        title: "Skills",
        url: "/admin-dashboard/skills",
        icon: Cpu,
      },
      {
        title: "Services",
        url: "/admin-dashboard/services",
        icon: Wrench,
      },
      {
        title: "Gallery",
        url: "/admin-dashboard/gallery",
        icon: Image,
      },
      {
        title: "Projects",
        url: "/admin-dashboard/projects",
        icon: FolderKanban,
      },
      {
        title: "Videos",
        url: "/admin-dashboard/video",
        icon: Video,
      },
      {
        title: "Reviews",
        url: "/admin-dashboard/reviews",
        icon: MessageSquare,
      },
      {
        title: "Category Management",
        url: "/admin-dashboard/categories",
        icon: FolderKanban,
      },
      {
        title: "User Management",
        url: "/admin-dashboard/users",
        icon: Users,
      },
      {
        title: "Settings",
        url: "/admin-dashboard/settings",
        icon: Settings,
      },
      {
        title: "Profile",
        url: "/admin-dashboard/profile",
        icon: UserCog,
      },
    ],
  },
];
