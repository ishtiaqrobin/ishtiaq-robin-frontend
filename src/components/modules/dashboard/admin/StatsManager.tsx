"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, TrendingUp, Briefcase, LayoutGrid, Users } from "lucide-react";
import { IStats } from "@/types";
import { updateStatsAction } from "@/actions/stats.action";
import { toast } from "sonner";

interface StatsManagerProps {
    stats: IStats | null;
    token: string;
    onRefresh: () => void;
}

export function StatsManager({ stats, token, onRefresh }: StatsManagerProps) {
    const [loading, setLoading] = useState(false);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data = {
            experience: Number(formData.get("experience")),
            projects: Number(formData.get("projects")),
            happyClients: Number(formData.get("happyClients")),
            successRate: Number(formData.get("successRate")),
        };

        setLoading(true);
        const result = await updateStatsAction(data, token);
        if (result.success) {
            toast.success(result.message);
            onRefresh();
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    return (
        <Card className="rounded-3xl border-none shadow-sm bg-muted/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Public Statistics
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4" /> Years of Experience
                            </Label>
                            <Input
                                type="number"
                                name="experience"
                                defaultValue={stats?.experience || 0}
                                required
                                className="rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <LayoutGrid className="h-4 w-4" /> Total Projects
                            </Label>
                            <Input
                                type="number"
                                name="projects"
                                defaultValue={stats?.projects || 0}
                                required
                                className="rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Users className="h-4 w-4" /> Happy Clients
                            </Label>
                            <Input
                                type="number"
                                name="happyClients"
                                defaultValue={stats?.happyClients || 0}
                                required
                                className="rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" /> Success Rate (%)
                            </Label>
                            <Input
                                type="number"
                                name="successRate"
                                defaultValue={stats?.successRate || 0}
                                required
                                className="rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            size={"md"}
                            className="cursor-pointer">
                            {/* {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} */}
                            Update Statistics
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
