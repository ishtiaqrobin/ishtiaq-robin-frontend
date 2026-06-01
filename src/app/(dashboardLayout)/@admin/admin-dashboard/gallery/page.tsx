"use client";

import { useEffect, useState, useCallback } from "react";
import { GalleryManager } from "@/components/modules/dashboard/admin/GalleryManager";
import { galleryService } from "@/services/gallery.service";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { IGallery } from "@/types";

export default function AdminGalleryPage() {
    const { session, isLoading: authLoading } = useAuth();
    const [galleries, setGalleries] = useState<IGallery[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const userToken = session?.token || "";

    const fetchGalleries = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await galleryService.getGalleries();

        if (error) {
            toast.error("Failed to load gallery items", { description: error.message });
            setGalleries([]);
        } else {
            setGalleries(data || []);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!authLoading) {
            Promise.resolve().then(() => fetchGalleries());
        }
    }, [authLoading, fetchGalleries]);

    return (
        <div className="space-y-6 min-h-screen pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Gallery Management</h1>
                <p className="text-muted-foreground mt-2">
                    Upload and organize your project screenshots and design assets
                </p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="aspect-square w-full rounded-2xl" />
                            <Skeleton className="h-4 w-3/4 mx-auto" />
                        </div>
                    ))}
                </div>
            ) : (
                <GalleryManager
                    galleries={galleries}
                    token={userToken}
                    onRefresh={fetchGalleries}
                />
            )}
        </div>
    );
}
