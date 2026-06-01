"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, GraduationCap, CheckCircle2, DollarSign, BookOpen, Coins, Video, Briefcase, ImageIcon } from "lucide-react";
import { AdminStats as AdminStatsType } from "@/types/admin.type";
import { formatPrice } from "@/lib/utils";

interface AdminStatsProps {
    stats: AdminStatsType | null;
}

export function AdminStats({ stats }: AdminStatsProps) {
    const cards = [
        {
            title: "Total Projects",
            value: stats?.totalProject || 0,
            icon: BookOpen,
            description: "Completed & showcased projects",
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            title: "Total Skills",
            value: stats?.totalSkills || 0,
            icon: GraduationCap,
            description: "Tech stack & tools",
            color: "text-purple-600",
            bg: "bg-purple-100",
        },
        {
            title: "Total Services",
            value: stats?.totalServices || 0,
            icon: UserCheck,
            description: "Active service offerings",
            color: "text-green-600",
            bg: "bg-green-100",
        },
        {
            title: "Total Reviews",
            value: stats?.totalReviews || 0,
            icon: CheckCircle2,
            description: "Client feedback & testimonials",
            color: "text-orange-600",
            bg: "bg-orange-100",
        },
    ];

    const subCards = [
        {
            title: "Experience",
            value: stats?.totalExperience || 0,
            icon: Briefcase,
            color: "text-emerald-600",
        },
        {
            title: "Education",
            value: stats?.totalCertificate || 0,
            icon: GraduationCap,
            color: "text-cyan-600",
        },
        {
            title: "Videos",
            value: stats?.totalVideos || 0,
            icon: Video,
            color: "text-rose-600",
        },
        {
            title: "Gallery",
            value: stats?.totalGallery || 0,
            icon: ImageIcon,
            color: "text-amber-600",
        },
        {
            title: "Categories",
            value: stats?.totalCategories || 0,
            icon: BookOpen,
            color: "text-orange-600",
        },
        {
            title: "Users",
            value: stats?.totalUsers || 0,
            icon: Users,
            color: "text-slate-600",
        },
        {
            title: "Admins",
            value: stats?.totalAdmins || 0,
            icon: UserCheck,
            color: "text-indigo-600",
        },
        {
            title: "Verified",
            value: stats?.totalVerifiedUsers || 0,
            icon: CheckCircle2,
            color: "text-green-600",
        },
        {
            title: "Unverified",
            value: stats?.totalUnverifiedUsers || 0,
            icon: Users, // Using Users icon as a placeholder or could find another
            color: "text-red-600",
        }
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, index) => (
                    <Card key={index} className="overflow-hidden border-none shadow-md hover:shadow-lg shadow-primary-400/30 hover:shadow-primary-400/50 transition-all duration-300 bg-card/50 backdrop-blur-sm border border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                            <div className={`${card.bg} p-2 rounded-lg`}>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                {subCards.map((card, index) => (
                    <Card key={index} className="border-none shadow-md hover:shadow-lg shadow-primary-400/30 hover:shadow-primary-400/50 duration-300 transition-all backdrop-blur-sm bg-muted/30 hover:bg-muted/50">
                        <CardContent className="flex flex-col items-center justify-center gap-2 py-6">
                            <div className={`${card.color} bg-background p-3 rounded-full shadow-sm`}>
                                <card.icon className="h-5 w-5" />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{card.title}</p>
                                <p className="text-xl font-bold">{card.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
