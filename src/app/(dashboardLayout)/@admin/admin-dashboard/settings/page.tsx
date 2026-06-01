"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { statsService } from "@/services/stats.service";
import { settingService } from "@/services/setting.service";
import { IStats, ISettings } from "@/types";
import { StatsManager } from "@/components/modules/dashboard/admin/StatsManager";
import { SettingsManager } from "@/components/modules/dashboard/admin/SettingsManager";

export default function AdminSettingsPage() {
    const { session, isLoading: authLoading } = useAuth();
    const [stats, setStats] = useState<IStats | null>(null);
    const [settings, setSettings] = useState<ISettings | null>(null);
    const [isStatsLoading, setIsStatsLoading] = useState(true);
    const [isSettingsLoading, setIsSettingsLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            const [statsRes, settingsRes] = await Promise.all([
                statsService.getStats(),
                settingService.getSettings()
            ]);

            if (statsRes.data) setStats(statsRes.data);
            if (settingsRes.data) setSettings(settingsRes.data);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setIsStatsLoading(false);
            setIsSettingsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!authLoading) {
            loadData();
        }
    }, [authLoading, loadData]);

    const handleRefresh = useCallback(async () => {
        setIsStatsLoading(true);
        setIsSettingsLoading(true);
        await loadData();
    }, [loadData]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Platform Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your platform statistics and global configurations.
                </p>
            </div>

            <div className="grid gap-6">
                {/* Settings Management */}
                <div>
                    {isSettingsLoading ? (
                        <div className="h-[400px] bg-muted animate-pulse rounded-3xl" />
                    ) : (
                        <SettingsManager
                            settings={settings}
                            token={session?.token || ""}
                            onRefresh={handleRefresh}
                        />
                    )}
                </div>

                {/* Stats Management */}
                <div>
                    {isStatsLoading ? (
                        <div className="space-y-4">
                            <div className="h-8 w-48 bg-muted animate-pulse rounded-lg" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="h-64 bg-muted animate-pulse rounded-3xl" />
                                <div className="h-64 bg-muted animate-pulse rounded-3xl" />
                            </div>
                        </div>
                    ) : (
                        <StatsManager
                            stats={stats}
                            token={session?.token || ""}
                            onRefresh={handleRefresh}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
